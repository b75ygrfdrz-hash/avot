import React from 'react';

// Pixar-warm storybook hero illustrations for every mishnah of Perek 1.
// All scenes share the same dusk sky + atmospheric base (HeroFrame);
// each scene's foreground subject reflects its mishnah's content.

// ============================================================
// Shared star field
// ============================================================
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
const HERO_SPARKLES = [
  { x: 270, y: 170, s: 6 },
  { x: 1140, y: 180, s: 7 },
  { x: 480, y: 280, s: 5 },
];

// ============================================================
// Shared frame with sky, divine light, stars, distant mountains,
// horizon haze, and a foreground silhouette. Children render in
// the middle layer between mountains and foreground.
// ============================================================
const HeroFrame = ({ children, defsExtra = null }) => (
  <svg
    viewBox="0 0 1600 900"
    preserveAspectRatio="xMidYMid slice"
    className="hero-illust"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="hi-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#1a2548" />
        <stop offset="28%"  stopColor="#3a2848" />
        <stop offset="56%"  stopColor="#7a4d6b" />
        <stop offset="80%"  stopColor="#c8825f" />
        <stop offset="100%" stopColor="#f0a275" />
      </linearGradient>
      <radialGradient id="hi-divine" cx="0.45" cy="0" r="0.85">
        <stop offset="0%"   stopColor="#fff1c2" stopOpacity="0.95" />
        <stop offset="22%"  stopColor="#ffd479" stopOpacity="0.55" />
        <stop offset="55%"  stopColor="#f0a275" stopOpacity="0.22" />
        <stop offset="100%" stopColor="#7a4d6b" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="hi-mountain" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#3e2848" />
        <stop offset="55%"  stopColor="#1f1428" />
        <stop offset="100%" stopColor="#0a0418" />
      </linearGradient>
      <linearGradient id="hi-mountain-lit" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%"   stopColor="#f0c275" stopOpacity="0.45" />
        <stop offset="50%"  stopColor="#c8825f" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#7a4d6b" stopOpacity="0" />
      </linearGradient>
      <radialGradient id="hi-halo" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%"   stopColor="#fff1c2" stopOpacity="1" />
        <stop offset="50%"  stopColor="#ffd479" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#ffd479" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="hi-haze" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#c8825f" stopOpacity="0" />
        <stop offset="100%" stopColor="#c8825f" stopOpacity="0.35" />
      </linearGradient>
      <radialGradient id="hi-glow-pt" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%"   stopColor="#fff1c2" stopOpacity="0.95" />
        <stop offset="50%"  stopColor="#ffd479" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#ffd479" stopOpacity="0" />
      </radialGradient>
      {defsExtra}
    </defs>

    {/* Sky base */}
    <rect width="1600" height="900" fill="url(#hi-sky)" />

    {/* Divine light pouring in from above */}
    <ellipse cx="720" cy="0" rx="620" ry="720" fill="url(#hi-divine)" />

    {/* Stars */}
    {HERO_STARS.map((s, i) => (
      <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff1c2" opacity={s.o} />
    ))}
    {HERO_SPARKLES.map((s, i) => (
      <g key={i} transform={`translate(${s.x} ${s.y})`}>
        <path
          d={`M 0 -${s.s} L 1 -1 L ${s.s} 0 L 1 1 L 0 ${s.s} L -1 1 L -${s.s} 0 L -1 -1 Z`}
          fill="#fff1c2"
          opacity="0.95"
        />
      </g>
    ))}

    {/* Distant mountain silhouettes */}
    <path
      d="M 0 540 L 180 410 L 360 500 L 560 360 L 780 470 L 960 390 L 1180 460 L 1380 370 L 1600 430 L 1600 900 L 0 900 Z"
      fill="#3e2848"
      opacity="0.55"
    />
    <path
      d="M 0 640 L 200 510 L 380 600 L 580 470 L 760 580 L 980 510 L 1200 600 L 1400 510 L 1600 580 L 1600 900 L 0 900 Z"
      fill="#241830"
      opacity="0.8"
    />

    {/* Soft warm haze along the horizon */}
    <rect x="0" y="520" width="1600" height="200" fill="url(#hi-haze)" />

    {/* Scene-specific subject */}
    {children}

    {/* Foreground silhouette */}
    <path
      d="M 0 800 Q 180 762, 360 786 Q 560 810, 760 798 Q 960 786, 1160 812 Q 1360 832, 1600 800 L 1600 900 L 0 900 Z"
      fill="#0a0418"
    />
    {/* Small rocks in the foreground */}
    <ellipse cx="120" cy="822" rx="22" ry="9" fill="#1f1428" />
    <ellipse cx="1480" cy="850" rx="36" ry="12" fill="#1f1428" />
  </svg>
);

// ============================================================
// Reusable subjects
// ============================================================

// A robed sage figure with optional rim light, beard, staff, lantern.
const Sage = ({ x, y, scale = 1, rim = true, beard = true, staff = false, lantern = false, lo = { x: 16, y: -22 } }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M -16 0 L -18 -38 Q -18 -50, -8 -54 L 8 -54 Q 18 -50, 18 -38 L 16 0 Z" fill="#0f0820" />
    <circle cx="0" cy="-60" r="8" fill="#0f0820" />
    {beard && <path d="M -5 -56 Q -5 -48, 0 -45 Q 5 -48, 5 -56 Z" fill="#070210" />}
    {staff && <rect x="18" y="-44" width="3" height="60" fill="#0f0820" />}
    {rim && (
      <>
        <path d="M -18 -38 Q -18 -50, -8 -54 L -7 -56" stroke="#f0c275" strokeWidth="1.4" fill="none" opacity="0.85" strokeLinecap="round" />
        <path d="M -16 -2 L -18 -38" stroke="#c8825f" strokeWidth="1.2" fill="none" opacity="0.65" />
      </>
    )}
    {lantern && (
      <>
        <circle cx={lo.x} cy={lo.y} r="11" fill="#ffd479" opacity="0.32" />
        <circle cx={lo.x} cy={lo.y} r="5" fill="#fff1c2" />
      </>
    )}
  </g>
);

