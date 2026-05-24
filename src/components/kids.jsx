import React from 'react';
import { Home } from './Home.jsx';
import { Icon } from './Icon.jsx';
import { ILLUSTRATIONS, KidsIllustration } from './illustrations.jsx';
import { getHeroFor } from './kidsHeroes.jsx';

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
    const track = trackRef.current;
    if (!track) return;
    const el = track.querySelector('.kp-stop.current');
    if (!el) return;
    // Only scroll the track itself — avoid scrollIntoView, which can
    // bubble up and scroll ancestors (even those with overflow: hidden,
    // which would shift the whole page).
    const currentCenter = el.offsetLeft + el.offsetWidth / 2;
    const target = Math.max(0, currentCenter - track.clientWidth / 2);
    if (typeof track.scrollTo === 'function') {
      track.scrollTo({ left: target, behavior: 'smooth' });
    } else {
      track.scrollLeft = target;
    }
    // Defensive: ensure ancestors didn't get scrolled by a prior render.
    let cur = track.parentElement;
    while (cur && cur !== document.body) {
      if (cur.scrollLeft) cur.scrollLeft = 0;
      cur = cur.parentElement;
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
// Hero illustration switcher — full scene library lives in
// kidsHeroes.jsx. We fall back to the small banner if no hero
// is available for the given mishnah.
// ============================================================
const MishnahHero = ({ mishnah }) => {
  const Hero = getHeroFor(mishnah.num);
  if (Hero) {
    return (
      <div className="hero-wrap">
        <Hero />
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
// Read-aloud — uses the browser's built-in speech synthesis.
// One playback at a time across the whole kids screen.
// Hebrew uses a male voice when one is available; otherwise the
// default Hebrew voice is pitched down to give a deeper read.
// ============================================================

// Known male voice names across platforms (macOS, iOS, Windows, Android).
const MALE_VOICE_HINTS = [
  // Hebrew
  'asaf', 'arnon', 'amir',
  // English
  'daniel', 'alex', 'fred', 'tom', 'aaron', 'arthur', 'oliver', 'rishi',
  'george', 'james', 'gordon', 'lee', 'rocko',
  // Generic
  'male',
];

function pickVoice(lang, preferMale) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const all = window.speechSynthesis.getVoices() || [];
  if (!all.length) return null;
  const langKey = String(lang || '').slice(0, 2).toLowerCase();
  const matches = all.filter(v => v.lang && v.lang.slice(0, 2).toLowerCase() === langKey);
  if (!matches.length) return null;
  // 1. Honor the user's explicit choice for this language, if any.
  try {
    const savedName = localStorage.getItem(`avot.kids.voice.${langKey}`);
    if (savedName) {
      const chosen = matches.find(v => v.name === savedName);
      if (chosen) return chosen;
    }
  } catch (e) {}
  // 2. Otherwise prefer a male-named voice.
  if (preferMale) {
    const male = matches.find(v => {
      const n = (v.name || '').toLowerCase();
      return MALE_VOICE_HINTS.some(h => n.includes(h));
    });
    if (male) return male;
  }
  // 3. Final fallback: the system default voice for this language.
  const def = matches.find(v => v.default);
  return def || matches[0];
}

function listVoicesFor(lang) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return [];
  const all = window.speechSynthesis.getVoices() || [];
  const langKey = String(lang || '').slice(0, 2).toLowerCase();
  return all.filter(v => v.lang && v.lang.slice(0, 2).toLowerCase() === langKey);
}

function saveVoiceChoice(lang, voiceName) {
  try {
    const langKey = String(lang || '').slice(0, 2).toLowerCase();
    if (voiceName) localStorage.setItem(`avot.kids.voice.${langKey}`, voiceName);
    else localStorage.removeItem(`avot.kids.voice.${langKey}`);
  } catch (e) {}
}

function getVoiceChoice(lang) {
  try {
    const langKey = String(lang || '').slice(0, 2).toLowerCase();
    return localStorage.getItem(`avot.kids.voice.${langKey}`) || '';
  } catch (e) { return ''; }
}

function useReadAloud() {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const [speakingId, setSpeakingId] = useState_k(null);

  // Warm up the voice list — on Chrome it loads asynchronously.
  useEffect(() => {
    if (!supported) return;
    if (window.speechSynthesis.getVoices().length) return;
    const onChange = () => {/* triggers re-evaluation on next speak */};
    window.speechSynthesis.addEventListener('voiceschanged', onChange);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', onChange);
  }, [supported]);

  // Cancel anything currently speaking when the component unmounts.
  useEffect(() => () => {
    if (supported) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }
  }, [supported]);

  const stop = () => {
    if (!supported) return;
    try { window.speechSynthesis.cancel(); } catch (e) {}
    setSpeakingId(null);
  };

  const speak = (id, text, lang = 'en-US') => {
    if (!supported || !text) return;
    if (speakingId === id) { stop(); return; }
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(String(text));
      utter.lang = lang;
      const isHe = lang.startsWith('he');
      const voice = pickVoice(lang, isHe);
      if (voice) utter.voice = voice;
      utter.rate = isHe ? 0.85 : 0.95;
      // For Hebrew, pitch the read down so the default female voice
      // sounds deeper / more masculine when no male voice is installed.
      utter.pitch = isHe ? 0.72 : 1.02;
      utter.onend = () => setSpeakingId(null);
      utter.onerror = () => setSpeakingId(null);
      setSpeakingId(id);
      window.speechSynthesis.speak(utter);
    } catch (e) {
      setSpeakingId(null);
    }
  };

  return { supported, speakingId, speak, stop };
}

