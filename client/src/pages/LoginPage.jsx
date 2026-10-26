import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Loader2,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Google SVG Logo (official colours, no external dependency)
function GoogleLogo({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      <path fill="none" d="M0 0h48v48H0z"/>
    </svg>
  );
}

// Trust feature bullets shown on the login page
const TRUST_POINTS = [
  'Verified rental listings with transparent fee breakdowns',
  'AI-powered duplicate detection protects you from scams',
  'Evidence-based landlord & property verification',
  'Side-by-side cost comparison across up to 3 listings',
];

export default function LoginPage() {
  const { signInWithGoogle, authLoading, authError, setAuthError, isAuthenticated, isSupabaseConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect already-authenticated users to dashboard or the page they came from
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    await signInWithGoogle();
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center bg-slate-50 overflow-hidden px-4 py-12">

      {/* ── Ambient Background (matches LuxuryBackground.jsx) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-brand-400/10 blur-3xl animate-drift-1" />
        <div className="absolute top-1/2 -right-60 w-[500px] h-[500px] rounded-full bg-teal-400/8 blur-3xl animate-drift-2" />
        <div className="absolute -bottom-40 left-1/3 w-[450px] h-[450px] rounded-full bg-emerald-500/8 blur-3xl animate-drift-3" />
        <div className="absolute inset-0 luxury-grid-pattern opacity-60" />
      </div>

      {/* ── Back to Home link ── */}
      <div className="relative z-10 w-full max-w-md mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to RentCheck
        </Link>
      </div>

      {/* ── Main Card ── */}
      <div className="relative z-10 w-full max-w-md">
        <div className="luxury-glass rounded-3xl shadow-luxury border border-white/80 overflow-hidden">

          {/* Gradient header bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-brand-600 via-emerald-500 to-teal-400" />

          <div className="p-8 sm:p-10">

            {/* ── Brand ── */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-700 via-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-brand-600/30">
                  <ShieldCheck className="w-8 h-8 drop-shadow-sm" />
                </div>
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-brand-400 to-teal-300 opacity-20 blur-sm -z-10" />
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 text-center">
                Welcome to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-teal-600">
                  RentCheck
                </span>
              </h1>
              <p className="mt-2 text-sm text-slate-500 text-center max-w-xs leading-relaxed">
                Sign in to access your personalised dashboard, publish listings, and track verification status.
              </p>
            </div>

            {/* ── Configuration warning (shown when Supabase vars missing) ── */}
            {!isSupabaseConfigured && (
              <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex gap-3">
                <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-amber-800 leading-relaxed">
                  <p className="font-bold mb-0.5">Supabase not configured</p>
                  <p>
                    Add <code className="font-mono bg-amber-100 px-1 rounded">VITE_SUPABASE_URL</code> and{' '}
                    <code className="font-mono bg-amber-100 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> to{' '}
                    <code className="font-mono bg-amber-100 px-1 rounded">client/.env</code> to enable authentication.
                  </p>
                </div>
              </div>
            )}

            {/* ── Auth Error ── */}
            {authError && (
              <div
                role="alert"
                className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex gap-3"
              >
                <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-700 leading-relaxed">{authError}</p>
              </div>
            )}

            {/* ── Google Sign-In Button ── */}
            <button
              id="google-signin-btn"
              onClick={handleGoogleSignIn}
              disabled={authLoading || !isSupabaseConfigured}
              aria-label="Continue with Google"
              className="luxury-btn-shimmer w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl font-bold text-sm bg-white border-2 border-slate-200 hover:border-brand-400 text-slate-800 hover:text-brand-800 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {authLoading ? (
                <Loader2 size={20} className="animate-spin text-brand-600" />
              ) : (
                <GoogleLogo size={20} />
              )}
              <span>
                {authLoading ? 'Signing in…' : 'Continue with Google'}
              </span>
            </button>

            {/* ── Divider ── */}
            <div className="relative flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Why RentCheck?
              </span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* ── Trust Points ── */}
            <ul className="space-y-3" aria-label="RentCheck features">
              {TRUST_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-brand-500 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-600 leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>

            {/* ── Legal / terms ── */}
            <p className="mt-8 text-center text-[11px] text-slate-400 leading-relaxed">
              By continuing, you agree to RentCheck's{' '}
              <a href="#" className="underline hover:text-brand-600">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="underline hover:text-brand-600">Privacy Policy</a>.
              We never share your data with third parties.
            </p>
          </div>
        </div>

        {/* ── Demo note ── */}
        <p className="mt-6 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <Sparkles size={12} className="text-brand-500" />
          Don't have credentials yet? The{' '}
          <Link to="/" className="underline font-semibold hover:text-brand-600">
            homepage
          </Link>{' '}
          is fully explorable without an account.
        </p>
      </div>
    </div>
  );
}
