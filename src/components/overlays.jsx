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
// Memorize mode (spaced repetition flashcards)
// ============================================================
const MemorizeMode = ({ perek, onClose }) => {
  const [idx, setIdx] = useState_m(0);
  const [revealed, setRevealed] = useState_m(false);
  const cards = perek.mishnayot.filter(m => !m.stub);
  const card = cards[idx];

  const judge = (level) => {
    // SRS levels: again / hard / good / easy
    setRevealed(false);
    setIdx(i => Math.min(cards.length - 1, i + 1));
  };

  if (!card) return null;
  const done = idx >= cards.length - 1 && revealed === false && idx === cards.length - 1;

  return (
    <div className="modal-back" onClick={onClose}>
      <div className="memorize" onClick={e => e.stopPropagation()}>
        <div className="memorize-head">
          <div>
            <div className="memorize-eyebrow">Memorize · Spaced Repetition</div>
            <div className="memorize-title">Perek {perek.num} · {idx + 1} of {cards.length}</div>
          </div>
          <button className="icon-btn" onClick={onClose} style={{color:'var(--ink)'}}><Icon name="close" /></button>
        </div>
        <div className="memorize-progress">
          <div className="memorize-progress-bar" style={{width: `${((idx + 1) / cards.length) * 100}%`}} />
        </div>
        <div className="memorize-card" onClick={() => setRevealed(true)}>
          <div className="memorize-num">{perek.num}:{card.num}</div>
          <div className="memorize-prompt">Recite the Mishnah of {card.attribution.en}…</div>
          {revealed ? (
            <>
              <div className="memorize-he">{card.hebrew}</div>
              <div className="memorize-en">{card.english}</div>
            </>
          ) : (
            <div className="memorize-cta">Try to recall, then tap to reveal</div>
          )}
        </div>
        {revealed && (
          <div className="memorize-judge">
            <button className="judge again" onClick={() => judge('again')}>Again<span>&lt; 1m</span></button>
            <button className="judge hard" onClick={() => judge('hard')}>Hard<span>10m</span></button>
            <button className="judge good" onClick={() => judge('good')}>Good<span>1d</span></button>
            <button className="judge easy" onClick={() => judge('easy')}>Easy<span>4d</span></button>
          </div>
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
