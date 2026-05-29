import React, { useState, useEffect, useCallback } from 'react';

// Kids-mode splash — shown every time KidsMode mounts.
//
// Bright, warm, bouncy: the four Pirkei Avot animals bounce in one by
// one (🦁 🦅 🦌 🐆), the Hebrew title pops up, stars burst outward.
// 2.1 seconds total. Lives inside kidsV2.jsx, not on app startup.

const ANIMALS = [
  { emoji: '🦁', label: 'Ari',    color: '#ff6b6b', delay: 0.00 },
  { emoji: '🦅', label: 'Nesher', color: '#4a90c2', delay: 0.12 },
  { emoji: '🦌', label: 'Tzvi',   color: '#5dd39e', delay: 0.24 },
  { emoji: '🐆', label: 'Namer',  color: '#ff8a3d', delay: 0.36 },
];

const STARS = ['✨','⭐','🌟','✨','⭐','🌟','✨'];

export const Splash = ({ onDone }) => {
  const [phase, setPhase] = useState(0);
  // 0 = animals bouncing in, 1 = text visible, 2 = fading out
  const done = useCallback(() => onDone?.(), [onDone]);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 550);   // text pops in
    const t2 = setTimeout(() => setPhase(2), 1700);  // fade out starts
    const t3 = setTimeout(() => done(),      2100);  // unmount
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [done]);

  return (
    <div className={`ks-shell${phase >= 2 ? ' ks-out' : ''}`} aria-hidden="true">

      {/* Floating background stars */}
      <div className="ks-stars" aria-hidden="true">
        {STARS.map((s, i) => (
          <span key={i} className="ks-star" style={{ '--i': i }}>{s}</span>
        ))}
      </div>

      <div className="ks-inner">
        {/* Bouncing animals */}
        <div className="ks-animals">
          {ANIMALS.map((a) => (
            <span
              key={a.label}
              className="ks-animal"
              style={{ animationDelay: `${a.delay}s` }}
              role="img"
              aria-label={a.label}
            >
              {a.emoji}
            </span>
          ))}
        </div>

        {/* Title */}
        <div className={`ks-title${phase >= 1 ? ' ks-text-in' : ''}`}>
          אָבוֹת
        </div>
        <div
          className={`ks-sub${phase >= 1 ? ' ks-text-in' : ''}`}
          style={{ animationDelay: '0.1s' }}
        >
          Let's learn! 🌟
        </div>
      </div>

    </div>
  );
};
