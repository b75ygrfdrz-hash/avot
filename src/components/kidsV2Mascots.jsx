import React from 'react';

// Four original mascots for Pirkei Avot 5:23:
//   Namer  (leopard) — be bold     — orange
//   Nesher (eagle)   — be light    — sky blue
//   Tzvi   (deer)    — be swift    — mint
//   Ari    (lion)    — be strong   — coral
//
// All hand-drawn SVG, no derivative imagery, friendly chibi style.

const SIZE = 80;

export const Mascots = {
  namer: ({ size = SIZE, mood = 'happy' }) => (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      {/* Body */}
      <ellipse cx="50" cy="60" rx="28" ry="22" fill="#ff9d3d" />
      {/* Spots */}
      <circle cx="38" cy="55" r="3" fill="#b85a00" opacity="0.7" />
      <circle cx="58" cy="62" rx="3" r="3" fill="#b85a00" opacity="0.7" />
      <circle cx="48" cy="70" r="2.5" fill="#b85a00" opacity="0.7" />
      <circle cx="65" cy="55" r="2.5" fill="#b85a00" opacity="0.7" />
      {/* Head */}
      <circle cx="50" cy="38" r="22" fill="#ffb567" />
      {/* Inner ears */}
      <path d="M30 26 L35 18 L42 25 Z" fill="#ff8a3d" />
      <path d="M70 26 L65 18 L58 25 Z" fill="#ff8a3d" />
      <path d="M32 24 L35 21 L40 25 Z" fill="#ffdab0" />
      <path d="M68 24 L65 21 L60 25 Z" fill="#ffdab0" />
      {/* Spots on face */}
      <circle cx="38" cy="32" r="2" fill="#b85a00" opacity="0.6" />
      <circle cx="62" cy="32" r="2" fill="#b85a00" opacity="0.6" />
      <circle cx="50" cy="28" r="1.8" fill="#b85a00" opacity="0.6" />
      {/* Eyes */}
      <circle cx="42" cy="38" r="3.5" fill="#222" />
      <circle cx="58" cy="38" r="3.5" fill="#222" />
      <circle cx="43" cy="37" r="1.3" fill="#fff" />
      <circle cx="59" cy="37" r="1.3" fill="#fff" />
      {/* Nose + mouth */}
      <ellipse cx="50" cy="44" rx="2.5" ry="2" fill="#5a2400" />
      {mood === 'sad' ? (
        <path d="M44 50 Q50 47 56 50" stroke="#5a2400" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M44 48 Q50 53 56 48" stroke="#5a2400" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      )}
    </svg>
  ),

  nesher: ({ size = SIZE, mood = 'happy' }) => (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      {/* Wings */}
      <path d="M22 50 Q10 35 18 60 Q22 65 30 60 Z" fill="#4a90c2" />
      <path d="M78 50 Q90 35 82 60 Q78 65 70 60 Z" fill="#4a90c2" />
      {/* Body */}
      <ellipse cx="50" cy="60" rx="22" ry="20" fill="#6ab1d6" />
      {/* Belly */}
      <ellipse cx="50" cy="62" rx="14" ry="14" fill="#d8eef9" />
      {/* Head */}
      <circle cx="50" cy="36" r="20" fill="#6ab1d6" />
      {/* Beak */}
      <path d="M50 40 L42 48 L55 46 Z" fill="#ffc936" />
      {/* Eyes */}
      <circle cx="42" cy="34" r="4" fill="#fff" />
      <circle cx="58" cy="34" r="4" fill="#fff" />
      <circle cx="42" cy="34" r="2.5" fill="#222" />
      <circle cx="58" cy="34" r="2.5" fill="#222" />
      <circle cx="43" cy="33" r="0.9" fill="#fff" />
      <circle cx="59" cy="33" r="0.9" fill="#fff" />
      {/* Feet */}
      <path d="M44 78 L41 84 M46 78 L46 84 M48 78 L51 84" stroke="#ffc936" strokeWidth="2" strokeLinecap="round" />
      <path d="M52 78 L49 84 M54 78 L54 84 M56 78 L59 84" stroke="#ffc936" strokeWidth="2" strokeLinecap="round" />
      {/* Crest feather */}
      <path d="M48 18 Q50 10 52 18 Z" fill="#4a90c2" />
    </svg>
  ),

  tzvi: ({ size = SIZE, mood = 'happy' }) => (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      {/* Body */}
      <ellipse cx="50" cy="62" rx="26" ry="20" fill="#7dd3a0" />
      {/* Legs */}
      <rect x="36" y="78" width="4" height="10" rx="1" fill="#5fae7e" />
      <rect x="60" y="78" width="4" height="10" rx="1" fill="#5fae7e" />
      {/* Head */}
      <ellipse cx="50" cy="38" rx="20" ry="22" fill="#9be0bb" />
      {/* Antlers */}
      <path d="M40 18 L36 8 M36 8 L32 13 M36 8 L41 6" stroke="#8b5a2b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M60 18 L64 8 M64 8 L68 13 M64 8 L59 6" stroke="#8b5a2b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Inner ears */}
      <ellipse cx="33" cy="26" rx="5" ry="8" fill="#7dd3a0" transform="rotate(-25 33 26)" />
      <ellipse cx="67" cy="26" rx="5" ry="8" fill="#7dd3a0" transform="rotate(25 67 26)" />
      <ellipse cx="33" cy="27" rx="2.5" ry="5" fill="#ffd5e3" transform="rotate(-25 33 27)" />
      <ellipse cx="67" cy="27" rx="2.5" ry="5" fill="#ffd5e3" transform="rotate(25 67 27)" />
      {/* White belly markings */}
      <circle cx="45" cy="46" r="1.8" fill="#fff" opacity="0.7" />
      <circle cx="55" cy="46" r="1.8" fill="#fff" opacity="0.7" />
      {/* Eyes */}
      <circle cx="42" cy="40" r="3.5" fill="#222" />
      <circle cx="58" cy="40" r="3.5" fill="#222" />
      <circle cx="43" cy="39" r="1.3" fill="#fff" />
      <circle cx="59" cy="39" r="1.3" fill="#fff" />
      {/* Nose */}
      <ellipse cx="50" cy="48" rx="3" ry="2" fill="#3b2410" />
      {mood === 'sad' ? (
        <path d="M44 54 Q50 50 56 54" stroke="#3b2410" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M44 52 Q50 56 56 52" stroke="#3b2410" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      )}
    </svg>
  ),

  ari: ({ size = SIZE, mood = 'happy' }) => (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      {/* Mane (back) */}
      <circle cx="50" cy="38" r="28" fill="#d97142" />
      {/* Body */}
      <ellipse cx="50" cy="64" rx="24" ry="20" fill="#ffb27a" />
      {/* Face */}
      <circle cx="50" cy="40" r="20" fill="#ffd0a8" />
      {/* Mane fluff strokes */}
      {[18, 30, 50, 70, 82].map((x, i) => (
        <circle key={i} cx={x} cy={22 + (i % 2) * 6} r="6" fill="#d97142" />
      ))}
      {[14, 86].map((x, i) => (
        <circle key={'s'+i} cx={x} cy="42" r="6" fill="#d97142" />
      ))}
      {/* Inner ears */}
      <circle cx="34" cy="28" r="5" fill="#d97142" />
      <circle cx="66" cy="28" r="5" fill="#d97142" />
      <circle cx="34" cy="29" r="2.5" fill="#ffd5e3" />
      <circle cx="66" cy="29" r="2.5" fill="#ffd5e3" />
      {/* Eyes */}
      <circle cx="42" cy="40" r="4" fill="#222" />
      <circle cx="58" cy="40" r="4" fill="#222" />
      <circle cx="43" cy="39" r="1.5" fill="#fff" />
      <circle cx="59" cy="39" r="1.5" fill="#fff" />
      {/* Nose */}
      <path d="M46 48 L54 48 L50 53 Z" fill="#5a2400" />
      {/* Mouth */}
      {mood === 'sad' ? (
        <path d="M44 58 Q50 54 56 58" stroke="#5a2400" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      ) : (
        <>
          <path d="M50 53 L50 57" stroke="#5a2400" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M50 57 Q45 60 42 56" stroke="#5a2400" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M50 57 Q55 60 58 56" stroke="#5a2400" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </>
      )}
      {/* Whiskers */}
      <line x1="32" y1="50" x2="22" y2="48" stroke="#a36" strokeWidth="1" opacity="0.5" />
      <line x1="68" y1="50" x2="78" y2="48" stroke="#a36" strokeWidth="1" opacity="0.5" />
    </svg>
  ),
};

export const MASCOT_META = {
  namer:  { name: 'Namer',  he: 'נָמֵר',  trait: 'Bold',  color: '#ff8a3d', bg: '#fff0e0', traitHe: 'עַז'   },
  nesher: { name: 'Nesher', he: 'נֶשֶׁר',  trait: 'Light', color: '#4a90c2', bg: '#dceaf2', traitHe: 'קַל'   },
  tzvi:   { name: 'Tzvi',   he: 'צְבִי',  trait: 'Swift', color: '#5dd39e', bg: '#daf5e7', traitHe: 'רָץ'   },
  ari:    { name: 'Ari',    he: 'אֲרִי', trait: 'Strong', color: '#ff6b6b', bg: '#ffe0e0', traitHe: 'גִּבּוֹר' },
};

export const Mascot = ({ which = 'ari', size = SIZE, mood = 'happy' }) => {
  const C = Mascots[which] || Mascots.ari;
  return <C size={size} mood={mood} />;
};
