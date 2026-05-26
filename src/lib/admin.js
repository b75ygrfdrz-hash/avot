// Admin auth + content-visibility helpers.
//
// Two ways to authenticate as admin:
//   1. Password — the hardcoded ADMIN_PASSWORD below (change it freely).
//   2. Supabase role — if the signed-in user's profiles.role === 'admin'
//      they bypass the password entirely. Set this in the Supabase dashboard:
//      Table Editor -> profiles -> find the row -> set role to 'admin'.

import { getProfile } from './supabase.js';

export const ADMIN_PASSWORD = 'avot-admin';

// Returns true if the currently signed-in Supabase user has admin role.
// Always resolves (never rejects) — returns false on any error.
export async function checkAdminRole(userId) {
  if (!userId) return false;
  try {
    const profile = await getProfile(userId);
    return profile?.role === 'admin';
  } catch (e) { return false; }
}

const AUTH_KEY = 'avot.admin.auth';
const HIDDEN_COMMS_KEY = 'avot.commentators.hidden';
const CHANGE_EVENT = 'avot:commentators-changed';

export function isAdminAuthed() {
  try { return localStorage.getItem(AUTH_KEY) === 'yes'; } catch (e) { return false; }
}

export function setAdminAuthed(yes) {
  try {
    if (yes) localStorage.setItem(AUTH_KEY, 'yes');
    else localStorage.removeItem(AUTH_KEY);
  } catch (e) {}
}

export function getHiddenCommentators() {
  try {
    const raw = localStorage.getItem(HIDDEN_COMMS_KEY) || '[]';
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch (e) { return new Set(); }
}

export function setCommentatorHidden(id, hidden) {
  const cur = getHiddenCommentators();
  if (hidden) cur.add(id);
  else cur.delete(id);
  try {
    localStorage.setItem(HIDDEN_COMMS_KEY, JSON.stringify([...cur]));
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  } catch (e) {}
}

export function onCommentatorsChange(handler) {
  window.addEventListener(CHANGE_EVENT, handler);
  return () => window.removeEventListener(CHANGE_EVENT, handler);
}
