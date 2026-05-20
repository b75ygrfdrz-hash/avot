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

// Kids mode: simplified, illustrated, gamified


const SCENE_ICONS = {
  1: "📜",  // Mountain/Torah
  2: "🏛️",  // Three pillars
  3: "❤️",  // Love/service
  4: "🏠",  // Home / vaad
  5: "🤝",  // Welcoming
  6: "👫",  // Friendship
  7: "🛡️",  // Distance from bad
  8: "⚖️",  // Justice
  9: "🔍",  // Investigate
  10: "🧰", // Work
  11: "💬", // Words
  12: "🕊️", // Peace
  13: "🤲", // Humility
  14: "⏰", // Now
  15: "📚", // Study
  16: "👨‍🏫", // Teacher
  17: "🤐", // Silence
  18: "⚖️", // Justice/truth/peace
};

// Tap a Hebrew word in kids mode to hear translation
const KidsHebrew = ({ mishnah }) => {
  const [tapped, setTapped] = useState_k(null);
  if (!mishnah.words || mishnah.words.length === 0) {
    return <div className="kids-hebrew">{mishnah.hebrew}</div>;
  }
  const lookupMap = {};
  mishnah.words.forEach(w => {
    const clean = w.he.replace(/[׳״.,;:]/g, '');
    lookupMap[clean] = w.en;
  });
  const tokens = mishnah.hebrew.split(/(\s+)/);
  return (
    <div>
      <div className="kids-hebrew">
        {tokens.map((tok, i) => {
          const clean = tok.trim().replace(/[׳״.,;:]/g, '');
          if (lookupMap[clean]) {
            return (
              <span key={i} className={`kids-word ${tapped === i ? 'tapped' : ''}`}
                onClick={() => setTapped(tapped === i ? null : i)}>
                {tok}
              </span>
            );
          }
          return tok;
        })}
      </div>
      <div className="kids-word-hint">
        {tapped !== null && lookupMap[tokens[tapped].trim().replace(/[׳״.,;:]/g, '')] ? (
          <>
            <span className="kids-word-he">{tokens[tapped]}</span>
            <span className="kids-word-arrow">→</span>
            <span className="kids-word-en">{lookupMap[tokens[tapped].trim().replace(/[׳״.,;:]/g, '')]}</span>
          </>
        ) : (
          <span className="kids-word-tip">👆 Tap any word to learn what it means!</span>
        )}
      </div>
    </div>
  );
};

