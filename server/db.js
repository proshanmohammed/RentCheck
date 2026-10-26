import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseKey && 
  !supabaseUrl.includes('your-supabase') && 
  !supabaseKey.includes('your-service-role')
);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

// Initial high-fidelity seed profiles
const SEED_PROFILES = [
  {
    id: '11111111-1111-4111-a111-111111111111',
    email: 'sarah.jenkins@baypropertymgmt.com',
    full_name: 'Sarah Jenkins',
    role: 'landlord',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    phone: '+1 (415) 555-0142',
    created_at: new Date('2024-01-15T08:00:00Z').toISOString()
  },
  {
    id: '22222222-2222-4222-a222-222222222222',
    email: 'marcus.sterling@sterlingrealestate.com',
    full_name: 'Marcus Sterling',
    role: 'landlord',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    phone: '+1 (310) 555-0198',
    created_at: new Date('2024-02-10T09:30:00Z').toISOString()
  },
  {
    id: '33333333-3333-4333-a333-333333333333',
    email: 'elena.rostova@rentcheck.org',
    full_name: 'Elena Rostova (Compliance)',
    role: 'moderator',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
    phone: '+1 (800) 555-0199',
    created_at: new Date('2024-01-01T00:00:00Z').toISOString()
  },
  {
    id: '44444444-4444-4444-a444-444444444444',
    email: 'alex.chen@gmail.com',
    full_name: 'Alex Chen',
    role: 'seeker',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    phone: '+1 (415) 555-0177',
    created_at: new Date('2024-03-01T12:00:00Z').toISOString()
  }
];