// Pillar with an ornament on top: scroll, flame, hands, scales, dove, tablet.
const Pillar = ({ x, y, h = 220, w = 64, ornament = 'flame' }) => (
  <g transform={`translate(${x} ${y})`}>
    {/* Soft glow under top */}
    <ellipse cx={w / 2} cy={-h + 4} rx={w * 1.2} ry={18} fill="#ffd479" opacity="0.3" />
    {/* Shaft */}
    <rect x="0" y={-h} width={w} height={h} fill="#2a1c34" />
    <rect x="0" y={-h} width={w * 0.5} height={h} fill="#5a3a5e" opacity="0.55" />
    {/* Capital */}
    <path d={`M ${-w * 0.15} ${-h} L ${w * 1.15} ${-h} L ${w * 1.05} ${-h - 14} L ${-w * 0.05} ${-h - 14} Z`} fill="#5a4068" />
    {/* Base */}
    <path d={`M ${-w * 0.05} 0 L ${w * 1.05} 0 L ${w * 0.95} 14 L ${w * 0.05} 14 Z`} fill="#3e2848" />
    {/* Ornament */}
    <g transform={`translate(${w / 2} ${-h - 20})`}>
      {ornament === 'flame' && (
        <>
          <path d="M 0 -14 Q -10 -2, -8 8 Q -2 14, 0 14 Q 2 14, 8 8 Q 10 -2, 0 -14 Z" fill="#ffd479" />
          <path d="M 0 -8 Q -4 0, -3 6 Q 0 10, 0 10 Q 0 10, 3 6 Q 4 0, 0 -8 Z" fill="#fff1c2" />
        </>
      )}
      {ornament === 'scroll' && (
        <g transform="translate(-16 -8)">
          <rect x="2" y="0" width="28" height="20" rx="2" fill="#fff1c2" stroke="#c8825f" strokeWidth="1.5" />
          <circle cx="2" cy="10" r="4" fill="#c8825f" />
          <circle cx="30" cy="10" r="4" fill="#c8825f" />
          <line x1="8" y1="6" x2="24" y2="6" stroke="#c8825f" strokeWidth="0.7" />
          <line x1="8" y1="10" x2="24" y2="10" stroke="#c8825f" strokeWidth="0.7" />
          <line x1="8" y1="14" x2="24" y2="14" stroke="#c8825f" strokeWidth="0.7" />
        </g>
      )}
      {ornament === 'hands' && (
        <g>
          <path d="M -14 4 Q -16 -6, -10 -10 Q -4 -12, 0 -8 Q 4 -12, 10 -10 Q 16 -6, 14 4 Q 8 12, 0 12 Q -8 12, -14 4 Z" fill="#fff1c2" />
          <circle cx="0" cy="-2" r="3" fill="#ffd479" />
        </g>
      )}
      {ornament === 'scales' && (
        <g>
          <line x1="0" y1="-12" x2="0" y2="4" stroke="#fff1c2" strokeWidth="2.5" />
          <line x1="-14" y1="-12" x2="14" y2="-12" stroke="#fff1c2" strokeWidth="2.5" />
          <ellipse cx="-14" cy="-4" rx="6" ry="2" fill="#fff1c2" />
          <ellipse cx="14" cy="-4" rx="6" ry="2" fill="#fff1c2" />
          <line x1="-14" y1="-12" x2="-14" y2="-6" stroke="#fff1c2" strokeWidth="1.5" />
          <line x1="14" y1="-12" x2="14" y2="-6" stroke="#fff1c2" strokeWidth="1.5" />
        </g>
      )}
      {ornament === 'dove' && (
        <g>
          <path d="M -12 0 Q -8 -8, 0 -8 Q 8 -8, 12 0 Q 8 6, 0 4 Q -4 8, -12 0 Z" fill="#fff1c2" />
          <path d="M -12 0 L -18 -4 L -14 2 Z" fill="#fff1c2" />
        </g>
      )}
      {ornament === 'tablet' && (
        <g>
          <path d="M -10 -10 L -10 8 Q -10 12, -6 12 L 6 12 Q 10 12, 10 8 L 10 -4 Q 10 -10, 4 -10 Z" fill="#fff1c2" stroke="#c8825f" strokeWidth="1.2" />
          <line x1="-7" y1="-4" x2="7" y2="-4" stroke="#c8825f" strokeWidth="0.7" />
          <line x1="-7" y1="0" x2="7" y2="0" stroke="#c8825f" strokeWidth="0.7" />
          <line x1="-7" y1="4" x2="7" y2="4" stroke="#c8825f" strokeWidth="0.7" />
          <line x1="-7" y1="8" x2="7" y2="8" stroke="#c8825f" strokeWidth="0.7" />
        </g>
      )}
    </g>
  </g>
);

// House with warm windows.
const House = ({ x, y, scale = 1, open = false }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    {/* Body */}
    <rect x="-58" y="-58" width="116" height="68" fill="#1f1428" />
    {/* Roof */}
    <polygon points="-66,-58 0,-104 66,-58" fill="#0f0820" />
    {/* Chimney */}
    <rect x="30" y="-92" width="12" height="20" fill="#0a0418" />
    {/* Windows */}
    <rect x="-50" y="-50" width="18" height="18" fill="#ffd479" opacity="0.92" />
    <rect x="32" y="-50" width="18" height="18" fill="#ffd479" opacity="0.92" />
    <line x1="-41" y1="-50" x2="-41" y2="-32" stroke="#0f0820" strokeWidth="1.5" />
    <line x1="-50" y1="-41" x2="-32" y2="-41" stroke="#0f0820" strokeWidth="1.5" />
    <line x1="41" y1="-50" x2="41" y2="-32" stroke="#0f0820" strokeWidth="1.5" />
    <line x1="32" y1="-41" x2="50" y2="-41" stroke="#0f0820" strokeWidth="1.5" />
    {/* Door */}
    {open ? (
      <>
        <rect x="-14" y="-34" width="28" height="44" fill="#7a4d6b" />
        <rect x="-13" y="-33" width="26" height="42" fill="#ffd479" opacity="0.8" />
        <rect x="-13" y="-33" width="26" height="6" fill="#fff1c2" opacity="0.85" />
      </>
    ) : (
      <>
        <rect x="-14" y="-34" width="28" height="44" fill="#0a0418" />
        <rect x="-12" y="-32" width="24" height="40" fill="#7a4d6b" opacity="0.55" />
        <circle cx="8" cy="-12" r="1.5" fill="#ffd479" />
      </>
    )}
    {/* Light spill on ground */}
    <ellipse cx="0" cy="20" rx="80" ry="10" fill="#ffd479" opacity={open ? 0.25 : 0.1} />
  </g>
);

