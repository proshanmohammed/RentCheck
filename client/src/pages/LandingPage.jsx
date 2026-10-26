import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Search, 
  Sparkles, 
  SlidersHorizontal, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  DollarSign, 
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Users,
  Compass,
  MapPin,
  Check
} from 'lucide-react';
import ListingCard from '../components/ListingCard';

const QUICK_CITIES = ['San Francisco', 'Los Angeles', 'Austin', 'Chicago', 'New York'];

export default function LandingPage() {
  const navigate = useNavigate();
  const [searchCity, setSearchCity] = useState('');
  const [propertyType, setPropertyType] = useState('All');
  const [featuredListings, setFeaturedListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/listings')
      .then((res) => res.json())
      .then((data) => {
        if (data.listings) {
          setFeaturedListings(data.listings.slice(0, 3));
        }
      })
      .catch((err) => console.error('Failed to fetch featured listings:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchCity) params.set('city', searchCity);
    if (propertyType && propertyType !== 'All') params.set('propertyType', propertyType);
    navigate(`/listings?${params.toString()}`);
  };

  const handleQuickCityClick = (city) => {
    setSearchCity(city);
    navigate(`/listings?city=${encodeURIComponent(city)}`);
  };

  return (
    <div className="space-y-20 lg:space-y-32 pb-24">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-24 lg:pb-28">
        
        {/* Floating Decorative Luxury Badges for Depth */}
        <div className="hidden xl:block absolute top-16 left-8 luxury-float pointer-events-none z-10">
          <div className="luxury-glass px-4 py-2.5 rounded-2xl flex items-center gap-3 border border-white/80 shadow-luxury">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck size={18} />
            </div>
            <div className="text-left text-xs">
              <div className="font-extrabold text-slate-900">$0 Hidden Charges</div>
              <div className="text-[10px] text-slate-500">Deed-Verified Accuracy</div>
            </div>
          </div>
        </div>

        <div className="hidden xl:block absolute top-28 right-8 luxury-float-delayed pointer-events-none z-10">
          <div className="luxury-glass px-4 py-2.5 rounded-2xl flex items-center gap-3 border border-white/80 shadow-luxury">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center font-bold">
              <Sparkles size={18} />
            </div>
            <div className="text-left text-xs">
              <div className="font-extrabold text-slate-900">Gemini 2.5 Deduplication</div>
              <div className="text-[10px] text-slate-500">Syndication Scraper Defense</div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            
            {/* Top Luxury Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-xl border border-white/80 text-brand-900 text-xs font-bold shadow-luxury">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
              <Sparkles size={14} className="text-brand-600" />
              <span>Next-Generation Transparent Real Estate Intelligence</span>
            </div>

            {/* Headline with High-Contrast Platinum/Emerald Sheen */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.08]">
              Rent with <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-emerald-600 to-teal-500">Zero Hidden Surcharges</span>. Guaranteed.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
              Say goodbye to surprise parking fees, undisclosed trash valets, and duplicate scam listings. RentCheck computes your verified <strong>True Monthly Occupancy Cost</strong> backed by Google Gemini deduplication.
            </p>

            {/* Luxury Frosted Search Form */}
            <div className="pt-4 max-w-3xl mx-auto">
              <form
                onSubmit={handleSearch}
                className="luxury-glass p-3 sm:p-4 rounded-3xl shadow-luxury hover:shadow-luxury-hover transition-all duration-300 border border-white/80 flex flex-col sm:flex-row items-center gap-3"
              >
                <div className="flex-1 flex items-center gap-3 w-full px-3 py-2 bg-white/60 rounded-2xl border border-slate-200/60 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
                  <Search size={18} className="text-brand-600 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search city, neighborhood, or address..."
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    className="w-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none font-medium"
                  />
                </div>

                <div className="w-full sm:w-auto px-3 py-2 bg-white/60 rounded-2xl border border-slate-200/60">
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full text-xs sm:text-sm font-bold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Property Types</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Condominium">Condominium</option>
                    <option value="Single-Family House">Single-Family House</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="Studio">Studio</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="luxury-btn-shimmer w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-brand-900 to-slate-900 hover:from-brand-600 hover:to-emerald-600 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
                >
                  <span>Explore Rentals</span>
                  <ArrowRight size={15} />
                </button>
              </form>

              {/* Quick City Filter Chips */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className="text-slate-400 font-semibold flex items-center gap-1">
                  <Compass size={13} /> Popular Metropolitan Hubs:
                </span>
                {QUICK_CITIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleQuickCityClick(c)}
                    className="px-3 py-1 rounded-full bg-white/70 hover:bg-white text-slate-700 hover:text-brand-700 border border-slate-200/70 hover:border-brand-400 shadow-2xs hover:shadow-xs transition-all duration-200 font-medium"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Key Value Stat Pills */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-bold text-slate-700">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 border border-white/60 shadow-2xs">
                <CheckCircle2 size={16} className="text-brand-600" />
                <span>100% Itemized Utilities</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 border border-white/60 shadow-2xs">
                <CheckCircle2 size={16} className="text-brand-600" />
                <span>Gemini 2.5 Duplicate AI</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 border border-white/60 shadow-2xs">
                <CheckCircle2 size={16} className="text-brand-600" />
                <span>Deed-Verified Ownership</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 border border-white/60 shadow-2xs">
                <CheckCircle2 size={16} className="text-brand-600" />
                <span>Fair Evidence Moderation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem & Solution Graphic */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="luxury-glass-dark rounded-3xl text-white p-8 lg:p-14 overflow-hidden relative shadow-2xl border border-slate-700/80">
          
          {/* Ambient Inner Glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-500/15 blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
            
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-400 text-xs font-bold border border-brand-500/30">
                <Sparkles size={14} />
                <span>The Rental Transparency Paradigm</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-snug">
                Advertised rent is almost never what leaves your bank account.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Renters in top metropolitan markets lose thousands of dollars each year to undisclosed mandatory garage surcharges, hidden trash valets, bait-and-switch deposits, and phantom syndication ads.
              </p>
              
              <div className="pt-2 space-y-3 text-xs">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 font-bold">
                    ✕
                  </div>
                  <span className="text-slate-300">
                    Legacy portals allow landlords to hide $300 to $650/month in mandatory fees until the lease delivery phase.
                  </span>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 font-bold">
                    ✕
                  </div>
                  <span className="text-slate-300">
                    Syndication bots clone legitimate listings with artificial discounts to solicit upfront deposit wire fraud.
                  </span>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-brand-500/10 border border-brand-500/30">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold">
                    ✓
                  </div>
                  <span className="text-emerald-200 font-semibold">
                    RentCheck unifies base rent, deposits, and recurring charges into one transparent, immutable schema.
                  </span>
                </div>
              </div>
            </div>

            {/* Visual Comparison Card with Frosted Specular Layers */}
            <div className="luxury-glass bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-white/15 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700/80">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Comparative Case Analysis</span>
                <span className="text-xs font-black text-brand-400 bg-brand-500/20 px-2.5 py-0.5 rounded-full border border-brand-500/30">
                  Verified Disclosure
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Base Advertised Rent:</span>
                  <span className="font-bold text-white">$2,450 /mo</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Mandatory Water / Trash / Sewer:</span>
                  <span className="text-amber-400 font-bold">+$140 /mo</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Assigned Garage Parking:</span>
                  <span className="text-amber-400 font-bold">+$200 /mo</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Building Gigabit Fiber:</span>
                  <span className="text-amber-400 font-bold">+$65 /mo</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700/80 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">True Monthly Occupancy Total:</span>
                  <span className="text-3xl font-black text-emerald-400 drop-shadow-sm">$2,855 /mo</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Surprise Fee Avoidance:</span>
                  <span className="text-xs font-black text-white bg-emerald-700/60 px-3 py-1.5 rounded-xl border border-emerald-500/40 inline-block mt-0.5">
                    +$405 Disclosed Upfront
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Transparent Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600">
              Verified Properties Spotlight
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
              Featured Transparent Residences
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Every residence undergoes deed authentication and pre-calculates mandatory utilities and parking.
            </p>
          </div>

          <Link
            to="/listings"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-brand-700 hover:text-brand-800 transition-colors"
          >
            <span>Explore Complete Directory</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-3xl bg-slate-200/80 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      {/* How It Works Workflow - 4 Protocol Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600">
            Institutional Verification
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How RentCheck Enforces Truth in Renting
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Four rigorous checkpoints safeguarding seekers and honest landlords.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="luxury-card luxury-glass p-7 rounded-3xl border border-white/80 shadow-luxury hover:shadow-luxury-hover transition-all duration-300 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 text-white flex items-center justify-center font-black text-lg shadow-md shadow-brand-500/25">
              01
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Standardized Schema</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Landlords must itemize water, power, fiber, pet deposits, and parking before any listing can enter public viewing.
            </p>
          </div>

          <div className="luxury-card luxury-glass p-7 rounded-3xl border border-white/80 shadow-luxury hover:shadow-luxury-hover transition-all duration-300 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-white flex items-center justify-center font-black text-lg shadow-md shadow-amber-500/25">
              02
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Gemini 2.5 Deduplication</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Google Gemini cross-references normalized street addresses, textual embeddings, and image fingerprints to flag scraper clones.
            </p>
          </div>

          <div className="luxury-card luxury-glass p-7 rounded-3xl border border-white/80 shadow-luxury hover:shadow-luxury-hover transition-all duration-300 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-cyan-500 text-white flex items-center justify-center font-black text-lg shadow-md shadow-teal-500/25">
              03
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Municipal Deed Proof</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Property managers upload tax records or certified management agreements to earn the verified transparency badge.
            </p>
          </div>

          <div className="luxury-card luxury-glass p-7 rounded-3xl border border-white/80 shadow-luxury hover:shadow-luxury-hover transition-all duration-300 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 text-white flex items-center justify-center font-black text-lg shadow-md shadow-indigo-500/25">
              04
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Evidence Moderation</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Community reports undergo human moderator review with evidence checks, preventing unfair false-positive fraud flags.
            </p>
          </div>

        </div>
      </section>

      {/* Landlord CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-navy-950 text-white p-8 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl border border-slate-800 relative overflow-hidden">
          
          <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-brand-500/10 blur-3xl pointer-events-none"></div>

          <div className="space-y-3 max-w-xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              <Sparkles size={13} />
              <span>For Transparent Property Managers</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-snug">
              Publish with verified transparency and earn renter trust.
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Distinguish your properties from shadowy syndication brokers. Receive high-intent tenant applications with pre-disclosed occupancy terms.
            </p>
          </div>
          
          <Link
            to="/listings/new"
            className="luxury-btn-shimmer px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 text-white font-black text-xs sm:text-sm transition-all shadow-lg shadow-brand-600/30 shrink-0 flex items-center gap-2.5 relative z-10"
          >
            <span>Publish Standardized Listing</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

    </div>
  );
}
