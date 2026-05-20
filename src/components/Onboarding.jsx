import React from 'react';

const { useState, useEffect, useRef, useCallback, useMemo } = React;
const useS = useState, useE = useEffect, useR = useRef, useC = useCallback;
const useState_p = useState, useEffect_p = useEffect, useState_k = useState;
const useState_m = useState, useEffect_m = useEffect, useRef_m = useRef;
const useS_s = useState, useE_s = useEffect, useR_s = useRef;
const useState_a = useState, useEffect_a = useEffect;
const useState_mc = useState, useRef_mc = useRef, useEffect_mc = useEffect;
const useEffect_h = useEffect, useState_ms = useState, useEffect_ms = useEffect;
const useS_o = useState, useE_o = useEffect;

// First-visit onboarding overlay — 3 screens, persists in localStorage


const Onboarding = ({ setMode, onDone }) => {
  const [screen, setScreen] = useS_o(0);
  const [mode, setLocalMode] = useS_o(null);
  const [dir, setDir] = useS_o(1);

  useE_o(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (screen === 0) goNext();
        else if (screen === 1 && mode) goNext();
        else if (screen === 2) finish();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [screen, mode]);

  const goNext = () => { setDir(1); setScreen(s => Math.min(2, s + 1)); };

  const finish = () => {
    localStorage.setItem('avot.onboarded.v1', 'true');
    if (mode) setMode(mode);
    onDone();
  };

  return (
    <div className="onb-overlay" role="dialog" aria-modal="true">
      <div className="onb-stage">
        <div className={`onb-screen onb-screen-0 ${screen === 0 ? 'is-active' : screen > 0 ? 'is-past' : ''}`}>
          <ScreenOpening onBegin={goNext} />
        </div>
        <div className={`onb-screen onb-screen-1 ${screen === 1 ? 'is-active' : screen > 1 ? 'is-past' : screen < 1 ? 'is-future' : ''}`}>
          <ScreenChoose mode={mode} setMode={setLocalMode} onContinue={goNext} />
        </div>
        <div className={`onb-screen onb-screen-2 ${screen === 2 ? 'is-active' : screen < 2 ? 'is-future' : ''}`}>
          <ScreenTip mode={mode} onStart={finish} />
        </div>
      </div>
      <div className="onb-dots">
        {[0,1,2].map(i => <span key={i} className={`onb-dot ${i === screen ? 'active' : ''} ${i < screen ? 'done' : ''}`} />)}
      </div>
    </div>
  );
};

// ============================================================
// Screen 1 — The Opening: animating mesorah chain
// ============================================================
const ScreenOpening = ({ onBegin }) => (
  <div className="onb-center" style={{maxWidth: 480}}>
    <div className="onb-chain" aria-hidden="true">
      <svg viewBox="0 0 360 60" width="100%" style={{maxWidth: 360}}>
        <line x1="20" y1="30" x2="340" y2="30" stroke="var(--border)" strokeWidth="1.5" strokeDasharray="3 4" className="onb-chain-line" />
        {[20, 73, 127, 180, 233, 287, 340].map((x, i) => (
          <g key={i} className="onb-chain-node" style={{animationDelay: `${i * 200}ms`}}>
            <circle cx={x} cy="30" r="9" fill={i === 6 ? "var(--gold)" : "var(--wine)"} />
            {i === 6 && <circle cx={x} cy="30" r="9" fill="none" stroke="var(--gold)" strokeWidth="2" className="onb-chain-pulse" />}
          </g>
        ))}
      </svg>
      <div className="onb-chain-labels">
        <span>Sinai</span>
        <span style={{textAlign:'right'}}>You</span>
      </div>
    </div>
    <h1 className="onb-hebrew">מֹשֶׁה קִבֵּל תּוֹרָה מִסִּינַי</h1>
    <p className="onb-tagline">From Sinai to you.</p>
    <button className="onb-btn" onClick={onBegin}>
      Begin
      <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="10" x2="16" y2="10" /><polyline points="12 6 16 10 12 14" />
      </svg>
    </button>
  </div>
);

