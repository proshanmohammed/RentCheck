import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  RotateCcw, 
  Building2, 
  CheckCircle2, 
  AlertTriangle,
  Loader2,
  DollarSign,
  ArrowUpDown,
  Sparkles
} from 'lucide-react';
import ListingCard from '../components/ListingCard';
import { useCompare } from '../context/CompareContext';

export default function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { compareListings, openDrawer } = useCompare();

  // Filter states initialized from URL params if present
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [city, setCity] = useState(searchParams.get('city') || 'All');
  const [propertyType, setPropertyType] = useState(searchParams.get('propertyType') || 'All');
  const [verificationStatus, setVerificationStatus] = useState(searchParams.get('verificationStatus') || 'All');
  const [maxTotalMonthly, setMaxTotalMonthly] = useState(searchParams.get('maxTotalMonthly') || '');
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || 'Any');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'monthly_asc' | 'monthly_desc'

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchListings = () => {
    setLoading(true);
    setError(null);

    const query = new URLSearchParams();
    if (search.trim()) query.set('search', search.trim());
    if (city !== 'All') query.set('city', city);
    if (propertyType !== 'All') query.set('propertyType', propertyType);
    if (verificationStatus !== 'All') query.set('verificationStatus', verificationStatus);
    if (maxTotalMonthly) query.set('maxTotalMonthly', maxTotalMonthly);
    if (bedrooms !== 'Any') query.set('bedrooms', bedrooms === 'Studio' ? '0' : bedrooms.replace('+', ''));

    fetch(`/api/listings?${query.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load listings.');
        return res.json();
      })
      .then((data) => {
        let list = data.listings || [];

        // Apply client sorting
        if (sortBy === 'monthly_asc') {
          list.sort((a, b) => a.total_monthly_occupancy - b.total_monthly_occupancy);
        } else if (sortBy === 'monthly_desc') {
          list.sort((a, b) => b.total_monthly_occupancy - a.total_monthly_occupancy);
        } else if (sortBy === 'newest') {
          list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }

        setListings(list);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchListings();
  }, [city, propertyType, verificationStatus, maxTotalMonthly, bedrooms, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchListings();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCity('All');
    setPropertyType('All');
    setVerificationStatus('All');
    setMaxTotalMonthly('');
    setBedrooms('Any');
    setSortBy('newest');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Directory Page Header */}
      <div className="luxury-glass p-6 sm:p-8 rounded-3xl border border-white/80 shadow-luxury flex flex-col md:flex-row md:items-end justify-between gap-6 backdrop-blur-xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-800 text-[11px] font-extrabold uppercase tracking-wider border border-brand-200 mb-2">
            <Sparkles size={13} className="text-brand-600" />
            <span>Verified Rental Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Transparent Listings & Cost Matrix
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Compare true recurring occupancy costs (Rent + Utilities + Parking + HOA) with verified landlord proof of ownership.
          </p>
        </div>

        {compareListings.length > 0 && (
          <button
            onClick={openDrawer}
            className="luxury-btn-shimmer px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-500 hover:to-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-brand-500/30 transition-all flex items-center gap-2 self-start md:self-auto"
          >
            <SlidersHorizontal size={16} />
            <span>Open Compare Drawer ({compareListings.length}/3)</span>
          </button>
        )}
      </div>

      {/* Main Layout: Filters & Listings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1 luxury-glass rounded-3xl border border-white/80 p-6 shadow-luxury space-y-6 backdrop-blur-xl sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Filter size={16} className="text-brand-600" />
              Filter Matrix
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-xs text-slate-400 hover:text-brand-600 font-bold flex items-center gap-1 transition-colors"
              title="Reset all filters"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          </div>

          {/* Search by keyword */}
          <form onSubmit={handleSearchSubmit} className="space-y-1.5">
            <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">
              Keyword Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Title, street, or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200/90 pl-8 pr-3 py-2.5 text-slate-900 bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 font-medium"
              />
              <Search size={14} className="absolute left-2.5 top-3 text-slate-400" />
            </div>
          </form>

          {/* City filter */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">
              City
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200/90 p-2.5 bg-white/80 focus:bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/30 font-bold cursor-pointer"
            >
              <option value="All">All Metropolitan Areas</option>
              <option value="San Francisco">San Francisco, CA</option>
              <option value="Los Angeles">Los Angeles, CA</option>
              <option value="Austin">Austin, TX</option>
              <option value="Chicago">Chicago, IL</option>
              <option value="New York">New York, NY</option>
            </select>
          </div>

          {/* Verification Status filter */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">
              Verification Badge
            </label>
            <select
              value={verificationStatus}
              onChange={(e) => setVerificationStatus(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200/90 p-2.5 bg-white/80 focus:bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/30 font-bold cursor-pointer"
            >
              <option value="All">All Verification Statuses</option>
              <option value="verified">Verified Transparency Only</option>
              <option value="pending_review">Pending Verification</option>
              <option value="unverified">Unverified Listings</option>
              <option value="flagged_duplicate">Flagged Duplicate Ads</option>
              <option value="suspicious">Under Community Review</option>
            </select>
          </div>

          {/* Property Type */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">
              Property Architecture
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200/90 p-2.5 bg-white/80 focus:bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/30 font-bold cursor-pointer"
            >
              <option value="All">All Architecture Types</option>
              <option value="Apartment">Apartment</option>
              <option value="Condominium">Condominium</option>
              <option value="Single-Family House">Single-Family House</option>
              <option value="Townhouse">Townhouse</option>
              <option value="Studio">Studio</option>
              <option value="Shared Room">Shared Room</option>
            </select>
          </div>

          {/* Bedrooms */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">
              Bedrooms
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {['Any', 'Studio', '1+', '2+'].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBedrooms(b)}
                  className={`py-2 text-xs rounded-xl font-extrabold border transition-all ${
                    bedrooms === b
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white/70 text-slate-700 border-slate-200 hover:bg-white'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Max Monthly Cost */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">
              Max Total Monthly ($/mo)
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder="e.g. 3500"
                value={maxTotalMonthly}
                onChange={(e) => setMaxTotalMonthly(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200/90 pl-7 pr-3 py-2.5 text-slate-900 bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 font-bold"
              />
              <DollarSign size={13} className="absolute left-2.5 top-3 text-slate-400" />
            </div>
            <span className="text-[10px] text-slate-400 block font-medium">
              Calculates Base Rent + Disclosed Utilities & Parking.
            </span>
          </div>

          {/* Apply Button */}
          <button
            onClick={fetchListings}
            className="luxury-btn-shimmer w-full py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-500 hover:to-emerald-500 text-white font-black text-xs transition-all shadow-md shadow-brand-600/25"
          >
            Apply Filters
          </button>
        </aside>

        {/* Listings Result View */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Top Bar: Count & Sort */}
          <div className="luxury-glass rounded-2xl border border-white/80 p-4 shadow-luxury flex flex-col sm:flex-row sm:items-center justify-between gap-3 backdrop-blur-xl">
            <div className="text-xs text-slate-600 font-medium">
              Showing <strong className="text-slate-900 font-extrabold">{listings.length}</strong> standardized transparent properties
            </div>

            <div className="flex items-center gap-2 text-xs">
              <ArrowUpDown size={14} className="text-slate-400" />
              <span className="font-extrabold text-slate-700">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-slate-200 p-2 bg-white text-slate-900 text-xs font-bold focus:outline-none cursor-pointer shadow-2xs"
              >
                <option value="newest">Newest First</option>
                <option value="monthly_asc">Total Monthly Cost: Low to High</option>
                <option value="monthly_desc">Total Monthly Cost: High to Low</option>
              </select>
            </div>
          </div>

          {/* Listings List */}
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center text-slate-400 space-y-3">
              <Loader2 className="w-9 h-9 animate-spin text-brand-600" />
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Retrieving transparent fee matrices...
              </p>
            </div>
          ) : error ? (
            <div className="p-8 rounded-3xl bg-rose-50 border border-rose-200 text-center space-y-2">
              <AlertTriangle className="w-8 h-8 text-rose-600 mx-auto" />
              <h4 className="font-bold text-rose-900 text-sm">Failed to Load Listings</h4>
              <p className="text-xs text-rose-700">{error}</p>
              <button
                onClick={fetchListings}
                className="mt-2 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
              >
                Retry
              </button>
            </div>
          ) : listings.length === 0 ? (
            <div className="luxury-glass rounded-3xl border border-white/80 p-14 text-center space-y-4 shadow-luxury">
              <Building2 size={44} className="text-slate-300 mx-auto" />
              <h4 className="font-black text-lg text-slate-800">No Listings Match Current Filters</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Try widening your price range or clearing verification filters to view all properties.
              </p>
              <button
                onClick={handleResetFilters}
                className="luxury-btn-shimmer px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition-colors shadow-md"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
