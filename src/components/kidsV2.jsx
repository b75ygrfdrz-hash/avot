import React from 'react';
import { Icon } from './Icon.jsx';
import { Mascot, MASCOT_META } from './kidsV2Mascots.jsx';
import {
  loadState,
  saveState,
  onStateChange,
  tick,
  awardXp,
  loseHeart,
  markCompleted,
  buildPath,
  HEART_FULL,
} from '../lib/kidsV2.js';
import { getLesson } from '../data/kidsV2Lessons.js';

const { useState, useEffect, useRef, useMemo, useCallback } = React;
const useS = useState, useE = useEffect, useR = useRef, useC = useCallback;

// ============================================================
// useKidsState — reactive state hook with tick
// ============================================================
function useKidsState() {
  const [state, setState] = useS(() => {
    const { state: s } = tick(loadState());
    return s;
  });
  useE(() => {
    const unsub = onStateChange(() => {
      const { state: s } = tick(loadState());
      setState(s);
    });
    return unsub;
  }, []);
  useE(() => {
    const id = setInterval(() => {
      const { state: s, dirty } = tick(loadState());
      if (dirty) saveState(s); else setState(s);
    }, 30000);
    return () => clearInterval(id);
  }, []);
  return state;
}

// ============================================================
// HUD — header strip with streak, hearts, XP
// ============================================================
const Hud = ({ state, onClose }) => {
  const heartsArr = Array.from({ length: HEART_FULL }, (_, i) => i < state.hearts);
  return (
    <div className="kv2-hud">
      <button className="kv2-hud-close" onClick={onClose} aria-label="Exit Kids mode">
        <Icon name="close" size={16} />
      </button>
      <div className="kv2-hud-item kv2-streak" title="Daily streak">
        <span className="kv2-streak-icon" aria-hidden="true">🔥</span>
        <span className="kv2-streak-num">{state.streak}</span>
      </div>
      <div className="kv2-hud-item kv2-hearts" title="Lives">
        {heartsArr.map((on, i) => (
          <span key={i} className={`kv2-heart ${on ? 'on' : 'off'}`} aria-hidden="true">{on ? '♥' : '♡'}</span>
        ))}
      </div>
      <div className="kv2-hud-item kv2-xp" title="Total XP">
        <span className="kv2-xp-icon" aria-hidden="true">⭐</span>
        <span className="kv2-xp-num">{state.xp}</span>
      </div>
    </div>
  );
};

// ============================================================
// Daily goal pill
// ============================================================
const DailyGoal = ({ state }) => {
  const pct = Math.min(100, Math.round((state.dailyXp / state.dailyGoal) * 100));
  return (
    <div className="kv2-daily">
      <div className="kv2-daily-label">Daily goal</div>
      <div className="kv2-daily-bar">
        <div className="kv2-daily-fill" style={{ width: pct + '%' }} />
      </div>
      <div className="kv2-daily-num">{state.dailyXp} / {state.dailyGoal} XP</div>
    </div>
  );
};

// ============================================================
// Path — skill-tree of stops
// ============================================================
const Path = ({ stops, state, onPick }) => {
  const currentIdx = stops.findIndex(s => s.hasLesson && !state.completed[s.key]);
  return (
    <div className="kv2-path">
      {stops.map((stop, i) => {
        const done = !!state.completed[stop.key];
        const isCurrent = i === currentIdx;
        const isLocked = !stop.hasLesson && !done;
        const meta = MASCOT_META[stop.animal];
        const offset = [0, 50, 80, 50, 0, -50, -80, -50][i % 8];
        return (
          <div key={stop.key} className="kv2-stop-wrap" style={{ transform: `translateX(${offset}px)` }}>
            <button
              className={`kv2-stop ${done ? 'done' : ''} ${isCurrent ? 'current' : ''} ${isLocked ? 'locked' : ''}`}
              onClick={() => stop.hasLesson && onPick(stop)}
              disabled={isLocked}
              style={{
                background: done ? meta.color : (isCurrent ? meta.color : '#e8e3dd'),
                boxShadow: isCurrent ? `0 6px 0 ${meta.color}aa, 0 8px 18px rgba(0,0,0,0.12)` : '0 4px 0 rgba(0,0,0,0.10)',
              }}
              data-tip={isLocked ? 'Coming soon' : `Perek ${stop.perek} · Mishnah ${stop.mishnah}`}
              data-tip-pos="top"
            >
              {done ? (
                <span className="kv2-stop-check">✓</span>
              ) : (
                <div className="kv2-stop-mascot"><Mascot which={stop.animal} size={isCurrent ? 60 : 50} /></div>
              )}
              {isCurrent && <span className="kv2-stop-pulse" />}
            </button>
            <div className={`kv2-stop-label ${isLocked ? 'locked' : ''}`}>{stop.perek}:{stop.mishnah}</div>
          </div>
        );
      })}
    </div>
  );
};

