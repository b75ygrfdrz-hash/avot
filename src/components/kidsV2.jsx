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
  groupByPerek,
  isPerekComplete,
  perekStats,
  HEART_FULL,
} from '../lib/kidsV2.js';
import { getLesson } from '../data/kidsV2Lessons.js';
import {
  playCorrect,
  playWrong,
  playLessonComplete,
  playPerekComplete,
  playHeartLost,
  playTestTone,
  isMuted,
  setMuted,
  onMuteChange,
} from '../lib/kidsV2Sound.js';

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
// HUD — header strip with streak, hearts, XP, mute toggle
// ============================================================
const Hud = ({ state, onClose, onShowStreak }) => {
  const heartsArr = Array.from({ length: HEART_FULL }, (_, i) => i < state.hearts);
  const [muted, setMutedS] = useS(isMuted());
  useE(() => onMuteChange(() => setMutedS(isMuted())), []);
  return (
    <div className="kv2-hud">
      <button className="kv2-hud-close" onClick={onClose} aria-label="Exit Kids mode">
        <Icon name="close" size={16} />
      </button>
      <button className="kv2-hud-item kv2-streak kv2-hud-btn" title="Streak calendar" onClick={onShowStreak}>
        <span className="kv2-streak-icon" aria-hidden="true">🔥</span>
        <span className="kv2-streak-num">{state.streak}</span>
      </button>
      <div className="kv2-hud-item kv2-hearts" title="Lives">
        {heartsArr.map((on, i) => (
          <span key={i} className={`kv2-heart ${on ? 'on' : 'off'}`} aria-hidden="true">{on ? '♥' : '♡'}</span>
        ))}
      </div>
      <div className="kv2-hud-item kv2-xp" title="Total XP">
        <span className="kv2-xp-icon" aria-hidden="true">⭐</span>
        <span className="kv2-xp-num">{state.xp}</span>
      </div>
      <button
        className="kv2-hud-mute"
        onClick={() => {
          const next = !muted;
          setMuted(next);
          // When turning sound ON, play a quick test tone so the user
          // can immediately confirm audio is working.
          if (!next) {
            setTimeout(() => playTestTone(), 60);
          }
        }}
        aria-label={muted ? 'Unmute' : 'Mute'}
        title={muted ? 'Unmute (and play test tone)' : 'Mute'}
      >
        {muted ? '🔇' : '🔊'}
      </button>
    </div>
  );
};