// Initial high-fidelity seed listings
const SEED_LISTINGS = [
  {
    id: 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81',
    landlord_id: '11111111-1111-4111-a111-111111111111',
    title: 'The Beacon at Mission Bay — Transparent Luxury 1BR Flat',
    property_type: 'Apartment',
    address: '260 King Street, Unit 612',
    city: 'San Francisco',
    state: 'CA',
    zip_code: '94107',
    bedrooms: 1,
    bathrooms: 1.0,
    square_feet: 780,
    base_rent: 2850.00,
    security_deposit: 2850.00,
    recurring_fees: 535.00,
    fee_details: {
      water_sewer_trash: 180.00,
      electricity_gas: 95.00,
      high_speed_fiber: 60.00,
      assigned_garage_parking: 200.00,
      hoa_maintenance: 0.00
    },
    amenities: [
      'In-Unit Washer & Dryer',
      'Central AC & Heating',
      '24/7 Doorman Concierge',
      'Heated Outdoor Lap Pool',
      'Fitness Center & Spa',
      'Pet Friendly (Deposit waived)',
      'Bike Storage Locker'
    ],
    description: 'Fully transparent Mission Bay residence with zero surprise charges. All utilities, high-speed fiber internet, and secure garage parking are pre-calculated in the monthly occupancy total. Features hardwood flooring, stainless steel appliances, quartz countertops, and floor-to-ceiling windows overlooking Oracle Park.',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
    ],
    verification_status: 'verified',
    verification_evidence: [
      'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80'
    ],
    moderation_notes: 'Ownership deed and certified management agreement verified by compliance team on 2024-03-12.',
    created_at: new Date('2024-03-10T10:00:00Z').toISOString(),
    updated_at: new Date('2024-03-12T14:30:00Z').toISOString()
  },
  {
    id: 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c82',
    landlord_id: '11111111-1111-4111-a111-111111111111',
    title: 'Pacific Heights Classic Victorian Flat with Bay Views',
    property_type: 'Apartment',
    address: '2140 Vallejo Street, Apt 3',
    city: 'San Francisco',
    state: 'CA',
    zip_code: '94123',
    bedrooms: 2,
    bathrooms: 2.0,
    square_feet: 1250,
    base_rent: 3950.00,
    security_deposit: 3950.00,
    recurring_fees: 320.00,
    fee_details: {
      water_trash: 140.00,
      gas_heating: 110.00,
      high_speed_internet: 70.00,
      street_permit_parking: 0.00
    },
    amenities: [
      'Historic Crown Moldings',
      'Original Hardwood Floors',
      'Decorative Fireplace',
      'Chef Kitchen with Viking Range',
      'Private Storage Unit',
      'Shared Landscaped Garden'
    ],
    description: 'Immaculate top-floor Victorian residence featuring unobstructed views of the Golden Gate Bridge and Alcatraz. Includes full breakdown of municipal utilities and gas radiator heat. No hidden administrative lease fees.',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
    ],
    verification_status: 'verified',
    verification_evidence: [
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80'
    ],
    moderation_notes: 'Direct landlord property tax statement cross-referenced with San Francisco Assessor records.',
    created_at: new Date('2024-03-14T11:00:00Z').toISOString(),
    updated_at: new Date('2024-03-15T09:15:00Z').toISOString()
  },
  {
    id: 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c83',
    landlord_id: '22222222-2222-4222-a222-222222222222',
    title: 'Silver Lake Sunlit Loft & Private Rooftop Terrace',
    property_type: 'Condominium',
    address: '1520 Griffith Park Blvd, Unit B',
    city: 'Los Angeles',
    state: 'CA',
    zip_code: '90026',
    bedrooms: 2,
    bathrooms: 1.5,
    square_feet: 950,
    base_rent: 2650.00,
    security_deposit: 2650.00,
    recurring_fees: 280.00,
    fee_details: {
      water_trash_recycling: 90.00,
      pet_monthly_rent: 40.00,
      assigned_tandem_parking: 150.00
    },
    amenities: [
      'Private 400 sqft Rooftop Deck',
      'Soaring 16ft Ceilings',
      'Electric Vehicle Charger',
      'Keyless Entry System',
      'Dog Friendly Park Adjacent'
    ],
    description: 'Chic architectural loft nestled in prime Silver Lake just steps from Sunset Junction. Transparent fee disclosure ensures you never pay unexpected move-in or amenity access charges.',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80'
    ],
    verification_status: 'verified',
    verification_evidence: [
      'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80'
    ],
    moderation_notes: 'HOA management certificate verified.',
    created_at: new Date('2024-03-18T16:20:00Z').toISOString(),
    updated_at: new Date('2024-03-19T10:00:00Z').toISOString()
  },
  {
    id: 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c84',
    landlord_id: '22222222-2222-4222-a222-222222222222',
    title: 'Rainey Street High-Rise Studio with Skyline Panorama',
    property_type: 'Studio',
    address: '44 East Ave, Suite 1408',
    city: 'Austin',
    state: 'TX',
    zip_code: '78701',
    bedrooms: 0,
    bathrooms: 1.0,
    square_feet: 560,
    base_rent: 1720.00,
    security_deposit: 1000.00,
    recurring_fees: 260.00,
    fee_details: {
      water_valet_trash: 75.00,
      building_amenity_access: 60.00,
      garage_parking_permit: 125.00
    },
    amenities: [
      'Infinity Edge Skyline Pool',
      'Coworking Lounge with Private Pods',
      '24/7 Peloton Fitness Center',
      'Pet Wash Station',
      'Direct Trail Access'
    ],
    description: 'Modern downtown studio overlooking Lady Bird Lake. Standardized RentCheck billing guarantees the advertised total matches your real bank statement every single month.',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
    ],
    verification_status: 'verified',
    verification_evidence: [
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80'
    ],
    moderation_notes: 'Owner verification documented.',
    created_at: new Date('2024-03-20T14:00:00Z').toISOString(),
    updated_at: new Date('2024-03-21T08:30:00Z').toISOString()
  },
  {
    id: 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c85',
    landlord_id: '44444444-4444-4444-a444-444444444444',
    title: 'Mission Bay 1BR King St — Special Rent Promo',
    property_type: 'Apartment',
    address: '260 King Street',
    city: 'San Francisco',
    state: 'CA',
    zip_code: '94107',
    bedrooms: 1,
    bathrooms: 1.0,
    square_feet: 780,
    base_rent: 2050.00,
    security_deposit: 1500.00,
    recurring_fees: 0.00,
    fee_details: {},
    amenities: [
      'Washer & Dryer',
      'Pool',
      'Gym'
    ],
    description: 'Great luxury flat in Mission Bay at 260 King St with pool, gym, doorman. Looking for quick lease takeover. Contact immediately to wire deposit.',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
    ],
    verification_status: 'flagged_duplicate',
    verification_evidence: [],
    moderation_notes: 'Flagged by automated deduplication heuristics against verified listing #a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81 (The Beacon at Mission Bay). High similarity score, identical photos, unverified landlord.',
    created_at: new Date('2024-03-22T09:10:00Z').toISOString(),
    updated_at: new Date('2024-03-22T09:12:00Z').toISOString()
  },
  {
    id: 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c86',
    landlord_id: '22222222-2222-4222-a222-222222222222',
    title: 'Historic Wicker Park Brownstone 3BR Townhouse',
    property_type: 'Townhouse',
    address: '1428 N Milwaukee Ave',
    city: 'Chicago',
    state: 'IL',
    zip_code: '60622',
    bedrooms: 3,
    bathrooms: 2.5,
    square_feet: 1850,
    base_rent: 3200.00,
    security_deposit: 3200.00,
    recurring_fees: 210.00,
    fee_details: {
      water_scavenger: 70.00,
      lawn_snow_removal: 60.00,
      high_speed_wifi: 80.00
    },
    amenities: [
      'Private Garage',
      'Finished Basement',
      'Private Fenced Yard',
      'Working Fireplace',
      'Smart Thermostat'
    ],
    description: 'Expansive 3-bedroom brownstone duplex in the heart of Wicker Park. Full itemized utility list and clear deposit conditions with zero administrative processing surcharges.',
    images: [
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    verification_status: 'pending_review',
    verification_evidence: [
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80'
    ],
    moderation_notes: 'Verification documents submitted, pending municipal tax record verification.',
    created_at: new Date('2024-03-23T15:00:00Z').toISOString(),
    updated_at: new Date('2024-03-23T15:00:00Z').toISOString()
  }
];

