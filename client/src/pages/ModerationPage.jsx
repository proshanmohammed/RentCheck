import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Loader2,
  HelpCircle,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ModerationTable from '../components/ModerationTable';

export default function ModerationPage() {
  const { user, role, switchRole } = useAuth();
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  const fetchQueue = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/moderation/queue');
      if (!res.ok) throw new Error('Failed to fetch moderation queue.');
      const data = await res.json();
      setQueueData(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const showNotification = (msg) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleUpdateStatus = async (listingId, verificationStatus, moderationNotes) => {
    const res = await fetch(`/api/moderation/listings/${listingId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        verificationStatus,
        moderationNotes,
        moderatorId: user.id
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Status update failed.');
    showNotification(data.message);
    fetchQueue();
  };

  const handleUpdateFlag = async (flagId, status) => {
    const res = await fetch(`/api/moderation/flags/${flagId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status,
        reviewedBy: user.id
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Flag update failed.');
    showNotification(data.message);
    fetchQueue();
  };

  const handleUpdateReport = async (reportId, status, moderatorNotes) => {
    const res = await fetch(`/api/moderation/reports/${reportId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status,
        moderatorNotes,
        resolvedBy: user.id
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Report update failed.');
    showNotification(data.message);
    fetchQueue();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Moderation Command Center Header */}
      <div className="luxury-glass p-7 sm:p-10 rounded-3xl border border-white/80 shadow-luxury flex flex-col md:flex-row md:items-center justify-between gap-6 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-100/90 px-3 py-1 rounded-full border border-amber-300 shadow-2xs">
              Compliance Console
            </span>
            <span className="text-xs text-slate-500 font-bold">
              Operator: {user.name} ({role})
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Institutional Verification & AI Deduplication
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Review Gemini AI duplicate flags, investigate evidence submissions, and validate deed disclosures.
          </p>
        </div>

        {role !== 'moderator' && (
          <div className="p-3.5 bg-amber-50/90 rounded-2xl border border-amber-200 text-xs flex items-center gap-3 shadow-2xs">
            <span className="text-amber-950 font-semibold">Active role: <strong>{role}</strong></span>
            <button
              onClick={() => switchRole('moderator')}
              className="luxury-btn-shimmer px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-extrabold text-xs shadow-md"
            >
              Switch to Elena Rostova (Moderator)
            </button>
          </div>
        )}
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs font-black text-emerald-800 flex items-center gap-2 animate-in fade-in shadow-2xs">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Moderation Integrity Manifesto Advisory */}
      <div className="luxury-glass-dark rounded-3xl text-white p-7 sm:p-9 shadow-2xl border border-slate-700/80 space-y-3 relative overflow-hidden">
        <div className="flex items-center gap-2 text-brand-400 text-xs font-black uppercase tracking-widest">
          <ShieldCheck size={18} />
          <span>RentCheck Evidence-First Moderation Standard</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl font-normal">
          Automated heuristic and Gemini scores serve as intelligent advisories, not final convictions. Never designate a landlord or property as fraudulent without direct municipal deed comparison. When resolving duplicate flags, landlords can verify ownership to clear their listing as a false positive.
        </p>
      </div>

      {/* Metrics Row */}
      {queueData?.stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          <div className="luxury-card luxury-glass p-6 rounded-3xl border border-white/80 shadow-luxury hover:shadow-luxury-hover transition-all duration-300">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Pending Duplicate Flags</span>
            <div className="text-3xl font-black text-orange-600 mt-1.5">{queueData.stats.pendingFlagsCount}</div>
            <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">Awaiting duplicate resolution</span>
          </div>

          <div className="luxury-card luxury-glass p-6 rounded-3xl border border-white/80 shadow-luxury hover:shadow-luxury-hover transition-all duration-300">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Open Community Reports</span>
            <div className="text-3xl font-black text-rose-600 mt-1.5">{queueData.stats.openReportsCount}</div>
            <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">Community submissions</span>
          </div>

          <div className="luxury-card luxury-glass p-6 rounded-3xl border border-white/80 shadow-luxury hover:shadow-luxury-hover transition-all duration-300">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Proof Awaiting Review</span>
            <div className="text-3xl font-black text-amber-600 mt-1.5">{queueData.stats.pendingReviewCount}</div>
            <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">Ownership deeds uploaded</span>
          </div>

          <div className="luxury-card luxury-glass p-6 rounded-3xl border border-white/80 shadow-luxury hover:shadow-luxury-hover transition-all duration-300">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Verified Properties</span>
            <div className="text-3xl font-black text-emerald-600 mt-1.5">{queueData.stats.verifiedCount}</div>
            <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">Zero hidden fees certified</span>
          </div>
        </div>
      )}

      {/* Moderation Queue Interactive Table */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 space-y-2">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-600" />
          <p className="text-xs font-semibold">Loading compliance queue...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 text-center">
          {error}
        </div>
      ) : (
        <ModerationTable
          queueData={queueData}
          onRefresh={fetchQueue}
          onUpdateStatus={handleUpdateStatus}
          onUpdateFlag={handleUpdateFlag}
          onUpdateReport={handleUpdateReport}
        />
      )}

    </div>
  );
}
