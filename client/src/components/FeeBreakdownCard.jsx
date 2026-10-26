import React from 'react';
import { DollarSign, ShieldCheck, Info, Check, HelpCircle, Sparkles } from 'lucide-react';

export default function FeeBreakdownCard({ listing, variant = 'full' }) {
  if (!listing) return null;

  const baseRent = Number(listing.base_rent || listing.baseRent || 0);
  const recurringFees = Number(listing.recurring_fees || listing.recurringFees || 0);
  const securityDeposit = Number(listing.security_deposit || listing.securityDeposit || 0);
  const feeDetails = listing.fee_details || listing.feeDetails || {};

  const totalMonthly = baseRent + recurringFees;
  const moveInTotal = baseRent + securityDeposit + recurringFees;

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const formatKeyName = (key) => {
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  if (variant === 'compact') {
    return (
      <div className="luxury-glass rounded-2xl p-4 border border-white/80 shadow-luxury">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>Base Advertised Rent:</span>
          <span className="font-extrabold text-slate-800">{formatCurrency(baseRent)}/mo</span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span>Disclosed Utilities & Fees:</span>
          <span className="font-extrabold text-emerald-700">+{formatCurrency(recurringFees)}/mo</span>
        </div>
        <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
          <span className="text-xs font-black text-slate-900">Total Monthly Cost:</span>
          <span className="text-base font-black text-brand-700">{formatCurrency(totalMonthly)}/mo</span>
        </div>
      </div>
    );
  }

  return (
    <div className="luxury-glass rounded-3xl border border-white/80 p-7 shadow-luxury backdrop-blur-xl">
      <div className="flex items-center justify-between pb-5 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <DollarSign className="text-brand-600 w-5 h-5" />
            Transparent Fee Matrix
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified monthly recurring obligations & one-time move-in capital
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full font-extrabold border border-emerald-200/80 shadow-2xs">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>Zero Surcharge Guarantee</span>
        </div>
      </div>

      {/* Main Monthly Calculation Block */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Monthly Recurring Box */}
        <div className="luxury-card bg-gradient-to-br from-brand-50/80 via-emerald-50/40 to-teal-50/20 rounded-2xl p-5 border border-brand-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-brand-900">
              True Monthly Occupancy
            </span>
            <Sparkles size={14} className="text-brand-600" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{formatCurrency(totalMonthly)}</span>
            <span className="text-xs text-slate-500 font-semibold">/ month</span>
          </div>
          <div className="mt-3.5 text-xs text-slate-600 space-y-1.5 pt-2 border-t border-brand-200/60 font-medium">
            <div className="flex justify-between">
              <span>Base Advertised Rent:</span>
              <span className="font-extrabold text-slate-800">{formatCurrency(baseRent)}</span>
            </div>
            <div className="flex justify-between">
              <span>Disclosed Utilities & Parking:</span>
              <span className="font-black text-emerald-700">+{formatCurrency(recurringFees)}</span>
            </div>
          </div>
        </div>

        {/* Upfront Move-In Box */}
        <div className="luxury-card bg-white/80 rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">
              Estimated Move-In Capital
            </span>
            <ShieldCheck size={14} className="text-slate-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{formatCurrency(moveInTotal)}</span>
            <span className="text-xs text-slate-500 font-semibold">1st month</span>
          </div>
          <div className="mt-3.5 text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-200/60 font-medium">
            <div className="flex justify-between">
              <span>1st Month Total:</span>
              <span className="font-extrabold text-slate-800">{formatCurrency(totalMonthly)}</span>
            </div>
            <div className="flex justify-between">
              <span>Security Deposit:</span>
              <span className="font-extrabold text-slate-800">{formatCurrency(securityDeposit)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Itemized Disclosed Fees List */}
      <div className="mt-7">
        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3">
          Itemized Monthly Fee Breakdown
        </h4>

        {Object.keys(feeDetails).length === 0 ? (
          <div className="bg-slate-50/80 rounded-2xl p-4 text-xs text-slate-500 flex items-center gap-2.5 border border-slate-200">
            <Info size={16} className="text-slate-400 shrink-0" />
            <span>No additional recurring fees disclosed by landlord. Base rent covers standard occupancy.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            {Object.entries(feeDetails).map(([key, amount]) => (
              <div
                key={key}
                className="flex items-center justify-between p-3 rounded-xl bg-white/70 hover:bg-white border border-slate-200/80 hover:border-brand-300 shadow-2xs hover:shadow-xs transition-all duration-200"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-brand-500 ring-2 ring-brand-100"></div>
                  <span className="text-slate-700 font-bold">{formatKeyName(key)}</span>
                </div>
                <span className="font-black text-slate-900">
                  {amount > 0 ? `${formatCurrency(amount)}/mo` : 'Included in Rent'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Renter Protection Advisory Note */}
      <div className="mt-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-[11px] text-amber-950 flex items-start gap-3 shadow-2xs">
        <Info size={17} className="text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed font-medium">
          <strong>RentCheck Transparency Pledge:</strong> If the landlord attempts to charge recurring mandatory fees not listed above upon lease signing, you can submit a fee discrepancy report with your lease agreement for expedited moderator investigation.
        </p>
      </div>
    </div>
  );
}
