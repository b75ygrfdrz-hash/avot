// Supabase client + auth helpers.
//
// Reads credentials from Vite env vars:
//   VITE_SUPABASE_URL
//   VITE_SUPABASE_ANON_KEY
//
// When credentials are missing (e.g., before the user has set up their
// Supabase project), this module exports `supabase = null` and
// `isConfigured = false`. The auth UI shows a friendly message in that
// state instead of crashing.

import { createClient } from '@supabase/supabase-js';

const URL = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isConfigured = !!(URL && KEY && !URL.includes('YOUR-PROJECT'));

export const supabase = isConfigured
  ? createClient(URL, KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true, // handle the magic-link / OAuth callback hash
      },
    })
  : null;

// Returns the current session synchronously from supabase's storage.
// Use the useAuth hook for reactive updates.
export async function getSession() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data?.session || null;
}

// Subscribe to auth state changes. Returns an unsubscribe function.
export function onAuthChange(handler) {
  if (!supabase) return () => {};
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    handler(session, event);
  });
  return () => data?.subscription?.unsubscribe?.();
}

export async function signInWithMagicLink(email) {
  if (!supabase) throw new Error('Supabase is not configured.');
  return supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.origin + '/#avot/home' },
  });
}

export async function signInWithPassword(email, password) {
  if (!supabase) throw new Error('Supabase is not configured.');
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithPassword(email, password) {
  if (!supabase) throw new Error('Supabase is not configured.');
  return supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: window.location.origin + '/#avot/home' },
  });
}

export async function signInWithOAuth(provider) {
  if (!supabase) throw new Error('Supabase is not configured.');
  return supabase.auth.signInWithOAuth({
    provider, // 'google' | 'apple'
    options: { redirectTo: window.location.origin + '/#avot/home' },
  });
}

export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function resetPassword(email) {
  if (!supabase) throw new Error('Supabase is not configured.');
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/#avot/home',
  });
}
