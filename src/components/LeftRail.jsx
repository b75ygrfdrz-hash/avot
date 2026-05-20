import React from 'react';
import { Icon } from './Icon.jsx';
import { Reader } from './Reader.jsx';

const { useState, useEffect, useRef, useCallback, useMemo } = React;
const useS = useState, useE = useEffect, useR = useRef, useC = useCallback;
const useState_p = useState, useEffect_p = useEffect, useState_k = useState;
const useState_m = useState, useEffect_m = useEffect, useRef_m = useRef;
const useS_s = useState, useE_s = useEffect, useR_s = useRef;
const useState_a = useState, useEffect_a = useEffect;
const useState_mc = useState, useRef_mc = useRef, useEffect_mc = useEffect;
const useEffect_h = useEffect, useState_ms = useState, useEffect_ms = useEffect;
const useS_o = useState, useE_o = useEffect;

const LeftRail = ({ data, perekIdx, mishnahIdx, setPerekIdx, setMishnahIdx, lastRead, onResume, onAdmin }) => {
  return (
    <aside className="rail">
      {lastRead && (
        <div className="rail-section">
          <div className="rail-label">Continue Reading</div>
          <button className="resume-card" onClick={onResume}>
            <div className="resume-meta">
              <span className="resume-pos">Perek {lastRead.perek} · Mishnah {lastRead.mishnah}</span>
              <span className="resume-time">{lastRead.timeAgo}</span>
            </div>
            <div className="resume-attr">{lastRead.attribution}</div>
          </button>
        </div>
      )}
      <div className="rail-section">
        <div className="rail-label">Pirkei Avot</div>
        <div className="perek-list">
          {data.perakim.map((p, i) => (
            <PerekRow key={i} perek={p} idx={i} active={i === perekIdx}
              expanded={i === perekIdx}
              onSelect={() => { setPerekIdx(i); setMishnahIdx(0); }}
              mishnahIdx={mishnahIdx}
              setMishnahIdx={setMishnahIdx}
            />
          ))}
        </div>
      </div>
      <div className="rail-section">
        <div className="rail-label">My Library</div>
        <div className="lib-list">
          <button className="lib-item" data-tip="Saved mishnayot you bookmarked" data-tip-pos="bottom"><Icon name="bookmark" size={14} /><span>Bookmarks</span><span className="count">12</span></button>
          <button className="lib-item" data-tip="All your highlights & notes across Pirkei Avot" data-tip-pos="bottom"><Icon name="note" size={14} /><span>Highlights & Notes</span><span className="count">38</span></button>
          <button className="lib-item" data-tip="Spaced-repetition memorization deck" data-tip-pos="bottom"><Icon name="cards" size={14} /><span>Memorize Deck</span><span className="count">7</span></button>
          <button className="lib-item" data-tip="Printable source sheets you’ve saved" data-tip-pos="bottom"><Icon name="print" size={14} /><span>Source Sheets</span><span className="count">4</span></button>
        </div>
      </div>
      <div className="rail-section">
        <div className="rail-label">Soon</div>
        <div className="lib-list">
          <button className="lib-item" data-tip="Track children’s progress, set goals" data-tip-pos="bottom"><Icon name="user" size={14} /><span>Parent Dashboard</span></button>
          <button className="lib-item" onClick={onAdmin} data-tip="Open the full admin / CMS panel" data-tip-pos="bottom"><Icon name="settings" size={14} /><span>CMS / Admin</span><span className="count" style={{background: 'var(--ink)', color: 'var(--paper)'}}>New</span></button>
        </div>
      </div>
    </aside>
  );
};

const PerekRow = ({ perek, idx, active, expanded, onSelect, mishnahIdx, setMishnahIdx }) => {
  return (
    <>
      <button className={`perek-item ${active ? 'active' : ''}`} onClick={onSelect}>
        <span>Perek {perek.num}</span>
        <span className="he">{perek.title.he.replace('פרק ', '')}</span>
      </button>
      {expanded && perek.mishnayot.length > 0 && (
        <div className="mishnayot-list">
          {perek.mishnayot.map((m, i) => (
            <button key={i}
              className={`mishnah-item ${i === mishnahIdx ? 'active' : ''}`}
              onClick={() => setMishnahIdx(i)}>
              <span className="num">{perek.num}:{m.num}</span>
              <span className="attr">{m.attribution.en}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
};

// ============================================================
// Reader (center)
// ============================================================

export { LeftRail, PerekRow };
