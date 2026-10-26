import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — wraps pages that require authentication.
 *
 * Behaviour:
 *  1. While Supabase session is loading → show a centered spinner (avoid
 *     flickering redirect to /login on first render).
 *  2. If Supabase is NOT configured → allow through (demo mode, no auth wall).
 *  3. If Supabase IS configured but user is not signed in → redirect to /login,
 *     preserving the intended destination so we can redirect back after sign-in.
 *  4. If signed in → render children.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, authLoading, isSupabaseConfigured } = useAuth();
  const location = useLocation();

  // While loading session on first render, show a spinner
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-700 via-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-brand-600/30">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <Loader2 size={24} className="animate-spin text-brand-600" />
          <p className="text-sm font-semibold text-slate-500">Restoring your session…</p>
        </div>
      </div>
    );
  }

  // Demo mode: Supabase not configured → no auth wall
  if (!isSupabaseConfigured) {
    return children;
  }

  // Supabase configured but not signed in → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
