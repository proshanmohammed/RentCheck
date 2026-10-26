import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink, 
  Sparkles, 
  FileText, 
  HelpCircle,
  Eye,
  RefreshCw
} from 'lucide-react';
import VerificationBadge from './VerificationBadge';

export default function ModerationTable({ queueData, onRefresh, onUpdateStatus, onUpdateFlag, onUpdateReport }) {
  const [activeTab, setActiveTab] = useState('flags'); // 'flags' | 'reports' | 'pending'
  const [processingId, setProcessingId] = useState(null);

  const pendingFlags = queueData?.pendingFlags || [];
  const openReports = queueData?.openReports || [];
  const pendingListings = queueData?.pendingListings || [];

  const handleResolveFlag = async (flagId, newStatus) => {
    setProcessingId(flagId);
    try {
      await onUpdateFlag(flagId, newStatus);
    } finally {
      setProcessingId(null);
    }
  };

  const handleResolveReport = async (reportId, newStatus, moderatorNotes) => {
    setProcessingId(reportId);
    try {
      await onUpdateReport(reportId, newStatus, moderatorNotes);
    } finally {
      setProcessingId(null);
    }
  };

  const handleUpdateListingVerification = async (listingId, newStatus, notes) => {
    setProcessingId(listingId);
    try {
      await onUpdateStatus(listingId, newStatus, notes);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      
      {/* Header & Tabs */}
      <div className="p-6 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="text-amber-600 w-5 h-5" />
            Compliance Moderation Queue
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Objective evidence validation to protect seekers without unfair automatic fraud labels
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200 transition-colors shadow-2xs"
            title="Refresh Moderation Queue"
          >
            <RefreshCw size={15} />
          </button>

          {/* Tab buttons */}
          <div className="inline-flex rounded-xl bg-slate-200/80 p-1 text-xs font-bold">
            <button
              onClick={() => setActiveTab('flags')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'flags' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Duplicate Flags</span>
              <span className="px-1.5 py-0.2 rounded-full bg-orange-100 text-orange-800 text-[10px]">
                {pendingFlags.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'reports' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>User Reports</span>
              <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-800 text-[10px]">
                {openReports.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Pending Proof</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px]">
                {pendingListings.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Duplicate Flags */}
      {activeTab === 'flags' && (
        <div className="p-6">
          {pendingFlags.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <CheckCircle2 size={36} className="mx-auto mb-2 text-emerald-500" />
              <p className="text-sm font-semibold text-slate-700">No Pending Duplicate Flags</p>
              <p className="text-xs text-slate-400">Gemini deduplication scans are currently clear.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingFlags.map((flag) => {
                const isProcessing = processingId === flag.id;
                const scorePercent = Math.round((flag.similarity_score || 0) * 100);

                return (
                  <div
                    key={flag.id}
                    className="p-5 rounded-2xl border border-orange-200 bg-orange-50/40 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-orange-200/60">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-orange-200 text-orange-950 font-extrabold text-xs flex items-center gap-1">
                          <Sparkles size={12} className="text-orange-700" />
                          {scorePercent}% Similarity Heuristic
                        </span>
                        <span className="text-xs font-semibold text-orange-800">
                          Flag #{flag.id.slice(0, 8)}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Detected: {new Date(flag.created_at).toLocaleString()}
                      </span>
                    </div>

                    {/* AI Reasoning Quote */}
                    <div className="p-3 rounded-xl bg-white/90 border border-orange-200 text-xs text-slate-700 space-y-1">
                      <span className="font-bold text-slate-900 flex items-center gap-1 text-[11px] uppercase tracking-wider text-orange-700">
                        <Sparkles size={12} />
                        RentCheck Core Intelligence Reasoning:
                      </span>
                      <p className="leading-relaxed text-slate-800">{flag.ai_reasoning}</p>
                    </div>

                    {/* Comparison Cards: Original vs Duplicate */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      {/* Original Listing */}
                      <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          Source / Original Listing
                        </span>
                        <h4 className="font-bold text-slate-900 mt-2 truncate">
                          {flag.original_listing?.title || `Listing #${flag.original_listing_id?.slice(0, 8)}`}
                        </h4>
                        <p className="text-slate-500 text-[11px] truncate">{flag.original_listing?.address}</p>
                        <div className="mt-2 text-slate-700">
                          Rent: <strong>${flag.original_listing?.base_rent}/mo</strong> + ${flag.original_listing?.recurring_fees || 0} fees
                        </div>
                        <div className="mt-2">
                          <Link
                            to={`/listings/${flag.original_listing_id}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-700 hover:underline"
                          >
                            <span>Inspect Original Listing</span>
                            <ExternalLink size={11} />
                          </Link>
                        </div>
                      </div>

                      {/* Flagged Duplicate Listing */}
                      <div className="p-3.5 rounded-xl bg-white border border-orange-300 shadow-2xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-800 bg-orange-100 px-2 py-0.5 rounded">
                          Flagged Duplicate Ad
                        </span>
                        <h4 className="font-bold text-slate-900 mt-2 truncate">
                          {flag.duplicate_listing?.title || `Listing #${flag.duplicate_listing_id?.slice(0, 8)}`}
                        </h4>
                        <p className="text-slate-500 text-[11px] truncate">{flag.duplicate_listing?.address}</p>
                        <div className="mt-2 text-slate-700">
                          Rent: <strong>${flag.duplicate_listing?.base_rent}/mo</strong>
                        </div>
                        <div className="mt-2">
                          <Link
                            to={`/listings/${flag.duplicate_listing_id}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-700 hover:underline"
                          >
                            <span>Inspect Flagged Listing</span>
                            <ExternalLink size={11} />
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Moderator Action Buttons */}
                    <div className="pt-2 flex flex-wrap items-center justify-end gap-3">
                      <button
                        disabled={isProcessing}
                        onClick={() => handleResolveFlag(flag.id, 'false_positive')}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 size={14} />
                        <span>Clear as False Positive</span>
                      </button>

                      <button
                        disabled={isProcessing}
                        onClick={() => handleResolveFlag(flag.id, 'confirmed_duplicate')}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 transition-colors shadow-xs flex items-center gap-1.5"
                      >
                        <AlertTriangle size={14} />
                        <span>Confirm Duplicate Syndication</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: User Community Reports */}
      {activeTab === 'reports' && (
        <div className="p-6">
          {openReports.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <CheckCircle2 size={36} className="mx-auto mb-2 text-emerald-500" />
              <p className="text-sm font-semibold text-slate-700">No Open User Reports</p>
              <p className="text-xs text-slate-400">All community submissions have been reviewed.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {openReports.map((report) => {
                const isProcessing = processingId === report.id;

                return (
                  <div
                    key={report.id}
                    className="p-5 rounded-2xl border border-rose-200 bg-rose-50/30 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-rose-200/60">
                      <div>
                        <span className="font-bold text-sm text-slate-900 block">
                          Reason: {report.reason}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Listing: <strong>{report.listing?.title || report.listing_id}</strong>
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {new Date(report.created_at).toLocaleString()}
                      </span>
                    </div>

                    <div className="text-xs text-slate-700">
                      <p className="font-semibold text-slate-900 mb-0.5">Reporter Statement:</p>
                      <p className="p-2.5 rounded-xl bg-white border border-slate-200 leading-relaxed">
                        {report.details || 'No additional statement provided.'}
                      </p>
                    </div>

                    {/* Evidence links */}
                    {report.evidence_urls && report.evidence_urls.length > 0 && (
                      <div className="text-xs space-y-1">
                        <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">
                          Attached Evidence Links:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {report.evidence_urls.map((url, i) => (
                            <a
                              key={i}
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white border border-slate-200 text-brand-700 text-xs hover:underline"
                            >
                              <FileText size={12} />
                              <span>Evidence Link #{i + 1}</span>
                              <ExternalLink size={10} />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-rose-200/60">
                      <Link
                        to={`/listings/${report.listing_id}`}
                        target="_blank"
                        className="text-xs font-semibold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1"
                      >
                        <Eye size={13} />
                        <span>View Reported Listing</span>
                      </Link>

                      <div className="flex items-center gap-2">
                        <button
                          disabled={isProcessing}
                          onClick={() => handleResolveReport(report.id, 'dismissed', 'Evidence inspected: does not substantiate violation.')}
                          className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                          Dismiss Report
                        </button>
                        <button
                          disabled={isProcessing}
                          onClick={() => handleResolveReport(report.id, 'resolved', 'Listing flagged for suspicious activity following evidence review.')}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-xs"
                        >
                          Resolve & Mark Suspicious
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Pending Proof / Verification Documents */}
      {activeTab === 'pending' && (
        <div className="p-6">
          {pendingListings.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <CheckCircle2 size={36} className="mx-auto mb-2 text-emerald-500" />
              <p className="text-sm font-semibold text-slate-700">No Listings Awaiting Proof Inspection</p>
              <p className="text-xs text-slate-400">All submitted proof documents have been validated.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingListings.map((listing) => {
                const isProcessing = processingId === listing.id;

                return (
                  <div
                    key={listing.id}
                    className="p-5 rounded-2xl border border-amber-200 bg-amber-50/30 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-amber-200/60">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{listing.title}</h4>
                        <p className="text-xs text-slate-500">{listing.address}, {listing.city}</p>
                      </div>
                      <VerificationBadge status={listing.verification_status} size="sm" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500">Advertised Rent & Fees:</span>
                        <div className="font-bold text-slate-800 text-sm">
                          ${listing.base_rent}/mo + ${listing.recurring_fees || 0} recurring
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500">Security Deposit:</span>
                        <div className="font-bold text-slate-800 text-sm">
                          ${listing.security_deposit}
                        </div>
                      </div>
                    </div>

                    {/* Verification Evidence Links */}
                    {listing.verification_evidence && listing.verification_evidence.length > 0 && (
                      <div className="text-xs space-y-1 pt-1">
                        <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">
                          Uploaded Ownership Documents / Proof:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {listing.verification_evidence.map((url, i) => (
                            <a
                              key={i}
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-brand-700 text-xs hover:underline shadow-2xs"
                            >
                              <FileText size={13} />
                              <span>Deed / Management Agreement #{i + 1}</span>
                              <ExternalLink size={10} />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-amber-200/60">
                      <Link
                        to={`/listings/${listing.id}`}
                        target="_blank"
                        className="text-xs font-semibold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1"
                      >
                        <Eye size={13} />
                        <span>Inspect Listing Profile</span>
                      </Link>

                      <div className="flex items-center gap-2">
                        <button
                          disabled={isProcessing}
                          onClick={() => handleUpdateListingVerification(listing.id, 'unverified', 'Verification documents rejected: insufficient proof of ownership.')}
                          className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                          Reject Documents
                        </button>
                        <button
                          disabled={isProcessing}
                          onClick={() => handleUpdateListingVerification(listing.id, 'verified', 'Ownership deed and transparent recurring fee disclosures verified by compliance team.')}
                          className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs flex items-center gap-1.5"
                        >
                          <CheckCircle2 size={14} />
                          <span>Approve & Verify Listing</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
