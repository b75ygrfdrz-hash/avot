import React from 'react';
import { Icon } from './Icon.jsx';
import { getColoringFor, SimpleColoring } from './kidsColoring.jsx';
import { createVoiceRecognition, alignRecitation } from '../lib/voice.js';

const { useState, useEffect, useRef, useCallback, useMemo } = React;
const useS = useState, useE = useEffect, useR = useRef, useC = useCallback;
const useState_p = useState, useEffect_p = useEffect, useState_k = useState;
const useState_m = useState, useEffect_m = useEffect, useRef_m = useRef;
const useS_s = useState, useE_s = useEffect, useR_s = useRef;
const useState_a = useState, useEffect_a = useEffect;
const useState_mc = useState, useRef_mc = useRef, useEffect_mc = useEffect;
const useEffect_h = useEffect, useState_ms = useState, useEffect_ms = useEffect;
const useS_o = useState, useE_o = useEffect;

// Selection toolbar, modals (quote, memorize, source sheet, parent dash, coloring)


// ============================================================
// Floating selection toolbar
// ============================================================
const SelectionToolbar = ({ pos, onHighlight, onNote, onShare, currentColor }) => {
  if (!pos) return null;
  const colors = [
    { id: 'yellow', label: 'Yellow' },
    { id: 'rose', label: 'Rose' },
    { id: 'sky', label: 'Sky' },
    { id: 'mint', label: 'Mint' },
  ];
  return (
    <div className="selection-toolbar" style={{ left: pos.x, top: pos.y }}>
      {colors.map(c => (
        <button key={c.id} className={`hl-swatch ${currentColor === c.id ? 'active' : ''}`}
          style={{ background: `var(--hl-${c.id})` }}
          data-tip={`Highlight ${c.label}`}
          onClick={() => onHighlight(c.id)} aria-label={`Highlight ${c.id}`} />
      ))}
      <div className="hl-divider" />
      <button className="sel-act" onClick={onNote} data-tip="Add a note"><Icon name="note" size={13} /></button>
      <button className="sel-act" onClick={onShare} data-tip="Copy a deep-link to this passage"><Icon name="link" size={13} /></button>
    </div>
  );
};

