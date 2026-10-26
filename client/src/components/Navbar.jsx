import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Building2, 
  ShieldCheck, 
  PlusCircle, 
  Layers, 
  SlidersHorizontal, 
  ShieldAlert, 
  Menu, 
  X, 
  UserCheck, 
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';

export default function Navbar() {
  const { user, role, switchRole, demoUsers } = useAuth();
  const { compareListings, openDrawer } = useCompare();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-glass transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-700 via-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-brand-600/30 group-hover:shadow-brand-500/60 group-hover:scale-105 transition-all duration-300">
                <ShieldCheck className="w-6 h-6 drop-shadow-sm" />
              </div>
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-tr from-brand-400 to-teal-300 opacity-0 group-hover:opacity-40 blur-xs transition-opacity duration-300 -z-10"></div>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-black text-2xl tracking-tight text-slate-900 group-hover:text-brand-700 transition-colors">
                  Rent<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-teal-600">Check</span>
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              </div>
              <span className="hidden sm:block text-[10px] font-extrabold tracking-widest text-slate-400 uppercase -mt-1">
                Transparent Real Estate Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/60 backdrop-blur-md">
            <Link
              to="/listings"
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
                isActive('/listings')
                  ? 'bg-white text-brand-900 shadow-sm shadow-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Building2 size={15} className={isActive('/listings') ? 'text-brand-600' : 'text-slate-400'} />
              <span>Explore Directory</span>
            </Link>

            <Link
              to="/listings/new"
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
                isActive('/listings/new')
                  ? 'bg-white text-brand-900 shadow-sm shadow-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <PlusCircle size={15} className={isActive('/listings/new') ? 'text-brand-600' : 'text-slate-400'} />
              <span>Publish Listing</span>
            </Link>

            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
                isActive('/dashboard')
                  ? 'bg-white text-brand-900 shadow-sm shadow-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Layers size={15} className={isActive('/dashboard') ? 'text-brand-600' : 'text-slate-400'} />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/moderation"
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 relative ${
                isActive('/moderation')
                  ? 'bg-white text-amber-900 shadow-sm shadow-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <ShieldAlert size={15} className="text-amber-500" />
              <span>Moderation</span>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            </Link>
          </nav>

          {/* Right Action Controls: Cost Compare Drawer & Persona Switcher */}
          <div className="hidden md:flex items-center gap-3">
            {/* Compare Drawer Trigger Button */}
            <button
              onClick={openDrawer}
              className="luxury-btn-shimmer relative px-4 py-2.5 rounded-xl text-xs font-extrabold bg-white hover:bg-brand-50/60 border border-slate-200 hover:border-brand-400 text-slate-800 hover:text-brand-800 shadow-2xs hover:shadow-md transition-all flex items-center gap-2"
              title="Open Side-by-Side Cost Comparison Drawer"
            >
              <SlidersHorizontal size={14} className="text-brand-600" />
              <span>Compare Costs</span>
              {compareListings.length > 0 && (
                <span className="w-5 h-5 bg-gradient-to-r from-brand-600 to-emerald-600 text-white rounded-full text-[11px] font-black flex items-center justify-center shadow-xs">
                  {compareListings.length}
                </span>
              )}
            </button>

            {/* Persona Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="group flex items-center gap-2.5 p-1.5 pr-3.5 rounded-full border border-slate-200/90 hover:border-brand-400 bg-white/90 hover:bg-white shadow-2xs hover:shadow-md transition-all duration-200"
              >
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-brand-400/80 group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></div>
                </div>
                <div className="text-left leading-tight">
                  <div className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
                    {user.name}
                    <ChevronDown size={12} className="text-slate-400 group-hover:text-brand-600 transition-colors" />
                  </div>
                  <div className="text-[10px] text-brand-600 font-bold uppercase tracking-wider">
                    {user.role}
                  </div>
                </div>
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-3 w-72 luxury-glass rounded-2xl shadow-2xl border border-white/80 p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1.5">
                    <p className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={13} className="text-brand-600" />
                      Role Simulation
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Toggle active persona to test permissions & verification
                    </p>
                  </div>

                  {Object.entries(demoUsers).map(([roleKey, u]) => (
                    <button
                      key={roleKey}
                      onClick={() => {
                        switchRole(roleKey);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl flex items-center gap-3 transition-all duration-200 ${
                        role === roleKey 
                          ? 'bg-brand-50 border border-brand-200 text-brand-950 font-bold shadow-2xs' 
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                      <div className="flex-1 text-xs">
                        <div className="font-extrabold">{u.name}</div>
                        <div className="text-[10px] text-slate-400 capitalize">{u.role} • {u.badge}</div>
                      </div>
                      {role === roleKey && (
                        <div className="w-2.5 h-2.5 rounded-full bg-brand-500 ring-4 ring-brand-100"></div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={openDrawer}
              className="relative p-2.5 rounded-xl text-slate-700 bg-white border border-slate-200 shadow-2xs"
            >
              <SlidersHorizontal size={18} />
              {compareListings.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {compareListings.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-700 bg-white border border-slate-200 shadow-2xs"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/listings"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-slate-700 font-bold hover:bg-slate-100"
          >
            <Building2 size={18} />
            Explore Directory
          </Link>
          <Link
            to="/listings/new"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-slate-700 font-bold hover:bg-slate-100"
          >
            <PlusCircle size={18} />
            Publish Listing
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-slate-700 font-bold hover:bg-slate-100"
          >
            <Layers size={18} />
            Dashboard
          </Link>
          <Link
            to="/moderation"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-slate-700 font-bold hover:bg-slate-100"
          >
            <ShieldAlert size={18} />
            Moderation Panel
          </Link>

          {/* Mobile Persona Switcher */}
          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Current Persona ({role})
            </p>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(demoUsers).map(([roleKey, u]) => (
                <button
                  key={roleKey}
                  onClick={() => {
                    switchRole(roleKey);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 ${
                    role === roleKey
                      ? 'border-brand-500 bg-brand-50 text-brand-800'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                  <span className="capitalize">{roleKey}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