// Chain figure (used in scene 1)
const ChainFigure = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M -16 0 L -18 -38 Q -18 -50, -8 -54 L 8 -54 Q 18 -50, 18 -38 L 16 0 Z" fill="#0f0820" />
    <circle cx="0" cy="-60" r="8" fill="#0f0820" />
    <path d="M -5 -56 Q -5 -48, 0 -45 Q 5 -48, 5 -56 Z" fill="#070210" />
    <path d="M -18 -38 Q -18 -50, -8 -54 L -7 -56" stroke="#f0c275" strokeWidth="1.4" fill="none" opacity="0.85" strokeLinecap="round" />
    <path d="M -16 -2 L -18 -38" stroke="#c8825f" strokeWidth="1.2" fill="none" opacity="0.65" />
    <circle cx="14" cy="-22" r="9" fill="#ffd479" opacity="0.32" />
    <circle cx="14" cy="-22" r="4.5" fill="#fff1c2" />
    <line x1="14" y1="-32" x2="14" y2="-28" stroke="#0f0820" strokeWidth="1.5" strokeLinecap="round" />
  </g>
);

// ============================================================
// Scene 1 — Moshe at Sinai, the chain of transmission
// ============================================================
const Hero1 = () => (
  <HeroFrame>
    {/* Sinai mountain */}
    <polygon points="380,800 720,200 1060,800" fill="url(#hi-mountain)" />
    <polygon points="380,800 720,200 720,800" fill="url(#hi-mountain-lit)" />
    <polygon points="700,280 720,200 740,280 730,295 710,295" fill="#5a4068" opacity="0.7" />
    {/* Light beam */}
    <polygon points="660,0 780,0 750,260 690,260" fill="url(#hi-divine)" opacity="0.65" />
    {/* Tablets halo */}
    <circle cx="720" cy="220" r="85" fill="url(#hi-halo)" />
    {/* Moshe */}
    <g transform="translate(720 280)">
      <path d="M -10 0 L -12 -28 Q -12 -36, -6 -38 L 6 -38 Q 12 -36, 12 -28 L 10 0 Z" fill="#0a0418" />
      <circle cx="0" cy="-46" r="6.5" fill="#0a0418" />
      <path d="M -10 -28 Q -18 -34, -22 -46" stroke="#0a0418" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M 10 -28 Q 18 -34, 22 -46" stroke="#0a0418" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M -12 -28 Q -12 -36, -6 -38" stroke="#f0c275" strokeWidth="1.5" fill="none" opacity="0.9" />
      <path d="M -10 0 L -12 -28" stroke="#c8825f" strokeWidth="1.3" fill="none" opacity="0.7" />
    </g>
    {/* Tablets */}
    <g transform="translate(720 210)">
      <path d="M -26 -28 L -26 28 Q -26 34, -20 34 L -5 34 Q -3 34, -3 28 L -3 -18 Q -3 -28, -14 -28 Z" fill="#fff1c2" stroke="#c8825f" strokeWidth="1.6" />
      <path d="M 3 -28 L 3 28 Q 3 34, 5 34 L 20 34 Q 26 34, 26 28 L 26 -18 Q 26 -28, 14 -28 Z" fill="#fff1c2" stroke="#c8825f" strokeWidth="1.6" />
      {[-14, -6, 2, 10, 18, 26].map((y, i) => (
        <React.Fragment key={i}>
          <line x1="-22" y1={y} x2="-7" y2={y} stroke="#c8825f" strokeWidth="0.7" opacity="0.85" />
          <line x1="7" y1={y} x2="22" y2={y} stroke="#c8825f" strokeWidth="0.7" opacity="0.85" />
        </React.Fragment>
      ))}
    </g>
    {/* Chain path + figures */}
    <path d="M 720 820 Q 850 800, 940 790 Q 1080 770, 1200 778 Q 1330 786, 1480 810" stroke="#ffd479" strokeWidth="3" fill="none" strokeDasharray="6 10" opacity="0.55" />
    <ChainFigure x={830} y={822} scale={1.0} />
    <ChainFigure x={1000} y={826} scale={0.85} />
    <ChainFigure x={1180} y={838} scale={0.7} />
    <ChainFigure x={1380} y={860} scale={0.55} />
    <ellipse cx="760" cy="830" rx="120" ry="22" fill="#ffd479" opacity="0.18" />
  </HeroFrame>
);

// ============================================================
// Scene 2 — Shimon HaTzaddik: three things the world stands on
// (Torah, Avodah/service, Gemilut Chasadim/kindness)
// ============================================================
const Hero2 = () => (
  <HeroFrame>
    {/* Soft platform shadow */}
    <ellipse cx="800" cy="810" rx="540" ry="32" fill="#0a0418" opacity="0.5" />
    <Pillar x={388} y={800} h={220} w={64} ornament="scroll" />
    <Pillar x={736} y={800} h={260} w={64} ornament="flame" />
    <Pillar x={1084} y={800} h={220} w={64} ornament="hands" />
    {/* Light particles drifting */}
    {[{ x: 460, y: 470 }, { x: 800, y: 410 }, { x: 1140, y: 470 }, { x: 620, y: 540 }, { x: 980, y: 540 }].map((p, i) => (
      <circle key={i} cx={p.x} cy={p.y} r="2" fill="#fff1c2" opacity="0.75" />
    ))}
  </HeroFrame>
);

