// Standalone admin pieces that are safe to import from anywhere
// without pulling in the rest of admin.jsx (which itself pulls in the
// 6.3MB illustrations.jsx). Keeping these here lets Vite code-split
// admin.jsx as a lazy chunk in App.jsx.

import React from 'react';
import { Icon } from './Icon.jsx';
import { ADMIN_PASSWORD, setAdminAuthed } from '../lib/admin.js';

const { useState } = React;

// Login gate shown when no admin session exists.
export const AdminLogin = ({ onAuth, onClose }) => {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const submit = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      setAdminAuthed(true);
      onAuth();
    } else {
      setErr('Incorrect password.');
    }
  };
  return (
    <div className="admin-shell admin-login-shell" data-screen-label="Admin · Sign in">
      <button className="admin-login-close" onClick={onClose} aria-label="Close">
        <Icon name="close" />
      </button>
      <form className="admin-login-form" onSubmit={submit}>
        <div className="admin-login-brand">
          <span style={{fontFamily:'var(--hebrew)', color:'var(--wine)', fontSize: 30}}>אבות</span>
          <span style={{fontFamily:'var(--serif)', fontWeight: 600, fontSize: 22}}>Avot Admin</span>
        </div>
        <p className="admin-login-sub">Sign in to manage content and visibility.</p>
        <label className="admin-login-label" htmlFor="admin-pw">Password</label>
        <input
          id="admin-pw"
          type="password"
          value={pw}
          onChange={e => { setPw(e.target.value); if (err) setErr(''); }}
          placeholder="Enter password"
          autoFocus
        />
        {err && <div className="admin-login-err">{err}</div>}
        <button type="submit" className="admin-btn primary admin-login-btn">Sign in</button>
        <div className="admin-login-hint">
          (Default password is set in <code>src/lib/admin.js</code>.)
        </div>
      </form>
    </div>
  );
};

// Tiny shared select used by both admin panel and other components.
export const Select = ({ value, onChange, options }) => (
  <select className="admin-select" value={value} onChange={e => onChange(e.target.value)}>
    {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
  </select>
);
