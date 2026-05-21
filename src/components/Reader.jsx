import React from 'react';
import { Icon } from './Icon.jsx';
import { MESORAH_CHAIN, NodePopover, findActiveIdx } from './MesorahChain.jsx';

const { useState, useEffect, useRef, useCallback, useMemo } = React;
const useS = useState, useE = useEffect, useR = useRef, useC = useCallback;
const useState_p = useState, useEffect_p = useEffect, useState_k = useState;
const useState_m = useState, useEffect_m = useEffect, useRef_m = useRef;
const useS_s = useState, useE_s = useEffect, useR_s = useRef;
const useState_a = useState, useEffect_a = useEffect;
const useState_mc = useState, useRef_mc = useRef, useEffect_mc = useEffect;
const useEffect_h = useEffect, useState_ms = useState, useEffect_ms = useEffect;
const useS_o = useState, useE_o = useEffect;

const Reader = ({ perek, mishnah, mishnahIdx, perekIdx, setMishnahIdx, setPerekIdx, perakim, onSelection, highlights, onHighlightClick, layout, setLayout, showWordHover, setShowWordHover, onShareQuote, onSourceSheet, dropcap }) => {
  const textRef = useRef(null);

  // Rabbi info — popover anchored to a button beside the attribution name
  const rabbiBtnRef = useRef(null);
  const [rabbiOpen, setRabbiOpen] = useState(false);
  const rabbiIdx = findActiveIdx(mishnah.attribution?.en || '', perek.num, mishnah.num);
  const rabbiNode = rabbiIdx >= 0 ? MESORAH_CHAIN[rabbiIdx] : null;
  useEffect(() => { setRabbiOpen(false); }, [perekIdx, mishnahIdx]);
  const navigateToRef = (perekNum, mishnahNum) => {
    const pIdx = perakim.findIndex(p => p.num === perekNum);
    if (pIdx < 0) return;
    const mIdx = perakim[pIdx].mishnayot.findIndex(m => m.num === mishnahNum);
    if (mIdx < 0) return;
    setPerekIdx(pIdx);
    setMishnahIdx(mIdx);
  };

  // Wrap selected ranges with highlight spans
  const renderEnglishWithHighlights = (text) => {
    const my = highlights.filter(h => h.lang === 'en' && h.mishnah === mishnah.num && h.perek === perek.num);
    if (my.length === 0) return text;
    // sort by start desc, splice spans in
    const sorted = [...my].sort((a, b) => b.start - a.start);
    let parts = [text];
    sorted.forEach(h => {
      const newParts = [];
      parts.forEach(p => {
        if (typeof p !== 'string') { newParts.push(p); return; }
        const s = h.start, e = h.end;
        if (s >= p.length || e <= 0) { newParts.push(p); return; }
        newParts.push(p.slice(0, s));
        newParts.push(
          <mark key={h.id} className={`hl hl-${h.color} ${h.note ? 'hl-has-note' : ''}`}
            onClick={(ev) => { ev.stopPropagation(); onHighlightClick(h, ev); }}>
            {p.slice(s, e)}
          </mark>
        );
        newParts.push(p.slice(e));
      });
      parts = newParts;
    });
    return parts;
  };

  // Hebrew text — split into words for hover
  const renderHebrewWords = () => {
    if (!showWordHover || !mishnah.words || mishnah.words.length === 0) {
      return mishnah.hebrew;
    }
    const tokens = mishnah.hebrew.split(/(\s+)/);
    const lookupMap = {};
    mishnah.words.forEach(w => {
      const clean = w.he.replace(/[׳״.,;:]/g, '');
      lookupMap[clean] = w.en;
    });
    return tokens.map((tok, i) => {
      const clean = tok.trim().replace(/[׳״.,;:]/g, '');
      if (lookupMap[clean]) {
        return <span key={i} className="word">{tok}<span className="tip">{lookupMap[clean]}</span></span>;
      }
      return tok;
    });
  };

  // Find the nearest perek in a direction that actually has mishnayot
  const nextPerek = () => {
    for (let p = perekIdx + 1; p < perakim.length; p++) if (perakim[p].mishnayot.length) return p;
    return -1;
  };
  const prevPerek = () => {
    for (let p = perekIdx - 1; p >= 0; p--) if (perakim[p].mishnayot.length) return p;
    return -1;
  };
  const hasNext = mishnahIdx < perek.mishnayot.length - 1 || nextPerek() >= 0;
  const hasPrev = mishnahIdx > 0 || prevPerek() >= 0;

  const goNext = () => {
    if (mishnahIdx < perek.mishnayot.length - 1) {
      setMishnahIdx(mishnahIdx + 1);
    } else {
      const p = nextPerek();
      if (p >= 0) { setPerekIdx(p); setMishnahIdx(0); }
    }
  };
  const goPrev = () => {
    if (mishnahIdx > 0) {
      setMishnahIdx(mishnahIdx - 1);
    } else {
      const p = prevPerek();
      if (p >= 0) { setPerekIdx(p); setMishnahIdx(Math.max(0, perakim[p].mishnayot.length - 1)); }
    }
  };

  return (
    <div className="reader" data-screen-label={`P${perek.num}:M${mishnah.num} Reader`}>
      <div className="reader-inner" key={`${perekIdx}-${mishnahIdx}`}>

        <div className="mishnah-header" data-num={`${perek.num}:${mishnah.num}`}>
          <div className="mishnah-num">
            <span>{perek.num}</span>
            <span className="slash">:</span>
            <span>{mishnah.num}</span>
          </div>
          <div className="attribution">
            <div className="attribution-name">
              <div className="he">{mishnah.attribution.he}</div>
              <div className="en">{mishnah.attribution.en}</div>
            </div>
            {rabbiNode && (
              <button
                ref={rabbiBtnRef}
                className={`rabbi-info-btn ${rabbiOpen ? 'open' : ''}`}
                onClick={() => setRabbiOpen(o => !o)}
                data-tip={`About ${rabbiNode.nameEn}`}
                data-tip-pos="bottom"
                aria-label={`About ${rabbiNode.nameEn}`}>
                <Icon name="info" size={17} />
              </button>
            )}
          </div>
        </div>

        {rabbiOpen && rabbiNode && (
          <NodePopover
            node={rabbiNode}
            anchor={rabbiBtnRef.current}
            onClose={() => setRabbiOpen(false)}
            onNavigate={navigateToRef} />
        )}

        <div className="text-toolbar">
          <div className="layout-segmented">
          <button onClick={() => setLayout('stacked')} className={layout === 'stacked' ? 'active' : ''} data-tip="Hebrew above, English below">
            <Icon name="menu" size={11} /> Stacked
          </button>
          <button onClick={() => setLayout('split')} className={layout === 'split' ? 'active' : ''} data-tip="Side-by-side Hebrew · English">
            <Icon name="grid" size={11} /> Split
          </button>
          <button onClick={() => setLayout('hebrew')} className={layout === 'hebrew' ? 'active' : ''} data-tip="Hebrew text only">
            <span style={{fontFamily:'var(--hebrew)', fontWeight:600}}>א</span> Hebrew
          </button>
          <button onClick={() => setLayout('english')} className={layout === 'english' ? 'active' : ''} data-tip="English translation only">
            <span style={{fontWeight:600}}>A</span> English
          </button>
          </div>
          <div className="divider" />
          <button onClick={() => setShowWordHover(!showWordHover)} className={showWordHover ? 'active' : ''} data-tip="Hover any Hebrew word for translation">
            <Icon name="eye" size={11} /> Word-by-word
          </button>
          <div className="divider" />
          <button onClick={onShareQuote} data-tip="Beautiful shareable quote card"><Icon name="share" size={11} /> Share</button>
          <button onClick={onSourceSheet} data-tip="Printable source sheet with commentary"><Icon name="print" size={11} /> Source sheet</button>
        </div>

        {layout === 'split' ? (
          <div className="split-view">
            <div className="split-he">
              <div className="hebrew-text">{renderHebrewWords()}</div>
            </div>
            <div className="split-en">
              <div className={`english-text ${dropcap ? 'with-dropcap' : ''}`} ref={textRef} onMouseUp={(e) => onSelection(e, 'en')}>
                {renderEnglishWithHighlights(mishnah.english)}
              </div>
            </div>
          </div>
        ) : (
          <>
            {layout !== 'english' && (
              <div className="hebrew-text" onMouseUp={(e) => onSelection(e, 'he')}>
                {renderHebrewWords()}
              </div>
            )}
            {layout !== 'hebrew' && (
              <div className={`english-text ${dropcap ? 'with-dropcap' : ''}`} ref={textRef} onMouseUp={(e) => onSelection(e, 'en')}>
                {renderEnglishWithHighlights(mishnah.english)}
              </div>
            )}
          </>
        )}

        {mishnah.themes && (
          <div className="themes">
            {mishnah.themes.map(t => <span key={t} className="theme-pill">{t}</span>)}
          </div>
        )}

        <div className="reader-nav">
          {hasPrev ? (
            <button className="nav-btn prev" onClick={goPrev}>
              <span className="lbl">← Previous</span>
              <span className="ttl">
                {mishnahIdx > 0 ? `Mishnah ${perek.mishnayot[mishnahIdx - 1]?.num}` : `Perek ${perakim[perekIdx-1]?.num}`}
              </span>
            </button>
          ) : <div style={{flex:1}} />}
          {hasNext ? (
            <button className="nav-btn next" onClick={goNext}>
              <span className="lbl">Next →</span>
              <span className="ttl">
                {mishnahIdx < perek.mishnayot.length - 1
                  ? `Mishnah ${perek.mishnayot[mishnahIdx + 1]?.num} · ${perek.mishnayot[mishnahIdx + 1]?.attribution.en}`
                  : `Perek ${perakim[perekIdx+1]?.num}`}
              </span>
            </button>
          ) : <div style={{flex:1}} />}
        </div>
      </div>
    </div>
  );
};