// Seed duplicate flags
const SEED_DUPLICATE_FLAGS = [
  {
    id: 'f1f2f3f4-1111-4111-b111-111111111111',
    original_listing_id: 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81',
    duplicate_listing_id: 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c85',
    similarity_score: 0.8950,
    ai_reasoning: 'Direct street address match (260 King Street); identical hero photographs; unit configuration matches; pricing represents an anomalous 28% discount without recurring fee disclosures.',
    status: 'pending',
    reviewed_by: null,
    reviewed_at: null,
    created_at: new Date('2024-03-22T09:12:00Z').toISOString()
  }
];

// Seed reports
const SEED_REPORTS = [
  {
    id: 'r1r2r3r4-1111-4111-c111-111111111111',
    listing_id: 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c85',
    reporter_id: '44444444-4444-4444-a444-444444444444',
    reason: 'Duplicate listing & suspicious below-market rent claim',
    details: 'This listing copies the photos and description of The Beacon at 260 King St, but lists it under a personal account demanding an upfront wire transfer.',
    evidence_urls: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'open',
    moderator_notes: 'Under review by Elena Rostova. Correlates with duplicate flag #f1f2f3f4.',
    resolved_by: null,
    resolved_at: null,
    created_at: new Date('2024-03-22T10:45:00Z').toISOString()
  }
];

// In-Memory Data Store (Synchronized fallback for local & test environments)
class MemoryDataStore {
  constructor() {
    this.profiles = [...SEED_PROFILES];
    this.listings = [...SEED_LISTINGS];
    this.duplicateFlags = [...SEED_DUPLICATE_FLAGS];
    this.reports = [...SEED_REPORTS];
  }

