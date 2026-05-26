// useSync — Auth Phase 2.
//
// Fires whenever the user signs in or the page loads with an existing session.
// Two paths:
//   1. User has data in Supabase (returning user / other device):
//      fetch remote highlights and kids-V2 state, merge into localStorage.
//   2. User has NO data in Supabase (first sign-in) but HAS local data:
//      show a one-time "Save your local data?" banner.
//
// After the user dismisses or accepts the banner, we remember the answer
// under 'avot.sync.prompted.<userId>' so it only shows once per account.

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  onAuthChange,
  uploadHighlights,
  fetchHighlights,
  uploadKidsV2State,
  fetchKidsV2State,
  hasAnyData,
} from './supabase.js';
import { loadState, saveState } from './kidsV2.js';

const PROMPTED_PREFIX = 'avot.sync.prompted.';

// Merge a remote kids-V2 state blob with the current localStorage state,
// keeping the best of each field.
function mergeKidsState(remote) {
  if (!remote) return;
  const local = loadState();
  const merged = {
    ...local,
    xp: Math.max(local.xp || 0, remote.xp || 0),
    hearts: Math.max(local.hearts || 0, remote.hearts || 0),
    heartsRefillAt: local.heartsRefillAt || remote.heartsRefillAt,
    streak: Math.max(local.streak || 0, remote.streak || 0),
    longestStreak: Math.max(local.longestStreak || 0, remote.longestStreak || 0),
    practiceDates: [
      ...new Set([
        ...(local.practiceDates || []),
        ...(remote.practiceDates || []),
      ]),
    ].sort(),
    // Start from remote completed, then overlay local (local wins on conflict)
    completed: { ...(remote.completed || {}) },
  };

  // For keys present in both: keep highest stars / most XP / latest timestamp
  for (const key of Object.keys(local.completed || {})) {
    const l = local.completed[key];
    const r = remote.completed?.[key];
    merged.completed[key] = r
      ? {
          stars: Math.max(l.stars || 0, r.stars || 0),
          xpEarned: Math.max(l.xpEarned || 0, r.xpEarned || 0),
          completedAt: Math.max(l.completedAt || 0, r.completedAt || 0),
        }
      : l;
  }

  // Keep the more recent practice date
  if (local.lastPracticeDate || remote.lastPracticeDate) {
    merged.lastPracticeDate =
      (local.lastPracticeDate || '') > (remote.lastPracticeDate || '')
        ? local.lastPracticeDate
        : remote.lastPracticeDate;
  }

  saveState(merged);
}

export function useSync({ highlights, onMergeHighlights }) {
  // Keep a live ref to highlights so the auth handler can read the latest
  // value without needing to be in its dependency array.
  const hlRef = useRef(highlights);
  useEffect(() => { hlRef.current = highlights; }, [highlights]);

  const [showUploadPrompt, setShowUploadPrompt] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncUser, setSyncUser] = useState(null);

  // Called when the user accepts the "save local data" prompt.
  const doUpload = useCallback(async (userId) => {
    if (!userId) return;
    setSyncing(true);
    try {
      const hls = hlRef.current;
      if (hls?.length) await uploadHighlights(userId, hls);
      const ks = loadState();
      if (ks.xp > 0 || Object.keys(ks.completed || {}).length > 0) {
        await uploadKidsV2State(userId, ks);
      }
      try { localStorage.setItem(PROMPTED_PREFIX + userId, 'yes'); } catch (_) {}
    } finally {
      setSyncing(false);
      setShowUploadPrompt(false);
    }
  }, []);

  const dismissUpload = useCallback((userId) => {
    if (userId) {
      try { localStorage.setItem(PROMPTED_PREFIX + userId, 'yes'); } catch (_) {}
    }
    setShowUploadPrompt(false);
  }, []);

  useEffect(() => {
    const unsub = onAuthChange(async (session, event) => {
      const u = session?.user || null;
      setSyncUser(u);

      if (!u) { setShowUploadPrompt(false); return; }

      // Act on sign-in or page-load with an existing session.
      if (event !== 'SIGNED_IN' && event !== 'INITIAL_SESSION') return;

      setSyncing(true);
      try {
        const hasRemote = await hasAnyData(u.id);

        if (hasRemote) {
          // Returning user — fetch and merge remote data into local.
          const [{ data: remoteHls }, { data: remoteKids }] = await Promise.all([
            fetchHighlights(u.id),
            fetchKidsV2State(u.id),
          ]);
          if (remoteHls?.length) onMergeHighlights(remoteHls);
          if (remoteKids) mergeKidsState(remoteKids);
        } else {
          // New account — offer to upload local data (once per account).
          const alreadyPrompted =
            localStorage.getItem(PROMPTED_PREFIX + u.id) === 'yes';
          if (!alreadyPrompted) {
            const localKids = loadState();
            const hasLocalHls = hlRef.current?.length > 0;
            const hasLocalKids =
              (localKids.xp || 0) > 0 ||
              Object.keys(localKids.completed || {}).length > 0;
            if (hasLocalHls || hasLocalKids) {
              setShowUploadPrompt(true);
            }
          }
        }
      } catch (_) {
        // Sync errors are non-fatal — local data is always the source of truth.
      } finally {
        setSyncing(false);
      }
    });
    return unsub;
  // onMergeHighlights must be stable (useCallback in caller) to avoid
  // re-subscribing on every render.
  }, [onMergeHighlights]);

  return { syncUser, showUploadPrompt, syncing, doUpload, dismissUpload };
}
