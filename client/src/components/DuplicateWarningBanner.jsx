import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ExternalLink, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';

export default function DuplicateWarningBanner({ duplicateFlag, originalListingId, isDetailed = true }) {
  if (!duplicateFlag && !originalListingId) return null;

  const score = duplicateFlag?.similarity_score 
    ? Math.round(duplicateFlag.similarity_score * 100) 
    : 85;

  const reasoning = duplicateFlag?.ai_reasoning || 
    'Automated AI deduplication heuristics detected significant metadata, description, and photographic overlap with an existing verified listing.';

  const targetOriginalId = originalListingId || duplicateFlag?.original_listing_id;

  return (
    <div className="rounded-2xl border-2 border-orange-300 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 p-5 shadow-sm my-4">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        
        {/* Warning Icon Container */}
        <div className="w-12 h-12 rounded-xl bg-orange-100 border border-orange-200 text-orange-600 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-6 h-6 animate-pulse" />
        </div>

        {/* Content Body */}
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-orange-900 text-base flex items-center gap-1.5">
              <ShieldAlert size={18} className="text-orange-600" />
              Automated Duplicate Syndication Advisory
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-orange-200 text-orange-950 font-bold text-xs flex items-center gap-1">
              <Sparkles size={12} className="text-orange-700" />
              {score}% Match Confidence
            </span>
            <span className="text-xs text-orange-700 font-medium">
              Status: {duplicateFlag?.status || 'Pending Moderator Review'}
            </span>
          </div>

          <p className="text-xs text-orange-950 leading-relaxed font-medium">
            {reasoning}
          </p>

          {isDetailed && (
            <div className="bg-white/80 rounded-xl p-3 border border-orange-200/80 text-xs text-slate-700 space-y-1">
              <p className="font-semibold text-slate-900 flex items-center gap-1">
                <HelpCircle size={14} className="text-orange-600" />
                Why RentCheck flags duplicates:
              </p>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Syndication scrapers and unverified sublease posts frequently re-publish legitimate properties with lower advertised rents while omitting mandatory utility charges or attempting deposit wire fraud. Compare against the original verified source below.
              </p>
            </div>
          )}

          {/* Action Links */}
          {targetOriginalId && (
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to={`/listings/${targetOriginalId}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs shadow-xs transition-colors"
              >
                <span>Inspect Original Verified Listing</span>
                <ExternalLink size={13} />
              </Link>
              <span className="text-[11px] text-orange-800">
                Cross-reference photos, landlord verification docs, and utility costs.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
