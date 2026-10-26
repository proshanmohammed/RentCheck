import React from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Maximize2, MapPin, SlidersHorizontal, ArrowRight, AlertTriangle, Sparkles } from 'lucide-react';
import VerificationBadge from './VerificationBadge';
import { useCompare } from '../context/CompareContext';

export default function ListingCard({ listing }) {
  if (!listing) return null;

  const { isComparing, toggleCompare } = useCompare();
  const comparing = isComparing(listing.id);

  const baseRent = Number(listing.base_rent || 0);
  const recurringFees = Number(listing.recurring_fees || 0);
  const totalMonthly = baseRent + recurringFees;

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const heroImage = listing.images && listing.images.length > 0
    ? listing.images[0]
    : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="group luxury-card luxury-glass rounded-3xl border border-white/70 hover:border-emerald-400/50 shadow-luxury hover:shadow-luxury-hover transition-all duration-500 flex flex-col relative overflow-hidden backdrop-blur-xl">
      
      {/* Media & Badges Header */}
      <div className="relative h-56 sm:h-60 w-full overflow-hidden bg-slate-900">
        <img
          src={heroImage}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-black/25"></div>

        {/* Verification Badge (Top Left) */}
        <div className="absolute top-3.5 left-3.5 z-10 drop-shadow-md">
          <VerificationBadge status={listing.verification_status} size="sm" />
        </div>

        {/* Property Type Pill (Top Right) */}
        <div className="absolute top-3.5 right-3.5 z-10">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-slate-950/60 backdrop-blur-md text-white border border-white/20 shadow-md">
            {listing.property_type}
          </span>
        </div>

        {/* Duplicate alert indicator if applicable */}
        {listing.verification_status === 'flagged_duplicate' && (
          <div className="absolute bottom-3 left-3 right-3 z-10 bg-orange-600/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-lg border border-orange-400/40">
            <AlertTriangle size={14} className="shrink-0 animate-bounce text-orange-200" />
            <span className="truncate">Automated duplicate syndication detected</span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1.5">
            <MapPin size={14} className="text-brand-600 shrink-0" />
            <span className="truncate">{listing.address}, {listing.city}</span>
          </div>

          {/* Title */}
          <Link to={`/listings/${listing.id}`}>
            <h3 className="font-extrabold text-base text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1 mb-3">
              {listing.title}
            </h3>
          </Link>

          {/* Specs: Bed, Bath, Sqft */}
          <div className="flex items-center gap-3 text-xs text-slate-600 pb-3 mb-3 border-b border-slate-100/80 font-medium">
            <span className="flex items-center gap-1.5">
              <Bed size={15} className="text-slate-400 group-hover:text-brand-600 transition-colors" />
              <span>{listing.bedrooms === 0 ? 'Studio' : `${listing.bedrooms} Bed`}</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5">
              <Bath size={15} className="text-slate-400 group-hover:text-brand-600 transition-colors" />
              <span>{listing.bathrooms} Bath</span>
            </span>
            {listing.square_feet && (
              <>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1.5">
                  <Maximize2 size={15} className="text-slate-400 group-hover:text-brand-600 transition-colors" />
                  <span>{listing.square_feet} sqft</span>
                </span>
              </>
            )}
          </div>

          {/* Transparent Cost Summary Box */}
          <div className="bg-gradient-to-br from-slate-50/90 to-brand-50/40 rounded-2xl p-4 border border-slate-200/80 group-hover:border-brand-300 transition-colors mb-4 shadow-2xs">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-xs text-slate-500 font-medium">Advertised Rent:</span>
              <span className="text-xs font-semibold text-slate-700">{formatCurrency(baseRent)}/mo</span>
            </div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-xs text-slate-500 font-medium">Disclosed Fees & Utilities:</span>
              <span className="text-xs font-semibold text-emerald-700">+{formatCurrency(recurringFees)}/mo</span>
            </div>
            <div className="pt-2.5 border-t border-slate-200/90 flex items-baseline justify-between">
              <span className="text-xs font-extrabold text-slate-900 uppercase tracking-tight flex items-center gap-1">
                <span>True Monthly:</span>
              </span>
              <span className="text-lg font-black text-brand-700">{formatCurrency(totalMonthly)}<span className="text-xs font-normal text-slate-500">/mo</span></span>
            </div>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="pt-3 flex items-center justify-between gap-2 border-t border-slate-100">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleCompare(listing);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-300 ${
              comparing
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 ring-2 ring-brand-400/50'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs hover:shadow-xs'
            }`}
            title={comparing ? 'Remove from comparison' : 'Add to side-by-side comparison'}
          >
            <SlidersHorizontal size={13} className={comparing ? 'animate-pulse' : ''} />
            <span>{comparing ? 'Comparing' : 'Compare'}</span>
          </button>

          <Link
            to={`/listings/${listing.id}`}
            className="luxury-btn-shimmer px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-slate-900 hover:bg-brand-600 transition-all duration-300 flex items-center gap-1.5 shadow-md group-hover:shadow-brand-500/25"
          >
            <span>Inspect Details</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