// ============================================================
// Scene 3 — Antigonos: serve without expecting a reward.
// A figure offers a gift upward; light comes down in return,
// but the figure's hands give, they do not receive.
// ============================================================
const Hero3 = () => (
  <HeroFrame>
    {/* Light shaft on the offering */}
    <polygon points="680,0 820,0 780,640 720,640" fill="url(#hi-divine)" opacity="0.55" />
    {/* Halo around the gift */}
    <circle cx="750" cy="540" r="60" fill="url(#hi-halo)" />
    {/* Offering vessel (a small chalice glowing) */}
    <g transform="translate(750 540)">
      <path d="M -22 -16 Q -22 10, 0 14 Q 22 10, 22 -16 Z" fill="#7a4d6b" stroke="#fff1c2" strokeWidth="1.5" />
      <ellipse cx="0" cy="-16" rx="22" ry="6" fill="#fff1c2" />
      <ellipse cx="0" cy="-18" rx="14" ry="3" fill="#ffd479" />
    </g>
    {/* Sage figure with raised arms */}
    <g transform="translate(750 760)">
      <path d="M -22 0 L -26 -68 Q -26 -82, -12 -86 L 12 -86 Q 26 -82, 26 -68 L 22 0 Z" fill="#0a0418" />
      <circle cx="0" cy="-94" r="10" fill="#0a0418" />
      <path d="M -7 -88 Q -7 -78, 0 -74 Q 7 -78, 7 -88 Z" fill="#070210" />
      {/* Raised arms reaching up */}
      <path d="M -22 -64 Q -36 -90, -30 -130 Q -26 -148, -18 -158" stroke="#0a0418" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M 22 -64 Q 36 -90, 30 -130 Q 26 -148, 18 -158" stroke="#0a0418" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M -26 -68 Q -26 -82, -12 -86" stroke="#f0c275" strokeWidth="1.8" fill="none" opacity="0.9" />
    </g>
  </HeroFrame>
);

// ============================================================
// Scene 4 — Yose ben Yoezer: house as a meeting place for the wise.
// A warm house with scholars gathered at the door.
// ============================================================
const Hero4 = () => (
  <HeroFrame>
    <House x={760} y={810} scale={1.4} />
    {/* Two sages at the door */}
    <Sage x={660} y={830} scale={0.85} lantern />
    <Sage x={870} y={830} scale={0.85} />
    {/* Smoke from chimney */}
    <path d="M 800 692 Q 794 680, 802 670 Q 808 658, 800 644 Q 794 632, 802 624" stroke="#7a4d6b" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
    <path d="M 808 668 Q 818 656, 812 644" stroke="#7a4d6b" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.45" />
    {/* Trees */}
    <g transform="translate(280 820)">
      <rect x="-6" y="0" width="12" height="40" fill="#0a0418" />
      <ellipse cx="0" cy="-20" rx="32" ry="42" fill="#1f1428" />
    </g>
    <g transform="translate(1320 800)">
      <rect x="-6" y="0" width="12" height="60" fill="#0a0418" />
      <ellipse cx="0" cy="-30" rx="36" ry="48" fill="#1f1428" />
    </g>
  </HeroFrame>
);

// ============================================================
// Scene 5 — Yose ben Yochanan: open your house wide, the poor as family.
// A wide-open doorway with figures walking in.
// ============================================================
const Hero5 = () => (
  <HeroFrame>
    {/* House with door wide open */}
    <House x={760} y={810} scale={1.5} open />
    {/* Light spill */}
    <polygon points="700,820 820,820 880,1000 640,1000" fill="#ffd479" opacity="0.2" />
    {/* Figures walking toward the door */}
    <Sage x={420} y={830} scale={0.7} lantern lo={{ x: -18, y: -22 }} />
    <Sage x={520} y={840} scale={0.75} />
    <Sage x={620} y={848} scale={0.8} />
    {/* Welcoming figure inside (silhouette in doorway) */}
    <g transform="translate(760 760)">
      <path d="M -8 0 L -10 -34 Q -10 -42, -4 -44 L 4 -44 Q 10 -42, 10 -34 L 8 0 Z" fill="#0a0418" />
      <circle cx="0" cy="-50" r="6" fill="#0a0418" />
      {/* Raised arm to welcome */}
      <path d="M 10 -34 Q 20 -42, 26 -52" stroke="#0a0418" strokeWidth="3" strokeLinecap="round" fill="none" />
    </g>
  </HeroFrame>
);

// ============================================================
// Scene 6 — Yehoshua ben Perachiah: find a teacher, acquire a friend,
// judge favorably. Two figures walking together under glowing scales.
// ============================================================
const Hero6 = () => (
  <HeroFrame>
    {/* Floating scales in the sky */}
    <g transform="translate(800 380)" opacity="0.85">
      <line x1="0" y1="-30" x2="0" y2="40" stroke="#fff1c2" strokeWidth="3" />
      <line x1="-70" y1="-30" x2="70" y2="-30" stroke="#fff1c2" strokeWidth="3" />
      <ellipse cx="-70" cy="0" rx="22" ry="6" fill="#fff1c2" />
      <ellipse cx="70" cy="0" rx="22" ry="6" fill="#fff1c2" />
      <line x1="-70" y1="-30" x2="-70" y2="-6" stroke="#fff1c2" strokeWidth="1.5" />
      <line x1="70" y1="-30" x2="70" y2="-6" stroke="#fff1c2" strokeWidth="1.5" />
      <circle cx="0" cy="-40" r="6" fill="#fff1c2" />
      <circle cx="0" cy="0" r="40" fill="url(#hi-halo)" opacity="0.5" />
    </g>
    {/* Two figures walking together */}
    <Sage x={680} y={830} scale={1.0} lantern beard />
    <Sage x={840} y={830} scale={0.95} lantern={false} beard={false} />
    {/* Path of light beneath them */}
    <ellipse cx="760" cy="838" rx="220" ry="14" fill="#ffd479" opacity="0.18" />
  </HeroFrame>
);

