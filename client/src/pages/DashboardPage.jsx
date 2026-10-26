import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Layers, 
  ShieldCheck, 
  AlertTriangle, 
  PlusCircle, 
  FileText, 
  Clock, 
  Eye, 
  ChevronRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import VerificationBadge from '../components/VerificationBadge';

export default function DashboardPage() {
  const { user, role, switchRole, demoUsers } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/listings')
      .then((res) => res.json())
      .then((data) => {
        if (data.listings) {
          // If landlord, show their listings or all listings for demo
          setListings(data.listings);
        }
      })
      .catch((err) => console.error('Failed to fetch dashboard listings:', err))
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Dashboard Profile Header */}
      <div className="luxury-glass rounded-3xl border border-white/80 p-7 sm:p-10 shadow-luxury flex flex-col md:flex-row md:items-center justify-between gap-6 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-18 h-18 rounded-2xl object-cover border-2 border-brand-500 shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-200"></div>
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{user.name}</h1>
              <span className="px-3 py-0.5 rounded-full text-xs font-black uppercase bg-brand-50 text-brand-700 border border-brand-200">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">{user.email} • {user.badge}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/listings/new"
            className="luxury-btn-shimmer px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-500 hover:to-emerald-500 text-white font-black text-xs sm:text-sm shadow-md shadow-brand-500/25 transition-all flex items-center gap-2"
          >
            <PlusCircle size={16} />
            <span>Publish Standardized Listing</span>
          </Link>

          {role === 'moderator' && (
            <Link
              to="/moderation"
              className="luxury-btn-shimmer px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
            >
              <ShieldCheck size={16} className="text-amber-400" />
              <span>Open Compliance Console</span>
            </Link>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="luxury-card luxury-glass p-6 rounded-3xl border border-white/80 shadow-luxury hover:shadow-luxury-hover transition-all duration-300">
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">
            Tracked Directory Listings
          </span>
          <div className="text-3xl font-black text-slate-900 mt-1.5">{listings.length}</div>
          <span className="text-[11px] text-slate-500 mt-1 block font-medium">Active in public directory</span>
        </div>

        <div className="luxury-card luxury-glass p-6 rounded-3xl border border-white/80 shadow-luxury hover:shadow-luxury-hover transition-all duration-300">
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">
            Verified Transparencies
          </span>
          <div className="text-3xl font-black text-emerald-600 mt-1.5">
            {listings.filter(l => l.verification_status === 'verified').length}
          </div>
          <span className="text-[11px] text-emerald-700 font-bold mt-1 block">Deeds & fee schedules verified</span>
        </div>

        <div className="luxury-card luxury-glass p-6 rounded-3xl border border-white/80 shadow-luxury hover:shadow-luxury-hover transition-all duration-300">
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">
            Duplicate Flags Under Review
          </span>
          <div className="text-3xl font-black text-orange-600 mt-1.5">
            {listings.filter(l => l.verification_status === 'flagged_duplicate').length}
          </div>
          <span className="text-[11px] text-orange-800 font-bold mt-1 block">Gemini syndication heuristics</span>
        </div>

        <div className="luxury-card luxury-glass p-6 rounded-3xl border border-white/80 shadow-luxury hover:shadow-luxury-hover transition-all duration-300">
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">
            Community Reports Queue
          </span>
          <div className="text-3xl font-black text-slate-900 mt-1.5">
            1 Open
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block font-medium">Assigned to compliance queue</span>
        </div>
      </div>

      {/* Listings Management Table */}
      <div className="luxury-glass rounded-3xl border border-white/80 shadow-luxury overflow-hidden backdrop-blur-xl">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Manage Property Listings</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review verification status, fee disclosures, and live syndication health
            </p>
          </div>
          <Link
            to="/listings"
            className="text-xs font-bold text-brand-700 hover:underline flex items-center gap-1"
          >
            <span>Public Directory</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading listings...</div>
        ) : listings.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No properties in dashboard.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Property</th>
                  <th className="px-6 py-3.5">Type & City</th>
                  <th className="px-6 py-3.5">Base Rent</th>
                  <th className="px-6 py-3.5">True Monthly Occupancy</th>
                  <th className="px-6 py-3.5">Verification Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {listings.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=120&q=80'}
                          alt={item.title}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div className="truncate max-w-xs">
                          <Link
                            to={`/listings/${item.id}`}
                            className="font-bold text-slate-900 hover:text-brand-600 truncate block"
                          >
                            {item.title}
                          </Link>
                          <span className="text-[11px] text-slate-400 truncate block">{item.address}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      <div>{item.property_type}</div>
                      <span className="text-[11px] text-slate-400">{item.city}</span>
                    </td>

                    <td className="px-6 py-4 font-bold text-slate-800">
                      {formatCurrency(item.base_rent)}/mo
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-extrabold text-brand-700 text-sm">
                        {formatCurrency(item.total_monthly_occupancy)}/mo
                      </div>
                      <span className="text-[10px] text-slate-400">
                        +${item.recurring_fees || 0} disclosed fees
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <VerificationBadge status={item.verification_status} size="sm" />
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/listings/${item.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 font-bold transition-colors"
                      >
                        <Eye size={13} />
                        <span>Inspect</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
