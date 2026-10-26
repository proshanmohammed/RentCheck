import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, FileSearch, Sparkles, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <ShieldCheck size={20} />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Rent<span className="text-brand-400">Check</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              The standardized rental transparency and deduplication platform. Empowering seekers with true monthly occupancy totals and protecting against phantom listings via Gemini AI analysis.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-400 font-medium">
              <Sparkles size={14} />
              <span>Powered by Google Gemini 2.5 AI</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Directory & Tools
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/listings" className="hover:text-white transition-colors">
                  Explore Transparent Listings
                </Link>
              </li>
              <li>
                <Link to="/listings/new" className="hover:text-white transition-colors">
                  Publish Verified Listing
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Landlord & Renter Dashboard
                </Link>
              </li>
              <li>
                <Link to="/moderation" className="hover:text-white transition-colors">
                  Compliance & Verification Queue
                </Link>
              </li>
            </ul>
          </div>

          {/* Verification Standards */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Verification Standards
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                <span>Zero Hidden Fees Guarantee</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                <span>Deed & Municipal Proof Required</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                <span>AI Heuristic Syndication Defense</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                <span>Evidence-Based Moderation Protocol</span>
              </li>
            </ul>
          </div>

          {/* Security & RLS notice */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Security Architecture
            </h4>
            <p className="text-xs leading-relaxed text-slate-400 mb-3">
              Built with Supabase PostgreSQL Row Level Security (RLS), Zod request schema validation, and isolated backend intelligence tokens.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-[11px] font-mono border border-slate-700">
              <Lock size={12} className="text-brand-400" />
              <span>RLS Enforced Data Isolation</span>
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} RentCheck Platform Inc. All rights reserved.</p>
          <p className="text-[11px] text-center md:text-right max-w-xl">
            RentCheck promotes evidence-based listing verification. Duplicate flags and community reports undergo moderator audit to prevent unfair or automated false-positive fraud designations.
          </p>
        </div>
      </div>
    </footer>
  );
}
