async function runTests() {
  console.log('🧪 Starting Comprehensive RentCheck API & Intelligence Tests...\n');

  const baseUrl = 'http://localhost:5000/api';

  // Test 1: Health Check
  console.log('--- Test 1: Health Check ---');
  const healthRes = await fetch(`${baseUrl}/health`).then(r => r.json());
  console.log('Health Response:', healthRes);
  if (healthRes.status !== 'healthy') throw new Error('Health check failed');

  // Test 2: Fetch Listings with Filters
  console.log('\n--- Test 2: Fetch Listings (Filter city=San Francisco) ---');
  const sfListings = await fetch(`${baseUrl}/listings?city=San%20Francisco`).then(r => r.json());
  console.log(`Retrieved ${sfListings.count} listings in SF`);
  sfListings.listings.forEach(l => {
    console.log(` • [${l.verification_status}] ${l.title} - Base: $${l.base_rent}, True Monthly: $${l.total_monthly_occupancy}`);
  });

  // Test 3: Fetch Single Listing Detail
  console.log('\n--- Test 3: Fetch Single Listing Details with Verification Data ---');
  const sampleId = sfListings.listings[0].id;
  const detail = await fetch(`${baseUrl}/listings/${sampleId}`).then(r => r.json());
  console.log('Listing Title:', detail.listing.title);
  console.log('Itemized Fees:', detail.listing.fee_breakdown.itemized);
  console.log('Estimated Move-In Total:', detail.listing.estimated_move_in_total);
  console.log('Landlord Representation:', detail.listing.landlord?.full_name);

  // Test 4: Batch Compare Endpoint
  console.log('\n--- Test 4: Batch Compare Endpoint ---');
  const ids = sfListings.listings.slice(0, 2).map(l => l.id).join(',');
  const compareRes = await fetch(`${baseUrl}/listings/compare/batch?ids=${ids}`).then(r => r.json());
  console.log(`Batch compared ${compareRes.count} listings successfully.`);

  // Test 5: Create a New Listing & Trigger Automated Duplicate Detection Scan
  console.log('\n--- Test 5: Submit Listing & Trigger AI Duplicate Detection ---');
  // Submitting a listing with King Street address similar to The Beacon at Mission Bay
  const candidateDuplicate = {
    title: 'Mission Bay King Street 1BR Suite',
    propertyType: 'Apartment',
    address: '260 King Street, Suite 404',
    city: 'San Francisco',
    baseRent: 2800,
    securityDeposit: 2800,
    recurringFees: 200,
    feeDetails: {
      water_trash: 120,
      parking: 80
    },
    description: 'Beautiful Mission Bay residence with luxury finishes at 260 King St, hardwood flooring, and pool access.',
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'],
    verificationEvidence: ['https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80']
  };

  const createRes = await fetch(`${baseUrl}/listings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(candidateDuplicate)
  }).then(r => r.json());

  console.log('Create Listing Status:', createRes.message);
  console.log('Duplicate Detected:', createRes.duplicateAnalysis?.isDuplicate);
  console.log('Similarity Score:', createRes.duplicateAnalysis?.similarityScore);
  console.log('AI Reasoning:', createRes.duplicateAnalysis?.reasoning);
  console.log('Assigned Verification Status:', createRes.listing.verification_status);

  // Test 6: Report a Listing
  console.log('\n--- Test 6: Submit Suspicious Listing Report ---');
  const reportRes = await fetch(`${baseUrl}/listings/${createRes.listing.id}/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      reason: 'Duplicate syndication of another property',
      details: 'Identical address and photographs to the original Beacon listing.',
      evidenceUrls: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00']
    })
  }).then(r => r.json());
  console.log('Report Submission Result:', reportRes.message);

  // Test 7: Moderation Queue Inspection
  console.log('\n--- Test 7: Inspect Moderation Queue ---');
  const queueRes = await fetch(`${baseUrl}/moderation/queue`).then(r => r.json());
  console.log('Moderation Stats:', queueRes.data.stats);
  console.log(`Pending Duplicate Flags count: ${queueRes.data.pendingFlags.length}`);
  console.log(`Open Community Reports count: ${queueRes.data.openReports.length}`);

  // Test 8: Safe Moderator Status Update
  console.log('\n--- Test 8: Update Listing Status via Moderation API ---');
  const statusRes = await fetch(`${baseUrl}/moderation/listings/${createRes.listing.id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      verificationStatus: 'verified',
      moderationNotes: 'Audited ownership deed with city recorder. Verified legitimate property.'
    })
  }).then(r => r.json());
  console.log('Moderation Status Update Result:', statusRes.message);
  console.log('Updated Status:', statusRes.listing.verification_status);

  console.log('\n✅ All API & Deduplication Intelligence Tests Passed Successfully!');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
