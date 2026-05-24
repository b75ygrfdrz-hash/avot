import React from 'react';
import { Home } from './Home.jsx';
import { Icon } from './Icon.jsx';
import { ILLUSTRATIONS, KidsIllustration } from './illustrations.jsx';

const { useState, useEffect, useRef, useCallback, useMemo } = React;
const useS = useState, useE = useEffect, useR = useRef, useC = useCallback;
const useState_p = useState, useEffect_p = useEffect, useState_k = useState;
const useState_m = useState, useEffect_m = useEffect, useRef_m = useRef;
const useS_s = useState, useE_s = useEffect, useR_s = useRef;
const useState_a = useState, useEffect_a = useEffect;
const useState_mc = useState, useRef_mc = useRef, useEffect_mc = useEffect;
const useEffect_h = useEffect, useState_ms = useState, useEffect_ms = useEffect;
const useS_o = useState, useE_o = useEffect;

// Kids mode v2 — playful, colourful per-chapter theming, three games,
// adventure-path progress, confetti, completion screen.

const SCENE_ICONS = {
  1: "📜", 2: "🏛️", 3: "❤️", 4: "🏠", 5: "🤝",
  6: "👫", 7: "🛡️", 8: "⚖️", 9: "🔍", 10: "🧰",
  11: "💬", 12: "🕊️", 13: "🤲", 14: "⏰", 15: "📚",
  16: "👨‍🏫", 17: "🤐", 18: "⚖️",
};

// Per-chapter colour themes. Each chapter shifts the whole UI.
const CHAPTER_THEMES = {
  1: { primary: '#8a4fb8', light: '#efe1f7', mid: '#c9a3e0', dark: '#5a2f7a' }, // purple
  2: { primary: '#2da7a0', light: '#d9efed', mid: '#7fc7c2', dark: '#1a6661' }, // teal
  3: { primary: '#e0578f', light: '#fadde9', mid: '#f0a3c0', dark: '#9a2d5a' }, // pink
  4: { primary: '#3a78d0', light: '#dbe7f6', mid: '#85a8db', dark: '#1f4a8e' }, // blue
  5: { primary: '#e8843a', light: '#fbe4cf', mid: '#f0b585', dark: '#a04d1a' }, // orange
  6: { primary: '#5aaa48', light: '#dceed3', mid: '#a3cf94', dark: '#326628' }, // green
};

function getTheme(perekNum) {
  return CHAPTER_THEMES[perekNum] || CHAPTER_THEMES[1];
}

function themeStyle(theme) {
  return {
    '--c': theme.primary,
    '--cl': theme.light,
    '--cm': theme.mid,
    '--cd': theme.dark,
  };
}

// ============================================================
// Confetti — 48 falling pieces, fires on correct answers and wins
// ============================================================
const CONFETTI_COLORS = ['#e8b144', '#d97a4a', '#5a8aaa', '#6aa56a', '#8a6db0', '#a85454', '#2da7a0', '#e0578f'];

const Confetti = ({ active }) => {
  const pieces = useMemo(() => {
    if (!active) return [];
    return Array.from({ length: 48 }, (_, i) => ({
      left: Math.random() * 100,
      size: 6 + Math.random() * 8,
      delay: Math.random() * 0.4,
      duration: 2 + Math.random() * 1.5,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      radius: i % 2 === 0 ? '50%' : '2px',
      rotation: Math.random() * 360,
    }));
  }, [active]);
  if (!active) return null;
  return (
    <div className="kids-confetti" aria-hidden="true">
      {pieces.map((p, i) => (
        <div key={i} className="kids-confetti-piece" style={{
          left: `${p.left}%`,
          width: `${p.size}px`,
          height: `${p.size}px`,
          background: p.color,
          borderRadius: p.radius,
          animationDelay: `${p.delay}s`,
          animationDuration: `${p.duration}s`,
          transform: `rotate(${p.rotation}deg)`,
        }} />
      ))}
    </div>
  );
};

