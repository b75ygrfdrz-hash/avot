import React from 'react';

// Four mascots for Pirkei Avot 5:23. Using emoji for instant
// recognition as the actual animals (no chibi abstraction), wrapped
// in a styled colored circle so they feel intentional.

const EMOJI = {
  namer:  '🐆',  // leopard
  nesher: '🦅',  // eagle
  tzvi:   '🦌',  // deer
  ari:    '🦁',  // lion
};

export const MASCOT_META = {
  namer:  { name: 'Namer',  he: 'נָמֵר',  trait: 'Bold',   color: '#ff8a3d', bg: '#fff0e0', traitHe: 'עַז'   },
  nesher: { name: 'Nesher', he: 'נֶשֶׁר',  trait: 'Light',  color: '#4a90c2', bg: '#dceaf2', traitHe: 'קַל'   },
  tzvi:   { name: 'Tzvi',   he: 'צְבִי',  trait: 'Swift',  color: '#5dd39e', bg: '#daf5e7', traitHe: 'רָץ'   },
  ari:    { name: 'Ari',    he: 'אֲרִי', trait: 'Strong', color: '#ff6b6b', bg: '#ffe0e0', traitHe: 'גִּבּוֹר' },
};

// mood: 'idle' | 'happy' | 'correct' | 'wrong' | 'combo' | 'perfect' | 'sad'
// 'happy' and 'idle' are the same; 'sad' maps to 'wrong' (backwards compat).
export const Mascot = ({ which = 'ari', size = 80, mood = 'idle' }) => {
  const emoji = EMOJI[which] || EMOJI.ari;
  const fontSize = Math.round(size * 0.78);
  // Normalise legacy mood values
  const normalised = mood === 'sad' ? 'wrong' : mood === 'happy' ? 'idle' : mood;
  return (
    <span
      className={`kv2-emoji-mascot kv2-mascot-${normalised}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        fontSize: fontSize,
        lineHeight: 1,
      }}
      role="img"
      aria-label={MASCOT_META[which]?.name || which}
    >
      {emoji}
    </span>
  );
};

// Old export shape kept for any code importing Mascots.X directly
export const Mascots = {
  namer:  (props) => <Mascot which="namer"  {...props} />,
  nesher: (props) => <Mascot which="nesher" {...props} />,
  tzvi:   (props) => <Mascot which="tzvi"   {...props} />,
  ari:    (props) => <Mascot which="ari"    {...props} />,
};
