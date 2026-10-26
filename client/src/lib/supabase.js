import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Guard: if not configured, export a null placeholder so the rest of the app
// can detect "not configured" and fall back gracefully (demo mode).
export const isSupabaseConfigured =
  Boolean(supabaseUrl) &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  Boolean(supabaseAnonKey) &&
  supabaseAnonKey !== 'your-anon-key';

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        // Store session in localStorage (default, safe for SPAs)
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
