import React from 'react';
import { Home } from './Home.jsx';
import { Icon } from './Icon.jsx';

const { useState, useEffect, useRef, useCallback, useMemo } = React;
const useS = useState, useE = useEffect, useR = useRef, useC = useCallback;
const useState_p = useState, useEffect_p = useEffect, useState_k = useState;
const useState_m = useState, useEffect_m = useEffect, useRef_m = useRef;
const useS_s = useState, useE_s = useEffect, useR_s = useRef;
const useState_a = useState, useEffect_a = useEffect;
const useState_mc = useState, useRef_mc = useRef, useEffect_mc = useEffect;
const useEffect_h = useEffect, useState_ms = useState, useEffect_ms = useEffect;
const useS_o = useState, useE_o = useEffect;

// Shell: Header, Left rail, Mishnah reader (center column)


// ============================================================
// Header
// ============================================================
const Header = ({ mode, setMode, perek, mishnah, onMenuClick, onSearchOpen, onMemorize, dark, setDark, onAdmin, onHome, atHome, onTour, onPicker, onShabbat }) => {
  return (
    <header className="header">
      <div className="header-left">
        <button className="icon-btn" onClick={onMenuClick} data-tip="Menu" data-tip-pos="bottom" aria-label="Menu">
          <Icon name="menu" />
        </button>
        <button className="brand" onClick={onHome} data-tip="Home" data-tip-pos="bottom" aria-label="Home" style={{cursor:'pointer', background:'transparent', border:0, padding:0}}>
          <span className="brand-mark">אבות</span>
          <span className="brand-word">Avot</span>
          <span className="brand-sub">Pirkei Avot · Reborn</span>
        </button>
        <div className="header-nav">
          <button className="perek-picker" data-tip="Jump to a perek or mishnah" data-tip-pos="bottom" onClick={onPicker}>
            <span className="he" style={{fontFamily: 'var(--hebrew)', fontWeight: 500}}>פרק {perek.title.he.replace('פרק ', '')}</span>
            <span style={{color: 'var(--muted-soft)'}}>·</span>
            <span>Mishnah {mishnah ? mishnah.num : '—'}</span>
            <Icon name="chevronD" size={12} />
          </button>
        </div>
      </div>
      <div className="header-right">
        {!atHome && (
          <button className="icon-btn" onClick={onHome} data-tip="Home" data-tip-pos="bottom" aria-label="Home">
            <Icon name="home" />
          </button>
        )}
        <button className="icon-btn" onClick={onSearchOpen} data-tip="Search · ⌘K" data-tip-pos="bottom" aria-label="Search">
          <Icon name="search" />
        </button>
        <button className="icon-btn" onClick={onMemorize} data-tip="Memorize mode · spaced repetition" data-tip-pos="bottom" aria-label="Memorize mode">
          <Icon name="cards" />
        </button>
        {onShabbat && (
          <button className="icon-btn header-shabbat-btn" onClick={onShabbat} data-tip="The Shabbat Table · this week's sheet" data-tip-pos="bottom" aria-label="The Shabbat Table">
            <Icon name="candle" />
          </button>
        )}
        <button className="icon-btn" onClick={onTour} data-tip="Replay the welcome tour" data-tip-pos="bottom" aria-label="Take the tour">
          <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="10" cy="10" r="7" />
            <path d="M7.5 7.5 Q7.5 5.5 10 5.5 Q12.5 5.5 12.5 8 Q12.5 9.5 10 10.5 L10 12" />
            <circle cx="10" cy="14.5" r="0.6" fill="currentColor" />
          </svg>
        </button>
        {mode !== 'kids' && (
          <button className="icon-btn" onClick={() => setDark(!dark)} data-tip={dark ? 'Light theme' : 'Dark theme'} data-tip-pos="bottom" aria-label="Toggle theme">
            <Icon name={dark ? "sun" : "moon"} />
          </button>
        )}
        <div className="mode-switch">
          <button className={mode === 'adult' ? 'active' : ''} onClick={() => setMode('adult')} data-tip="Full reader with commentary, sources, shiurim" data-tip-pos="bottom">Adult</button>
          <button className={mode === 'kids' ? 'active' : ''} onClick={() => setMode('kids')} data-tip="Illustrated, story-based learning for ages 5–10" data-tip-pos="bottom">Kids</button>
        </div>
        <div className="avatar" data-tip="Your profile" data-tip-pos="left">DG</div>
      </div>
    </header>
  );
};

// ============================================================
// Left rail
// ============================================================

export { Header };