// ============================================================
// Accent picker — quick color swatch popover in the header
// ============================================================
const ACCENT_SWATCHES = [
  { id: 'gold', label: 'Aged Gold', sw: '#C69A30' },
  { id: 'emerald', label: 'Deep Emerald', sw: '#1F6B4A' },
  { id: 'sienna', label: 'Burnt Sienna', sw: '#B25A2E' },
  { id: 'ink', label: 'Ink Blue', sw: '#2A4D7A' },
  { id: 'claret', label: 'Claret', sw: '#6A1F1F' },
  { id: 'mono', label: 'Monochrome', sw: '#1C1612' },
];

const AccentPicker = () => {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(localStorage.getItem('avot.accent.v1') || 'gold');
  React.useEffect(() => {
    document.documentElement.setAttribute('data-accent', active);
    localStorage.setItem('avot.accent.v1', active);
  }, [active]);
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (!e.target.closest('.accent-pop') && !e.target.closest('.accent-trigger')) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);
  const current = ACCENT_SWATCHES.find(s => s.id === active) || ACCENT_SWATCHES[0];
  return (
    <div className="accent-wrap">
      <button className="icon-btn accent-trigger" onClick={() => setOpen(o => !o)} data-tip={`Accent · ${current.label}`} data-tip-pos="bottom" aria-label="Choose accent color">
        <span className="accent-trigger-swatch" style={{background: current.sw}} />
      </button>
      {open && (
        <div className="accent-pop">
          <div className="accent-pop-label">Accent color</div>
          {ACCENT_SWATCHES.map(s => (
            <button key={s.id}
              className={`accent-row ${active === s.id ? 'active' : ''}`}
              onClick={() => { setActive(s.id); setOpen(false); }}>
              <span className="accent-row-sw" style={{background: s.sw}} />
              <span className="accent-row-name">{s.label}</span>
              {active === s.id && <span className="accent-row-check">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

window.AccentPicker = AccentPicker;

export { ACCENT_SWATCHES, AccentPicker, Reader };