// ============================================================
// Quote card
// ============================================================
const QuoteCard = ({ mishnah, perek, onClose }) => {
  return (
    <div className="modal-back" onClick={onClose}>
      <div className="quote-stack" onClick={e => e.stopPropagation()}>
        <div className="quote-card">
          <div className="open-quote">"</div>
          <div>
            <div className="qhe">{mishnah.hebrew}</div>
            <div className="qen">"{mishnah.english}"</div>
          </div>
          <div className="qfoot">
            <div className="brand-mark" style={{fontFamily: 'var(--hebrew)', color: 'var(--wine)'}}>אבות</div>
            <div>— {mishnah.attribution.en} · Avot {perek.num}:{mishnah.num}</div>
          </div>
        </div>
        <div className="modal-actions" style={{position: 'relative', bottom: 0, marginTop: 18, justifyContent: 'center'}}>
          <button className="btn-primary"><Icon name="download" size={13} /> Download PNG</button>
          <button className="btn-primary"><Icon name="share" size={13} /> Share to social</button>
          <button className="btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// Memorize mode — ReciteCard: recite the mishnah, self-grade word by word
// ============================================================
const ReciteCard = ({ perek, mishnah, index, total, onDone }) => {
  const [lang, setLang] = useS_o('he');
  const [phase, setPhase] = useS_o('idle'); // idle | recording | results
  const [interim, setInterim] = useS_o('');
  // statuses: array of 'correct'|'wrong'|'neutral' per word, user-tappable
  const [statuses, setStatuses] = useS_o(null);
  const [capturedText, setCapturedText] = useS_o('');
  const recRef = useR(null);
  const fullTranscriptRef = useR('');
  const isRecordingRef = useR(false);

  const rawText = lang === 'he' ? (mishnah.hebrew || '') : (mishnah.english || '');
  // Strip punctuation from expected words so matching isn't thrown off by commas/periods
  const wordTokens = rawText.split(/\s+/).map(w => w.replace(/[.,:;!?״׳]/g, '')).filter(Boolean);

  useE_o(() => {
    isRecordingRef.current = false;
    recRef.current?.stop();
    setPhase('idle'); setInterim(''); setStatuses(null);
    fullTranscriptRef.current = '';
  }, [mishnah.num, lang]);

  const startRecording = () => {
    fullTranscriptRef.current = '';
    setInterim('');
    setPhase('recording');
    isRecordingRef.current = true;

    const launch = () => {
      if (!isRecordingRef.current) return;
      const rec = createVoiceRecognition({
        continuous: false,
        lang: lang === 'he' ? 'he-IL' : 'en-US',
        onInterim: (t) => setInterim(t),
        onFinal: (t) => {
          fullTranscriptRef.current = (fullTranscriptRef.current + ' ' + t).trim();
          setInterim('');
        },
        onError: (err) => {
          if (err !== 'no-speech' && err !== 'aborted') isRecordingRef.current = false;
        },
        onEnd: () => { if (isRecordingRef.current) setTimeout(launch, 200); },
      });
      if (!rec.supported) { isRecordingRef.current = false; setPhase('idle'); return; }
      recRef.current = rec;
      rec.start();
    };
    launch();
  };

  const reveal = () => {
    isRecordingRef.current = false;
    recRef.current?.stop();

    const full = (fullTranscriptRef.current + ' ' + interim).trim();
    setCapturedText(full);
    const spokenWords = full.split(/\s+/).filter(Boolean);

    let initial;
    if (spokenWords.length > 0) {
      // Run alignment on whatever we got — even a few words is useful
      const aligned = alignRecitation(spokenWords, wordTokens, lang);
      // correct → green, anything else → neutral (user confirms)
      initial = aligned.map(r => r.status === 'correct' ? 'correct' : 'neutral');
    } else {
      // No transcript at all — start all green, user taps what they missed
      initial = wordTokens.map(() => 'correct');
    }
    setStatuses(initial);
    setPhase('results');
  };

  const toggleWord = (i) => {
    setStatuses(prev => {
      const next = [...prev];
      // cycle: neutral → correct → wrong → correct
      next[i] = prev[i] === 'correct' ? 'wrong' : 'correct';
      return next;
    });
  };

  const reset = () => {
    isRecordingRef.current = false;
    recRef.current?.stop();
    setPhase('idle'); setInterim(''); setStatuses(null);
    fullTranscriptRef.current = '';
  };

  const score = statuses ? statuses.filter(s => s === 'correct').length : 0;
  const pct   = statuses ? Math.round((score / statuses.length) * 100) : 0;

  return (
    <>
      <div className="memorize-progress">
        <div className="memorize-progress-bar" style={{ width: `${(index / total) * 100}%` }} />
      </div>
      <div className="memorize-meta">Mishnah {index + 1} of {total}</div>

      <div className="memorize-card recite-card">
        <div className="memorize-num">{perek.num}:{mishnah.num}</div>
        <div className="memorize-prompt">{mishnah.attribution.en}</div>

        {phase === 'idle' && (
          <div className="recite-lang-toggle">
            <button className={`recite-lang-btn ${lang === 'he' ? 'active' : ''}`} onClick={() => setLang('he')}>עברית Hebrew</button>
            <button className={`recite-lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>English</button>
          </div>
        )}

        {/* Text — blurred while reciting, tappable after reveal */}
        <div className={`recite-text ${lang === 'he' ? 'recite-text--he' : 'recite-text--en'}`}
             dir={lang === 'he' ? 'rtl' : 'ltr'}>
          {(phase === 'idle' || phase === 'recording') && wordTokens.map((w, i) => (
            <span key={i} className="recite-word recite-word--blurred">{w}</span>
          ))}
          {phase === 'results' && statuses && wordTokens.map((w, i) => (
            <span key={i}
              className={`recite-word recite-word--${statuses[i]} recite-word--tappable`}
              onClick={() => toggleWord(i)}
              title="Tap to toggle correct / wrong">
              {w}
            </span>
          ))}
        </div>

        {/* Idle */}
        {phase === 'idle' && (
          <div className="recite-idle">
            <button className="recite-mic-btn" onClick={startRecording}>
              <Icon name="mic" size={26} />
            </button>
            <p className="recite-idle-hint">
              {lang === 'he' ? 'Tap to start — recite the mishnah in Hebrew from memory'
                             : 'Tap to start — recite the English translation from memory'}
            </p>
          </div>
        )}

        {/* Recording */}
        {phase === 'recording' && (
          <div className="recite-recording">
            <div className="recite-pulse-ring"><div className="recite-pulse-dot" /></div>
            <p className="recite-recording-label">Listening…</p>
            {interim && <p className="recite-live-text"><em>{interim}</em></p>}
            <button className="recite-done-btn" onClick={reveal}>
              <Icon name="check" size={14} /> Done — reveal
            </button>
          </div>
        )}

        {/* Results: score + tap-to-grade hint */}
        {phase === 'results' && statuses && (
          <div className="recite-score">
            <div className="recite-score-num">
              <span className="recite-score-big">{score}</span>
              <span className="recite-score-sep">/</span>
              <span className="recite-score-total">{statuses.length}</span>
            </div>
            <div className="recite-score-pct">{pct}% correct</div>
            <p className="recite-tap-hint">Tap any word to mark it wrong (grey → red) or correct (→ green)</p>
            {capturedText && (
              <details className="recite-transcript-details">
                <summary>What the mic heard</summary>
                <p className="recite-transcript-text" dir={lang === 'he' ? 'rtl' : 'ltr'}>{capturedText}</p>
              </details>
            )}
          </div>
        )}
      </div>

      <div className="fade-controls">
        {phase === 'results' && (
          <>
            <button className="fade-btn-soft" onClick={reset}>Try again</button>
            <button className="fade-btn" onClick={onDone}>Next mishnah →</button>
          </>
        )}
      </div>
    </>
  );
};

const MemorizeMode = ({ perek, onClose }) => {
  const [cards] = useState_m(() => perek.mishnayot.filter(m => !m.stub));
  const [idx, setIdx] = useState_m(0);

  const total = cards.length;
  const card = idx < total ? cards[idx] : null;
  const finished = total > 0 && idx >= total;

  return (
    <div className="modal-back" onClick={onClose}>
      <div className="memorize" onClick={e => e.stopPropagation()}>
        <div className="memorize-head">
          <div>
            <div className="memorize-eyebrow">Memorize · Perek {perek.num}</div>
            <div className="memorize-title">Recite aloud</div>
          </div>
          <button className="icon-btn" onClick={onClose} style={{color:'var(--ink)'}}><Icon name="close" /></button>
        </div>

        {total === 0 ? (
          <div className="memorize-empty">
            <Icon name="cards" size={28} />
            <div className="memorize-empty-title">Nothing to memorize yet</div>
            <div className="memorize-empty-sub">This chapter has no mishnayot loaded.</div>
            <button className="memorize-done-btn" onClick={onClose}>Close</button>
          </div>
        ) : finished ? (
          <div className="memorize-complete">
            <div className="memorize-complete-mark"><Icon name="check" size={26} /></div>
            <div className="memorize-complete-title">Perek {perek.num} complete</div>
            <div className="memorize-complete-sub">
              You worked through all {total} {total === 1 ? 'mishnah' : 'mishnayot'} in this chapter.
            </div>
            <div className="memorize-complete-actions">
              <button className="memorize-restart-btn" onClick={() => setIdx(0)}>Start over</button>
              <button className="memorize-done-btn" onClick={onClose}>Done</button>
            </div>
          </div>
        ) : (
          <ReciteCard
            key={`recite-${perek.num}-${card.num}`}
            perek={perek}
            mishnah={card}
            index={idx}
            total={total}
            onDone={() => setIdx(i => i + 1)}
          />
        )}
      </div>
    </div>
  );
};

// ============================================================
// Source sheet (printable)
// ============================================================
const SourceSheet = ({ mishnah, perek, onClose }) => {
  return (
    <div className="modal-back" onClick={onClose}>
      <div className="sheet-wrap" onClick={e => e.stopPropagation()}>
        <div className="sheet-toolbar">
          <span>Source Sheet · Avot {perek.num}:{mishnah.num}</span>
          <div style={{display:'flex', gap: 8}}>
            <button className="btn-primary"><Icon name="print" size={13} /> Print</button>
            <button className="btn-primary"><Icon name="download" size={13} /> PDF</button>
            <button className="btn-ghost" onClick={onClose}>Close</button>
          </div>
        </div>
        <div className="sheet-page">
          <div className="sheet-head">
            <div>
              <div className="sheet-eyebrow">Source Sheet</div>
              <div className="sheet-title">Pirkei Avot {perek.num}:{mishnah.num}</div>
              <div className="sheet-attr">{mishnah.attribution.he} · {mishnah.attribution.en}</div>
            </div>
            <div className="sheet-brand">
              <div style={{fontFamily: 'var(--hebrew)', fontSize: 24, color: 'var(--wine)'}}>אבות</div>
              <div style={{fontSize: 9, letterSpacing: '0.2em', color: 'var(--muted)'}}>AVOT</div>
            </div>
          </div>
          <hr />
          <div className="sheet-section">
            <div className="sheet-label">המשנה · The Mishnah</div>
            <div className="sheet-he">{mishnah.hebrew}</div>
            <div className="sheet-en">{mishnah.english}</div>
          </div>
          {mishnah.commentary && (
            <div className="sheet-section">
              <div className="sheet-label">פירושים · Commentary</div>
              {Object.entries(mishnah.commentary).slice(0, 3).map(([id, text]) => {
                const c = window.COMMENTATORS.find(c => c.id === id);
                if (!c) return null;
                return (
                  <div key={id} className="sheet-comm">
                    <div className="sheet-comm-head">
                      <span style={{fontWeight:600}}>{c.name}</span>
                      <span style={{fontFamily:'var(--hebrew)', color:'var(--muted)'}}>{c.he}</span>
                    </div>
                    <div className="sheet-comm-body">{text}</div>
                  </div>
                );
              })}
            </div>
          )}
          {mishnah.crossRefs && mishnah.crossRefs.length > 0 && (
            <div className="sheet-section">
              <div className="sheet-label">מקורות · Cross References</div>
              <ul className="sheet-list">
                {mishnah.crossRefs.map((r, i) => (
                  <li key={i}><strong>{r.source}.</strong> {r.text}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="sheet-section">
            <div className="sheet-label">שאלות לדיון · Discussion Questions</div>
            <ol className="sheet-list">
              <li>What is the most surprising word choice in this Mishnah, and why might it matter?</li>
              <li>How would you live this teaching out in one specific situation this week?</li>
              <li>Which commentator above resonates with you most — and which one challenges you?</li>
            </ol>
          </div>
          <div className="sheet-foot">
            <span>avot.app · Generated source sheet</span>
            <span>{new Date().toLocaleDateString(undefined, {month:'long', day:'numeric', year:'numeric'})}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// Parent Dashboard (kids progress)
// ============================================================
const ParentDashboard = ({ onClose }) => {
  return (
    <div className="modal-back" onClick={onClose}>
      <div className="parent-dash" onClick={e => e.stopPropagation()}>
        <div className="parent-head">
          <div>
            <div className="memorize-eyebrow">Parent Dashboard</div>
            <div className="memorize-title">Children's Progress</div>
          </div>
          <button className="icon-btn" onClick={onClose} style={{color:'var(--ink)'}}><Icon name="close" /></button>
        </div>
        <div className="parent-kids">
          {[
            { name: "Yael", age: 7, color: "#d97a4a", stars: 23, streak: 5, last: "Avot 1:3" },
            { name: "Eli", age: 9, color: "#5a8aaa", stars: 41, streak: 12, last: "Avot 1:6" },
            { name: "Tova", age: 5, color: "#8a6db0", stars: 8, streak: 2, last: "Avot 1:1" },
          ].map(k => (
            <div key={k.name} className="parent-kid">
              <div className="kid-avatar" style={{background: k.color}}>{k.name[0]}</div>
              <div className="kid-info">
                <div className="kid-name">{k.name}, {k.age}</div>
                <div className="kid-stats">
                  <span><strong>{k.stars}</strong> stars</span>
                  <span><strong>{k.streak}</strong>-day streak</span>
                  <span>Last: <strong>{k.last}</strong></span>
                </div>
                <div className="kid-bar"><div className="kid-bar-fill" style={{width: `${Math.min(100, k.stars*2)}%`, background: k.color}} /></div>
              </div>
            </div>
          ))}
        </div>
        <div className="parent-actions">
          <button className="btn-primary" style={{background: 'var(--ink)', color:'var(--paper)'}}><Icon name="plus" size={13} /> Add child profile</button>
          <button className="btn-primary"><Icon name="bell" size={13} /> Daily reminders</button>
          <button className="btn-primary"><Icon name="settings" size={13} /> Content filters</button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// Coloring page — tap-to-fill regions, download as PNG, print
// ============================================================

const CP_COLORS = [
  { name: 'Red',    hex: '#e74c3c' },
  { name: 'Orange', hex: '#e8843a' },
  { name: 'Yellow', hex: '#f0c64a' },
  { name: 'Green',  hex: '#5aaa48' },
  { name: 'Sky',    hex: '#85b8e0' },
  { name: 'Blue',   hex: '#3a78d0' },
  { name: 'Purple', hex: '#8a4fb8' },
  { name: 'Pink',   hex: '#e0578f' },
  { name: 'Brown',  hex: '#8a5a3a' },
  { name: 'Tan',    hex: '#e8c89a' },
  { name: 'Black',  hex: '#2a2a2a' },
  { name: 'Eraser', hex: '#ffffff' },
];

// Detailed Sinai line-art for Mishnah 1:1 — Moshe receives the Torah.
// Roughly 35 fillable regions, designed to feel like a real kids' coloring page.
const SinaiColoringSVG = ({ fills, onFill, svgRef }) => {
  const r = (id) => ({
    'data-id': id,
    fill: fills[id] || '#ffffff',
    stroke: '#1a1a1a',
    strokeWidth: 2.5,
    strokeLinejoin: 'round',
    onClick: () => onFill(id),
    style: { cursor: 'pointer' },
  });
  return (
    <svg
      ref={svgRef}
      viewBox="0 0 800 1000"
      xmlns="http://www.w3.org/2000/svg"
      className="cp-svg"
    >
      {/* Outer page frame */}
      <rect {...r('frame_outer')} x="20" y="20" width="760" height="960" rx="14" />
      <rect {...r('frame_inner')} x="40" y="40" width="720" height="920" rx="8" />

      {/* Title banner */}
      <path {...r('banner')} d="M 200 50 L 600 50 L 624 95 L 600 140 L 200 140 L 176 95 Z" />
      <text x="400" y="105" textAnchor="middle" fontFamily="Georgia, serif" fontSize="28" fontWeight="600" fill="none" stroke="#1a1a1a" strokeWidth="1.2">
        From Sinai
      </text>

      {/* Sky */}
      <path {...r('sky')} d="M 60 150 L 740 150 L 740 600 L 60 600 Z" />

      {/* Sun */}
      <circle {...r('sun')} cx="660" cy="230" r="46" />
      <polygon {...r('ray_n')}  points="660,160 651,182 669,182" />
      <polygon {...r('ray_e')}  points="730,230 708,221 708,239" />
      <polygon {...r('ray_s')}  points="660,300 651,278 669,278" />
      <polygon {...r('ray_w')}  points="590,230 612,221 612,239" />
      <polygon {...r('ray_ne')} points="713,177 695,193 708,205" />
      <polygon {...r('ray_se')} points="713,283 695,267 708,255" />
      <polygon {...r('ray_sw')} points="607,283 625,267 612,255" />
      <polygon {...r('ray_nw')} points="607,177 625,193 612,205" />

      {/* Clouds */}
      <path {...r('cloud1')} d="M 100 250 Q 110 222, 150 226 Q 165 205, 200 220 Q 230 210, 245 235 Q 260 252, 235 260 L 110 260 Q 88 260, 100 250 Z" />
      <path {...r('cloud2')} d="M 290 320 Q 300 295, 340 299 Q 355 278, 390 295 Q 420 285, 432 308 Q 446 325, 420 330 L 305 330 Q 282 330, 290 320 Z" />
      <path {...r('cloud3')} d="M 490 245 Q 502 222, 540 226 Q 555 208, 590 222 Q 615 235, 600 252 L 510 252 Q 488 252, 490 245 Z" />

      {/* Birds */}
      <path {...r('bird1')} d="M 200 195 Q 215 182, 230 195 Q 245 182, 260 195 L 260 200 Q 245 188, 230 200 Q 215 188, 200 200 Z" />
      <path {...r('bird2')} d="M 360 215 Q 375 202, 390 215 Q 405 202, 420 215 L 420 220 Q 405 208, 390 220 Q 375 208, 360 220 Z" />
      <path {...r('bird3')} d="M 460 340 Q 475 327, 490 340 Q 505 327, 520 340 L 520 345 Q 505 333, 490 345 Q 475 333, 460 345 Z" />

      {/* Decorative stars */}
      <polygon {...r('star1')} points="160,180 164,191 175,191 166,198 169,209 160,202 151,209 154,198 145,191 156,191" />
      <polygon {...r('star2')} points="740,300 744,310 754,310 746,317 749,327 740,321 731,327 734,317 726,310 736,310" />
      <polygon {...r('star3')} points="80,400 84,410 94,410 86,417 89,427 80,421 71,427 74,417 66,410 76,410" />

      {/* Side mountain left */}
      <polygon {...r('left_mtn')} points="60,740 230,460 380,740" />
      <polygon {...r('left_mtn_snow')} points="208,495 230,460 252,495 240,505 220,505" />

      {/* Side mountain right */}
      <polygon {...r('right_mtn')} points="420,740 570,460 740,740" />
      <polygon {...r('right_mtn_snow')} points="548,495 570,460 592,495 580,505 560,505" />

      {/* Main Sinai mountain */}
      <polygon {...r('sinai')} points="180,740 400,290 620,740" />
      <polygon {...r('sinai_snow')} points="368,375 400,290 432,375 420,388 380,388" />

      {/* Rays of light streaming down */}
      <polygon {...r('ray_light_1')} points="378,450 360,580 396,580 396,450" />
      <polygon {...r('ray_light_2')} points="404,450 404,580 440,580 422,450" />

      {/* Tablets of stone */}
      <path {...r('tablet_l')} d="M 360 488 L 360 600 Q 360 612, 372 612 L 392 612 Q 400 612, 400 602 L 400 510 Q 400 488, 380 488 Z" />
      <path {...r('tablet_r')} d="M 400 488 L 400 602 Q 400 612, 408 612 L 428 612 Q 440 612, 440 600 L 440 510 Q 440 488, 420 488 Z" />
      {/* Tablet engraving lines (decorative, not fillable) */}
      <line x1="366" y1="520" x2="394" y2="520" stroke="#1a1a1a" strokeWidth="1.4" />
      <line x1="366" y1="540" x2="394" y2="540" stroke="#1a1a1a" strokeWidth="1.4" />
      <line x1="366" y1="560" x2="394" y2="560" stroke="#1a1a1a" strokeWidth="1.4" />
      <line x1="366" y1="580" x2="394" y2="580" stroke="#1a1a1a" strokeWidth="1.4" />
      <line x1="406" y1="520" x2="434" y2="520" stroke="#1a1a1a" strokeWidth="1.4" />
      <line x1="406" y1="540" x2="434" y2="540" stroke="#1a1a1a" strokeWidth="1.4" />
      <line x1="406" y1="560" x2="434" y2="560" stroke="#1a1a1a" strokeWidth="1.4" />
      <line x1="406" y1="580" x2="434" y2="580" stroke="#1a1a1a" strokeWidth="1.4" />

      {/* Moshe figure */}
      <path {...r('robe')} d="M 372 740 L 372 670 Q 372 645, 400 628 Q 428 645, 428 670 L 428 740 Z" />
      <circle {...r('head')} cx="400" cy="616" r="16" />
      <path {...r('beard')} d="M 386 622 Q 386 648, 400 654 Q 414 648, 414 622 Z" />
      <rect {...r('staff')} x="430" y="660" width="6" height="84" />

      {/* Ground / hills */}
      <path {...r('ground')} d="M 60 740 L 740 740 L 740 940 L 60 940 Z" />

      {/* Path winding up to mountain */}
      <path {...r('path')} d="M 340 940 L 425 940 L 412 740 L 388 740 Z" />

      {/* Trees */}
      <rect {...r('tree1_trunk')} x="100" y="830" width="26" height="80" rx="3" />
      <ellipse {...r('tree1_leaves')} cx="113" cy="810" rx="48" ry="56" />
      <ellipse {...r('tree1_detail')} cx="113" cy="795" rx="22" ry="22" />

      <rect {...r('tree2_trunk')} x="674" y="830" width="26" height="80" rx="3" />
      <ellipse {...r('tree2_leaves')} cx="687" cy="810" rx="48" ry="56" />
      <ellipse {...r('tree2_detail')} cx="687" cy="795" rx="22" ry="22" />

      {/* Flowers along the ground */}
      <line x1="220" y1="895" x2="220" y2="930" stroke="#1a1a1a" strokeWidth="2.5" />
      <circle {...r('flower1_petal')} cx="220" cy="880" r="14" />
      <circle {...r('flower1_center')} cx="220" cy="880" r="5" />

      <line x1="280" y1="910" x2="280" y2="932" stroke="#1a1a1a" strokeWidth="2.5" />
      <circle {...r('flower2_petal')} cx="280" cy="900" r="12" />
      <circle {...r('flower2_center')} cx="280" cy="900" r="4" />

      <line x1="520" y1="905" x2="520" y2="930" stroke="#1a1a1a" strokeWidth="2.5" />
      <circle {...r('flower3_petal')} cx="520" cy="893" r="13" />
      <circle {...r('flower3_center')} cx="520" cy="893" r="4" />

      <line x1="580" y1="895" x2="580" y2="930" stroke="#1a1a1a" strokeWidth="2.5" />
      <circle {...r('flower4_petal')} cx="580" cy="880" r="14" />
      <circle {...r('flower4_center')} cx="580" cy="880" r="5" />

      {/* Grass tufts */}
      <path d="M 170 935 L 175 920 L 180 935" stroke="#1a1a1a" strokeWidth="2" fill="none" />
      <path d="M 350 938 L 355 922 L 360 938" stroke="#1a1a1a" strokeWidth="2" fill="none" />
      <path d="M 460 938 L 465 922 L 470 938" stroke="#1a1a1a" strokeWidth="2" fill="none" />
      <path d="M 630 935 L 635 920 L 640 935" stroke="#1a1a1a" strokeWidth="2" fill="none" />

      {/* Corner ornaments */}
      <path {...r('corner_tl')} d="M 60 60 L 110 60 L 110 75 Q 95 75, 90 90 Q 75 95, 60 95 Z" />
      <path {...r('corner_tr')} d="M 740 60 L 690 60 L 690 75 Q 705 75, 710 90 Q 725 95, 740 95 Z" />
      <path {...r('corner_bl')} d="M 60 940 L 110 940 L 110 925 Q 95 925, 90 910 Q 75 905, 60 905 Z" />
      <path {...r('corner_br')} d="M 740 940 L 690 940 L 690 925 Q 705 925, 710 910 Q 725 905, 740 905 Z" />
    </svg>
  );
};

// Simpler placeholder for mishnayot that have not yet been illustrated.
const SimpleColoringSVG = ({ mishnah, fills, onFill, svgRef }) => {
  const r = (id) => ({
    'data-id': id,
    fill: fills[id] || '#ffffff',
    stroke: '#1a1a1a',
    strokeWidth: 2.5,
    strokeLinejoin: 'round',
    onClick: () => onFill(id),
    style: { cursor: 'pointer' },
  });
  return (
    <svg ref={svgRef} viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg" className="cp-svg">
      <rect {...r('frame_outer')} x="20" y="20" width="760" height="960" rx="14" />
      <rect {...r('frame_inner')} x="40" y="40" width="720" height="920" rx="8" />
      <path {...r('banner')} d="M 200 50 L 600 50 L 624 95 L 600 140 L 200 140 L 176 95 Z" />
      <text x="400" y="105" textAnchor="middle" fontFamily="Georgia, serif" fontSize="28" fontWeight="600" fill="none" stroke="#1a1a1a" strokeWidth="1.2">
        Mishnah {mishnah.num}
      </text>
      {/* A simple three-pillar scene — full coloring art coming for every mishnah */}
      <rect {...r('back')} x="60" y="160" width="680" height="780" rx="20" />
      <rect {...r('p1_base')} x="120" y="780" width="160" height="40" />
      <rect {...r('p1_shaft')} x="148" y="320" width="104" height="460" />
      <rect {...r('p1_cap')} x="120" y="280" width="160" height="40" />
      <rect {...r('p2_base')} x="320" y="780" width="160" height="40" />
      <rect {...r('p2_shaft')} x="348" y="280" width="104" height="500" />
      <rect {...r('p2_cap')} x="320" y="240" width="160" height="40" />
      <rect {...r('p3_base')} x="520" y="780" width="160" height="40" />
      <rect {...r('p3_shaft')} x="548" y="320" width="104" height="460" />
      <rect {...r('p3_cap')} x="520" y="280" width="160" height="40" />
      <circle {...r('sun_a')} cx="200" cy="220" r="30" />
      <circle {...r('sun_b')} cx="600" cy="220" r="30" />
    </svg>
  );
};

const ColoringPage = ({ mishnah, onClose }) => {
  const [activeColor, setActiveColor] = useState_m(CP_COLORS[5].hex); // blue
  const [fills, setFills] = useState_m({});
  const svgRef = useRef_m(null);

  const fillRegion = (id) => {
    setFills(prev => ({ ...prev, [id]: activeColor }));
  };
  const resetAll = () => setFills({});

  const downloadPNG = () => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgEl);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const W = 1600, H = 2000; // 2x viewBox for crisp PNG
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, W, H);
      ctx.drawImage(img, 0, 0, W, H);
      canvas.toBlob((pngBlob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(pngBlob);
        link.download = `avot-coloring-mishnah-${mishnah.num}.png`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(link.href), 1000);
        URL.revokeObjectURL(url);
      }, 'image/png');
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      alert('Could not export this page. Try Print instead.');
    };
    img.src = url;
  };

  const printIt = () => {
    document.body.classList.add('cp-printing');
    setTimeout(() => {
      window.print();
      document.body.classList.remove('cp-printing');
    }, 50);
  };

  return (
    <div className="modal-back cp-modal" onClick={onClose}>
      <div className="cp-wrap" onClick={e => e.stopPropagation()}>
        <div className="cp-toolbar">
          <div>
            <div className="memorize-eyebrow">Coloring Page</div>
            <div className="memorize-title" style={{fontStyle:'normal', fontFamily:'var(--serif)', fontSize: '20px'}}>
              Mishnah {mishnah.num}
            </div>
          </div>
          <div className="cp-actions">
            <button className="cp-btn" onClick={resetAll} title="Clear all colors">↺ Reset</button>
            <button className="cp-btn" onClick={downloadPNG} title="Save your colored picture">⬇ Download PNG</button>
            <button className="cp-btn" onClick={printIt} title="Print the blank page to color on paper">🖨 Print blank</button>
            <button className="icon-btn cp-close" onClick={onClose} aria-label="Close" style={{color:'var(--ink)'}}>
              <Icon name="close" />
            </button>
          </div>
        </div>

        <div className="cp-stage">
          <div className="cp-palette" role="toolbar" aria-label="Color palette">
            {CP_COLORS.map(c => (
              <button
                key={c.hex}
                className={`cp-crayon ${activeColor === c.hex ? 'active' : ''} ${c.name === 'Eraser' ? 'cp-eraser' : ''}`}
                style={{ background: c.hex }}
                onClick={() => setActiveColor(c.hex)}
                aria-label={c.name}
                title={c.name}
              >
                {c.name === 'Eraser' && '✕'}
              </button>
            ))}
          </div>

          <div className="cp-canvas-wrap">
            <div className="cp-canvas">
              {(() => {
                const Scene = getColoringFor(mishnah.num);
                if (Scene) {
                  return <Scene mishnah={mishnah} fills={fills} onFill={fillRegion} svgRef={svgRef} />;
                }
                return <SimpleColoring mishnah={mishnah} fills={fills} onFill={fillRegion} svgRef={svgRef} />;
              })()}
            </div>
            <div className="cp-hint">
              <span className="cp-hint-color" style={{ background: activeColor }} />
              <span>Tap any region to fill it with the active color.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// Note popover
// ============================================================
const NotePopover = ({ pos, hl, onSave, onClose }) => {
  const [note, setNote] = useState_m(hl?.note || '');
  const [tagText, setTagText] = useState_m((hl?.tags || []).join(', '));
  if (!pos) return null;
  return (
    <div className="note-pop" style={{left: pos.x, top: pos.y}} onClick={e => e.stopPropagation()}>
      <textarea autoFocus placeholder="Your note about this passage…"
        value={note} onChange={e => setNote(e.target.value)} />
      <div className="actions">
        <input className="tag-input" placeholder="add tags, comma-separated"
          value={tagText} onChange={e => setTagText(e.target.value)} />
        <button className="save-btn" onClick={() => {
          const tags = tagText.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean);
          onSave({ ...hl, note, tags });
        }}>Save</button>
      </div>
    </div>
  );
};

Object.assign(window, { SelectionToolbar, QuoteCard, MemorizeMode, SourceSheet, ParentDashboard, ColoringPage, NotePopover });

export { ColoringPage, MemorizeMode, NotePopover, ParentDashboard, QuoteCard, SelectionToolbar, SourceSheet };
