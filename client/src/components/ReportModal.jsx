import React, { useState } from 'react';
import { AlertOctagon, X, CheckCircle2, Link2, Plus, Trash2, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const REASON_OPTIONS = [
  'Duplicate syndication of another property',
  'Hidden recurring fees not disclosed in listing',
  'Misleading property claims or false photographs',
  'Unverified contact requesting upfront wire transfer',
  'Inaccurate pricing or bait-and-switch rent claim',
  'Other suspicious activity'
];

export default function ReportModal({ isOpen, onClose, listing, onReportSubmitted }) {
  const { user } = useAuth();
  const [reason, setReason] = useState(REASON_OPTIONS[0]);
  const [details, setDetails] = useState('');
  const [evidenceUrls, setEvidenceUrls] = useState(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !listing) return null;

  const handleAddEvidence = () => {
    if (evidenceUrls.length < 3) {
      setEvidenceUrls([...evidenceUrls, '']);
    }
  };

  const handleRemoveEvidence = (index) => {
    setEvidenceUrls(evidenceUrls.filter((_, i) => i !== index));
  };

  const handleEvidenceChange = (index, value) => {
    const updated = [...evidenceUrls];
    updated[index] = value;
    setEvidenceUrls(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const validEvidenceUrls = evidenceUrls
        .map(u => u.trim())
        .filter(u => u.startsWith('http://') || u.startsWith('https://'));

      const response = await fetch(`/api/listings/${listing.id}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason,
          details,
          evidenceUrls: validEvidenceUrls,
          reporterId: user?.id
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit report.');
      }

      setSuccess(true);
      if (onReportSubmitted) {
        onReportSubmitted(data.report);
      }

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <AlertOctagon size={20} />
            </div>
            <div>
              <h3 className="font-bold text-base">Report Listing</h3>
              <p className="text-xs text-slate-400 truncate max-w-xs">{listing.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content / Form */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Report Submitted</h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Thank you for protecting the rental community. Our compliance moderators will inspect your evidence against the landlord's verified records without jumping to premature fraud conclusions.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                  {error}
                </div>
              )}

              {/* Reason selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Primary Reason for Report *
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-2.5 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                >
                  {REASON_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Additional details */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Detailed Explanation & Evidence Summary *
                </label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Explain why this listing is misleading, what hidden fees were requested, or provide context..."
                  className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              {/* Evidence URLs */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Evidence URLs (Optional)
                  </label>
                  {evidenceUrls.length < 3 && (
                    <button
                      type="button"
                      onClick={handleAddEvidence}
                      className="text-xs text-brand-600 font-semibold flex items-center gap-1 hover:underline"
                    >
                      <Plus size={12} /> Add Link
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {evidenceUrls.map((url, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Link2 size={14} className="absolute left-3 top-3 text-slate-400" />
                        <input
                          type="url"
                          placeholder="https://example.com/original-ad-or-lease-screenshot"
                          value={url}
                          onChange={(e) => handleEvidenceChange(idx, e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                      </div>
                      {evidenceUrls.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveEvidence(idx)}
                          className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Links to syndication sites, municipal records, or fee sheets help moderators resolve reports quickly.
                </p>
              </div>

              {/* Renter Diligence Advisory */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
                <ShieldCheck size={16} className="text-brand-600 shrink-0 mt-0.5" />
                <p>
                  Submitted reports enter a moderator review queue. In accordance with RentCheck integrity policies, listings are evaluated objectively based on documentation.
                </p>
              </div>

              {/* Footer action buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Report for Audit'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