  // Profile queries
  async getProfiles() {
    return this.profiles;
  }

  async getProfileById(id) {
    return this.profiles.find(p => p.id === id) || null;
  }

  // Listings queries
  async getListings(filters = {}) {
    let result = [...this.listings];

    if (filters.city) {
      const cityLower = filters.city.toLowerCase().trim();
      result = result.filter(l => l.city && l.city.toLowerCase().includes(cityLower));
    }

    if (filters.propertyType && filters.propertyType !== 'All') {
      result = result.filter(l => l.property_type === filters.propertyType);
    }

    if (filters.verificationStatus && filters.verificationStatus !== 'All') {
      result = result.filter(l => l.verification_status === filters.verificationStatus);
    }

    if (filters.minRent) {
      result = result.filter(l => Number(l.base_rent) >= Number(filters.minRent));
    }

    if (filters.maxRent) {
      result = result.filter(l => Number(l.base_rent) <= Number(filters.maxRent));
    }

    if (filters.maxTotalMonthly) {
      result = result.filter(l => {
        const total = Number(l.base_rent) + Number(l.recurring_fees || 0);
        return total <= Number(filters.maxTotalMonthly);
      });
    }

    if (filters.bedrooms && filters.bedrooms !== 'Any') {
      const beds = Number(filters.bedrooms);
      result = result.filter(l => Number(l.bedrooms) >= beds);
    }

    if (filters.search) {
      const s = filters.search.toLowerCase().trim();
      result = result.filter(l => 
        (l.title && l.title.toLowerCase().includes(s)) ||
        (l.address && l.address.toLowerCase().includes(s)) ||
        (l.city && l.city.toLowerCase().includes(s)) ||
        (l.description && l.description.toLowerCase().includes(s))
      );
    }

    // Default sort by created_at DESC
    return result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  async getListingById(id) {
    const listing = this.listings.find(l => l.id === id);
    if (!listing) return null;

    // Attach landlord profile
    const landlord = this.profiles.find(p => p.id === listing.landlord_id) || null;

    // Attach active duplicate flags
    const duplicateFlags = this.duplicateFlags.filter(
      df => df.duplicate_listing_id === id || df.original_listing_id === id
    );

    // Attach reports
    const reports = this.reports.filter(r => r.listing_id === id);

    return {
      ...listing,
      landlord,
      duplicate_flags: duplicateFlags,
      reports
    };
  }

  async createListing(listingData) {
    const newListing = {
      id: uuidv4(),
      landlord_id: listingData.landlord_id || '11111111-1111-4111-a111-111111111111',
      title: listingData.title,
      property_type: listingData.property_type || listingData.propertyType,
      address: listingData.address,
      city: listingData.city,
      state: listingData.state || 'CA',
      zip_code: listingData.zip_code || listingData.zipCode || '',
      bedrooms: Number(listingData.bedrooms ?? 1),
      bathrooms: Number(listingData.bathrooms ?? 1.0),
      square_feet: listingData.square_feet ?? listingData.squareFeet ?? null,
      base_rent: Number(listingData.base_rent ?? listingData.baseRent),
      security_deposit: Number(listingData.security_deposit ?? listingData.securityDeposit ?? 0),
      recurring_fees: Number(listingData.recurring_fees ?? listingData.recurringFees ?? 0),
      fee_details: listingData.fee_details || listingData.feeDetails || {},
      amenities: listingData.amenities || [],
      description: listingData.description,
      images: listingData.images || [],
      verification_status: listingData.verification_status || 'unverified',
      verification_evidence: listingData.verification_evidence || listingData.verificationEvidence || [],
      moderation_notes: listingData.moderation_notes || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.listings.unshift(newListing);
    return newListing;
  }

  async updateListing(id, updates) {
    const index = this.listings.findIndex(l => l.id === id);
    if (index === -1) return null;

    this.listings[index] = {
      ...this.listings[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    return this.listings[index];
  }

  async deleteListing(id) {
    const initialLen = this.listings.length;
    this.listings = this.listings.filter(l => l.id !== id);
    return this.listings.length < initialLen;
  }

  // Duplicate Flags
  async createDuplicateFlag(flagData) {
    const newFlag = {
      id: uuidv4(),
      original_listing_id: flagData.original_listing_id || flagData.originalListingId,
      duplicate_listing_id: flagData.duplicate_listing_id || flagData.duplicateListingId,
      similarity_score: Number(flagData.similarity_score ?? flagData.similarityScore),
      ai_reasoning: flagData.ai_reasoning || flagData.aiReasoning,
      status: flagData.status || 'pending',
      reviewed_by: null,
      reviewed_at: null,
      created_at: new Date().toISOString()
    };

    this.duplicateFlags.unshift(newFlag);
    return newFlag;
  }

  async getDuplicateFlags(status) {
    let list = this.duplicateFlags;
    if (status && status !== 'all') {
      list = list.filter(f => f.status === status);
    }
    return list.map(flag => {
      const original = this.listings.find(l => l.id === flag.original_listing_id) || null;
      const duplicate = this.listings.find(l => l.id === flag.duplicate_listing_id) || null;
      return {
        ...flag,
        original_listing: original,
        duplicate_listing: duplicate
      };
    });
  }

  async updateDuplicateFlag(id, updates) {
    const index = this.duplicateFlags.findIndex(f => f.id === id);
    if (index === -1) return null;

    this.duplicateFlags[index] = {
      ...this.duplicateFlags[index],
      ...updates,
      reviewed_at: updates.status ? new Date().toISOString() : this.duplicateFlags[index].reviewed_at
    };
    return this.duplicateFlags[index];
  }

  // Reports
  async createReport(reportData) {
    const newReport = {
      id: uuidv4(),
      listing_id: reportData.listing_id || reportData.listingId,
      reporter_id: reportData.reporter_id || reportData.reporterId || '44444444-4444-4444-a444-444444444444',
      reason: reportData.reason,
      details: reportData.details || '',
      evidence_urls: reportData.evidence_urls || reportData.evidenceUrls || [],
      status: 'open',
      moderator_notes: '',
      resolved_by: null,
      resolved_at: null,
      created_at: new Date().toISOString()
    };

    this.reports.unshift(newReport);
    return newReport;
  }

  async getReports(status) {
    let list = this.reports;
    if (status && status !== 'all') {
      list = list.filter(r => r.status === status);
    }
    return list.map(report => {
      const listing = this.listings.find(l => l.id === report.listing_id) || null;
      const reporter = this.profiles.find(p => p.id === report.reporter_id) || null;
      return {
        ...report,
        listing,
        reporter
      };
    });
  }

  async updateReport(id, updates) {
    const index = this.reports.findIndex(r => r.id === id);
    if (index === -1) return null;

    this.reports[index] = {
      ...this.reports[index],
      ...updates,
      resolved_at: updates.status && ['resolved', 'dismissed'].includes(updates.status)
        ? new Date().toISOString()
        : this.reports[index].resolved_at
    };
    return this.reports[index];
  }

  async getModerationQueue() {
    const pendingFlags = await this.getDuplicateFlags('pending');
    const openReports = await this.getReports('open');
    const pendingListings = this.listings.filter(l => l.verification_status === 'pending_review');

    return {
      pendingFlags,
      openReports,
      pendingListings,
      stats: {
        totalListings: this.listings.length,
        verifiedCount: this.listings.filter(l => l.verification_status === 'verified').length,
        pendingReviewCount: pendingListings.length,
        flaggedDuplicatesCount: this.listings.filter(l => l.verification_status === 'flagged_duplicate').length,
        suspiciousCount: this.listings.filter(l => l.verification_status === 'suspicious').length,
        openReportsCount: openReports.length,
        pendingFlagsCount: pendingFlags.length
      }
    };
  }
}

export const db = new MemoryDataStore();
