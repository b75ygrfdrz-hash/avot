// useAuth — reactive auth state hook.
//
// Returns { session, user, loading, isConfigured }.
// Subscribes to Supabase auth events so any component re-renders when
// the user signs in / out.

import React from 'react';
import { supabase, getSession, onAuthChange, isConfigured } from './supabase.js';

const { useState, useEffect } = React;

export function useAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(isConfigured);

  useEffect(() => {
    if (!isConfigured) { setLoading(false); return; }
    let mounted = true;
    getSession().then(s => {
      if (mounted) { setSession(s); setLoading(false); }
    });
    const unsub = onAuthChange((s) => {
      if (mounted) setSession(s);
    });
    return () => { mounted = false; unsub(); };
  }, []);

  return {
    session,
    user: session?.user || null,
    loading,
    isConfigured,
  };
}