const ReadAloudButton = ({ id, text, lang = 'en-US', label = 'Read aloud', read }) => {
  const [pickerOpen, setPickerOpen] = useState_k(false);
  // Force re-evaluate which voice is current after user picks one
  // or after the browser's voice list loads asynchronously.
  const [, force] = useState_k(0);
  const wrapRef = useRef(null);

  // Re-render when speech synthesis voices load (Chrome loads them async).
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const onChange = () => force(t => t + 1);
    window.speechSynthesis.addEventListener('voiceschanged', onChange);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', onChange);
  }, []);

  useEffect(() => {
    if (!pickerOpen) return;
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setPickerOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [pickerOpen]);

  if (!read || !read.supported || !text) return null;
  const playing = read.speakingId === id;
  const voices = listVoicesFor(lang);
  const currentVoice = pickVoice(lang, lang.startsWith('he'));
  const currentName = currentVoice ? currentVoice.name : '';

  const choose = (name) => {
    saveVoiceChoice(lang, name);
    force(t => t + 1);
    setPickerOpen(false);
  };
  const clearChoice = () => {
    saveVoiceChoice(lang, '');
    force(t => t + 1);
    setPickerOpen(false);
  };

  return (
    <div className="kra-group" ref={wrapRef}>
      <button
        type="button"
        className={`kra-btn ${playing ? 'is-playing' : ''}`}
        onClick={() => read.speak(id, text, lang)}
        aria-label={playing ? 'Stop reading' : label}
      >
        <span className="kra-icon" aria-hidden="true">{playing ? '⏸' : '▶'}</span>
        <span className="kra-label">{playing ? 'Stop' : label}</span>
      </button>
      {voices.length > 0 && (
        <>
          <button
            type="button"
            className="kra-picker-btn"
            onClick={() => setPickerOpen(o => !o)}
            aria-label="Choose voice"
            title={currentName ? `Voice: ${currentName}` : 'Choose voice'}
          >
            ⚙
          </button>
          {pickerOpen && (
            <div className="kra-popover" role="menu">
              <div className="kra-popover-title">Choose a voice</div>
              <div className="kra-voice-list">
                {voices.map(v => (
                  <button
                    key={v.name}
                    type="button"
                    className={`kra-voice ${v.name === currentName ? 'is-active' : ''}`}
                    onClick={() => choose(v.name)}
                  >
                    <span className="kra-voice-name">{v.name}</span>
                    <span className="kra-voice-lang">{v.lang}</span>
                  </button>
                ))}
              </div>
              {getVoiceChoice(lang) && (
                <button type="button" className="kra-reset" onClick={clearChoice}>
                  Reset to auto
                </button>
              )}
              {lang.startsWith('he') && (
                <div className="kra-tip">
                  <strong>Want a male Hebrew voice?</strong> On macOS, open
                  <em> System Settings → Accessibility → Spoken Content → System Voice →
                  Customize…</em>, scroll to <em>Hebrew</em>, check <em>Asaf</em>, and
                  click OK. It will appear in this list once downloaded.
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ============================================================
// Tappable Hebrew — themed colours, persistent hint box
// ============================================================
const KidsHebrew = ({ mishnah, read }) => {
  const [tapped, setTapped] = useState_k(null);
  if (!mishnah.words || mishnah.words.length === 0) {
    return (
      <div className="kh-wrap">
        <div className="kh-toolbar">
          <ReadAloudButton id="hebrew" text={mishnah.hebrew} lang="he-IL" label="Read in Hebrew" read={read} />
        </div>
        <div className="kh-plain">{mishnah.hebrew}</div>
      </div>
    );
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
      <div className="kh-toolbar">
        <ReadAloudButton id="hebrew" text={mishnah.hebrew} lang="he-IL" label="Read in Hebrew" read={read} />
      </div>
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
  const read = useReadAloud();

  // Reset transient state on mishnah/chapter change (and stop reading aloud)
  useEffect(() => {
    setPicked(null);
    setCompletion(false);
    read.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

          <KidsHebrew mishnah={mishnah} read={read} />

          <div className="kids-story-wrap">
            <div className="kids-story-toolbar">
              <ReadAloudButton
                id="story"
                text={mishnah.kidsStory || ''}
                lang="en-US"
                label="Read the story"
                read={read}
              />
            </div>
            <p className="kids-story">
              {mishnah.kidsStory || "Story coming soon for this Mishnah! Until then, ask a grown-up to read the Hebrew with you and tell you what it means."}
            </p>
          </div>

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
