import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * AuthCallbackPage — handles the OAuth redirect from Google via Supabase.
 *
 * Supabase appends `#access_token=...&refresh_token=...` to the redirect URL
 * (or `?code=...` for PKCE). The Supabase JS client detects & exchanges them
 * automatically via `detectSessionInUrl: true` set in the client config.
 *
 * This page simply waits for the session to be detected, then redirects.
 */
export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setError('Supabase is not configured.');
      return;
    }

    // The Supabase client will fire onAuthStateChange once the session from
    // the OAuth code/token in the URL has been exchanged. We listen for it.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          subscription.unsubscribe();
          navigate('/dashboard', { replace: true });
        } else if (event === 'TOKEN_REFRESHED' && session) {
          subscription.unsubscribe();
          navigate('/dashboard', { replace: true });
        }
      }
    );

    // Safety fallback: if the URL already contains an error param from OAuth
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get('error_description') || params.get('error');
    if (oauthError) {
      setError(decodeURIComponent(oauthError));
      subscription.unsubscribe();
    }

    // Timeout fallback (10s) in case state change never fires
    const timeout = setTimeout(() => {
      subscription.unsubscribe();
      navigate('/login', { replace: true });
    }, 10_000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-brand-400/10 blur-3xl animate-drift-1" />
        <div className="absolute -bottom-40 right-10 w-[400px] h-[400px] rounded-full bg-teal-400/8 blur-3xl animate-drift-2" />
      </div>

      <div className="relative z-10 luxury-glass rounded-3xl shadow-luxury border border-white/80 p-10 flex flex-col items-center max-w-sm w-full text-center">
        {/* gradient accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl bg-gradient-to-r from-brand-600 via-emerald-500 to-teal-400" />

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-700 via-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-brand-600/30 mb-5">
          <ShieldCheck className="w-8 h-8" />
        </div>

        {error ? (
          <>
            <AlertCircle size={28} className="text-red-500 mb-3" />
            <h2 className="text-lg font-black text-slate-900 mb-2">Authentication Failed</h2>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">{error}</p>
            <a
              href="/login"
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition-colors"
            >
              Return to Login
            </a>
          </>
        ) : (
          <>
            <Loader2 size={28} className="animate-spin text-brand-600 mb-3" />
            <h2 className="text-lg font-black text-slate-900 mb-2">Signing you in…</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Completing your Google authentication. You'll be redirected in a moment.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
