import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  Trash2, 
  SlidersHorizontal, 
  ShieldCheck, 
  TrendingDown, 
  ArrowRight, 
  DollarSign, 
  Check, 
  ExternalLink,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useCompare } from '../context/CompareContext';
import VerificationBadge from './VerificationBadge';

export default function CostCalculator() {
  const { compareListings, isDrawerOpen, closeDrawer, removeFromCompare, clearCompare } = useCompare();
  const [leaseMonths, setLeaseMonths] = useState(12);

  if (!isDrawerOpen) return null;

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val || 0);

  // Calculate lowest monthly occupancy
  const lowestTotalMonthly = compareListings.length > 0
    ? Math.min(...compareListings.map(l => Number(l.base_rent || 0) + Number(l.recurring_fees || 0)))
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-md transition-opacity animate-in fade-in duration-300">
      <div className="w-full max-w-5xl bg-white/95 backdrop-blur-2xl h-full shadow-2xl flex flex-col border-l border-white/60 overflow-hidden">
        
        {/* Drawer Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-950 via-slate-900 to-navy-950 text-white flex items-center justify-between border-b border-slate-800 shadow-lg">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 text-white flex items-center justify-center border border-brand-400/30 shadow-md shadow-brand-500/20">
              <SlidersHorizontal size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight">Occupancy Cost Comparison Engine</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  Side-by-Side
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Itemized true recurring charges & security deposit comparison ({compareListings.length}/3 properties selected)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {compareListings.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-xs text-slate-400 hover:text-rose-400 font-bold flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-white/10 transition-colors"
              >
                <Trash2 size={13} />
                <span>Clear All</span>
              </button>
            )}
            <button
              onClick={closeDrawer}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Lease Duration Simulator Bar */}
        <div className="bg-slate-100/80 px-6 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs backdrop-blur-md">
          <div className="flex items-center gap-3 text-slate-700 font-bold">
            <Calendar size={16} className="text-brand-600" />
            <span>Simulate Lease Commitment:</span>
            <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-2xs">
              {[6, 12, 18, 24].map((m) => (
                <button
                  key={m}
                  onClick={() => setLeaseMonths(m)}
                  className={`px-3 py-1 rounded-lg font-black transition-all ${
                    leaseMonths === m 
                      ? 'bg-slate-900 text-white shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {m} Mo
                </button>
              ))}
            </div>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            Projections: Upfront Security Deposit + ({leaseMonths} × True Monthly Cost)
          </span>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {compareListings.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center shadow-inner">
                <SlidersHorizontal size={36} />
              </div>
              <div className="max-w-md">
                <h3 className="text-lg font-black text-slate-800 mb-1">No Listings Selected for Comparison</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Browse our transparent directory and click the <strong>"Compare"</strong> button on any property card to view side-by-side fee breakdowns, security deposits, and true monthly occupancy totals.
                </p>
              </div>
              <Link
                to="/listings"
                onClick={closeDrawer}
                className="luxury-btn-shimmer px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-emerald-600 text-white text-xs font-black hover:from-brand-500 hover:to-emerald-500 transition-all shadow-md inline-flex items-center gap-2"
              >
                <span>Browse Directory</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Grid of Comparing Listings */}
              <div className={`grid grid-cols-1 ${compareListings.length === 2 ? 'md:grid-cols-2' : compareListings.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-1 max-w-lg mx-auto'} gap-6`}>
                {compareListings.map((listing) => {
                  const baseRent = Number(listing.base_rent || 0);
                  const recurring = Number(listing.recurring_fees || 0);
                  const deposit = Number(listing.security_deposit || 0);
                  const totalMonthly = baseRent + recurring;
                  const moveInCost = totalMonthly + deposit;
                  const totalTermCost = deposit + (totalMonthly * leaseMonths);
                  const isLowestMonthly = compareListings.length > 1 && totalMonthly === lowestTotalMonthly;

                  const heroImg = listing.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80';

                  return (
                    <div
                      key={listing.id}
                      className={`luxury-card rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                        isLowestMonthly 
                          ? 'border-brand-500 shadow-luxury-hover ring-2 ring-brand-500/30 bg-white' 
                          : 'border-slate-200/90 shadow-luxury bg-white/90 hover:bg-white'
                      }`}
                    >
                      {/* Card Media Header */}
                      <div className="relative h-48 bg-slate-900 overflow-hidden">
                        <img src={heroImg} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20"></div>

                        <button
                          onClick={() => removeFromCompare(listing.id)}
                          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-slate-950/70 hover:bg-rose-600 text-white flex items-center justify-center transition-colors shadow-md"
                          title="Remove from comparison"
                        >
                          <X size={14} />
                        </button>
                        
                        <div className="absolute top-3 left-3">
                          <VerificationBadge status={listing.verification_status} size="sm" />
                        </div>

                        {isLowestMonthly && (
                          <div className="absolute bottom-3 left-3 right-3 bg-gradient-to-r from-brand-600 to-emerald-600 text-white text-[11px] font-black px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md border border-brand-300/40 animate-pulse">
                            <TrendingDown size={14} />
                            <span>Lowest True Monthly Cost</span>
                          </div>
                        )}
                      </div>

                      {/* Header details */}
                      <div className="p-4 border-b border-slate-100">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                          {listing.property_type} • {listing.city}
                        </span>
                        <h4 className="font-extrabold text-sm text-slate-900 line-clamp-1 mt-0.5">
                          {listing.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{listing.address}</p>
                      </div>

                      {/* Metrics comparison matrix */}
                      <div className="p-4 space-y-3 flex-1 text-xs">
                        
                        {/* True Monthly Highlight Box */}
                        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-brand-50 to-emerald-50/40 border border-brand-200/90 shadow-2xs">
                          <span className="text-[10px] font-black uppercase tracking-wider text-brand-900">
                            True Monthly Occupancy
                          </span>
                          <div className="text-2xl font-black text-slate-900 mt-0.5">
                            {formatCurrency(totalMonthly)}
                            <span className="text-xs font-normal text-slate-500"> /mo</span>
                          </div>
                        </div>

                        {/* Breakdown lines */}
                        <div className="space-y-1.5 text-slate-600 pt-1 font-medium">
                          <div className="flex justify-between">
                            <span>Base Advertised Rent:</span>
                            <span className="font-bold text-slate-800">{formatCurrency(baseRent)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Disclosed Utilities & Fees:</span>
                            <span className="font-bold text-emerald-700">+{formatCurrency(recurring)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Security Deposit:</span>
                            <span className="font-bold text-slate-800">{formatCurrency(deposit)}</span>
                          </div>
                          <div className="flex justify-between pt-1.5 border-t border-slate-100">
                            <span className="font-extrabold text-slate-800">1st Month Move-In Capital:</span>
                            <span className="font-black text-slate-900">{formatCurrency(moveInCost)}</span>
                          </div>
                        </div>

                        {/* Itemized recurring fees preview */}
                        <div className="pt-2 border-t border-slate-100">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                            Disclosed In Recurring Total:
                          </span>
                          {listing.fee_details && Object.keys(listing.fee_details).length > 0 ? (
                            <div className="space-y-1 text-[11px]">
                              {Object.entries(listing.fee_details).map(([k, val]) => (
                                <div key={k} className="flex justify-between text-slate-500 font-medium">
                                  <span className="capitalize">{k.replace(/_/g, ' ')}:</span>
                                  <span className="font-bold text-slate-700">{formatCurrency(val)}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">No extra monthly fees disclosed.</span>
                          )}
                        </div>

                        {/* Lease Term Total projection */}
                        <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-slate-600 font-semibold">{leaseMonths}-Mo Total Cost:</span>
                            <span className="font-black text-slate-900 text-sm">{formatCurrency(totalTermCost)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="p-4 bg-slate-50/70 border-t border-slate-100">
                        <Link
                          to={`/listings/${listing.id}`}
                          onClick={closeDrawer}
                          className="luxury-btn-shimmer w-full py-2.5 rounded-xl bg-slate-900 hover:bg-brand-600 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md"
                        >
                          <span>Inspect Full Verified Details</span>
                          <ExternalLink size={13} />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Renter Guidance Box */}
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-3.5 shadow-2xs">
                <ShieldCheck size={22} className="text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-extrabold text-slate-800">RentCheck Comparison Guarantee</h5>
                  <p className="text-[11px] leading-relaxed text-slate-500 mt-0.5">
                    Traditional rental portals hide parking, pet rents, and trash valets until the lease signing phase. RentCheck forces complete itemized disclosure upfront so your side-by-side comparison reflects true out-of-pocket occupancy.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