// ============================================================
// Screen 2 — Choose your path
// ============================================================
const ScreenChoose = ({ mode, setMode, onContinue }) => (
  <div className="onb-center" style={{maxWidth: 720, width: '100%'}}>
    <h2 className="onb-heading">How would you like to learn?</h2>
    <p className="onb-sub">Choose a mode — you can switch any time.</p>
    <div className="onb-cards">
      <button className={`onb-card adult ${mode === 'adult' ? 'selected' : ''}`} onClick={() => setMode('adult')}>
        <div className="onb-card-icon">
          <svg viewBox="0 0 40 40" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 8 L20 8 L20 34 L5 34 Z" />
            <path d="M35 8 L20 8 L20 34 L35 34 Z" />
            <line x1="9" y1="14" x2="16" y2="14" />
            <line x1="9" y1="20" x2="16" y2="20" />
            <line x1="9" y1="26" x2="14" y2="26" />
            <line x1="24" y1="14" x2="31" y2="14" />
            <line x1="24" y1="20" x2="31" y2="20" />
            <line x1="24" y1="26" x2="29" y2="26" />
          </svg>
        </div>
        <div className="onb-card-title">For Adults</div>
        <div className="onb-card-desc">Hebrew text, classical commentary, AI chevruta, highlights & notes.</div>
      </button>
      <button className={`onb-card kids ${mode === 'kids' ? 'selected' : ''}`} onClick={() => setMode('kids')}>
        <div className="onb-card-icon">
          <svg viewBox="0 0 40 40" width="36" height="36" fill="currentColor">
            <polygon points="20 4 24.5 14.5 36 16 27.5 24 30 35.5 20 29.5 10 35.5 12.5 24 4 16 15.5 14.5" />
          </svg>
        </div>
        <div className="onb-card-title">For Kids</div>
        <div className="onb-card-desc">Stories, illustrations, word games, and stars for learning.</div>
      </button>
    </div>
    <button className="onb-btn" disabled={!mode} onClick={onContinue}>
      Continue
      <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="10" x2="16" y2="10" /><polyline points="12 6 16 10 12 14" />
      </svg>
    </button>
  </div>
);

// ============================================================
// Screen 3 — One quick tip
// ============================================================
const ScreenTip = ({ mode, onStart }) => (
  <div className="onb-center" style={{maxWidth: 620, width: '100%'}}>
    {mode === 'adult' ? (
      <>
        <div className="onb-tip-frame">
          <div className="onb-hebrew-demo">
            <span>מֹשֶׁה </span>
            <span className="onb-word-demo">
              קִבֵּל
              <span className="onb-word-tip">received</span>
            </span>
            <span> תּוֹרָה מִסִּינַי</span>
          </div>
        </div>
        <h3 className="onb-tip-title">Hover any Hebrew word</h3>
        <p className="onb-tip-caption">A floating tooltip shows you the English instantly — no looking away. Toggle this on or off in the reading toolbar.</p>
      </>
    ) : (
      <>
        <div className="onb-tip-frame onb-tip-kids">
          <div className="onb-quiz-demo">
            <span className="onb-q-label">★ Quiz time</span>
            <div className="onb-q-text">What three things did the Men of the Great Assembly teach?</div>
            <div className="onb-q-opt correct">Be deliberate, raise students, make a fence around Torah ✓</div>
            <div className="onb-q-opt">Eat well, sleep early, brush teeth</div>
          </div>
        </div>
        <h3 className="onb-tip-title">Answer, earn, learn</h3>
        <p className="onb-tip-caption">Every Mishnah has a story, an illustration, and a quick quiz. Get the right answer and earn a ★ for your collection.</p>
      </>
    )}
    <button className="onb-btn primary-large" onClick={onStart}>
      Start learning
      <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="10" x2="16" y2="10" /><polyline points="12 6 16 10 12 14" />
      </svg>
    </button>
  </div>
);

window.Onboarding = Onboarding;

export { Onboarding, ScreenChoose, ScreenOpening, ScreenTip };
