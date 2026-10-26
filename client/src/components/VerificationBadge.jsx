import React from 'react';
import { ShieldCheck, Clock, AlertTriangle, AlertOctagon, HelpCircle } from 'lucide-react';

const STATUS_CONFIGS = {
  verified: {
    label: 'Verified Transparency',
    shortLabel: 'Verified',
    icon: ShieldCheck,
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-500',
    description: 'Deed/ownership and transparent recurring fee disclosures verified by compliance team.'
  },
  pending_review: {
    label: 'Pending Verification',
    shortLabel: 'Under Review',
    icon: Clock,
    bg: 'bg-amber-50 text-amber-800 border-amber-200',
    dot: 'bg-amber-500',
    description: 'Verification documents uploaded; municipal review or landlord audit in progress.'
  },
  unverified: {
    label: 'Unverified Listing',
    shortLabel: 'Unverified',
    icon: HelpCircle,
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
    description: 'No ownership or fee documentation submitted yet. Standard renter diligence advised.'
  },
  flagged_duplicate: {
    label: 'Flagged Duplicate Ad',
    shortLabel: 'Duplicate Alert',
    icon: AlertTriangle,
    bg: 'bg-orange-50 text-orange-800 border-orange-300',
    dot: 'bg-orange-500',
    description: 'Potential duplicate syndication or clone detected against an existing verified property.'
  },
  suspicious: {
    label: 'Community Reported',
    shortLabel: 'Suspicious',
    icon: AlertOctagon,
    bg: 'bg-rose-50 text-rose-800 border-rose-300',
    dot: 'bg-rose-500',
    description: 'Under investigation by compliance moderators following community report(s).'
  }
};

export default function VerificationBadge({ status = 'unverified', size = 'md', showTooltip = true }) {
  const config = STATUS_CONFIGS[status] || STATUS_CONFIGS.unverified;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs sm:text-sm px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm sm:text-base px-3.5 py-1.5 gap-2 font-semibold'
  }[size] || 'text-xs px-2.5 py-1 gap-1.5';

  const iconSizes = {
    sm: 13,
    md: 15,
    lg: 18
  }[size] || 15;

  return (
    <div className="relative group inline-flex items-center">
      <span
        className={`inline-flex items-center rounded-full border shadow-xs transition-all duration-150 ${sizeClasses} ${config.bg}`}
      >
        <Icon size={iconSizes} className="shrink-0" />
        <span>{size === 'sm' ? config.shortLabel : config.label}</span>
      </span>

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center w-64 p-2 bg-slate-900 text-white text-xs rounded-lg shadow-xl z-50 pointer-events-none transition-opacity">
          <p className="font-semibold text-slate-200 mb-0.5">{config.label}</p>
          <p className="text-slate-300 text-center leading-relaxed">{config.description}</p>
          <div className="w-2 h-2 bg-slate-900 rotate-45 -mb-1 mt-1"></div>
        </div>
      )}
    </div>
  );
}
