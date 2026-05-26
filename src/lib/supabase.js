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

// =========================================================================
// Data sync helpers (Phase 2)
// =========================================================================

// Map a local highlight object to the Supabase row shape.
function hlToRow(h, userId) {
  return {
    id: h.id,
    user_id: userId,
    perek: h.perek,
    mishnah: h.mishnah,
    text: h.text,
    start_offset: h.start ?? null,
    end_offset: h.end ?? null,
    color: h.color || 'yellow',
    note: h.note || '',
    tags: h.tags || [],
    lang: h.lang || 'en',
    created_at: h.createdAt || new Date().toISOString(),
  };
}

// Map a Supabase row back to the local highlight shape.
function rowToHl(r) {
  return {
    id: r.id,
    perek: r.perek,
    mishnah: r.mishnah,
    lang: r.lang,
    text: r.text,
    start: r.start_offset,
    end: r.end_offset,
    color: r.color,
    note: r.note,
    tags: r.tags || [],
    createdAt: r.created_at,
  };
}

export async function uploadHighlights(userId, highlights) {
  if (!supabase || !highlights?.length) return { error: null };
  try {
    const rows = highlights.map(h => hlToRow(h, userId));
    return await supabase.from('highlights').upsert(rows, { onConflict: 'id' });
  } catch (e) { return { error: e }; }
}

export async function fetchHighlights(userId) {
  if (!supabase) return { data: [], error: null };
  try {
    const { data, error } = await supabase
      .from('highlights')
      .select('*')
      .eq('user_id', userId)
      .order('created_at');
    if (error) return { data: [], error };
    return { data: (data || []).map(rowToHl), error: null };
  } catch (e) { return { data: [], error: e }; }
}

export async function uploadKidsV2State(userId, state) {
  if (!supabase) return { error: null };
  try {
    return await supabase.from('kidsv2_state').upsert(
      { user_id: userId, state, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    );
  } catch (e) { return { error: e }; }
}

export async function fetchKidsV2State(userId) {
  if (!supabase) return { data: null, error: null };
  try {
    const { data, error } = await supabase
      .from('kidsv2_state')
      .select('state')
      .eq('user_id', userId)
      .maybeSingle();
    return { data: data?.state || null, error };
  } catch (e) { return { data: null, error: e }; }
}

// Returns true if this user already has any data stored in Supabase.
export async function hasAnyData(userId) {
  if (!supabase) return false;
  try {
    const [{ data: h }, { data: k }] = await Promise.all([
      supabase.from('highlights').select('id').eq('user_id', userId).limit(1),
      supabase.from('kidsv2_state').select('user_id').eq('user_id', userId).limit(1),
    ]);
    return !!(h?.length || k?.length);
  } catch (e) { return false; }
}

// Fetch the profile row for a user (role, display_name).
export async function getProfile(userId) {
  if (!supabase) return null;
  try {
    const { data } = await supabase
      .from('profiles')
      .select('role, display_name, email')
      .eq('id', userId)
      .maybeSingle();
    return data || null;
  } catch (e) { return null; }
}
