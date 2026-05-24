// Admin auth + content-visibility helpers.
//
// The admin password is hard-coded here for now; change ADMIN_PASSWORD
// below to anything you like. A real backend would replace this with
// proper auth.

export const ADMIN_PASSWORD = 'avot-admin';

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