// ============================================================
// Scene 7 — Nitai of Arbel: distance from a bad neighbor.
// A fork in the path; one way is lit, the other dark.
// ============================================================
const Hero7 = () => (
  <HeroFrame>
    {/* Forking path */}
    <path d="M 760 900 Q 760 820, 600 750 Q 480 690, 380 660" stroke="#ffd479" strokeWidth="3.5" fill="none" strokeDasharray="6 10" opacity="0.75" />
    <path d="M 760 900 Q 760 820, 920 750 Q 1040 690, 1200 660" stroke="#5a3a5e" strokeWidth="3" fill="none" strokeDasharray="2 14" opacity="0.55" />
    {/* Warm house on the lit (left) path */}
    <House x={300} y={700} scale={0.95} />
    {/* Sinister tilted shack on the dark (right) path */}
    <g transform="translate(1240 680) rotate(-4)">
      <rect x="-50" y="-44" width="100" height="54" fill="#0f0820" />
      <polygon points="-58,-44 0,-80 58,-44" fill="#0a0418" />
      <rect x="-12" y="-22" width="24" height="32" fill="#1a0e2e" />
      <rect x="-30" y="-36" width="14" height="14" fill="#5a3a5e" opacity="0.7" />
    </g>
    {/* Figure standing at the fork */}
    <Sage x={760} y={870} scale={1.05} staff />
  </HeroFrame>
);

// ============================================================
// Scene 8 — Yehudah ben Tabbai: be a judge. Scales in balance.
// ============================================================
const Hero8 = () => (
  <HeroFrame>
    {/* Judge's seat */}
    <g transform="translate(760 810)">
      <rect x="-46" y="-20" width="92" height="20" fill="#3e2848" />
      <rect x="-50" y="0" width="100" height="12" fill="#2a1c34" />
    </g>
    {/* Sage on the seat */}
    <Sage x={760} y={794} scale={1.0} beard staff />
    {/* Large balanced scales above */}
    <g transform="translate(760 470)">
      <line x1="0" y1="-60" x2="0" y2="40" stroke="#fff1c2" strokeWidth="4" />
      <line x1="-110" y1="-60" x2="110" y2="-60" stroke="#fff1c2" strokeWidth="4" />
      <ellipse cx="-110" cy="-20" rx="32" ry="8" fill="#fff1c2" />
      <ellipse cx="110" cy="-20" rx="32" ry="8" fill="#fff1c2" />
      <line x1="-110" y1="-60" x2="-110" y2="-28" stroke="#fff1c2" strokeWidth="2" />
      <line x1="110" y1="-60" x2="110" y2="-28" stroke="#fff1c2" strokeWidth="2" />
      <circle cx="0" cy="-70" r="9" fill="#fff1c2" />
      <circle cx="0" cy="-30" r="70" fill="url(#hi-halo)" opacity="0.4" />
    </g>
    {/* Two small witness figures */}
    <Sage x={500} y={840} scale={0.6} beard={false} />
    <Sage x={1020} y={840} scale={0.6} beard={false} />
  </HeroFrame>
);

// ============================================================
// Scene 9 — Shimon ben Shatach: examine witnesses carefully.
// A sage with a questioning gesture, light-beam revealing truth.
// ============================================================
const Hero9 = () => (
  <HeroFrame>
    {/* Beam of light revealing */}
    <polygon points="600,200 760,200 920,820 440,820" fill="url(#hi-divine)" opacity="0.35" />
    {/* Lit halo on a small floating glyph (truth) */}
    <circle cx="680" cy="380" r="38" fill="url(#hi-halo)" opacity="0.7" />
    <g transform="translate(680 380)">
      <path d="M -16 -12 L 16 -12 L 16 12 L -16 12 Z" fill="#fff1c2" stroke="#c8825f" strokeWidth="1.4" />
      <line x1="-10" y1="-4" x2="10" y2="-4" stroke="#c8825f" strokeWidth="0.8" />
      <line x1="-10" y1="4" x2="10" y2="4" stroke="#c8825f" strokeWidth="0.8" />
    </g>
    {/* Sage with raised hand (questioning gesture) */}
    <g transform="translate(560 800)">
      <path d="M -22 0 L -26 -64 Q -26 -78, -12 -82 L 12 -82 Q 26 -78, 26 -64 L 22 0 Z" fill="#0a0418" />
      <circle cx="0" cy="-92" r="10" fill="#0a0418" />
      <path d="M -7 -86 Q -7 -76, 0 -72 Q 7 -76, 7 -86 Z" fill="#070210" />
      {/* Pointing arm */}
      <path d="M 22 -56 Q 60 -70, 96 -90" stroke="#0a0418" strokeWidth="6" strokeLinecap="round" fill="none" />
      <circle cx="98" cy="-92" r="5" fill="#0a0418" />
      <path d="M -26 -64 Q -26 -78, -12 -82" stroke="#f0c275" strokeWidth="1.6" fill="none" opacity="0.9" />
    </g>
    {/* Witnesses */}
    <Sage x={960} y={840} scale={0.65} beard={false} />
    <Sage x={1080} y={840} scale={0.65} beard={false} />
  </HeroFrame>
);

