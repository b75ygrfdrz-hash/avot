import React from 'react';
import { Icon } from './Icon.jsx';
import { useAuth } from '../lib/useAuth.js';
import { signOut } from '../lib/supabase.js';

const { useState, useRef, useEffect } = React;
const useS = useState, useR = useRef, useE = useEffect;

// AccountMenu — sits in the header.
//
// Signed out: shows a "Sign in" button that opens AuthModal.
// Signed in: shows an avatar (initial of email) with a dropdown
// for profile email + sign-out.

const AccountMenu = ({ onOpenAuth }) => {
  const { user, isConfigured, loading } = useAuth();
  const [open, setOpen] = useS(false);
  const ref = useR(null);

  useE(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  if (loading) {
    return <div className="acct-skel" aria-hidden="true" />;
  }

  if (!isConfigured || !user) {
    return (
      <div className="acct-auth-btns">
        <button className="acct-login" onClick={() => onOpenAuth('signin')}>
          Log in
        </button>
        <button className="acct-signup" onClick={() => onOpenAuth('signup')}>
          Sign up
        </button>
      </div>
    );
  }

  const email = user.email || '';
  const initial = (email[0] || '·').toUpperCase();
  const provider = user.app_metadata?.provider || 'email';

  async function handleSignOut() {
    await signOut();
    setOpen(false);
  }

  return (
    <div className="acct-wrap" ref={ref}>
      <button className="acct-avatar" onClick={() => setOpen(v => !v)} aria-label="Account menu" data-tip={email} data-tip-pos="bottom">
        {initial}
      </button>
      {open && (
        <div className="acct-menu" role="menu">
          <div className="acct-menu-head">
            <div className="acct-menu-avatar">{initial}</div>
            <div className="acct-menu-text">
              <div className="acct-menu-email">{email}</div>
              <div className="acct-menu-provider">via {provider}</div>
            </div>
          </div>
          <button className="acct-menu-item" onClick={handleSignOut}>
            <Icon name="close" size={13} /> Sign out
          </button>
        </div>
      )}
    </div>
  );
};

Object.assign(window, { AccountMenu });

export { AccountMenu };