// ============================================================
// Streak Calendar — last 35 days grid
// ============================================================
const StreakCalendar = ({ state, onClose }) => {
  const today = new Date();
  const days = useMemo(() => {
    const dates = state.practiceDates || [];
    const set = new Set(dates);
    const arr = [];
    for (let i = 34; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const key = `${yyyy}-${mm}-${dd}`;
      arr.push({ key, day: d.getDate(), weekday: d.getDay(), isToday: i === 0, practiced: set.has(key) });
    }
    return arr;
  }, [state.practiceDates]);
  const totalDays = (state.practiceDates || []).length;
  const longest = state.longestStreak || 0;
  return (
    <div className="kv2-streak-modal" onClick={onClose}>
      <div className="kv2-streak-card" onClick={e => e.stopPropagation()}>
        <button className="kv2-streak-close" onClick={onClose} aria-label="Close">
          <Icon name="close" size={14} />
        </button>
        <div className="kv2-streak-head">
          <span className="kv2-streak-big">🔥</span>
          <div>
            <div className="kv2-streak-big-num">{state.streak}</div>
            <div className="kv2-streak-big-label">day streak</div>
          </div>
        </div>
        <div className="kv2-streak-grid">
          {['S','M','T','W','T','F','S'].map((d, i) => (
            <div key={'h'+i} className="kv2-streak-weekday">{d}</div>
          ))}
          {/* Pad leading empties so the first day aligns to its weekday */}
          {Array.from({ length: days[0].weekday }).map((_, i) => (
            <div key={'pad'+i} className="kv2-streak-cell empty" />
          ))}
          {days.map(d => (
            <div
              key={d.key}
              className={`kv2-streak-cell ${d.practiced ? 'on' : ''} ${d.isToday ? 'today' : ''}`}
              title={d.key + (d.practiced ? ' · practiced' : '')}
            >
              {d.practiced ? '🔥' : d.day}
            </div>
          ))}
        </div>
        <div className="kv2-streak-stats">
          <div className="kv2-streak-stat"><div className="kv2-streak-stat-num">{state.streak}</div><div className="kv2-streak-stat-lbl">Current</div></div>
          <div className="kv2-streak-stat"><div className="kv2-streak-stat-num">{longest}</div><div className="kv2-streak-stat-lbl">Longest</div></div>
          <div className="kv2-streak-stat"><div className="kv2-streak-stat-num">{totalDays}</div><div className="kv2-streak-stat-lbl">Total days</div></div>
        </div>
        <p className="kv2-streak-hint">Complete one lesson a day to keep the streak alive.</p>
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
// Section header — divides the path into perakim (levels)
// ============================================================
const PEREK_NAMES_EN = ['', 'Perek 1', 'Perek 2', 'Perek 3', 'Perek 4', 'Perek 5', 'Perek 6'];
const PEREK_NAMES_HE = ['', 'פֶּרֶק א׳', 'פֶּרֶק ב׳', 'פֶּרֶק ג׳', 'פֶּרֶק ד׳', 'פֶּרֶק ה׳', 'פֶּרֶק ו׳'];
const PEREK_THEMES = ['', 'The Chain of Tradition', 'The World Stands on Three', 'Where We Come From', 'Be a Disciple', 'Tens and Sevens', 'The Acquisition of Torah'];

const SectionHeader = ({ perek, done, locked }) => (
  <div className={`kv2-section ${done ? 'done' : ''} ${locked ? 'locked' : ''}`}>
    <div className="kv2-section-line" />
    <div className="kv2-section-pill">
      <div className="kv2-section-name">{PEREK_NAMES_EN[perek] || `Perek ${perek}`}</div>
      <div className="kv2-section-he" style={{ fontFamily: 'var(--hebrew)' }}>{PEREK_NAMES_HE[perek]}</div>
      <div className="kv2-section-theme">{PEREK_THEMES[perek] || ''}</div>
      {done && <div className="kv2-section-badge">✓ Complete</div>}
      {locked && <div className="kv2-section-badge locked">🔒 Locked</div>}
    </div>
    <div className="kv2-section-line" />
  </div>
);

// ============================================================
// Path — skill-tree of stops, grouped by perek
// ============================================================
const Path = ({ stops, state, onPick }) => {
  const groups = useMemo(() => {
    const real = groupByPerek(stops);
    // Always include all 6 perakim so the user sees the full journey,
    // even if the later ones are empty placeholders.
    const all = [];
    for (let p = 1; p <= 6; p++) {
      const found = real.find(g => g.perek === p);
      all.push(found || { perek: p, stops: [] });
    }
    return all;
  }, [stops]);
  const currentIdx = stops.findIndex(s => s.hasLesson && !state.completed[s.key]);
  // A perek is "locked" if any earlier perek has playable stops not yet done.
  let earlierPerekLocked = false;
  return (
    <div className="kv2-path">
      {groups.map((group, gi) => {
        const groupComplete = group.stops.length > 0 && isPerekComplete(group.stops, state.completed);
        // First perek is always unlocked. Later perakim wait for earlier ones.
        const groupLocked = earlierPerekLocked;
        // Empty perakim are placeholders — also lock subsequent ones until prior ones are filled.
        if ((!groupComplete && group.stops.some(s => s.hasLesson)) || group.stops.length === 0) {
          earlierPerekLocked = true;
        }
        let stopRelIdx = -1;
        return (
          <React.Fragment key={group.perek}>
            <SectionHeader perek={group.perek} done={groupComplete} locked={groupLocked} />
            {group.stops.map((stop, si) => {
              stopRelIdx++;
              const done = !!state.completed[stop.key];
              const absIdx = stops.findIndex(s => s.key === stop.key);
              const isCurrent = absIdx === currentIdx;
              const isLocked = (!stop.hasLesson && !done) || groupLocked;
              const meta = MASCOT_META[stop.animal];
              const offset = [0, 50, 80, 50, 0, -50, -80, -50][stopRelIdx % 8];
              return (
                <div key={stop.key} className="kv2-stop-wrap" style={{ transform: `translateX(${offset}px)` }}>
                  <button
                    className={`kv2-stop ${done ? 'done' : ''} ${isCurrent ? 'current' : ''} ${isLocked ? 'locked' : ''}`}
                    onClick={() => stop.hasLesson && !groupLocked && onPick(stop)}
                    disabled={isLocked}
                    style={{
                      background: done ? meta.color : (isCurrent ? meta.color : '#e8e3dd'),
                      boxShadow: isCurrent ? `0 6px 0 ${meta.color}aa, 0 8px 18px rgba(0,0,0,0.12)` : '0 4px 0 rgba(0,0,0,0.10)',
                    }}
                    data-tip={groupLocked ? `Finish Perek ${group.perek - 1} first` : (isLocked ? 'Coming soon' : `Perek ${stop.perek} · Mishnah ${stop.mishnah}`)}
                    data-tip-pos="top"
                  >
                    {done ? (
                      <span className="kv2-stop-check">✓</span>
                    ) : (
                      <div className="kv2-stop-mascot"><Mascot which={stop.animal} size={isCurrent ? 64 : 54} /></div>
                    )}
                    {isCurrent && <span className="kv2-stop-pulse" />}
                  </button>
                  <div className={`kv2-stop-label ${isLocked ? 'locked' : ''}`}>{stop.perek}:{stop.mishnah}</div>
                </div>
              );
            })}
          </React.Fragment>
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
    setTimeout(() => onAnswer(i === exercise.answer, exercise.choices[exercise.answer]), 750);
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
    const correctText = exercise.correctOrder.map(i => exercise.words[i]).join(' · ');
    setTimeout(() => onAnswer(correct, correctText), 850);
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
    setTimeout(() => onAnswer(i === exercise.answer, exercise.choices[exercise.answer]), 750);
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
      <div className="kv2-intro-scroll">
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
        </div>
      </div>
      <div className="kv2-intro-footer">
        <button className="kv2-btn kv2-btn-lg kv2-intro-go" onClick={onStart}>
          Start lesson →
        </button>
      </div>
    </div>
  );
};

// ============================================================
// Feedback bar — slides up after every answer (Duolingo-style)
// ============================================================
const FeedbackBar = ({ feedback, onContinue }) => {
  if (!feedback) return null;
  const { correct, correctText } = feedback;
  return (
    <div className={`kv2-feedback-bar ${correct ? 'correct' : 'wrong'}`}>
      <div className="kv2-fb-body">
        <div className="kv2-fb-label">
          {correct ? '🎉 Correct!' : '😬 Oops!'}
        </div>
        {!correct && correctText && (
          <div className="kv2-fb-answer">
            Correct answer: <strong style={{ fontFamily: correctText.match(/[֐-׿]/) ? 'var(--hebrew)' : 'inherit' }}>{correctText}</strong>
          </div>
        )}
      </div>
      <button className={`kv2-fb-btn ${correct ? 'correct' : 'wrong'}`} onClick={onContinue}>
        {correct ? 'CONTINUE' : 'GOT IT'}
      </button>
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
  const [feedback, setFeedback] = useS(null); // { correct, correctText }
  const state = useKidsState();

  const exercise = lesson.exercises[idx];
  const total = lesson.exercises.length;

  function handleAnswer(correct, correctText = '') {
    if (correct) {
      correctRef.current += 1;
      playCorrect();
    } else {
      loseHeart();
      setHeartLost(true);
      playWrong();
      playHeartLost();
      setTimeout(() => setHeartLost(false), 600);
    }
    setFeedback({ correct, correctText });
  }

  function advanceLesson() {
    setFeedback(null);
    if (idx + 1 >= total) {
      const xpPerCorrect = 5;
      const xpEarned = correctRef.current * xpPerCorrect;
      const accuracy = correctRef.current / total;
      const stars = accuracy >= 0.95 ? 3 : accuracy >= 0.75 ? 2 : 1;
      if (xpEarned > 0) awardXp(xpEarned);
      markCompleted(stop.key, stars, xpEarned);
      playLessonComplete();
      onComplete({ stars, xpEarned, accuracy });
    } else {
      setIdx(i => i + 1);
    }
  }

  if (state.hearts <= 0) return <NoHearts onClose={onExit} />;

  if (phase === 'intro') {
    return <Intro stop={stop} lesson={lesson} onStart={() => setPhase('quiz')} onExit={onExit} />;
  }

  return (
    <div className={`kv2-lesson ${heartLost ? 'kv2-shake' : ''} ${feedback ? 'kv2-lesson-answered' : ''}`}>
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
      <FeedbackBar feedback={feedback} onContinue={advanceLesson} />
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
// Confetti — pure CSS particles for the level-up celebration
// ============================================================
const Confetti = ({ count = 60 }) => {
  const pieces = useMemo(() => {
    const colors = ['#ff6b6b', '#ffd23f', '#5dd39e', '#4a90c2', '#ff8a3d', '#b48ad9', '#ff8fab'];
    return Array.from({ length: count }, () => ({
      left: Math.random() * 100,
      delay: Math.random() * 1.2,
      duration: 2.2 + Math.random() * 1.8,
      drift: (Math.random() - 0.5) * 240,
      rotate: Math.random() * 720 - 360,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 8 + Math.random() * 8,
      isSquare: Math.random() > 0.5,
    }));
  }, [count]);
  return (
    <div className="kv2-confetti" aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="kv2-confetto"
          style={{
            left: p.left + '%',
            background: p.color,
            width: p.size,
            height: p.isSquare ? p.size : p.size * 1.4,
            borderRadius: p.isSquare ? '2px' : '50%',
            animation: `kv2-confetto-fall ${p.duration}s linear ${p.delay}s infinite`,
            '--drift': p.drift + 'px',
            '--rotate': p.rotate + 'deg',
          }}
        />
      ))}
    </div>
  );
};

// ============================================================
// PerekComplete — level-up celebration
// ============================================================
const PerekComplete = ({ perek, stats, onContinue, hasNext }) => {
  const perekName = PEREK_NAMES_EN[perek] || `Perek ${perek}`;
  const perekHe = PEREK_NAMES_HE[perek] || '';
  useE(() => { playPerekComplete(); }, []);
  return (
    <div className="kv2-perek-complete">
      <Confetti count={80} />
      <div className="kv2-pc-mascots">
        <div className="kv2-pc-mascot kv2-pc-m1"><Mascot which="namer"  size={70} /></div>
        <div className="kv2-pc-mascot kv2-pc-m2"><Mascot which="nesher" size={70} /></div>
        <div className="kv2-pc-mascot kv2-pc-m3"><Mascot which="tzvi"   size={70} /></div>
        <div className="kv2-pc-mascot kv2-pc-m4"><Mascot which="ari"    size={70} /></div>
      </div>
      <div className="kv2-pc-eyebrow">Level Complete</div>
      <h1 className="kv2-pc-title">{perekName} Done!</h1>
      <div className="kv2-pc-he" style={{ fontFamily: 'var(--hebrew)' }}>{perekHe}</div>
      <div className="kv2-pc-stats">
        <div className="kv2-pc-stat">
          <div className="kv2-pc-stat-num" style={{ color: '#ffd23f' }}>+{stats.totalXp}</div>
          <div className="kv2-pc-stat-label">XP</div>
        </div>
        <div className="kv2-pc-stat">
          <div className="kv2-pc-stat-num">{stats.totalStars} <span style={{ fontSize: 18, opacity: 0.4 }}>/ {stats.maxStars}</span></div>
          <div className="kv2-pc-stat-label">Stars</div>
        </div>
        <div className="kv2-pc-stat">
          <div className="kv2-pc-stat-num" style={{ color: '#5dd39e' }}>{stats.lessonsDone}</div>
          <div className="kv2-pc-stat-label">Lessons</div>
        </div>
      </div>
      <button className="kv2-btn kv2-btn-lg kv2-pc-btn" onClick={onContinue}>
        {hasNext ? `Continue to Perek ${perek + 1} →` : 'Back to path'}
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
  const [showStreak, setShowStreak] = useS(false);
  return (
    <div className="kv2-home">
      <Hud state={state} onClose={onClose} onShowStreak={() => setShowStreak(true)} />
      {showStreak && <StreakCalendar state={state} onClose={() => setShowStreak(false)} />}
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
  const [perekDoneFor, setPerekDoneFor] = useS(null); // perek number to celebrate
  const allStops = useMemo(() => buildPath(perakim), [perakim]);
  const groups = useMemo(() => groupByPerek(allStops), [allStops]);

  function openLesson(stop) { setActiveStop(stop); setResult(null); }
  function exitLesson() { setActiveStop(null); setResult(null); }
  function onComplete(r) { setResult(r); }
  function backToPath() {
    // Did this completion just finish a perek? Check fresh state.
    if (activeStop) {
      const finishedPerek = activeStop.perek;
      const freshState = loadState();
      const group = groups.find(g => g.perek === finishedPerek);
      if (group && isPerekComplete(group.stops, freshState.completed)) {
        // Only celebrate if we haven't already shown it for this perek
        const shownKey = `avot.kidsV2.perekCelebrated.${finishedPerek}`;
        const alreadyShown = localStorage.getItem(shownKey) === 'yes';
        if (!alreadyShown) {
          localStorage.setItem(shownKey, 'yes');
          setActiveStop(null); setResult(null);
          setPerekDoneFor(finishedPerek);
          return;
        }
      }
    }
    setActiveStop(null); setResult(null);
  }
  function dismissPerekCelebration() {
    setPerekDoneFor(null);
  }
  function close() {
    try { localStorage.setItem('avot.mode.v1', 'adult'); } catch (e) {}
    window.location.reload();
  }

  if (perekDoneFor !== null) {
    const group = groups.find(g => g.perek === perekDoneFor);
    const freshState = loadState();
    const stats = perekStats(group.stops, freshState.completed);
    const hasNext = groups.some(g => g.perek === perekDoneFor + 1);
    return <PerekComplete perek={perekDoneFor} stats={stats} hasNext={hasNext} onContinue={dismissPerekCelebration} />;
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