// ============================================================
// Scene 10 — Shemaiah: love work.
// A craftsman at an anvil with golden sparks.
// ============================================================
const Hero10 = () => (
  <HeroFrame>
    {/* Forge / anvil base */}
    <g transform="translate(800 800)">
      <rect x="-50" y="-10" width="100" height="20" fill="#2a1c34" />
      <path d="M -60 -10 L -32 -42 L 32 -42 L 60 -10 Z" fill="#3e2848" />
      <rect x="-22" y="-58" width="44" height="20" rx="3" fill="#5a4068" />
      {/* Glow on top of anvil */}
      <ellipse cx="0" cy="-58" rx="18" ry="5" fill="#ffd479" opacity="0.7" />
      <ellipse cx="0" cy="-58" rx="8" ry="2" fill="#fff1c2" />
    </g>
    {/* Sparks */}
    {[{ x: 770, y: 720 }, { x: 820, y: 700 }, { x: 850, y: 740 }, { x: 790, y: 690 }].map((p, i) => (
      <g key={i}>
        <circle cx={p.x} cy={p.y} r="3" fill="#ffd479" />
        <circle cx={p.x} cy={p.y} r="6" fill="#ffd479" opacity="0.4" />
      </g>
    ))}
    {/* Craftsman with hammer */}
    <g transform="translate(680 800)">
      <path d="M -22 0 L -26 -68 Q -26 -82, -12 -86 L 12 -86 Q 26 -82, 26 -68 L 22 0 Z" fill="#0a0418" />
      <circle cx="0" cy="-94" r="10" fill="#0a0418" />
      <path d="M -7 -88 Q -7 -78, 0 -74 Q 7 -78, 7 -88 Z" fill="#070210" />
      {/* Arm swinging hammer */}
      <path d="M 22 -68 Q 60 -52, 90 -40" stroke="#0a0418" strokeWidth="6" strokeLinecap="round" fill="none" />
      <rect x="86" y="-50" width="18" height="20" rx="2" fill="#0a0418" />
      <rect x="92" y="-46" width="6" height="40" fill="#0a0418" />
    </g>
  </HeroFrame>
);

// ============================================================
// Scene 11 — Avtalyon: be careful with your words.
// A sage with words/letters drifting up like stars.
// ============================================================
const Hero11 = () => (
  <HeroFrame>
    {/* Floating Hebrew letters */}
    {[
      { x: 800, y: 580, c: 'ת' }, { x: 740, y: 510, c: 'ו' }, { x: 860, y: 490, c: 'ר' },
      { x: 700, y: 420, c: 'ה' }, { x: 880, y: 400, c: 'ש' },
      { x: 760, y: 330, c: 'מ' }, { x: 840, y: 310, c: 'ל' },
      { x: 800, y: 230, c: 'ם' },
    ].map((p, i) => (
      <g key={i}>
        <circle cx={p.x} cy={p.y} r="18" fill="url(#hi-halo)" opacity="0.7" />
        <text
          x={p.x}
          y={p.y + 6}
          textAnchor="middle"
          fontFamily="serif"
          fontSize="22"
          fill="#fff1c2"
          opacity={1 - i * 0.05}
        >
          {p.c}
        </text>
      </g>
    ))}
    {/* Sage with hand near mouth */}
    <g transform="translate(800 800)">
      <path d="M -22 0 L -26 -64 Q -26 -78, -12 -82 L 12 -82 Q 26 -78, 26 -64 L 22 0 Z" fill="#0a0418" />
      <circle cx="0" cy="-94" r="11" fill="#0a0418" />
      <path d="M -7 -88 Q -7 -76, 0 -72 Q 7 -76, 7 -88 Z" fill="#070210" />
      {/* Hand to mouth */}
      <path d="M -26 -64 Q -34 -76, -22 -94" stroke="#0a0418" strokeWidth="6" strokeLinecap="round" fill="none" />
      <circle cx="-18" cy="-96" r="5" fill="#0a0418" />
      <path d="M -26 -64 Q -26 -78, -12 -82" stroke="#f0c275" strokeWidth="1.6" fill="none" opacity="0.9" />
    </g>
  </HeroFrame>
);

// ============================================================
// Scene 12 — Hillel: love peace, pursue peace. Two friends and a dove.
// ============================================================
const Hero12 = () => (
  <HeroFrame>
    {/* Dove flying between them with olive branch */}
    <g transform="translate(800 460)">
      <circle cx="0" cy="0" r="50" fill="url(#hi-halo)" opacity="0.6" />
      <g>
        <path d="M -22 0 Q -14 -14, 0 -14 Q 14 -14, 22 0 Q 14 8, 0 6 Q -8 12, -22 0 Z" fill="#fff1c2" />
        <path d="M -22 0 L -30 -6 L -26 4 Z" fill="#fff1c2" />
        <circle cx="-18" cy="-4" r="1.5" fill="#1a0e2e" />
        {/* Olive branch */}
        <path d="M 16 0 Q 30 -2, 40 -10" stroke="#5aaa48" strokeWidth="2" fill="none" />
        <ellipse cx="34" cy="-6" rx="4" ry="2" fill="#6aa56a" />
        <ellipse cx="38" cy="-8" rx="3" ry="1.5" fill="#6aa56a" />
      </g>
    </g>
    {/* Olive trees */}
    <g transform="translate(280 800)">
      <rect x="-6" y="0" width="12" height="46" fill="#2a1c34" />
      <ellipse cx="0" cy="-24" rx="32" ry="44" fill="#1f1428" />
      <circle cx="-8" cy="-30" r="3" fill="#6aa56a" />
      <circle cx="6" cy="-36" r="3" fill="#6aa56a" />
      <circle cx="-2" cy="-14" r="3" fill="#6aa56a" />
    </g>
    <g transform="translate(1320 800)">
      <rect x="-6" y="0" width="12" height="46" fill="#2a1c34" />
      <ellipse cx="0" cy="-24" rx="32" ry="44" fill="#1f1428" />
      <circle cx="-6" cy="-32" r="3" fill="#6aa56a" />
      <circle cx="8" cy="-22" r="3" fill="#6aa56a" />
    </g>
    {/* Two figures meeting */}
    <Sage x={640} y={830} scale={1.05} beard />
    <Sage x={960} y={830} scale={1.05} beard={false} />
    {/* Their inner hands meeting */}
    <line x1="660" y1="780" x2="940" y2="780" stroke="#fff1c2" strokeWidth="2" strokeDasharray="2 3" opacity="0.5" />
  </HeroFrame>
);

