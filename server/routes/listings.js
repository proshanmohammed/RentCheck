import express from 'express';
import { db } from '../db.js';
import { validate, createListingSchema, reportListingSchema } from '../middleware/validate.js';
import { analyzeListingForDuplicates } from '../services/gemini.js';

const router = express.Router();

/**
 * Helper to compute occupancy cost breakdown
 */
function enrichListing(listing) {
  const baseRent = Number(listing.base_rent || 0);
  const recurringFees = Number(listing.recurring_fees || 0);
  const securityDeposit = Number(listing.security_deposit || 0);
  const feeDetails = listing.fee_details || {};

  const totalMonthlyOccupancy = Number((baseRent + recurringFees).toFixed(2));
  const estimatedMoveInTotal = Number((baseRent + securityDeposit + recurringFees).toFixed(2));

  return {
    ...listing,
    total_monthly_occupancy: totalMonthlyOccupancy,
    estimated_move_in_total: estimatedMoveInTotal,
    fee_breakdown: {
      base_rent: baseRent,
      recurring_fees_total: recurringFees,
      security_deposit: securityDeposit,
      itemized: feeDetails
    }
  };
}

/**
 * GET /api/listings
 * Fetch listings with comprehensive query filtering
 */
router.get('/', async (req, res, next) => {
  try {
    const {
      city,
      propertyType,
      verificationStatus,
      minRent,
      maxRent,
      maxTotalMonthly,
      bedrooms,
      search
    } = req.query;

    const rawListings = await db.getListings({
      city,
      propertyType,
      verificationStatus,
      minRent,
      maxRent,
      maxTotalMonthly,
      bedrooms,
      search
    });

    const listings = rawListings.map(enrichListing);

    res.json({
      success: true,
      count: listings.length,
      listings
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/listings/compare/batch
 * Batch compare multiple listings side-by-side
 */
router.get('/compare/batch', async (req, res, next) => {
  try {
    const idsParam = req.query.ids;
    if (!idsParam) {
      return res.status(400).json({ error: 'Missing "ids" query parameter (comma-separated IDs).' });
    }

    const ids = idsParam.split(',').map(id => id.trim()).filter(Boolean);
    const listings = [];

    for (const id of ids) {
      const listing = await db.getListingById(id);
      if (listing) {
        listings.push(enrichListing(listing));
      }
    }

    res.json({
      success: true,
      count: listings.length,
      listings
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/listings/:id
 * Single listing details with landlord profile and duplicate warnings
 */
router.get('/:id', async (req, res, next) => {
  try {
    const listing = await db.getListingById(req.params.id);
    if (!listing) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Listing with ID ${req.params.id} does not exist.`
      });
    }

    res.json({
      success: true,
      listing: enrichListing(listing)
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/listings
 * Create new listing and trigger Gemini duplicate detection scan
 */
router.post('/', validate(createListingSchema), async (req, res, next) => {
  try {
    const payload = req.validatedBody;

    // Calculate total recurring fees if itemized feeDetails are supplied
    let calculatedRecurringFees = payload.recurringFees || 0;
    if (payload.feeDetails && Object.keys(payload.feeDetails).length > 0) {
      const itemizedTotal = Object.values(payload.feeDetails).reduce((sum, val) => sum + (Number(val) || 0), 0);
      if (itemizedTotal > 0) {
        calculatedRecurringFees = itemizedTotal;
      }
    }

    // Determine initial verification status based on evidence
    let initialVerificationStatus = 'unverified';
    if (payload.verificationEvidence && payload.verificationEvidence.length > 0) {
      initialVerificationStatus = 'pending_review';
    }

    // Prepare temporary listing object for deduplication scan
    const candidateListing = {
      title: payload.title,
      propertyType: payload.propertyType,
      address: payload.address,
      city: payload.city,
      state: payload.state || 'CA',
      zipCode: payload.zipCode,
      bedrooms: payload.bedrooms,
      bathrooms: payload.bathrooms,
      squareFeet: payload.squareFeet,
      baseRent: payload.baseRent,
      securityDeposit: payload.securityDeposit,
      recurringFees: calculatedRecurringFees,
      feeDetails: payload.feeDetails,
      amenities: payload.amenities,
      description: payload.description,
      images: payload.images,
      verificationEvidence: payload.verificationEvidence,
      landlord_id: payload.landlordId || '11111111-1111-4111-a111-111111111111'
    };

    // Fetch existing listings for deduplication analysis
    const existingListings = await db.getListings();

    // Run Gemini duplicate scan (with built-in heuristic fallback)
    const duplicateAnalysis = await analyzeListingForDuplicates(candidateListing, existingListings);

    // If duplicate is flagged with high confidence
    let duplicateFlagRecord = null;
    if (duplicateAnalysis.isDuplicate && duplicateAnalysis.matchedListingId) {
      initialVerificationStatus = 'flagged_duplicate';
    }

    // Persist new listing
    const createdListing = await db.createListing({
      ...candidateListing,
      verification_status: initialVerificationStatus,
      moderation_notes: duplicateAnalysis.isDuplicate 
        ? `Automated Duplicate Detection: ${duplicateAnalysis.reasoning}`
        : 'Automated duplicate check passed with clean result.'
    });

    // If duplicate was detected, record flag
    if (duplicateAnalysis.isDuplicate && duplicateAnalysis.matchedListingId) {
      duplicateFlagRecord = await db.createDuplicateFlag({
        original_listing_id: duplicateAnalysis.matchedListingId,
        duplicate_listing_id: createdListing.id,
        similarity_score: duplicateAnalysis.similarityScore,
        ai_reasoning: duplicateAnalysis.reasoning,
        status: 'pending'
      });
    }

    res.status(201).json({
      success: true,
      message: duplicateAnalysis.isDuplicate 
        ? 'Listing submitted, but flagged for duplicate review.' 
        : 'Listing successfully created with transparent fee disclosures.',
      listing: enrichListing(createdListing),
      duplicateAnalysis,
      duplicateFlag: duplicateFlagRecord
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/listings/:id/report
 * Submit a suspicious activity or duplicate listing report
 */
router.post('/:id/report', validate(reportListingSchema), async (req, res, next) => {
  try {
    const listingId = req.params.id;
    const existingListing = await db.getListingById(listingId);

    if (!existingListing) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'The listing you are attempting to report does not exist.'
      });
    }

    const { reason, details, evidenceUrls } = req.validatedBody;

    const report = await db.createReport({
      listing_id: listingId,
      reporter_id: req.body.reporterId || '44444444-4444-4444-a444-444444444444',
      reason,
      details,
      evidence_urls: evidenceUrls
    });

    // Count open reports for this listing; if threshold exceeded, flag for investigation
    const reports = await db.getReports('open');
    const listingReports = reports.filter(r => r.listing_id === listingId);

    if (listingReports.length >= 2 && existingListing.verification_status !== 'flagged_duplicate') {
      await db.updateListing(listingId, {
        verification_status: 'suspicious',
        moderation_notes: `Auto-escalated to suspicious status due to ${listingReports.length} user community reports.`
      });
    }

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully. Our compliance moderators will investigate evidence before changing listing status.',
      report
    });
  } catch (err) {
    next(err);
  }
});

export default router;