// ============================================================
// Adventure path — horizontal stops with current/done states
// ============================================================
const AdventurePath = ({ mishnayot, currentIdx, onJump }) => {
  const trackRef = useRef(null);
  useEffect(() => {
    const el = trackRef.current?.querySelector('.kp-stop.current');
    if (el && el.scrollIntoView) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [currentIdx]);

  return (
    <div className="kp-wrap">
      <div className="kp-track" ref={trackRef}>
        {mishnayot.map((m, i) => {
          const done = i < currentIdx;
          const current = i === currentIdx;
          return (
            <React.Fragment key={i}>
              {i > 0 && <div className={`kp-line ${i <= currentIdx ? 'done' : ''}`} />}
              <button
                className={`kp-stop ${done ? 'done' : ''} ${current ? 'current' : ''}`}
                onClick={() => onJump(i)}
                aria-label={`Mishnah ${i + 1}`}
              >
                {current && <span className="kp-pulse" aria-hidden="true" />}
                <span className="kp-stop-label">{done ? '✓' : i + 1}</span>
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================
// Illustration banner — gradient card with icon + attribution
// ============================================================
const IllustrationBanner = ({ mishnah }) => {
  const icon = SCENE_ICONS[mishnah.num] || '📖';
  return (
    <div className="kb-banner">
      <span className="kb-pill">Mishnah {mishnah.num}</span>
      <span className="kb-deco kb-d1" aria-hidden="true">✦</span>
      <span className="kb-deco kb-d2" aria-hidden="true">◆</span>
      <span className="kb-deco kb-d3" aria-hidden="true">✦</span>
      <div className="kb-icon">{icon}</div>
      <div className="kb-text">
        <div className="kb-he">{mishnah.attribution.he}</div>
        <div className="kb-en">{mishnah.attribution.en}</div>
      </div>
    </div>
  );
};

// ============================================================
// Hero illustration — Pixar-warm storybook scenes per mishnah.
// Currently a single lighthouse scene for Mishnah 1:1.
// ============================================================

// Stars scattered across the upper sky. Hand-tuned positions for variety.
const HERO_STARS = [
  { x: 80, y: 60, r: 1.3, o: 0.85 },   { x: 160, y: 110, r: 1, o: 0.6 },
  { x: 220, y: 50, r: 1.6, o: 0.95 },  { x: 290, y: 130, r: 0.9, o: 0.7 },
  { x: 380, y: 90, r: 1.4, o: 0.8 },   { x: 460, y: 40, r: 1, o: 0.65 },
  { x: 540, y: 150, r: 1.2, o: 0.75 }, { x: 620, y: 70, r: 1.5, o: 0.9 },
  { x: 800, y: 110, r: 1, o: 0.65 },   { x: 880, y: 50, r: 1.3, o: 0.8 },
  { x: 960, y: 140, r: 0.9, o: 0.6 },  { x: 1080, y: 80, r: 1.4, o: 0.85 },
  { x: 1180, y: 130, r: 1, o: 0.7 },   { x: 1280, y: 60, r: 1.6, o: 0.95 },
  { x: 1360, y: 110, r: 1.1, o: 0.75 },{ x: 1440, y: 50, r: 1.2, o: 0.85 },
  { x: 1520, y: 130, r: 0.9, o: 0.65 },{ x: 130, y: 220, r: 0.8, o: 0.55 },
  { x: 1490, y: 230, r: 0.9, o: 0.6 },
];
// Four-point sparkle stars (the bigger statement stars)
const HERO_SPARKLES = [
  { x: 270, y: 170, s: 6 },
  { x: 1140, y: 180, s: 7 },
  { x: 480, y: 280, s: 5 },
];

// One chain-of-transmission figure in silhouette with warm rim light.
const ChainFigure = ({ x, y, scale = 1, lantern = true }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    {/* Robe */}
    <path
      d="M -16 0 L -18 -38 Q -18 -50, -8 -54 L 8 -54 Q 18 -50, 18 -38 L 16 0 Z"
      fill="#0f0820"
    />
    {/* Head */}
    <circle cx="0" cy="-60" r="8" fill="#0f0820" />
    {/* Beard */}
    <path d="M -5 -56 Q -5 -48, 0 -45 Q 5 -48, 5 -56 Z" fill="#070210" />
    {/* Rim light on the leading edge (toward Sinai/the source) */}
    <path
      d="M -18 -38 Q -18 -50, -8 -54 L -7 -56"
      stroke="#f0c275"
      strokeWidth="1.4"
      fill="none"
      opacity="0.85"
      strokeLinecap="round"
    />
    <path
      d="M -16 -2 L -18 -38"
      stroke="#c8825f"
      strokeWidth="1.2"
      fill="none"
      opacity="0.65"
    />
    {/* Small carried lantern (the Torah, passing down the chain) */}
    {lantern && (
      <>
        <circle cx="14" cy="-22" r="9" fill="#ffd479" opacity="0.32" />
        <circle cx="14" cy="-22" r="4.5" fill="#fff1c2" />
        <line x1="14" y1="-32" x2="14" y2="-28" stroke="#0f0820" strokeWidth="1.5" strokeLinecap="round" />
      </>
    )}
  </g>
);

const HeroSinai = () => (
  <svg
    viewBox="0 0 1600 900"
    preserveAspectRatio="xMidYMid slice"
    className="hero-illust"
    aria-hidden="true"
  >
    <defs>
      {/* Deep dusk sky going from night to gold */}
      <linearGradient id="hi-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#1a2548" />
        <stop offset="28%"  stopColor="#3a2848" />
        <stop offset="56%"  stopColor="#7a4d6b" />
        <stop offset="80%"  stopColor="#c8825f" />
        <stop offset="100%" stopColor="#f0a275" />
      </linearGradient>
      {/* Divine light from the top of the frame */}
      <radialGradient id="hi-divine" cx="0.45" cy="0" r="0.85">
        <stop offset="0%"   stopColor="#fff1c2" stopOpacity="0.95" />
        <stop offset="22%"  stopColor="#ffd479" stopOpacity="0.55" />
        <stop offset="55%"  stopColor="#f0a275" stopOpacity="0.22" />
        <stop offset="100%" stopColor="#7a4d6b" stopOpacity="0" />
      </radialGradient>
      {/* Main mountain gradient — deep mauve to indigo */}
      <linearGradient id="hi-mountain" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#3e2848" />
        <stop offset="55%"  stopColor="#1f1428" />
        <stop offset="100%" stopColor="#0a0418" />
      </linearGradient>
      {/* Warm overlay on the lit side of Sinai */}
      <linearGradient id="hi-mountain-lit" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%"   stopColor="#f0c275" stopOpacity="0.45" />
        <stop offset="50%"  stopColor="#c8825f" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#7a4d6b" stopOpacity="0" />
      </linearGradient>
      {/* Halo behind the tablets */}
      <radialGradient id="hi-halo" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%"   stopColor="#fff1c2" stopOpacity="1" />
        <stop offset="50%"  stopColor="#ffd479" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#ffd479" stopOpacity="0" />
      </radialGradient>
      {/* Soft ground haze */}
      <linearGradient id="hi-haze" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#c8825f" stopOpacity="0" />
        <stop offset="100%" stopColor="#c8825f" stopOpacity="0.35" />
      </linearGradient>
    </defs>

    {/* Sky base */}
    <rect width="1600" height="900" fill="url(#hi-sky)" />

    {/* Divine light pouring in from above */}
    <ellipse cx="720" cy="0" rx="620" ry="720" fill="url(#hi-divine)" />

    {/* Scattered stars */}
    {HERO_STARS.map((s, i) => (
      <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff1c2" opacity={s.o} />
    ))}

    {/* Sparkle stars */}
    {HERO_SPARKLES.map((s, i) => (
      <g key={i} transform={`translate(${s.x} ${s.y})`}>
        <path
          d={`M 0 -${s.s} L 1 -1 L ${s.s} 0 L 1 1 L 0 ${s.s} L -1 1 L -${s.s} 0 L -1 -1 Z`}
          fill="#fff1c2"
          opacity="0.95"
        />
      </g>
    ))}

    {/* Far mountain silhouettes (atmospheric depth) */}
    <path
      d="M 0 540 L 180 410 L 360 500 L 560 360 L 780 470 L 960 390 L 1180 460 L 1380 370 L 1600 430 L 1600 900 L 0 900 Z"
      fill="#3e2848"
      opacity="0.55"
    />
    {/* Near mountains */}
    <path
      d="M 0 640 L 200 510 L 380 600 L 580 470 L 760 580 L 980 510 L 1200 600 L 1400 510 L 1600 580 L 1600 900 L 0 900 Z"
      fill="#241830"
      opacity="0.8"
    />

    {/* Soft warm haze along the horizon */}
    <rect x="0" y="520" width="1600" height="200" fill="url(#hi-haze)" />

    {/* Main Sinai mountain */}
    <polygon points="380,800 720,200 1060,800" fill="url(#hi-mountain)" />
    {/* Lit side of Sinai (facing the light) */}
    <polygon points="380,800 720,200 720,800" fill="url(#hi-mountain-lit)" />
    {/* Snow / rocky cap (a small triangle near the top) */}
    <polygon points="700,280 720,200 740,280 730,295 710,295" fill="#5a4068" opacity="0.7" />

    {/* Light beam streaming from sky onto the peak */}
    <polygon points="660,0 780,0 750,260 690,260" fill="url(#hi-divine)" opacity="0.65" />

    {/* Tablets halo */}
    <circle cx="720" cy="220" r="85" fill="url(#hi-halo)" />

    {/* Moshe figure on the peak, arms raised */}
    <g transform="translate(720 280)">
      <path d="M -10 0 L -12 -28 Q -12 -36, -6 -38 L 6 -38 Q 12 -36, 12 -28 L 10 0 Z" fill="#0a0418" />
      <circle cx="0" cy="-46" r="6.5" fill="#0a0418" />
      {/* Arms raised toward the tablets */}
      <path d="M -10 -28 Q -18 -34, -22 -46" stroke="#0a0418" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M 10 -28 Q 18 -34, 22 -46" stroke="#0a0418" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Rim light */}
      <path d="M -12 -28 Q -12 -36, -6 -38" stroke="#f0c275" strokeWidth="1.5" fill="none" opacity="0.9" />
      <path d="M -10 0 L -12 -28" stroke="#c8825f" strokeWidth="1.3" fill="none" opacity="0.7" />
    </g>

    {/* The two tablets, floating above Moshe */}
    <g transform="translate(720 210)">
      {/* Left tablet */}
      <path
        d="M -26 -28 L -26 28 Q -26 34, -20 34 L -5 34 Q -3 34, -3 28 L -3 -18 Q -3 -28, -14 -28 Z"
        fill="#fff1c2"
        stroke="#c8825f"
        strokeWidth="1.6"
      />
      {/* Right tablet */}
      <path
        d="M 3 -28 L 3 28 Q 3 34, 5 34 L 20 34 Q 26 34, 26 28 L 26 -18 Q 26 -28, 14 -28 Z"
        fill="#fff1c2"
        stroke="#c8825f"
        strokeWidth="1.6"
      />
      {/* Engraving lines */}
      {[-14, -6, 2, 10, 18, 26].map((y, i) => (
        <React.Fragment key={i}>
          <line x1="-22" y1={y} x2="-7" y2={y} stroke="#c8825f" strokeWidth="0.7" opacity="0.85" />
          <line x1="7" y1={y} x2="22" y2={y} stroke="#c8825f" strokeWidth="0.7" opacity="0.85" />
        </React.Fragment>
      ))}
    </g>

    {/* Light particles drifting in the lit zone */}
    {[
      { x: 480, y: 360 }, { x: 560, y: 420 }, { x: 640, y: 320 },
      { x: 820, y: 380 }, { x: 880, y: 460 }, { x: 940, y: 340 },
      { x: 1020, y: 420 },
    ].map((p, i) => (
      <circle key={i} cx={p.x} cy={p.y} r="1.6" fill="#fff1c2" opacity="0.7" />
    ))}

    {/* Lit path winding from the foot of Sinai out across the valley */}
    <path
      d="M 720 820 Q 850 800, 940 790 Q 1080 770, 1200 778 Q 1330 786, 1480 810"
      stroke="#ffd479"
      strokeWidth="3"
      fill="none"
      strokeDasharray="6 10"
      opacity="0.55"
    />

    {/* Chain of figures along the path */}
    <ChainFigure x={830} y={822} scale={1.0} />
    <ChainFigure x={1000} y={826} scale={0.85} />
    <ChainFigure x={1180} y={838} scale={0.7} />
    <ChainFigure x={1380} y={860} scale={0.55} />

    {/* Foreground silhouette (rocks, sand) */}
    <path
      d="M 0 800 Q 180 762, 360 786 Q 560 810, 760 798 Q 960 786, 1160 812 Q 1360 832, 1600 800 L 1600 900 L 0 900 Z"
      fill="#0a0418"
    />

    {/* A few small rocks in the foreground */}
    <ellipse cx="120" cy="820" rx="22" ry="9" fill="#1f1428" />
    <ellipse cx="270" cy="850" rx="32" ry="11" fill="#1f1428" />
    <ellipse cx="1480" cy="850" rx="36" ry="12" fill="#1f1428" />
    <ellipse cx="1320" cy="870" rx="26" ry="9" fill="#1f1428" />

    {/* Bottom warm-gold glow near the path source */}
    <ellipse cx="760" cy="830" rx="120" ry="22" fill="#ffd479" opacity="0.18" />
  </svg>
);

// Switcher: hero illustration when we have one, banner otherwise.
const MishnahHero = ({ mishnah }) => {
  if (mishnah.num === 1) {
    return (
      <div className="hero-wrap">
        <HeroSinai />
        <div className="hero-overlay">
          <span className="hero-num">Mishnah {mishnah.num}</span>
          <div className="hero-attr">
            <div className="hero-he">{mishnah.attribution.he}</div>
            <div className="hero-en">{mishnah.attribution.en}</div>
          </div>
        </div>
      </div>
    );
  }
  return <IllustrationBanner mishnah={mishnah} />;
};

// ============================================================
// Tappable Hebrew — themed colours, persistent hint box
// ============================================================
const KidsHebrew = ({ mishnah }) => {
  const [tapped, setTapped] = useState_k(null);
  if (!mishnah.words || mishnah.words.length === 0) {
    return <div className="kh-plain">{mishnah.hebrew}</div>;
  }
  const lookupMap = {};
  mishnah.words.forEach(w => {
    const clean = w.he.replace(/[׳״.,;:]/g, '');
    lookupMap[clean] = w.en;
  });
  const tokens = mishnah.hebrew.split(/(\s+)/);
  const tappedTok = tapped !== null ? tokens[tapped] : null;
  const tappedClean = tappedTok ? tappedTok.trim().replace(/[׳״.,;:]/g, '') : null;
  const tappedEn = tappedClean ? lookupMap[tappedClean] : null;

  return (
    <div className="kh-wrap">
      <div className="kh-hebrew">
        {tokens.map((tok, i) => {
          const clean = tok.trim().replace(/[׳״.,;:]/g, '');
          if (lookupMap[clean]) {
            return (
              <span
                key={i}
                className={`kh-word ${tapped === i ? 'tapped' : ''}`}
                onClick={() => setTapped(tapped === i ? null : i)}
              >
                {tok}
              </span>
            );
          }
          return <span key={i}>{tok}</span>;
        })}
      </div>
      <div className={`kh-hint ${tappedEn ? 'has' : ''}`}>
        {tappedEn ? (
          <>
            <span className="kh-hint-he">{tappedTok}</span>
            <span className="kh-hint-arrow">→</span>
            <span className="kh-hint-en">{tappedEn}</span>
          </>
        ) : (
          <span className="kh-hint-tip">👆 Tap any coloured word to learn what it means!</span>
        )}
      </div>
    </div>
  );
};

// ============================================================
// Game selector — three cards launching the games
// ============================================================
const GameSelector = ({ onOpen }) => (
  <div className="kgs-section">
    <div className="kgs-title">Learning Games</div>
    <div className="kgs-grid">
      <button className="kgs-card" onClick={() => onOpen('match')}>
        <div className="kgs-icon">🎯</div>
        <div className="kgs-name">Word Match</div>
        <div className="kgs-desc">Match Hebrew to English</div>
        <div className="kgs-stars">★★★ <span>+3 stars</span></div>
      </button>
      <button className="kgs-card" onClick={() => onOpen('blank')}>
        <div className="kgs-icon">📝</div>
        <div className="kgs-name">Fill in the Blank</div>
        <div className="kgs-desc">Complete the verse</div>
        <div className="kgs-stars">★★ <span>+2 stars</span></div>
      </button>
      <button className="kgs-card" onClick={() => onOpen('speed')}>
        <div className="kgs-icon">⚡</div>
        <div className="kgs-name">Speed Quiz</div>
        <div className="kgs-desc">Five questions, sixty seconds</div>
        <div className="kgs-stars">★★★★ <span>+4 stars</span></div>
      </button>
    </div>
  </div>
);

// ============================================================
// Empty-game stub when the mishnah has no words for a game
// ============================================================
const EmptyGame = ({ title, onClose }) => (
  <div className="kg-backdrop" onClick={onClose}>
    <div className="kg-panel" onClick={e => e.stopPropagation()}>
      <div className="kg-head">
        <div>
          <div className="kg-eyebrow">★ {title}</div>
        </div>
        <button className="kg-close" onClick={onClose} aria-label="Close">✕</button>
      </div>
      <p className="kg-empty-msg">Not enough words available for this Mishnah yet.</p>
      <button className="kids-btn primary" onClick={onClose}>OK</button>
    </div>
  </div>
);

// ============================================================
// Word Match game — Hebrew left, shuffled English right
// ============================================================
const WordMatchGame = ({ mishnah, onClose, onComplete }) => {
  const words = (mishnah.words || []).slice(0, 6);
  const [matched, setMatched] = useState_k(new Set());
  const [selectedHe, setSelectedHe] = useState_k(null);
  const [wrong, setWrong] = useState_k(null);

  const shuffled = useMemo(() => {
    const arr = words.map((w, i) => ({ ...w, origIdx: i }));
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mishnah.num]);

  const tryMatch = (engIdx) => {
    if (selectedHe === null) return;
    const eng = shuffled[engIdx];
    if (eng.origIdx === selectedHe) {
      setMatched(m => new Set([...m, selectedHe]));
      setSelectedHe(null);
    } else {
      setWrong(engIdx);
      setTimeout(() => { setWrong(null); setSelectedHe(null); }, 600);
    }
  };

  const done = matched.size === words.length && words.length > 0;
  const handleContinue = () => { onComplete && onComplete(3); onClose(); };

  if (words.length === 0) {
    return <EmptyGame title="Word Match" onClose={onClose} />;
  }

  return (
    <div className="kg-backdrop" onClick={onClose}>
      <div className="kg-panel kg-match" onClick={e => e.stopPropagation()}>
        <div className="kg-head">
          <div>
            <div className="kg-eyebrow">★ Word Match</div>
            <div className="kg-title">Mishnah {mishnah.num}</div>
          </div>
          <button className="kg-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        {done ? (
          <div className="kg-done">
            <Confetti active={true} />
            <div className="kg-done-trophy">🏆</div>
            <div className="kg-done-title">Beautiful work!</div>
            <div className="kg-done-sub">You matched all {words.length} words. +3 stars!</div>
            <button className="kids-btn primary" onClick={handleContinue}>Continue</button>
          </div>
        ) : (
          <>
            <div className="kg-progressbar">
              <div className="kg-progressbar-fill" style={{ width: `${(matched.size / words.length) * 100}%` }} />
            </div>
            <div className="kg-progresstxt">{matched.size} / {words.length} matched</div>
            <div className="kg-grid">
              <div className="kg-col">
                <div className="kg-col-label">Hebrew</div>
                {words.map((w, i) => (
                  <button
                    key={i}
                    className={`kg-tile he ${matched.has(i) ? 'matched' : ''} ${selectedHe === i ? 'selected' : ''}`}
                    disabled={matched.has(i)}
                    onClick={() => setSelectedHe(selectedHe === i ? null : i)}
                  >
                    {w.he}
                  </button>
                ))}
              </div>
              <div className="kg-col">
                <div className="kg-col-label">English</div>
                {shuffled.map((w, i) => (
                  <button
                    key={i}
                    className={`kg-tile en ${matched.has(w.origIdx) ? 'matched' : ''} ${wrong === i ? 'wrong' : ''}`}
                    disabled={matched.has(w.origIdx)}
                    onClick={() => tryMatch(i)}
                  >
                    {w.en}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ============================================================
// Fill in the Blank — replace 1-3 words in english with inputs
// ============================================================
function buildBlankSegments(english, blanks) {
  let segments = [{ text: english, isBlank: false }];
  blanks.forEach((blank, blankIdx) => {
    const next = [];
    segments.forEach(seg => {
      if (seg.isBlank) { next.push(seg); return; }
      const regex = new RegExp(`\\b(${blank.en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b`, 'i');
      const match = seg.text.match(regex);
      if (!match) { next.push(seg); return; }
      const idx = match.index;
      const before = seg.text.slice(0, idx);
      const after = seg.text.slice(idx + match[0].length);
      if (before) next.push({ text: before, isBlank: false });
      next.push({ isBlank: true, blankIdx, answer: blank.en, he: blank.he });
      if (after) next.push({ text: after, isBlank: false });
    });
    segments = next;
  });
  return segments;
}

const FillBlankGame = ({ mishnah, onClose, onComplete }) => {
  const blanks = useMemo(() => {
    const candidates = (mishnah.words || []).filter(w =>
      /^\S+$/.test(w.en) && w.en.length > 3 && mishnah.english.toLowerCase().includes(w.en.toLowerCase())
    );
    // De-dupe by english (keep first occurrence)
    const seen = new Set();
    const unique = [];
    for (const c of candidates) {
      const key = c.en.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(c);
    }
    return unique.slice(0, 3);
  }, [mishnah]);

  const segments = useMemo(() => buildBlankSegments(mishnah.english, blanks), [mishnah, blanks]);
  const [answers, setAnswers] = useState_k(() => blanks.map(() => ''));
  const [checked, setChecked] = useState_k(false);
  const allCorrect = blanks.every((b, i) => (answers[i] || '').trim().toLowerCase() === b.en.toLowerCase());

  if (blanks.length === 0) {
    return <EmptyGame title="Fill in the Blank" onClose={onClose} />;
  }

  const handleContinue = () => { onComplete && onComplete(2); onClose(); };

  const reset = () => {
    setChecked(false);
    setAnswers(blanks.map(() => ''));
  };

  return (
    <div className="kg-backdrop" onClick={onClose}>
      <div className="kg-panel kg-blank" onClick={e => e.stopPropagation()}>
        <div className="kg-head">
          <div>
            <div className="kg-eyebrow">★ Fill in the Blank</div>
            <div className="kg-title">Mishnah {mishnah.num}</div>
          </div>
          <button className="kg-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {checked && allCorrect ? (
          <div className="kg-done">
            <Confetti active={true} />
            <div className="kg-done-trophy">🌟</div>
            <div className="kg-done-title">All correct!</div>
            <div className="kg-done-sub">You filled in all {blanks.length}. +2 stars!</div>
            <button className="kids-btn primary" onClick={handleContinue}>Continue</button>
          </div>
        ) : (
          <>
            <div className="kfb-clues">
              {blanks.map((b, i) => (
                <div key={i} className="kfb-clue">
                  <span className="kfb-clue-he">{b.he}</span>
                  <span className="kfb-clue-arrow">→</span>
                  <span className="kfb-clue-q">?</span>
                </div>
              ))}
            </div>
            <div className="kfb-sentence">
              {segments.map((seg, i) => {
                if (!seg.isBlank) return <span key={i}>{seg.text}</span>;
                const userVal = answers[seg.blankIdx] || '';
                const isCorrect = checked && userVal.trim().toLowerCase() === seg.answer.toLowerCase();
                const isWrong = checked && !isCorrect;
                return (
                  <span key={i} className={`kfb-input-wrap ${isCorrect ? 'ok' : ''} ${isWrong ? 'bad' : ''}`}>
                    <input
                      type="text"
                      className="kfb-input"
                      value={userVal}
                      placeholder="…"
                      onChange={(e) => {
                        const a = [...answers];
                        a[seg.blankIdx] = e.target.value;
                        setAnswers(a);
                      }}
                      disabled={checked && allCorrect}
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck="false"
                    />
                    {isWrong && <span className="kfb-correct">({seg.answer})</span>}
                  </span>
                );
              })}
            </div>
            <div className="kg-actions">
              {!checked && (
                <button className="kids-btn primary" onClick={() => setChecked(true)}>
                  Check answers
                </button>
              )}
              {checked && !allCorrect && (
                <button className="kids-btn primary" onClick={reset}>
                  Try again
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ============================================================
// Speed Quiz — 5 rapid-fire questions in 60 seconds
// ============================================================

// Pull up to 5 quick questions: the mishnah's main quiz first, then
// word-meaning questions generated from mishnah.words.
function generateSpeedQuestions(mishnah) {
  const out = [];
  if (mishnah.kidsQuestion && Array.isArray(mishnah.kidsQuestion.options)) {
    out.push({
      q: mishnah.kidsQuestion.q,
      options: mishnah.kidsQuestion.options.slice(),
      correct: mishnah.kidsQuestion.correct,
      kind: 'mishnah',
    });
  }
  const words = (mishnah.words || []).filter(w => w && w.he && w.en);
  const pool = words.map(w => w.en);
  const used = new Set();
  for (let i = 0; i < words.length && out.length < 5; i++) {
    const w = words[i];
    if (used.has(w.he)) continue;
    used.add(w.he);
    const distractors = pool.filter(e => e !== w.en);
    // shuffle distractors and take 2
    for (let j = distractors.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [distractors[j], distractors[k]] = [distractors[k], distractors[j]];
    }
    const opts = [w.en, ...distractors.slice(0, 2)];
    // shuffle final options
    for (let j = opts.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [opts[j], opts[k]] = [opts[k], opts[j]];
    }
    out.push({
      q: 'What does this word mean?',
      he: w.he,
      options: opts,
      correct: opts.indexOf(w.en),
      kind: 'word',
    });
  }
  return out.slice(0, 5);
}

const SpeedQuizGame = ({ mishnah, onClose, onComplete }) => {
  const questions = useMemo(() => generateSpeedQuestions(mishnah), [mishnah]);
  const total = questions.length;
  const [idx, setIdx] = useState_k(0);
  const [picked, setPicked] = useState_k(null);
  const [score, setScore] = useState_k(0);
  const [timeLeft, setTimeLeft] = useState_k(60);
  const [done, setDone] = useState_k(false);

  // Countdown timer
  useEffect(() => {
    if (done || total === 0) return;
    if (timeLeft <= 0) { setDone(true); return; }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, done, total]);

  const pick = (i) => {
    if (picked !== null || done) return;
    setPicked(i);
    const q = questions[idx];
    if (q.correct === i) setScore(s => s + 1);
    setTimeout(() => {
      if (idx + 1 >= total) {
        setDone(true);
      } else {
        setIdx(idx + 1);
        setPicked(null);
      }
    }, 700);
  };

  if (total === 0) {
    return <EmptyGame title="Speed Quiz" onClose={onClose} />;
  }

  // Star award: at least 2 right earns stars, more right earns more.
  const starsEarned = Math.min(4, Math.max(0, score >= 5 ? 4 : score >= 4 ? 4 : score >= 3 ? 3 : score >= 2 ? 2 : score >= 1 ? 1 : 0));
  const handleContinue = () => { onComplete && onComplete(starsEarned); onClose(); };

  const q = questions[idx];
  const lowTime = timeLeft <= 15;

  return (
    <div className="kg-backdrop" onClick={onClose}>
      <div className="kg-panel kg-speed" onClick={e => e.stopPropagation()}>
        <div className="kg-head">
          <div>
            <div className="kg-eyebrow">★ Speed Quiz</div>
            <div className="kg-title">Mishnah {mishnah.num}</div>
          </div>
          <button className="kg-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {done ? (
          <div className="kg-done">
            {starsEarned >= 3 && <Confetti active={true} />}
            <div className="kg-done-trophy">{starsEarned >= 4 ? '🏆' : starsEarned >= 3 ? '⭐' : '👍'}</div>
            <div className="kg-done-title">
              {starsEarned >= 4 ? 'Perfect run!' : starsEarned >= 3 ? 'Great job!' : starsEarned >= 1 ? 'Good try!' : 'Time is up!'}
            </div>
            <div className="kg-done-sub">
              {score} / {total} correct{timeLeft > 0 ? ` · ${60 - timeLeft}s` : ' · time ran out'}.
              {starsEarned > 0 && ` +${starsEarned} star${starsEarned === 1 ? '' : 's'}!`}
            </div>
            <button className="kids-btn primary" onClick={handleContinue}>Continue</button>
          </div>
        ) : (
          <>
            <div className="ksq-meta">
              <div className={`ksq-timer ${lowTime ? 'low' : ''}`}>
                ⏱ <span>{String(Math.floor(timeLeft / 60)).padStart(1, '0')}:{String(timeLeft % 60).padStart(2, '0')}</span>
              </div>
              <div className="ksq-progress-txt">Question {idx + 1} of {total}</div>
              <div className="ksq-score">★ {score}</div>
            </div>
            <div className="ksq-progress">
              <div className="ksq-progress-fill" style={{ width: `${((idx) / total) * 100}%` }} />
            </div>
            <div className="ksq-q">
              {q.he && <div className="ksq-he">{q.he}</div>}
              <div className="ksq-text">{q.q}</div>
            </div>
            <div className="ksq-options">
              {q.options.map((opt, i) => {
                let state = '';
                if (picked !== null) {
                  if (i === q.correct) state = 'correct';
                  else if (i === picked) state = 'wrong';
                }
                return (
                  <button
                    key={i}
                    className={`ksq-opt ${state}`}
                    onClick={() => pick(i)}
                    disabled={picked !== null}
                  >
                    <span className="ksq-opt-badge">{String.fromCharCode(65 + i)}</span>
                    <span className="ksq-opt-text">{opt}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ============================================================
// Completion screen — full screen at end of chapter
// ============================================================
const CompletionScreen = ({ perek, stars, mishnahCount, onContinue }) => (
  <div className="kc-screen">
    <Confetti active={true} />
    <div className="kc-card">
      <div className="kc-badge">🎓</div>
      <div className="kc-title">Chapter {perek.num} Complete!</div>
      <div className="kc-sub">{mishnahCount} mishnayot studied</div>
      <div className="kc-stats">
        <div className="kc-stat">
          <div className="kc-stat-num">{stars}</div>
          <div className="kc-stat-lbl">Stars Earned</div>
        </div>
        <div className="kc-stat">
          <div className="kc-stat-num">{mishnahCount}</div>
          <div className="kc-stat-lbl">Mishnayot Done</div>
        </div>
      </div>
      <div className="kc-chips">
        <span className="kc-chip">📚 Torah Scholar</span>
        <span className="kc-chip">🏆 Chapter Champion</span>
      </div>
      <button className="kids-btn primary kc-cta" onClick={onContinue}>
        Start Next Chapter →
      </button>
    </div>
  </div>
);

// ============================================================
// Main KidsMode component
// ============================================================
const KidsMode = ({ perek, perakim, perekIdx, setPerekIdx, mishnah, mishnahIdx, setMishnahIdx, onColoring, onParentDash }) => {
  const theme = getTheme(perek.num);
  const [picked, setPicked] = useState_k(null);
  const [stars, setStars] = useState_k(parseInt(localStorage.getItem('avot-kids-stars') || '0', 10));
  const [openGame, setOpenGame] = useState_k(null);
  const [confetti, setConfetti] = useState_k(false);
  const [starsPop, setStarsPop] = useState_k(false);
  const [completion, setCompletion] = useState_k(false);

  // Reset transient state on mishnah/chapter change
  useEffect(() => {
    setPicked(null);
    setCompletion(false);
  }, [mishnahIdx, perekIdx]);

  const awardStars = (n) => {
    setStars(prev => {
      const next = prev + n;
      localStorage.setItem('avot-kids-stars', String(next));
      return next;
    });
    setStarsPop(true);
    setTimeout(() => setStarsPop(false), 650);
  };

  const fireConfetti = () => {
    setConfetti(true);
    setTimeout(() => setConfetti(false), 3500);
  };

  const onPick = (i) => {
    if (picked !== null) return;
    setPicked(i);
    if (mishnah.kidsQuestion && i === mishnah.kidsQuestion.correct) {
      awardStars(1);
      fireConfetti();
    }
  };

  const onGameComplete = (n) => {
    awardStars(n);
    fireConfetti();
  };

  const isLastInChapter = mishnah && mishnahIdx >= perek.mishnayot.length - 1;

  const goNext = () => {
    if (isLastInChapter) {
      setCompletion(true);
      return;
    }
    setMishnahIdx(mishnahIdx + 1);
  };
  const goPrev = () => setMishnahIdx(Math.max(0, mishnahIdx - 1));

  const advanceChapter = () => {
    setCompletion(false);
    const nextPerek = perekIdx + 1;
    if (perakim && nextPerek < perakim.length) {
      setPerekIdx(nextPerek);
      setMishnahIdx(0);
    } else {
      // Wrap back to the start
      setPerekIdx(0);
      setMishnahIdx(0);
    }
  };

  if (!mishnah) {
    return (
      <div className="kids kids-v2" style={themeStyle(theme)} data-screen-label="Kids Mode">
        <div className="kp-empty-state">
          <div className="kp-empty-icon">🌱</div>
          <div className="kp-empty-title">Chapter {perek.num} is growing</div>
          <div className="kp-empty-sub">More mishnayot coming soon!</div>
        </div>
      </div>
    );
  }

  return (
    <div className="kids kids-v2" style={themeStyle(theme)} data-screen-label="Kids Mode">
      <Confetti active={confetti} />

      <div className="kids-header">
        <div className="kids-title">Avot for Kids · Chapter {perek.num}</div>
        <div className="kids-stars">
          <span className={`star ${starsPop ? 'pop' : ''}`}>★</span>
          <span className={`star-count ${starsPop ? 'pop' : ''}`}>{stars}</span>
          <button
            className="kids-iconbtn"
            onClick={onParentDash}
            aria-label="Parent dashboard"
            data-tip="Parent dashboard"
            data-tip-pos="left"
          >
            <Icon name="user" size={14} />
          </button>
        </div>
      </div>

      <AdventurePath
        mishnayot={perek.mishnayot}
        currentIdx={mishnahIdx}
        onJump={(i) => setMishnahIdx(i)}
      />

      <div className="kids-main">
        <div className="kv2-card" key={`${perekIdx}-${mishnahIdx}`}>
          <MishnahHero mishnah={mishnah} />

          <KidsHebrew mishnah={mishnah} />

          <p className="kids-story">
            {mishnah.kidsStory || "Story coming soon for this Mishnah! Until then, ask a grown-up to read the Hebrew with you and tell you what it means."}
          </p>

          <div className="kids-actions-row">
            <button className="kids-btn secondary" onClick={onColoring}>
              <Icon name="palette" size={14} /> Coloring page
            </button>
          </div>

          <GameSelector onOpen={setOpenGame} />

          {mishnah.kidsQuestion && (
            <div className="kv2-quiz">
              <div className="kv2-q-label">★ Quiz Time</div>
              <div className="kv2-q-text">{mishnah.kidsQuestion.q}</div>
              <div className="kv2-options">
                {mishnah.kidsQuestion.options.map((opt, i) => {
                  let state = '';
                  if (picked !== null) {
                    if (i === mishnah.kidsQuestion.correct) state = 'correct';
                    else if (i === picked) state = 'wrong';
                  }
                  return (
                    <button
                      key={i}
                      className={`kv2-opt ${state}`}
                      onClick={() => onPick(i)}
                      disabled={picked !== null}
                    >
                      <span className="kv2-opt-badge">{String.fromCharCode(65 + i)}</span>
                      <span className="kv2-opt-text">{opt}</span>
                    </button>
                  );
                })}
              </div>
              {picked !== null && picked === mishnah.kidsQuestion.correct && (
                <div className="kv2-feedback good">🎉 Amazing! +1 star earned!</div>
              )}
              {picked !== null && picked !== mishnah.kidsQuestion.correct && (
                <div className="kv2-feedback bad">Almost! The green answer is the right one.</div>
              )}
            </div>
          )}

          <div className="kv2-nav">
            <button className="kids-btn secondary" onClick={goPrev} disabled={mishnahIdx === 0}>
              ← Previous
            </button>
            <span className="kv2-counter">{mishnahIdx + 1} / {perek.mishnayot.length}</span>
            <button className="kids-btn primary" onClick={goNext}>
              {isLastInChapter ? 'Finish Chapter 🎓' : 'Next →'}
            </button>
          </div>
        </div>
      </div>

      {openGame === 'match' && (
        <WordMatchGame mishnah={mishnah} onClose={() => setOpenGame(null)} onComplete={onGameComplete} />
      )}
      {openGame === 'blank' && (
        <FillBlankGame mishnah={mishnah} onClose={() => setOpenGame(null)} onComplete={onGameComplete} />
      )}
      {openGame === 'speed' && (
        <SpeedQuizGame mishnah={mishnah} onClose={() => setOpenGame(null)} onComplete={onGameComplete} />
      )}

      {completion && (
        <CompletionScreen
          perek={perek}
          stars={stars}
          mishnahCount={perek.mishnayot.length}
          onContinue={advanceChapter}
        />
      )}
    </div>
  );
};

Object.assign(window, { KidsMode });

export { KidsHebrew, KidsMode, SCENE_ICONS, WordMatchGame };