// ============================================================
// Scene 13 — Hillel: chasing a name loses the name.
// A figure reaching for a falling star.
// ============================================================
const Hero13 = () => (
  <HeroFrame>
    {/* Falling star with trail */}
    <g>
      <path d="M 1200 220 Q 1100 320, 1000 420 Q 920 500, 840 580" stroke="#fff1c2" strokeWidth="3" fill="none" opacity="0.7" />
      <path d="M 1180 240 Q 1090 340, 990 440" stroke="#ffd479" strokeWidth="2" fill="none" opacity="0.5" />
      {/* Star itself */}
      <circle cx="840" cy="580" r="14" fill="#fff1c2" />
      <circle cx="840" cy="580" r="32" fill="url(#hi-halo)" opacity="0.7" />
      {/* Sparkles around */}
      <circle cx="820" cy="560" r="2" fill="#fff1c2" />
      <circle cx="860" cy="565" r="2" fill="#fff1c2" />
    </g>
    {/* Hill with figure reaching up */}
    <polygon points="500,820 760,640 1020,820" fill="url(#hi-mountain)" />
    <polygon points="500,820 760,640 760,820" fill="url(#hi-mountain-lit)" />
    <g transform="translate(760 660)">
      <path d="M -10 0 L -12 -28 Q -12 -36, -6 -38 L 6 -38 Q 12 -36, 12 -28 L 10 0 Z" fill="#0a0418" />
      <circle cx="0" cy="-46" r="6.5" fill="#0a0418" />
      {/* Reaching arm up-right toward the star */}
      <path d="M 12 -28 Q 30 -50, 60 -70" stroke="#0a0418" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M -12 -28 Q -12 -36, -6 -38" stroke="#f0c275" strokeWidth="1.5" fill="none" opacity="0.9" />
    </g>
  </HeroFrame>
);

// ============================================================
// Scene 14 — Hillel: if not now, when? Hourglass, figure stepping forward.
// ============================================================
const Hero14 = () => (
  <HeroFrame>
    {/* Hourglass */}
    <g transform="translate(560 760)">
      {/* Top frame */}
      <rect x="-40" y="-100" width="80" height="6" fill="#5a4068" />
      <rect x="-40" y="-4" width="80" height="6" fill="#5a4068" />
      <line x1="-36" y1="-94" x2="-36" y2="-4" stroke="#5a4068" strokeWidth="3" />
      <line x1="36" y1="-94" x2="36" y2="-4" stroke="#5a4068" strokeWidth="3" />
      {/* Glass shape */}
      <path d="M -32 -94 L 32 -94 L 0 -50 L 32 -4 L -32 -4 L 0 -50 Z" fill="#1f1428" stroke="#fff1c2" strokeWidth="1.5" />
      {/* Sand top */}
      <path d="M -28 -90 L 28 -90 L 0 -52 Z" fill="#ffd479" />
      {/* Sand bottom (small pile) */}
      <path d="M -16 -8 Q -14 -22, 0 -24 Q 14 -22, 16 -8 Z" fill="#ffd479" />
      {/* Falling stream */}
      <rect x="-1.5" y="-50" width="3" height="36" fill="#ffd479" />
      <circle cx="0" cy="-32" r="3" fill="#fff1c2" />
    </g>
    {/* Figure stepping forward (away from hourglass) */}
    <g transform="translate(960 800)">
      {/* Body */}
      <path d="M -22 0 L -26 -68 Q -26 -82, -12 -86 L 12 -86 Q 26 -82, 26 -68 L 22 0 Z" fill="#0a0418" />
      <circle cx="0" cy="-94" r="10" fill="#0a0418" />
      <path d="M -7 -88 Q -7 -76, 0 -72 Q 7 -76, 7 -88 Z" fill="#070210" />
      {/* Forward stride leg */}
      <path d="M 14 0 Q 32 18, 48 24" stroke="#0a0418" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M -26 -68 Q -26 -82, -12 -86" stroke="#f0c275" strokeWidth="1.6" fill="none" opacity="0.9" />
    </g>
    {/* Glow under the moving figure */}
    <ellipse cx="990" cy="826" rx="80" ry="10" fill="#ffd479" opacity="0.25" />
  </HeroFrame>
);

// ============================================================
// Scene 15 — Shammai: say little, do much. Figure carrying a load.
// ============================================================
const Hero15 = () => (
  <HeroFrame>
    {/* House in background */}
    <House x={1180} y={810} scale={1.1} />
    {/* Working figure carrying stack of books/load */}
    <g transform="translate(680 800)">
      {/* Body, leaning forward */}
      <path d="M -22 0 L -22 -64 Q -20 -78, -8 -82 L 14 -82 Q 26 -78, 22 -64 L 22 0 Z" fill="#0a0418" />
      <circle cx="0" cy="-90" r="10" fill="#0a0418" />
      {/* Stack of books being carried */}
      <g transform="translate(0 -100)">
        <rect x="-26" y="-30" width="52" height="10" fill="#7a4d6b" stroke="#fff1c2" strokeWidth="0.8" />
        <rect x="-28" y="-22" width="56" height="10" fill="#5a3a5e" stroke="#fff1c2" strokeWidth="0.8" />
        <rect x="-24" y="-14" width="48" height="10" fill="#3e2848" stroke="#fff1c2" strokeWidth="0.8" />
        <ellipse cx="0" cy="-30" rx="28" ry="3" fill="#fff1c2" opacity="0.6" />
      </g>
      {/* Arms holding stack */}
      <path d="M -22 -64 L -28 -100" stroke="#0a0418" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M 22 -64 L 28 -100" stroke="#0a0418" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M -22 -64 Q -22 -78, -8 -82" stroke="#f0c275" strokeWidth="1.6" fill="none" opacity="0.9" />
    </g>
    {/* Path */}
    <path d="M 680 840 Q 880 830, 1080 820 Q 1180 815, 1200 810" stroke="#ffd479" strokeWidth="3" fill="none" strokeDasharray="6 10" opacity="0.55" />
  </HeroFrame>
);

