import React from 'react';
import { Icon } from './Icon.jsx';
import {
  isConfigured,
  signInWithMagicLink,
  signInWithPassword,
  signUpWithPassword,
  signInWithOAuth,
  resetPassword,
} from '../lib/supabase.js';

const { useState, useEffect, useRef } = React;
const useS = useState, useE = useEffect, useR = useRef;

// AuthModal — sign up / sign in dialog.
//
// Three methods, three tabs:
//   1. Magic link  (default — passwordless, just enter email)
//   2. Email + password  (with sign-in / sign-up switch + forgot password)
//   3. OAuth buttons     (Google + Apple)

const AuthModal = ({ onClose, defaultMode = 'signin', defaultMethod = 'magic' }) => {
  const [method, setMethod] = useS(defaultMethod); // 'magic' | 'password' | 'oauth'
  const [mode, setMode] = useS(defaultMode);  // 'signin' | 'signup'
  const [email, setEmail] = useS('');
  const [password, setPassword] = useS('');
  const [busy, setBusy] = useS(false);
  const [msg, setMsg] = useS(null);   // { kind: 'ok'|'err', text }
  const emailRef = useR(null);

  useE(() => { emailRef.current?.focus(); }, []);
  useE(() => { setMsg(null); }, [method, mode]);

  async function handleMagic(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true); setMsg(null);
    try {
      const { error } = await signInWithMagicLink(email.trim());
      if (error) setMsg({ kind: 'err', text: error.message });
      else setMsg({ kind: 'ok', text: 'Check your email for the sign-in link.' });
    } catch (err) {
      setMsg({ kind: 'err', text: err.message });
    } finally { setBusy(false); }
  }

  async function handlePassword(e) {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setBusy(true); setMsg(null);
    try {
      const fn = mode === 'signup' ? signUpWithPassword : signInWithPassword;
      const { error } = await fn(email.trim(), password);
      if (error) setMsg({ kind: 'err', text: error.message });
      else if (mode === 'signup') setMsg({ kind: 'ok', text: 'Check your email to confirm your account.' });
      else onClose && onClose();
    } catch (err) {
      setMsg({ kind: 'err', text: err.message });
    } finally { setBusy(false); }
  }

  async function handleOAuth(provider) {
    setBusy(true); setMsg(null);
    try {
      const { error } = await signInWithOAuth(provider);
      if (error) setMsg({ kind: 'err', text: error.message });
    } catch (err) {
      setMsg({ kind: 'err', text: err.message });
    } finally { setBusy(false); }
  }

  async function handleForgot() {
    if (!email.trim()) { setMsg({ kind: 'err', text: 'Enter your email first.' }); return; }
    setBusy(true);
    try {
      const { error } = await resetPassword(email.trim());
      if (error) setMsg({ kind: 'err', text: error.message });
      else setMsg({ kind: 'ok', text: 'Password reset link sent. Check your email.' });
    } catch (err) {
      setMsg({ kind: 'err', text: err.message });
    } finally { setBusy(false); }
  }

  if (!isConfigured) {
    return (
      <div className="auth-shell" role="dialog" aria-modal="true">
        <div className="auth-card">
          <button className="auth-close" onClick={onClose} aria-label="Close">
            <Icon name="close" size={14} />
          </button>
          <div className="auth-brand">
            <span className="auth-mark">אבות</span>
            <h2>Sign in</h2>
            <div className="auth-sub">Not configured yet</div>
          </div>
          <div className="auth-msg auth-msg-err">
            Supabase credentials aren't set. Add <code>VITE_SUPABASE_URL</code> and
            <code> VITE_SUPABASE_ANON_KEY</code> to your <code>.env.local</code> (and
            to your Netlify environment variables for production).
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-shell" role="dialog" aria-modal="true">
      <div className="auth-card">
        <button className="auth-close" onClick={onClose} aria-label="Close">
          <Icon name="close" size={14} />
        </button>

        <div className="auth-brand">
          <span className="auth-mark">אבות</span>
          <h2>{mode === 'signup' ? 'Create your account' : 'Sign in'}</h2>
          <div className="auth-sub">Save your highlights, notes, and progress across devices.</div>
        </div>

        <div className="auth-methods">
          <button className={`auth-method ${method === 'magic' ? 'active' : ''}`} onClick={() => setMethod('magic')}>Magic link</button>
          <button className={`auth-method ${method === 'password' ? 'active' : ''}`} onClick={() => setMethod('password')}>Password</button>
          <button className={`auth-method ${method === 'oauth' ? 'active' : ''}`} onClick={() => setMethod('oauth')}>Google / Apple</button>
        </div>

        {method === 'magic' && (
          <form onSubmit={handleMagic} className="auth-form">
            <label className="auth-label">Email</label>
            <input
              ref={emailRef}
              type="email"
              className="auth-input"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <button type="submit" className="auth-submit" disabled={busy || !email.trim()}>
              {busy ? 'Sending…' : 'Email me a link'}
            </button>
            <div className="auth-hint">We'll email you a one-time sign-in link. No password needed.</div>
          </form>
        )}

        {method === 'password' && (
          <form onSubmit={handlePassword} className="auth-form">
            <label className="auth-label">Email</label>
            <input
              ref={emailRef}
              type="email"
              className="auth-input"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <label className="auth-label">Password</label>
            <input
              type="password"
              className="auth-input"
              placeholder={mode === 'signup' ? 'At least 8 characters' : 'Your password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={mode === 'signup' ? 8 : undefined}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            />
            <button type="submit" className="auth-submit" disabled={busy || !email.trim() || !password}>
              {busy ? '…' : (mode === 'signup' ? 'Create account' : 'Sign in')}
            </button>
            <div className="auth-foot">
              {mode === 'signin' ? (
                <>
                  <button type="button" className="auth-link" onClick={() => setMode('signup')}>
                    Need an account?
                  </button>
                  <button type="button" className="auth-link" onClick={handleForgot}>
                    Forgot password?
                  </button>
                </>
              ) : (
                <button type="button" className="auth-link" onClick={() => setMode('signin')}>
                  Already have an account? Sign in
                </button>
              )}
            </div>
          </form>
        )}

        {method === 'oauth' && (
          <div className="auth-form">
            <button className="auth-oauth auth-oauth-google" onClick={() => handleOAuth('google')} disabled={busy}>
              <GoogleMark /> Continue with Google
            </button>
            <button className="auth-oauth auth-oauth-apple" onClick={() => handleOAuth('apple')} disabled={busy}>
              <AppleMark /> Continue with Apple
            </button>
            <div className="auth-hint">We never see your password. One tap, signed in.</div>
          </div>
        )}

        {msg && (
          <div className={`auth-msg ${msg.kind === 'err' ? 'auth-msg-err' : 'auth-msg-ok'}`}>
            {msg.text}
          </div>
        )}
      </div>
    </div>
  );
};

const GoogleMark = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
    <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.79 2.72v2.26h2.9c1.7-1.57 2.69-3.88 2.69-6.62z"/>
    <path fill="#34A853" d="M9 18c2.43 0 4.46-.8 5.95-2.18l-2.9-2.26c-.8.54-1.83.86-3.05.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"/>
    <path fill="#FBBC05" d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33z"/>
    <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A8.99 8.99 0 0 0 9 0 9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"/>
  </svg>
);
const AppleMark = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true" fill="currentColor">
    <path d="M14.94 9.5c.02 1.94 1.7 2.59 1.72 2.6-.02.05-.27.92-.88 1.81-.53.78-1.07 1.55-1.93 1.57-.85.01-1.12-.5-2.08-.5-.97 0-1.27.49-2.08.51-.83.03-1.45-.83-1.98-1.6-1.1-1.58-1.93-4.45-.8-6.39A3.07 3.07 0 0 1 9.5 5.97c.81-.02 1.57.55 2.07.55.49 0 1.42-.68 2.4-.58.4.02 1.55.16 2.29 1.23-.06.04-1.36.79-1.34 2.33zM12.7 4.74c.44-.54.74-1.28.66-2.02-.64.03-1.41.42-1.86.95-.4.47-.76 1.23-.67 1.95.71.06 1.43-.36 1.87-.88z"/>
  </svg>
);

Object.assign(window, { AuthModal });

export { AuthModal };
