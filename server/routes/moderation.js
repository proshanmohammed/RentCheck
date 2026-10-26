import express from 'express';
import { db } from '../db.js';
import { validate, updateStatusSchema } from '../middleware/validate.js';

const router = express.Router();

/**
 * GET /api/moderation/queue
 * Fetch pending reports, duplicate flags, and listings awaiting moderation
 */
router.get('/queue', async (req, res, next) => {
  try {
    const queue = await db.getModerationQueue();
    res.json({
      success: true,
      data: queue
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/moderation/listings/:id/status
 * Safely update listing verification status and record moderation notes
 */
router.patch('/listings/:id/status', validate(updateStatusSchema), async (req, res, next) => {
  try {
    const listingId = req.params.id;
    const { verificationStatus, moderationNotes, resolveDuplicateFlagId, flagStatus } = req.validatedBody;

    const existing = await db.getListingById(listingId);
    if (!existing) {
      return res.status(404).json({ error: 'Listing not found.' });
    }

    const updated = await db.updateListing(listingId, {
      verification_status: verificationStatus,
      moderation_notes: moderationNotes || existing.moderation_notes
    });

    // If an associated duplicate flag ID was provided, resolve it
    if (resolveDuplicateFlagId && flagStatus) {
      await db.updateDuplicateFlag(resolveDuplicateFlagId, {
        status: flagStatus,
        reviewed_by: req.body.moderatorId || '33333333-3333-4333-a333-333333333333'
      });
    }

    res.json({
      success: true,
      message: `Listing status updated to "${verificationStatus}".`,
      listing: updated
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/moderation/flags/:id
 * Update duplicate flag resolution (confirmed_duplicate, false_positive, pending)
 */
router.patch('/flags/:id', async (req, res, next) => {
  try {
    const flagId = req.params.id;
    const { status, reviewedBy } = req.body;

    if (!['pending', 'confirmed_duplicate', 'false_positive'].includes(status)) {
      return res.status(400).json({
        error: 'Invalid status. Must be pending, confirmed_duplicate, or false_positive.'
      });
    }

    const updatedFlag = await db.updateDuplicateFlag(flagId, {
      status,
      reviewed_by: reviewedBy || '33333333-3333-4333-a333-333333333333'
    });

    if (!updatedFlag) {
      return res.status(404).json({ error: 'Duplicate flag record not found.' });
    }

    // If marked as false positive, restore the duplicate listing status safely
    if (status === 'false_positive') {
      const listing = await db.getListingById(updatedFlag.duplicate_listing_id);
      if (listing && listing.verification_status === 'flagged_duplicate') {
        await db.updateListing(updatedFlag.duplicate_listing_id, {
          verification_status: listing.verification_evidence?.length ? 'verified' : 'unverified',
          moderation_notes: 'Duplicate flag reviewed and cleared as a false positive by compliance team.'
        });
      }
    } else if (status === 'confirmed_duplicate') {
      await db.updateListing(updatedFlag.duplicate_listing_id, {
        verification_status: 'flagged_duplicate',
        moderation_notes: 'Confirmed syndication duplicate. Renter advisory banner displayed.'
      });
    }

    res.json({
      success: true,
      message: `Duplicate flag status updated to ${status}.`,
      flag: updatedFlag
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/moderation/reports/:id
 * Update report resolution (investigating, resolved, dismissed)
 */
router.patch('/reports/:id', async (req, res, next) => {
  try {
    const reportId = req.params.id;
    const { status, moderatorNotes, resolvedBy } = req.body;

    if (!['open', 'investigating', 'resolved', 'dismissed'].includes(status)) {
      return res.status(400).json({
        error: 'Invalid report status. Must be open, investigating, resolved, or dismissed.'
      });
    }

    const updatedReport = await db.updateReport(reportId, {
      status,
      moderator_notes: moderatorNotes || '',
      resolved_by: resolvedBy || '33333333-3333-4333-a333-333333333333'
    });

    if (!updatedReport) {
      return res.status(404).json({ error: 'Report not found.' });
    }

    res.json({
      success: true,
      message: `Report status updated to ${status}.`,
      report: updatedReport
    });
  } catch (err) {
    next(err);
  }
});

export default router;