// ============================================================
// Exercise: Match pairs
// ============================================================
const ExMatch = ({ exercise, onAnswer }) => {
  const pairs = exercise.pairs;
  const [hePool] = useS(() => pairs.map((p, i) => ({ ...p, i })));
  const [enPool] = useS(() => [...pairs].map((p, i) => ({ ...p, i })).sort(() => Math.random() - 0.5));
  const [picked, setPicked] = useS({ he: null, en: null });
  const [matched, setMatched] = useS(new Set());
  const [wrongAttempt, setWrongAttempt] = useS(null);
  const wrongCount = useR(0);

  useE(() => {
    if (picked.he !== null && picked.en !== null) {
      if (picked.he === picked.en) {
        const next = new Set(matched);
        next.add(picked.he);
        setMatched(next);
        setPicked({ he: null, en: null });
        if (next.size === pairs.length) {
          setTimeout(() => onAnswer(wrongCount.current === 0), 350);
        }
      } else {
        wrongCount.current += 1;
        setWrongAttempt({ ...picked });
        setTimeout(() => {
          setPicked({ he: null, en: null });
          setWrongAttempt(null);
        }, 600);
      }
    }
  }, [picked]);

  return (
    <div className="kv2-ex kv2-ex-match">
      <div className="kv2-ex-prompt">{exercise.instruction}</div>
      <div className="kv2-match-grid">
        <div className="kv2-match-col">
          {hePool.map(p => {
            const isMatched = matched.has(p.i);
            const isPicked = picked.he === p.i;
            const isWrong = wrongAttempt && wrongAttempt.he === p.i;
            return (
              <button
                key={p.i}
                className={`kv2-match-tile he ${isMatched ? 'matched' : ''} ${isPicked ? 'picked' : ''} ${isWrong ? 'wrong' : ''}`}
                onClick={() => !isMatched && setPicked(s => ({ ...s, he: p.i }))}
                disabled={isMatched}
                style={{ fontFamily: 'var(--hebrew)' }}
              >
                {p.he}
              </button>
            );
          })}
        </div>
        <div className="kv2-match-col">
          {enPool.map(p => {
            const isMatched = matched.has(p.i);
            const isPicked = picked.en === p.i;
            const isWrong = wrongAttempt && wrongAttempt.en === p.i;
            return (
              <button
                key={p.i}
                className={`kv2-match-tile en ${isMatched ? 'matched' : ''} ${isPicked ? 'picked' : ''} ${isWrong ? 'wrong' : ''}`}
                onClick={() => !isMatched && setPicked(s => ({ ...s, en: p.i }))}
                disabled={isMatched}
              >
                {p.en}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// Exercise: Listen and tap
// ============================================================
const ExListen = ({ exercise, onAnswer }) => {
  const [chosen, setChosen] = useS(null);
  const [revealed, setRevealed] = useS(false);

  const speak = useC(() => {
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(exercise.speakText);
      u.lang = exercise.speakLang || 'he-IL';
      u.rate = 0.85;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }, [exercise]);

  useE(() => { setTimeout(speak, 300); }, []);

  function pick(i) {
    if (revealed) return;
    setChosen(i);
    setRevealed(true);
    setTimeout(() => onAnswer(i === exercise.answer), 750);
  }

  return (
    <div className="kv2-ex kv2-ex-listen">
      <div className="kv2-ex-prompt">{exercise.instruction}</div>
      <button className="kv2-speak-btn" onClick={speak} aria-label="Replay audio">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M3 9v6h4l5 4V5L7 9H3z" fill="currentColor" />
          <path d="M16 8c1.5 1.5 1.5 6.5 0 8M19 5c3 3 3 11 0 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      </button>
      <div className="kv2-listen-choices">
        {exercise.choices.map((c, i) => {
          const correct = revealed && i === exercise.answer;
          const wrong = revealed && i === chosen && i !== exercise.answer;
          return (
            <button
              key={i}
              className={`kv2-choice ${correct ? 'correct' : ''} ${wrong ? 'wrong' : ''}`}
              onClick={() => pick(i)}
              style={{ fontFamily: 'var(--hebrew)', fontSize: 22 }}
            >
              {c}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================
// Exercise: Word order
// ============================================================
const ExOrder = ({ exercise, onAnswer }) => {
  const [bank] = useS(() => exercise.words.map((w, i) => ({ word: w, i })));
  const [picked, setPicked] = useS([]);
  const [submitted, setSubmitted] = useS(false);
  const [isCorrect, setIsCorrect] = useS(null);

  const remaining = bank.filter(b => !picked.includes(b.i));

  function pick(i) { if (submitted) return; setPicked([...picked, i]); }
  function unpick(i) { if (submitted) return; setPicked(picked.filter(x => x !== i)); }
  function submit() {
    if (picked.length !== exercise.correctOrder.length) return;
    setSubmitted(true);
    const correct = picked.every((p, idx) => p === exercise.correctOrder[idx]);
    setIsCorrect(correct);
    setTimeout(() => onAnswer(correct), 850);
  }

  return (
    <div className="kv2-ex kv2-ex-order">
      <div className="kv2-ex-prompt">{exercise.instruction}</div>
      {exercise.translation && (
        <div className="kv2-ex-translation">"{exercise.translation}"</div>
      )}
      <div className={`kv2-order-line ${submitted ? (isCorrect ? 'correct' : 'wrong') : ''}`}>
        {picked.length === 0 && <span className="kv2-order-placeholder">Tap words below…</span>}
        {picked.map(idx => (
          <button key={idx} className="kv2-word kv2-word-picked" onClick={() => unpick(idx)} style={{ fontFamily: 'var(--hebrew)' }}>
            {bank[idx].word}
          </button>
        ))}
      </div>
      <div className="kv2-order-bank">
        {remaining.map(b => (
          <button key={b.i} className="kv2-word kv2-word-bank" onClick={() => pick(b.i)} style={{ fontFamily: 'var(--hebrew)' }}>
            {b.word}
          </button>
        ))}
      </div>
      <button
        className="kv2-submit"
        disabled={picked.length !== exercise.correctOrder.length || submitted}
        onClick={submit}
      >
        Check
      </button>
    </div>
  );
};

// ============================================================
// Exercise: Multiple choice
// ============================================================
const ExChoose = ({ exercise, onAnswer }) => {
  const [chosen, setChosen] = useS(null);
  const [revealed, setRevealed] = useS(false);

  function pick(i) {
    if (revealed) return;
    setChosen(i);
    setRevealed(true);
    setTimeout(() => onAnswer(i === exercise.answer), 750);
  }

  return (
    <div className="kv2-ex kv2-ex-choose">
      <div className="kv2-ex-prompt kv2-ex-prompt-lg">{exercise.instruction}</div>
      <div className="kv2-choose-grid">
        {exercise.choices.map((c, i) => {
          const correct = revealed && i === exercise.answer;
          const wrong = revealed && i === chosen && i !== exercise.answer;
          return (
            <button
              key={i}
              className={`kv2-choice-card ${correct ? 'correct' : ''} ${wrong ? 'wrong' : ''}`}
              onClick={() => pick(i)}
            >
              {c}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================
// Hebrew-with-hover-translation — for the intro screen
// ============================================================
const HebrewWithTranslation = ({ hebrew, words }) => {
  const [tapped, setTapped] = useS(null); // token index currently revealed
  const lookup = useMemo(() => {
    const m = {};
    (words || []).forEach(w => {
      const clean = w.he.replace(/[׳״.,;:!?־"־]/g, '');
      m[clean] = w.en;
    });
    return m;
  }, [words]);

  if (!words || words.length === 0) {
    return <span>{hebrew}</span>;
  }

  // Split by whitespace, preserving the separators
  const tokens = hebrew.split(/(\s+)/);
  return (
    <span className="kv2-hbw-line">
      {tokens.map((tok, i) => {
        if (/^\s+$/.test(tok)) return tok;
        const clean = tok.trim().replace(/[׳״.,;:!?־"־]/g, '');
        const en = lookup[clean];
        if (!en) return <span key={i}>{tok}</span>;
        const isOpen = tapped === i;
        return (
          <span
            key={i}
            className={`kv2-hbw-word ${isOpen ? 'open' : ''}`}
            onClick={() => setTapped(isOpen ? null : i)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTapped(isOpen ? null : i); } }}
          >
            {tok}
            <span className="kv2-hbw-tip">{en}</span>
          </span>
        );
      })}
    </span>
  );
};

// ============================================================
// Intro screen — shows the full Mishnah before the quiz starts
// ============================================================
const Intro = ({ stop, lesson, onStart, onExit }) => {
  const meta = MASCOT_META[stop.animal];
  // Look up the actual Mishnah text from window.PIRKEI_AVOT
  const data = (typeof window !== 'undefined' && window.PIRKEI_AVOT) ? window.PIRKEI_AVOT : null;
  const perekData = data && data.perakim.find(p => p.num === stop.perek);
  const mishnahData = perekData && perekData.mishnayot.find(m => m.num === stop.mishnah);

  const hebrew = mishnahData?.hebrew || lesson.intro || '';
  const english = mishnahData?.english || '';
  const words = mishnahData?.words || [];
  const attribution = mishnahData?.attribution;

  const speak = () => {
    try {
      if (!hebrew) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(hebrew);
      u.lang = 'he-IL';
      u.rate = 0.8;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  };

  return (
    <div className="kv2-intro" style={{ background: meta.bg }}>
      <div className="kv2-intro-top">
        <button className="kv2-lesson-exit" onClick={onExit} aria-label="Exit">
          <Icon name="close" size={18} />
        </button>
        <div className="kv2-intro-crumb">Perek {stop.perek} · Mishnah {stop.mishnah}</div>
      </div>
      <div className="kv2-intro-body">
        <div className="kv2-intro-mascot">
          <Mascot which={stop.animal} size={90} />
        </div>
        <div className="kv2-intro-title-block">
          <h2 className="kv2-intro-title">{lesson.title}</h2>
          {lesson.titleHe && <div className="kv2-intro-title-he" style={{ fontFamily: 'var(--hebrew)' }}>{lesson.titleHe}</div>}
          {lesson.theme && <div className="kv2-intro-theme">{lesson.theme}</div>}
          {attribution && (
            <div className="kv2-intro-attribution">
              {typeof attribution === 'string' ? attribution : (attribution.en || attribution.he)}
            </div>
          )}
        </div>

        <div className="kv2-intro-card">
          <div className="kv2-intro-card-head">
            <span className="kv2-intro-card-label">The Mishnah</span>
            {hebrew && (
              <button className="kv2-intro-speak" onClick={speak} aria-label="Read aloud">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3 9v6h4l5 4V5L7 9H3z" fill="currentColor" />
                  <path d="M16 8c1.5 1.5 1.5 6.5 0 8M19 5c3 3 3 11 0 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                </svg>
                Listen
              </button>
            )}
          </div>
          {hebrew && (
            <div className="kv2-intro-hebrew" style={{ fontFamily: 'var(--hebrew)' }}>
              <HebrewWithTranslation hebrew={hebrew} words={words} />
            </div>
          )}
          {words && words.length > 0 && (
            <div className="kv2-intro-hint">Tap any word to see its meaning</div>
          )}
          {english && <div className="kv2-intro-english">{english}</div>}
        </div>

        {lesson.intro && !mishnahData && (
          <div className="kv2-intro-note">{lesson.intro}</div>
        )}

        <button className="kv2-btn kv2-btn-lg kv2-intro-go" onClick={onStart}>
          Start lesson →
        </button>
      </div>
    </div>
  );
};

// ============================================================
// Lesson runner
// ============================================================
const Lesson = ({ stop, lesson, onExit, onComplete }) => {
  const [phase, setPhase] = useS('intro'); // 'intro' | 'quiz'
  const [idx, setIdx] = useS(0);
  const correctRef = useR(0);
  const [heartLost, setHeartLost] = useS(false);
  const state = useKidsState();

  const exercise = lesson.exercises[idx];
  const total = lesson.exercises.length;

  function handleAnswer(correct) {
    if (correct) correctRef.current += 1;
    else {
      loseHeart();
      setHeartLost(true);
      setTimeout(() => setHeartLost(false), 600);
    }
    setTimeout(() => {
      if (idx + 1 >= total) {
        const xpPerCorrect = 5;
        const xpEarned = correctRef.current * xpPerCorrect;
        const accuracy = correctRef.current / total;
        const stars = accuracy >= 0.95 ? 3 : accuracy >= 0.75 ? 2 : 1;
        if (xpEarned > 0) awardXp(xpEarned);
        markCompleted(stop.key, stars, xpEarned);
        onComplete({ stars, xpEarned, accuracy });
      } else {
        setIdx(i => i + 1);
      }
    }, 250);
  }

  if (state.hearts <= 0) return <NoHearts onClose={onExit} />;

  if (phase === 'intro') {
    return <Intro stop={stop} lesson={lesson} onStart={() => setPhase('quiz')} onExit={onExit} />;
  }

  return (
    <div className={`kv2-lesson ${heartLost ? 'kv2-shake' : ''}`}>
      <div className="kv2-lesson-top">
        <button className="kv2-lesson-exit" onClick={onExit} aria-label="Exit">
          <Icon name="close" size={18} />
        </button>
        <div className="kv2-progress">
          <div className="kv2-progress-fill" style={{ width: ((idx / total) * 100) + '%' }} />
        </div>
        <div className="kv2-lesson-hearts">
          <span>♥</span>
          <span>{state.hearts}</span>
        </div>
      </div>
      {exercise.kind === 'match' && <ExMatch key={idx} exercise={exercise} onAnswer={handleAnswer} />}
      {exercise.kind === 'listen' && <ExListen key={idx} exercise={exercise} onAnswer={handleAnswer} />}
      {exercise.kind === 'order' && <ExOrder key={idx} exercise={exercise} onAnswer={handleAnswer} />}
      {exercise.kind === 'choose' && <ExChoose key={idx} exercise={exercise} onAnswer={handleAnswer} />}
    </div>
  );
};

// ============================================================
// No-hearts state
// ============================================================
const NoHearts = ({ onClose }) => (
  <div className="kv2-no-hearts">
    <div className="kv2-no-hearts-icon">💔</div>
    <h2>Out of lives!</h2>
    <p>Take a break and come back in a bit. Lives refill over time.</p>
    <button className="kv2-btn" onClick={onClose}>Back to path</button>
  </div>
);

// ============================================================
// Lesson complete screen
// ============================================================
const Complete = ({ stop, result, onContinue }) => {
  const meta = MASCOT_META[stop.animal];
  const { stars, xpEarned } = result;
  return (
    <div className="kv2-complete" style={{ background: meta.bg }}>
      <div className="kv2-complete-mascot">
        <Mascot which={stop.animal} size={130} mood="happy" />
      </div>
      <h2 className="kv2-complete-title">Lesson Complete!</h2>
      <div className="kv2-stars">
        {[1, 2, 3].map(n => (
          <span key={n} className={`kv2-star ${n <= stars ? 'on' : ''}`}>★</span>
        ))}
      </div>
      <div className="kv2-complete-stats">
        <div className="kv2-stat">
          <div className="kv2-stat-num" style={{ color: '#ffc936' }}>+{xpEarned}</div>
          <div className="kv2-stat-label">XP</div>
        </div>
        <div className="kv2-stat">
          <div className="kv2-stat-num">{stars}/3</div>
          <div className="kv2-stat-label">Stars</div>
        </div>
      </div>
      <button className="kv2-btn kv2-btn-lg" onClick={onContinue}>
        Continue
      </button>
    </div>
  );
};

// ============================================================
// Lesson coming-soon state
// ============================================================
const LessonStub = ({ stop, onClose }) => {
  const meta = MASCOT_META[stop.animal];
  return (
    <div className="kv2-stub" style={{ background: meta.bg }}>
      <Mascot which={stop.animal} size={120} />
      <h2>Coming soon!</h2>
      <p>Perek {stop.perek}, Mishnah {stop.mishnah} is being prepared.</p>
      <button className="kv2-btn" onClick={onClose}>Back to path</button>
    </div>
  );
};

// ============================================================
// Home — path screen
// ============================================================
const KidsV2Home = ({ data, onOpenLesson, onClose }) => {
  const state = useKidsState();
  const stops = useMemo(() => buildPath(data.perakim), [data]);
  return (
    <div className="kv2-home">
      <Hud state={state} onClose={onClose} />
      <DailyGoal state={state} />
      <div className="kv2-hero">
        <div className="kv2-hero-eyebrow">Pirkei Avot</div>
        <h1 className="kv2-hero-title">Wisdom, one step at a time</h1>
        <div className="kv2-hero-sub">
          Be bold as a <strong style={{ color: MASCOT_META.namer.color }}>leopard</strong>,
          light as an <strong style={{ color: MASCOT_META.nesher.color }}>eagle</strong>,
          swift as a <strong style={{ color: MASCOT_META.tzvi.color }}>deer</strong>,
          and strong as a <strong style={{ color: MASCOT_META.ari.color }}>lion</strong>.
        </div>
      </div>
      <Path stops={stops} state={state} onPick={onOpenLesson} />
    </div>
  );
};

// ============================================================
// Top-level KidsMode
// ============================================================
const KidsMode = ({ perek, perakim, perekIdx, setPerekIdx, mishnah, mishnahIdx, setMishnahIdx, onColoring, onParentDash }) => {
  const data = { perakim };
  const [activeStop, setActiveStop] = useS(null);
  const [result, setResult] = useS(null);

  function openLesson(stop) { setActiveStop(stop); setResult(null); }
  function exitLesson() { setActiveStop(null); setResult(null); }
  function onComplete(r) { setResult(r); }
  function backToPath() { setActiveStop(null); setResult(null); }
  function close() {
    try { localStorage.setItem('avot.mode', 'adult'); } catch (e) {}
    window.location.reload();
  }

  if (activeStop && result) {
    return <Complete stop={activeStop} result={result} onContinue={backToPath} />;
  }
  if (activeStop) {
    const lesson = getLesson(activeStop.perek, activeStop.mishnah);
    if (!lesson) return <LessonStub stop={activeStop} onClose={exitLesson} />;
    return <Lesson stop={activeStop} lesson={lesson} onExit={exitLesson} onComplete={onComplete} />;
  }
  return <KidsV2Home data={data} onOpenLesson={openLesson} onClose={close} />;
};

Object.assign(window, { KidsModeV2: KidsMode });

export { KidsMode };
