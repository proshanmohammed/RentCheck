import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  DollarSign, 
  ShieldCheck, 
  AlertTriangle, 
  Flag, 
  SlidersHorizontal, 
  Check, 
  FileText, 
  User, 
  ExternalLink,
  ChevronLeft,
  Calendar,
  Share2,
  Phone,
  Mail,
  Sparkles
} from 'lucide-react';
import VerificationBadge from '../components/VerificationBadge';
import FeeBreakdownCard from '../components/FeeBreakdownCard';
import DuplicateWarningBanner from '../components/DuplicateWarningBanner';
import ReportModal from '../components/ReportModal';
import { useCompare } from '../context/CompareContext';

export default function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isComparing, toggleCompare, openDrawer } = useCompare();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchListingDetails = () => {
    setLoading(true);
    fetch(`/api/listings/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Listing not found or server error.');
        return res.json();
      })
      .then((data) => setListing(data.listing))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchListingDetails();
    window.scrollTo(0, 0);
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-28 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">
          Loading Transparent Residence Profile...
        </p>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4 luxury-glass rounded-3xl p-8 border border-white/80 shadow-luxury">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-black text-slate-900">Residence Not Available</h2>
        <p className="text-xs text-slate-500">{error || 'This listing does not exist or has been archived.'}</p>
        <Link
          to="/listings"
          className="luxury-btn-shimmer inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
        >
          <ChevronLeft size={16} />
          <span>Back to Directory</span>
        </Link>
      </div>
    );
  }

  const images = listing.images && listing.images.length > 0
    ? listing.images
    : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'];

  const comparing = isComparing(listing.id);
  const activeDuplicateFlag = listing.duplicate_flags?.[0] || null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Breadcrumb & Actions Bar */}
      <div className="luxury-glass p-4 rounded-2xl border border-white/80 shadow-luxury flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-xl">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/listings" className="hover:text-slate-900 font-extrabold flex items-center gap-1 transition-colors">
            <ChevronLeft size={14} />
            <span>Listings Directory</span>
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-extrabold truncate max-w-xs">{listing.title}</span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Compare toggle */}
          <button
            onClick={() => {
              toggleCompare(listing);
              openDrawer();
            }}
            className={`luxury-btn-shimmer px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              comparing
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 ring-2 ring-brand-400/40'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs'
            }`}
          >
            <SlidersHorizontal size={14} />
            <span>{comparing ? 'Comparing in Drawer' : 'Compare Fees'}</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-2xs relative"
            title="Copy Listing URL"
          >
            <Share2 size={16} />
            {copiedLink && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] font-bold shadow-md whitespace-nowrap">
                Copied!
              </span>
            )}
          </button>

          {/* Report Listing Button */}
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 hover:bg-rose-100 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Flag size={13} />
            <span>Report Ad</span>
          </button>
        </div>
      </div>

      {/* Duplicate Warning Banner (If flagged) */}
      {(listing.verification_status === 'flagged_duplicate' || activeDuplicateFlag) && (
        <DuplicateWarningBanner
          duplicateFlag={activeDuplicateFlag}
          originalListingId={activeDuplicateFlag?.original_listing_id}
          isDetailed={true}
        />
      )}

      {/* Main Listing Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <VerificationBadge status={listing.verification_status} size="md" />
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-white/90 border border-slate-200 text-slate-800 shadow-2xs">
              {listing.property_type}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {listing.title}
          </h1>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-semibold">
            <MapPin size={16} className="text-brand-600 shrink-0" />
            <span>{listing.address}, {listing.city}, {listing.state} {listing.zip_code}</span>
          </div>
        </div>

        {/* Pricing Summary Pill on Right */}
        <div className="luxury-glass bg-gradient-to-br from-brand-50/90 via-emerald-50/40 to-teal-50/20 rounded-3xl p-6 border border-white/80 text-right shrink-0 shadow-luxury">
          <span className="text-[10px] font-black uppercase tracking-widest text-brand-900 block">
            True Monthly Occupancy
          </span>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
            ${listing.total_monthly_occupancy}
            <span className="text-xs text-slate-500 font-normal"> /mo</span>
          </div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            ${listing.base_rent} Base + ${listing.recurring_fees} Mandatory Disclosed Fees
          </div>
        </div>
      </div>

      {/* Photo Gallery Grid */}
      <div className="space-y-4">
        <div className="h-96 sm:h-[460px] md:h-[520px] w-full rounded-3xl overflow-hidden bg-slate-950 relative shadow-2xl border border-white/60">
          <img
            src={images[activeImageIndex]}
            alt={listing.title}
            className="w-full h-full object-cover transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-black/10"></div>
        </div>

        {images.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-28 h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition-all duration-300 ${
                  activeImageIndex === idx 
                    ? 'border-brand-500 ring-4 ring-brand-500/25 scale-105 shadow-md' 
                    : 'border-transparent opacity-70 hover:opacity-100 hover:scale-100'
                }`}
              >
                <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Grid: Fee Breakdown & Property Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column (2 Cols): Details & Description */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Key Specs Card */}
          <div className="luxury-glass rounded-3xl border border-white/80 p-6 shadow-luxury grid grid-cols-3 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-white/70 border border-slate-100 shadow-2xs hover:shadow-xs transition-shadow">
              <Bed className="w-6 h-6 text-brand-600 mx-auto mb-1.5" />
              <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Bedrooms</span>
              <strong className="text-base font-black text-slate-900">{listing.bedrooms === 0 ? 'Studio' : listing.bedrooms}</strong>
            </div>

            <div className="p-4 rounded-2xl bg-white/70 border border-slate-100 shadow-2xs hover:shadow-xs transition-shadow">
              <Bath className="w-6 h-6 text-brand-600 mx-auto mb-1.5" />
              <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Bathrooms</span>
              <strong className="text-base font-black text-slate-900">{listing.bathrooms}</strong>
            </div>

            <div className="p-4 rounded-2xl bg-white/70 border border-slate-100 shadow-2xs hover:shadow-xs transition-shadow">
              <Maximize2 className="w-6 h-6 text-brand-600 mx-auto mb-1.5" />
              <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Area</span>
              <strong className="text-base font-black text-slate-900">{listing.square_feet ? `${listing.square_feet} sqft` : 'N/A'}</strong>
            </div>

            <div className="p-4 rounded-2xl bg-white/70 border border-slate-100 shadow-2xs hover:shadow-xs transition-shadow col-span-3 sm:col-span-1">
              <Building2 className="w-6 h-6 text-brand-600 mx-auto mb-1.5" />
              <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Type</span>
              <strong className="text-base font-black text-slate-900 truncate block">{listing.property_type}</strong>
            </div>
          </div>

          {/* Description */}
          <div className="luxury-glass rounded-3xl border border-white/80 p-7 shadow-luxury space-y-3">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Property Overview</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line font-medium">
              {listing.description}
            </p>
          </div>

          {/* Amenities checklist */}
          {listing.amenities && listing.amenities.length > 0 && (
            <div className="luxury-glass rounded-3xl border border-white/80 p-7 shadow-luxury space-y-4">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Residences Features & Amenities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {listing.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 font-semibold p-2.5 rounded-xl bg-white/60 border border-slate-100">
                    <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
                      <Check size={12} />
                    </div>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Landlord & Evidence Verification Section */}
          <div className="luxury-glass rounded-3xl border border-white/80 p-7 shadow-luxury space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="text-brand-600 w-5 h-5" />
                Evidence & Verification Audit Trail
              </h3>
              <VerificationBadge status={listing.verification_status} size="sm" />
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {listing.moderation_notes || 'All submitted deeds, lease disclosures, and utility attachments are cross-referenced with public property tax rolls.'}
            </p>

            {listing.verification_evidence && listing.verification_evidence.length > 0 && (
              <div className="pt-2 space-y-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                  Audited Ownership Documents
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {listing.verification_evidence.map((docUrl, i) => (
                    <a
                      key={i}
                      href={docUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 transition-colors shadow-2xs"
                    >
                      <FileText size={14} className="text-brand-600" />
                      <span>Audit Document #{i + 1}</span>
                      <ExternalLink size={11} className="text-slate-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column (1 Col): Cost Breakdown Card & Contact */}
        <div className="space-y-6">
          
          {/* Transparent Cost Breakdown Card */}
          <FeeBreakdownCard listing={listing} variant="full" />

          {/* Landlord Contact Card */}
          <div className="luxury-glass rounded-3xl border border-white/80 p-7 shadow-luxury space-y-5">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Verified Representation
            </h4>

            <div className="flex items-center gap-3.5">
              <img
                src={listing.landlord?.avatar_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80'}
                alt={listing.landlord?.full_name || 'Landlord'}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-brand-500 shadow-sm"
              />
              <div>
                <h5 className="font-extrabold text-base text-slate-900">
                  {listing.landlord?.full_name || 'Verified Property Manager'}
                </h5>
                <span className="text-xs text-brand-600 font-bold capitalize">
                  {listing.landlord?.role || 'Landlord'} • RentCheck Verified
                </span>
              </div>
            </div>

            <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-2.5">
                <Mail size={15} className="text-slate-400" />
                <span className="truncate">{listing.landlord?.email || 'contact@baypropertymgmt.com'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={15} className="text-slate-400" />
                <span>{listing.landlord?.phone || '+1 (415) 555-0142'}</span>
              </div>
            </div>

            <button
              onClick={() => alert(`Direct inquiry simulated to ${listing.landlord?.email || 'property manager'}. RentCheck guarantees zero undisclosed application surcharge.`)}
              className="luxury-btn-shimmer w-full py-3 rounded-2xl bg-gradient-to-r from-slate-900 via-brand-900 to-slate-900 hover:from-brand-600 hover:to-emerald-600 text-white font-black text-xs transition-all shadow-md"
            >
              Contact Verified Representative
            </button>
          </div>

        </div>

      </div>

      {/* Report Listing Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        listing={listing}
        onReportSubmitted={() => {
          fetchListingDetails();
        }}
      />

    </div>
  );
}
