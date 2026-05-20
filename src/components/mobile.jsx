import React from 'react';
import { Home } from './Home.jsx';
import { RightPanel } from './RightPanel.jsx';

const { useState, useEffect, useRef, useCallback, useMemo } = React;
const useS = useState, useE = useEffect, useR = useRef, useC = useCallback;
const useState_p = useState, useEffect_p = useEffect, useState_k = useState;
const useState_m = useState, useEffect_m = useEffect, useRef_m = useRef;
const useS_s = useState, useE_s = useEffect, useR_s = useRef;
const useState_a = useState, useEffect_a = useEffect;
const useState_mc = useState, useRef_mc = useRef, useEffect_mc = useEffect;
const useEffect_h = useEffect, useState_ms = useState, useEffect_ms = useEffect;
const useS_o = useState, useE_o = useEffect;

// Mobile bottom-sheet for the right panel (Commentary, Sources, Shiurim, Notes, Chevruta)


const MobilePanelSheet = ({ open, onClose, mishnah, perek, highlights }) => {
  const [snap, setSnap] = useState_ms('mid'); // 'mid' (60vh) or 'full' (95vh)

  useEffect_ms(() => {
    if (open) setSnap('mid');
  }, [open]);

  if (!open) return null;
  return (
    <>
      <div className="ms-back" onClick={onClose} />
      <div className={`ms-sheet ms-${snap}`} role="dialog" aria-label="Mishnah details">
        <button className="ms-grab" onClick={() => setSnap(snap === 'mid' ? 'full' : 'mid')} aria-label="Toggle sheet size">
          <span className="ms-grab-bar" />
        </button>
        <div className="ms-body">
          <RightPanel mishnah={mishnah} perek={perek} highlights={highlights} />
        </div>
      </div>
    </>
  );
};

// Mobile bottom nav
const MobileBottomNav = ({ active, onHome, onRead, onLibrary, onShowSheet, atHome }) => (
  <nav className="mob-nav" aria-label="Mobile navigation">
    <button className={`mob-nav-btn ${atHome ? 'active' : ''}`} onClick={onHome} aria-label="Home">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11 L12 3 L21 11 L21 21 L3 21 Z" />
        <path d="M9 21 V14 H15 V21" />
      </svg>
      <span>Home</span>
    </button>
    <button className={`mob-nav-btn ${!atHome ? 'active' : ''}`} onClick={onRead} aria-label="Read">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4 L12 4 L12 20 L4 20 Z" />
        <path d="M20 4 L12 4 L12 20 L20 20 Z" />
      </svg>
      <span>Read</span>
    </button>
    <button className="mob-nav-btn" onClick={onShowSheet} aria-label="Commentary">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 5 L20 5 L20 18 L4 18 Z" />
        <line x1="8" y1="9" x2="16" y2="9" />
        <line x1="8" y1="12" x2="14" y2="12" />
        <line x1="8" y1="15" x2="16" y2="15" />
      </svg>
      <span>Sources</span>
    </button>
    <button className={`mob-nav-btn ${active === 'library' ? 'active' : ''}`} onClick={onLibrary} aria-label="Library">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4 L7 4 L7 20 L4 20 Z" />
        <path d="M9 6 L13 6 L13 20 L9 20 Z" />
        <path d="M15 7 L18 4 L21 7 L21 20 L15 20 Z" />
      </svg>
      <span>Library</span>
    </button>
  </nav>
);

window.MobilePanelSheet = MobilePanelSheet;
window.MobileBottomNav = MobileBottomNav;

export { MobileBottomNav, MobilePanelSheet };