// Word-matching mini-game
const WordMatchGame = ({ mishnah, onClose }) => {
  const words = (mishnah.words || []).slice(0, 6);
  const [matched, setMatched] = useState_k(new Set());
  const [selectedHe, setSelectedHe] = useState_k(null);
  const [wrong, setWrong] = useState_k(null);

  // shuffled english order
  const [shuffled] = useState_k(() => {
    const arr = words.map((w, i) => ({ ...w, origIdx: i }));
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

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

  if (words.length === 0) {
    return (
      <div className="modal-back" onClick={onClose}>
        <div className="game-wrap" onClick={e => e.stopPropagation()}>
          <div className="memorize-eyebrow">Word Match Game</div>
          <p style={{margin: '20px 0', color: 'var(--muted)'}}>No words available yet for this Mishnah.</p>
          <button className="kids-btn" onClick={onClose}>OK</button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-back" onClick={onClose}>
      <div className="game-wrap" onClick={e => e.stopPropagation()}>
        <div className="game-head">
          <div>
            <div className="memorize-eyebrow">★ Word Match Game</div>
            <div className="memorize-title" style={{fontStyle:'normal', fontFamily:'var(--serif)', fontSize: '20px', whiteSpace: 'nowrap'}}>
              Mishnah {mishnah.num} · Match the words
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} style={{color:'var(--ink)'}}><Icon name="close" /></button>
        </div>
        {done ? (
          <div className="game-done">
            <div className="game-trophy">🏆</div>
            <div className="game-done-title">Beautiful work!</div>
            <div className="game-done-sub">You matched all {words.length} words. +3 stars!</div>
            <button className="kids-btn" onClick={onClose}>Continue</button>
          </div>
        ) : (
          <>
            <div className="game-progress">{matched.size} / {words.length} matched</div>
            <div className="game-grid">
              <div className="game-col">
                <div className="game-col-label">Hebrew</div>
                {words.map((w, i) => (
                  <button key={i}
                    className={`game-tile he ${matched.has(i) ? 'matched' : ''} ${selectedHe === i ? 'selected' : ''}`}
                    disabled={matched.has(i)}
                    onClick={() => setSelectedHe(selectedHe === i ? null : i)}>
                    {w.he}
                  </button>
                ))}
              </div>
              <div className="game-col">
                <div className="game-col-label">English</div>
                {shuffled.map((w, i) => (
                  <button key={i}
                    className={`game-tile en ${matched.has(w.origIdx) ? 'matched' : ''} ${wrong === i ? 'wrong' : ''}`}
                    disabled={matched.has(w.origIdx)}
                    onClick={() => tryMatch(i)}>
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

const KidsMode = ({ perek, perakim, perekIdx, setPerekIdx, mishnah, mishnahIdx, setMishnahIdx, onColoring, onParentDash }) => {
  const [picked, setPicked] = useState_k(null);
  const [stars, setStars] = useState_k(parseInt(localStorage.getItem('avot-kids-stars') || '0'));
  const [showGame, setShowGame] = useState_k(false);

  const onPick = (i) => {
    setPicked(i);
    if (i === mishnah.kidsQuestion.correct) {
      const newStars = stars + 1;
      setStars(newStars);
      localStorage.setItem('avot-kids-stars', String(newStars));
    }
  };
  const nextMishnah = () => {
    setPicked(null);
    if (mishnahIdx < perek.mishnayot.length - 1) setMishnahIdx(mishnahIdx + 1);
  };

  return (
    <div className="kids" data-screen-label="Kids Mode">
      <div className="kids-header">
        <div className="kids-title">Avot for Kids · Chapter {perek.num}</div>
        <div className="kids-progress" data-tip={`Mishnah ${mishnahIdx+1} of ${perek.mishnayot.length} \u00b7 click any dot to jump`} data-tip-pos="bottom">
          {perek.mishnayot.map((m, i) => (
            <button key={i}
              className={`dot ${i < mishnahIdx ? 'done' : ''} ${i === mishnahIdx ? 'current' : ''}`}
              data-tip={`Mishnah ${i+1} \u00b7 ${m.attribution.en}`}
              data-tip-pos="bottom"
              onClick={() => { setPicked(null); setMishnahIdx(i); }}
              aria-label={`Go to Mishnah ${i+1}`} />
          ))}
        </div>
        <div className="kids-stars">
          <span className="star">★</span><span>{stars}</span>
          <button className="kids-iconbtn" onClick={onParentDash} data-tip="Parent dashboard" data-tip-pos="left"><Icon name="user" size={14} /></button>
        </div>
      </div>
      <div className="kids-main">
        <div className="kids-card">
          <div className="kids-illustration">
            <KidsIllustration mishnahNum={mishnah.num} />
            {window.ILLUSTRATIONS?.[mishnah.num] && (
              <span className="placeholder">{window.ILLUSTRATIONS[mishnah.num].name}</span>
            )}
          </div>
          <div className="kids-tag">Mishnah {mishnah.num}</div>
          <div className="kids-attribution">{mishnah.attribution.he}</div>
          <div className="kids-attribution-en">{mishnah.attribution.en}</div>

          <KidsHebrew mishnah={mishnah} />

          <div className="kids-audio" data-tip="Audio coming soon — will be a professional narration">
            <div className="play-circ"><Icon name="play" size={14} /></div>
            <div>
              <div className="audio-label">Listen along</div>
              <div className="audio-sub">Hebrew + English narration · 1:42</div>
            </div>
          </div>

          <p className="kids-story">{mishnah.kidsStory || "Story coming soon for this Mishnah! Until then, ask a grown-up to read the Hebrew with you and tell you what it means."}</p>

          <div className="kids-actions-row">
            <button className="kids-btn secondary" onClick={onColoring} data-tip="Print a coloring page for this Mishnah">
              <Icon name="palette" size={14} /> Coloring page
            </button>
            <button className="kids-btn secondary" onClick={() => setShowGame(true)} data-tip="Match Hebrew words to their meanings">
              <Icon name="sparkle" size={14} /> Word match
            </button>
          </div>

          {mishnah.kidsQuestion && (
            <div className="kids-quiz">
              <span className="q-label">★ Quiz time</span>
              <div className="q-text">{mishnah.kidsQuestion.q}</div>
              <div className="options">
                {mishnah.kidsQuestion.options.map((opt, i) => {
                  let cls = 'opt';
                  if (picked !== null) {
                    if (i === mishnah.kidsQuestion.correct) cls += ' correct';
                    else if (i === picked) cls += ' wrong';
                  }
                  return <button key={i} className={cls} onClick={() => picked === null && onPick(i)}>{opt}</button>;
                })}
              </div>
              {picked !== null && picked === mishnah.kidsQuestion.correct && (
                <div className="kids-feedback good">
                  <span className="star">★</span> Amazing! +1 star earned
                </div>
              )}
              {picked !== null && picked !== mishnah.kidsQuestion.correct && (
                <div className="kids-feedback bad">
                  Try again — the green answer is the right one!
                </div>
              )}
            </div>
          )}

          <div className="kids-nav">
            <button className="kids-btn secondary" onClick={() => { setPicked(null); setMishnahIdx(Math.max(0, mishnahIdx-1)); }}>
              ← Previous
            </button>
            <button className="kids-btn" onClick={nextMishnah}>
              Next Mishnah →
            </button>
          </div>
        </div>
      </div>
      {showGame && <WordMatchGame mishnah={mishnah} onClose={() => setShowGame(false)} />}
    </div>
  );
};

Object.assign(window, { KidsMode });

export { KidsHebrew, KidsMode, SCENE_ICONS, WordMatchGame };