// ============================================================
// Scene 16 — Rabban Gamliel: make yourself a teacher.
// A larger sage and a smaller student side by side.
// ============================================================
const Hero16 = () => (
  <HeroFrame>
    {/* Soft glow around them */}
    <circle cx="800" cy="780" r="180" fill="url(#hi-halo)" opacity="0.5" />
    {/* Tablet / book between them */}
    <g transform="translate(800 700)">
      <rect x="-22" y="-16" width="44" height="32" rx="2" fill="#fff1c2" stroke="#c8825f" strokeWidth="1.4" />
      <line x1="-16" y1="-8" x2="16" y2="-8" stroke="#c8825f" strokeWidth="0.7" />
      <line x1="-16" y1="-2" x2="16" y2="-2" stroke="#c8825f" strokeWidth="0.7" />
      <line x1="-16" y1="4" x2="16" y2="4" stroke="#c8825f" strokeWidth="0.7" />
      <line x1="-16" y1="10" x2="16" y2="10" stroke="#c8825f" strokeWidth="0.7" />
    </g>
    {/* Teacher (larger, with staff and beard) */}
    <Sage x={680} y={830} scale={1.15} staff beard />
    {/* Student (smaller, no beard, looking at teacher) */}
    <Sage x={900} y={840} scale={0.85} beard={false} />
  </HeroFrame>
);

// ============================================================
// Scene 17 — Shimon (his son): silence. A quiet figure under stars.
// ============================================================
const Hero17 = () => (
  <HeroFrame>
    {/* Extra stars and constellation */}
    <g opacity="0.85">
      <circle cx="600" cy="220" r="2" fill="#fff1c2" />
      <circle cx="700" cy="180" r="2.5" fill="#fff1c2" />
      <circle cx="800" cy="240" r="2" fill="#fff1c2" />
      <circle cx="900" cy="180" r="2.5" fill="#fff1c2" />
      <circle cx="1000" cy="220" r="2" fill="#fff1c2" />
      <path d="M 600 220 L 700 180 L 800 240 L 900 180 L 1000 220" stroke="#fff1c2" strokeWidth="0.5" fill="none" opacity="0.4" />
    </g>
    {/* Single peaceful sage looking up */}
    <g transform="translate(800 800)">
      <path d="M -22 0 L -26 -64 Q -26 -78, -12 -82 L 12 -82 Q 26 -78, 26 -64 L 22 0 Z" fill="#0a0418" />
      <circle cx="0" cy="-94" r="11" fill="#0a0418" />
      <path d="M -7 -88 Q -7 -76, 0 -72 Q 7 -76, 7 -88 Z" fill="#070210" />
      {/* Finger to lips */}
      <path d="M -26 -64 Q -36 -82, -16 -98" stroke="#0a0418" strokeWidth="5" strokeLinecap="round" fill="none" />
      <circle cx="-12" cy="-100" r="4" fill="#0a0418" />
      {/* Rim light */}
      <path d="M -26 -64 Q -26 -78, -12 -82" stroke="#f0c275" strokeWidth="1.8" fill="none" opacity="0.9" />
      <path d="M -22 -2 L -26 -64" stroke="#c8825f" strokeWidth="1.4" fill="none" opacity="0.6" />
    </g>
    {/* Soft halo around the head */}
    <circle cx="800" cy="706" r="60" fill="url(#hi-halo)" opacity="0.35" />
  </HeroFrame>
);

// ============================================================
// Scene 18 — Rabban Shimon ben Gamliel: world endures on justice,
// truth, peace. Three pillars supporting a glowing world.
// ============================================================
const Hero18 = () => (
  <HeroFrame>
    {/* Glowing world above the three pillars */}
    <g transform="translate(800 360)">
      <circle cx="0" cy="0" r="90" fill="url(#hi-halo)" opacity="0.9" />
      <circle cx="0" cy="0" r="60" fill="#ffd479" />
      <circle cx="0" cy="0" r="60" fill="url(#hi-mountain-lit)" />
      {/* Stylized continents */}
      <path d="M -36 -20 Q -20 -32, 0 -22 Q 14 -10, 28 -20 Q 36 -8, 26 4 Q 14 14, -2 8 Q -22 14, -36 -20 Z" fill="#5aaa48" opacity="0.85" />
      <path d="M -20 20 Q -6 14, 8 22 Q 18 30, 6 36 Q -8 36, -20 20 Z" fill="#5aaa48" opacity="0.7" />
    </g>
    {/* Soft platform shadow */}
    <ellipse cx="800" cy="820" rx="540" ry="28" fill="#0a0418" opacity="0.5" />
    {/* Three pillars holding the world up */}
    <Pillar x={448} y={810} h={200} w={56} ornament="scales" />
    <Pillar x={772} y={810} h={200} w={56} ornament="tablet" />
    <Pillar x={1096} y={810} h={200} w={56} ornament="dove" />
    {/* Light particles drifting up */}
    {[{ x: 500, y: 540 }, { x: 800, y: 560 }, { x: 1100, y: 540 }, { x: 660, y: 600 }, { x: 940, y: 600 }].map((p, i) => (
      <circle key={i} cx={p.x} cy={p.y} r="2" fill="#fff1c2" opacity="0.8" />
    ))}
  </HeroFrame>
);

// ============================================================
// Lookup
// ============================================================
const HEROES = {
  1: Hero1, 2: Hero2, 3: Hero3, 4: Hero4, 5: Hero5, 6: Hero6,
  7: Hero7, 8: Hero8, 9: Hero9, 10: Hero10, 11: Hero11, 12: Hero12,
  13: Hero13, 14: Hero14, 15: Hero15, 16: Hero16, 17: Hero17, 18: Hero18,
};

export function getHeroFor(mishnahNum) {
  return HEROES[mishnahNum] || null;
}
