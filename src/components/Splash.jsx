import React, { useState, useEffect, useCallback } from 'react';

// Torah-themed opening splash. Shows every app load for ~2.2 seconds.
//
// Design: deep dark parchment background, a self-drawing 7-branched
// menorah (stroke-dasharray animation, like a scribe drawing it in
// gold ink), then the Hebrew title and English subtitle fade up.
// No mascots, no cartoons — dignified and distinctly Jewish.

// SVG paths for the menorah, drawn in sequence (bottom to top).
// ViewBox: 0 0 140 175
const MENORAH_PATHS = [
  'M 12 163 H 128',                            // bottom base
  'M 28 156 H 112',                            // mid base
  'M 44 148 H 96',                             // top base platform
  'M 70 148 V 20',                             // center stem (shamash)
  'M 70 128 C 68 116 58 113 58 20',            // inner-left branch
  'M 70 128 C 72 116 82 113 82 20',            // inner-right branch
  'M 70 113 C 67 98  44  95 44 20',            // mid-left branch
  'M 70 113 C 73 98  96  95 96 20',            // mid-right branch
  'M 70  98 C 65 82  28  79 28 20',            // outer-left branch
  'M 70  98 C 75 82 112  79 112 20',           // outer-right branch
];

// x-positions of the 7 candle flames (matching branch tops + shamash)
const FLAME_X = [28, 44, 58, 70, 82, 96, 112];

export const Splash = ({ onDone }) => {
  const [phase, setPhase] = useState(0);
  // 0 = menorah drawing, 1 = text visible, 2 = fading out
  const done = useCallback(() => onDone?.(), [onDone]);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1000);  // text appears
    const t2 = setTimeout(() => setPhase(2), 1900);  // fade out
    const t3 = setTimeout(() => done(),      2350);  // unmount
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [done]);

  return (
    <div className={`splash-shell${phase >= 2 ? ' splash-out' : ''}`} aria-hidden="true">
      <div className="splash-inner">

        {/* Self-drawing menorah */}
        <svg
          className="splash-menorah"
          viewBox="0 0 140 175"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {MENORAH_PATHS.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke="#d4a843"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="splash-m-path"
              style={{ animationDelay: `${i * 0.078}s` }}
            />
          ))}
          {/* Flames — scale up after paths finish drawing */}
          {FLAME_X.map((cx, i) => (
            <ellipse
              key={`fl${i}`}
              cx={cx} cy={13} rx={3.5} ry={5.5}
              fill="#f5d878"
              className="splash-flame"
              style={{ animationDelay: `${0.82 + i * 0.04}s` }}
            />
          ))}
        </svg>

        {/* Title block fades up once menorah is done */}
        <div className={`splash-title${phase >= 1 ? ' splash-text-in' : ''}`}>
          אָבוֹת
        </div>
        <div
          className={`splash-subtitle${phase >= 1 ? ' splash-text-in' : ''}`}
          style={{ animationDelay: '0.12s' }}
        >
          פִּרְקֵי אָבוֹת
        </div>
        <div
          className={`splash-eng${phase >= 1 ? ' splash-text-in' : ''}`}
          style={{ animationDelay: '0.22s' }}
        >
          Ethics of the Fathers
        </div>

      </div>
    </div>
  );
};
