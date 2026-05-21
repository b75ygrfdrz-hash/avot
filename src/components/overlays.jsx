import React from 'react';
import { Icon } from './Icon.jsx';

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
// Memorize mode — fade to memory
// ============================================================

// One mishnah, learned by the fade technique: progressively hide words
// and recall them, until the whole text is hidden and known by heart.
const FadeCard = ({ perek, mishnah, index, total, onLearned }) => {
  const words = useMemo(() => mishnah.hebrew.split(/\s+/).filter(Boolean), [mishnah]);
  // A fixed random order in which words get hidden.
  const order = useMemo(() => {
    const a = words.map((_, i) => i);
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }, [words]);

  const LEVELS = [0, 0.2, 0.4, 0.6, 0.8, 1];
  const [level, setLevel] = useState_m(0);
  const [peeked, setPeeked] = useState_m(() => new Set());

  const frac = LEVELS[level];
  const hideCount = Math.round(frac * words.length);
  const hidden = useMemo(() => new Set(order.slice(0, hideCount)), [order, hideCount]);
  const atFull = level >= LEVELS.length - 1;
  const shown = (i) => !hidden.has(i) || peeked.has(i);

  const hideMore = () => { setLevel(l => Math.min(LEVELS.length - 1, l + 1)); setPeeked(new Set()); };
  const showAll = () => { setLevel(0); setPeeked(new Set()); };
  const peek = (i) => setPeeked(p => { const n = new Set(p); n.add(i); return n; });

  return (
    <>
      <div className="memorize-progress">
        <div className="memorize-progress-bar" style={{ width: `${(index / total) * 100}%` }} />
      </div>
      <div className="memorize-meta">Mishnah {index + 1} of {total}</div>
      <div className="memorize-card fade-card">
        <div className="memorize-num">{perek.num}:{mishnah.num}</div>
        <div className="memorize-prompt">{mishnah.attribution.en}</div>
        <div className="fade-text" dir="rtl">
          {words.map((w, i) => (
            <span
              key={i}
              className={`fade-word ${shown(i) ? '' : 'faded'}`}
              onClick={() => { if (!shown(i)) peek(i); }}>
              {w}
            </span>
          ))}
        </div>
        <div className="fade-en">{mishnah.english}</div>
        <div className="fade-status">
          {frac === 0
            ? 'Read it through, then start hiding words.'
            : atFull
            ? 'The whole mishnah is hidden — recite it from memory.'
            : `Reciting ${Math.round(frac * 100)}% from memory.`}
        </div>
      </div>
      <div className="fade-controls">
        {level > 0 && <button className="fade-btn-soft" onClick={showAll}>Show all</button>}
        {atFull ? (
          <button className="fade-btn" onClick={onLearned}>I have learned this →</button>
        ) : (
          <button className="fade-btn" onClick={hideMore}>
            {frac === 0 ? 'Start hiding words' : 'Hide more'}
          </button>
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
            <div className="memorize-eyebrow">Memorize · Fade to memory</div>
            <div className="memorize-title">Perek {perek.num}</div>
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
          <FadeCard
            key={`${perek.num}-${card.num}`}
            perek={perek}
            mishnah={card}
            index={idx}
            total={total}
            onLearned={() => setIdx(i => i + 1)}
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
// Coloring page
// ============================================================
const ColoringPage = ({ mishnah, onClose }) => {
  const [color, setColor] = useState_m('#d97a4a');
  const colors = ['#d97a4a', '#e8b144', '#5a8aaa', '#6aa56a', '#8a6db0', '#a85454'];
  return (
    <div className="modal-back" onClick={onClose}>
      <div className="coloring-wrap" onClick={e => e.stopPropagation()}>
        <div className="coloring-head">
          <div>
            <div className="memorize-eyebrow">Coloring Page</div>
            <div className="memorize-title">Mishnah {mishnah.num}</div>
          </div>
          <button className="icon-btn" onClick={onClose} style={{color:'var(--ink)'}}><Icon name="close" /></button>
        </div>
        <div className="coloring-canvas">
          <svg viewBox="0 0 400 400" width="100%" style={{maxHeight: 380}}>
            {/* Simple line-art placeholder — three pillars */}
            <rect x="40" y="80" width="320" height="280" fill="none" stroke="#3a2a1a" strokeWidth="3" rx="8" />
            <text x="200" y="60" textAnchor="middle" fontFamily="var(--hebrew)" fontSize="24" fill="#3a2a1a">פרק א משנה {mishnah.num}</text>
            {/* Three pillars */}
            <g transform="translate(80, 150)">
              <rect x="0" y="0" width="50" height="180" fill="none" stroke="#3a2a1a" strokeWidth="2.5" />
              <rect x="-8" y="-10" width="66" height="14" fill="none" stroke="#3a2a1a" strokeWidth="2.5" />
              <rect x="-8" y="180" width="66" height="14" fill="none" stroke="#3a2a1a" strokeWidth="2.5" />
            </g>
            <g transform="translate(175, 150)">
              <rect x="0" y="0" width="50" height="180" fill="none" stroke="#3a2a1a" strokeWidth="2.5" />
              <rect x="-8" y="-10" width="66" height="14" fill="none" stroke="#3a2a1a" strokeWidth="2.5" />
              <rect x="-8" y="180" width="66" height="14" fill="none" stroke="#3a2a1a" strokeWidth="2.5" />
            </g>
            <g transform="translate(270, 150)">
              <rect x="0" y="0" width="50" height="180" fill="none" stroke="#3a2a1a" strokeWidth="2.5" />
              <rect x="-8" y="-10" width="66" height="14" fill="none" stroke="#3a2a1a" strokeWidth="2.5" />
              <rect x="-8" y="180" width="66" height="14" fill="none" stroke="#3a2a1a" strokeWidth="2.5" />
            </g>
            <text x="200" y="380" textAnchor="middle" fontSize="14" fill="#3a2a1a">— Three things the world stands on —</text>
          </svg>
        </div>
        <div className="coloring-palette">
          {colors.map(c => (
            <button key={c} className={`crayon ${color === c ? 'active' : ''}`} style={{background: c}} onClick={() => setColor(c)} />
          ))}
          <div style={{flex:1}} />
          <button className="btn-primary" style={{background:'var(--ink)', color:'var(--paper)'}}>
            <Icon name="print" size={13} /> Print
          </button>
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
