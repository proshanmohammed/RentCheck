import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// ---------------------------------------------------------------------------
// Demo Persona Definitions (preserved for when Supabase is not configured)
// ---------------------------------------------------------------------------
const DEMO_USERS = {
  seeker: {
    id: '44444444-4444-4444-a444-444444444444',
    name: 'Alex Chen',
    email: 'alex.chen@gmail.com',
    role: 'seeker',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    badge: 'Verified Renter',
    isDemo: true,
  },
  landlord: {
    id: '11111111-1111-4111-a111-111111111111',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@baypropertymgmt.com',
    role: 'landlord',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    badge: 'Verified Property Manager',
    isDemo: true,
  },
  moderator: {
    id: '33333333-3333-4333-a333-333333333333',
    name: 'Elena Rostova',
    email: 'elena.rostova@rentcheck.org',
    role: 'moderator',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
    badge: 'Compliance Lead',
    isDemo: true,
  },
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Real Supabase auth state
  const [supabaseUser, setSupabaseUser] = useState(null);
  const [supabaseSession, setSupabaseSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Demo persona switcher state (always available as a fallback / demo tool)
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('rentcheck_role') || 'seeker';
  });

  // -------------------------------------------------------------------------
  // Supabase Auth Initialization & Listener
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      // No Supabase: operate entirely in demo mode
      setAuthLoading(false);
      return;
    }

    // Retrieve current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSupabaseSession(session);
      setSupabaseUser(session?.user ?? null);
      setAuthLoading(false);
    });

    // Subscribe to auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSupabaseSession(session);
        setSupabaseUser(session?.user ?? null);
        setAuthLoading(false);
        setAuthError(null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // -------------------------------------------------------------------------
  // Sign in with Google OAuth
  // -------------------------------------------------------------------------
  const signInWithGoogle = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setAuthError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env.');
      return;
    }
    setAuthError(null);
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          // Request offline access so Supabase can refresh the token
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    if (error) setAuthError(error.message);
  }, []);

  // -------------------------------------------------------------------------
  // Sign out
  // -------------------------------------------------------------------------
  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) return;
    setAuthError(null);
    const { error } = await supabase.auth.signOut();
    if (error) setAuthError(error.message);
  }, []);

  // -------------------------------------------------------------------------
  // Demo Persona Switcher (preserved)
  // -------------------------------------------------------------------------
  const switchRole = (newRole) => {
    if (DEMO_USERS[newRole]) {
      setCurrentRole(newRole);
      localStorage.setItem('rentcheck_role', newRole);
    }
  };

  // -------------------------------------------------------------------------
  // Derive the "active user" shown in the UI
  //   • If Supabase is configured and a real user is signed in → real user
  //   • Otherwise → demo persona
  // -------------------------------------------------------------------------
  let user;
  let isAuthenticated = false;

  if (isSupabaseConfigured && supabaseUser) {
    const meta = supabaseUser.user_metadata || {};
    user = {
      id: supabaseUser.id,
      name: meta.full_name || meta.name || supabaseUser.email?.split('@')[0] || 'User',
      email: supabaseUser.email || '',
      role: currentRole, // role is still managed by persona switcher for demo purposes
      avatar:
        meta.avatar_url ||
        meta.picture ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(meta.full_name || supabaseUser.email || 'User')}&background=059669&color=fff&size=256`,
      badge: 'Signed In via Google',
      isDemo: false,
    };
    isAuthenticated = true;
  } else {
    user = DEMO_USERS[currentRole] || DEMO_USERS.seeker;
    isAuthenticated = false;
  }

  // -------------------------------------------------------------------------
  // Context value
  // -------------------------------------------------------------------------
  const value = {
    // User & session
    user,
    session: supabaseSession,
    isAuthenticated,
    authLoading,
    authError,
    setAuthError,

    // Auth actions
    signInWithGoogle,
    signOut,

    // Demo persona switcher (always available)
    role: user.role,
    switchRole,
    allRoles: Object.keys(DEMO_USERS),
    demoUsers: DEMO_USERS,

    // Feature flags
    isSupabaseConfigured,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
