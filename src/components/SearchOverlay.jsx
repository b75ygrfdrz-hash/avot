import React from 'react';
import { Icon } from './Icon.jsx';
import { createVoiceRecognition } from '../lib/voice.js';

const { useState, useEffect, useRef, useCallback, useMemo } = React;
const useS = useState, useE = useEffect, useR = useRef, useC = useCallback;
const useState_p = useState, useEffect_p = useEffect, useState_k = useState;
const useState_m = useState, useEffect_m = useEffect, useRef_m = useRef;
const useS_s = useState, useE_s = useEffect, useR_s = useRef;
const useState_a = useState, useEffect_a = useEffect;
const useState_mc = useState, useRef_mc = useRef, useEffect_mc = useEffect;
const useEffect_h = useEffect, useState_ms = useState, useEffect_ms = useEffect;
const useS_o = useState, useE_o = useEffect;

// Global search overlay — fuzzy across Hebrew, English, themes, attribution, commentators


const SearchOverlay = ({ onClose, onNavigate, data }) => {
  const [query, setQuery] = useS_s('');
  const [active, setActive] = useS_s(0);
  const [micListening, setMicListening] = useS_s(false);
  const inputRef = useR_s(null);
  const recRef = useR_s(null);

  useE_s(() => { inputRef.current?.focus(); }, []);

  useE_s(() => {
    return () => recRef.current?.stop();
  }, []);

  const toggleMic = () => {
    if (micListening) {
      recRef.current?.stop();
      setMicListening(false);
      return;
    }
    const rec = createVoiceRecognition({
      onInterim: (t) => setQuery(t),
      onFinal: (t) => { setQuery(t); setMicListening(false); inputRef.current?.focus(); },
      onError: () => setMicListening(false),
      onEnd: () => setMicListening(false),
    });
    if (!rec.supported) return;
    recRef.current = rec;
    setMicListening(true);
    rec.start();
  };

  const results = computeResults(query, data);

  useE_s(() => { setActive(0); }, [query]);

  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(results.length - 1, a + 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(0, a - 1)); }
    if (e.key === 'Enter') { e.preventDefault(); const r = results[active]; if (r) onNavigate(r.perek, r.mishnah); }
    if (e.key === 'Escape') onClose();
  };

  return (
    <div className="search-back" onClick={onClose}>
      <div className="search-modal" onClick={e => e.stopPropagation()}>
        <div className="search-input-wrap">
          <Icon name="search" size={16} />
          <input ref={inputRef}
            className="search-input"
            placeholder={micListening ? 'Listening…' : 'Search Hebrew, English, themes, attribution, commentators…'}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={onKey} />
          <button
            className={`search-mic-btn ${micListening ? 'search-mic-btn--active' : ''}`}
            onClick={toggleMic}
            aria-label={micListening ? 'Stop listening' : 'Search by voice'}
            data-tip={micListening ? 'Stop' : 'Voice search'}>
            <Icon name="mic" size={15} />
          </button>
          <span className="admin-kbd">ESC</span>
        </div>
        <div className="search-results">
          {query === '' && (
            <div className="search-quick">
              <div className="search-section">Quick jumps</div>
              {[
                { label: 'Perek 1, Mishnah 1 · Moshe & Men of Great Assembly', p: 1, m: 1 },
                { label: 'Perek 1, Mishnah 14 · "If I am not for myself…"', p: 1, m: 14 },
                { label: 'Perek 1, Mishnah 18 · World stands on justice, truth, peace', p: 1, m: 18 },
              ].map(q => (
                <button key={q.label} className="search-result quick" onClick={() => onNavigate(q.p, q.m)}>
                  <span className="search-ref">{q.p}:{q.m}</span>
                  <span className="search-text">{q.label}</span>
                </button>
              ))}
              <div className="search-section">Tips</div>
              <div className="search-tip">Type Hebrew, English, or a name. Try <em>Hillel</em>, <em>chesed</em>, or <em>שלום</em>.</div>
            </div>
          )}
          {query !== '' && results.length === 0 && (
            <div className="search-empty">No matches for "{query}". Try a different word or check spelling.</div>
          )}
          {results.map((r, i) => (
            <button key={`${r.perek}.${r.mishnah}.${i}`}
              className={`search-result ${i === active ? 'active' : ''}`}
              onClick={() => onNavigate(r.perek, r.mishnah)}
              onMouseEnter={() => setActive(i)}>
              <span className="search-ref">{r.perek}:{r.mishnah}</span>
              <div className="search-body">
                <div className="search-attr">
                  {r.attribution.en}
                  <span className="search-attr-he">{r.attribution.he}</span>
                </div>
                <div className="search-snippet">{r.snippet}</div>
                <div className="search-meta">
                  <span className={`search-kind ${r.kind}`}>{kindLabel(r.kind)}</span>
                  {r.themes && r.themes.slice(0, 3).map(t => <span key={t} className="meta-chip">{t}</span>)}
                </div>
              </div>
              <Icon name="arrow_right" size={13} />
            </button>
          ))}
        </div>
        <div className="search-foot">
          <span><span className="admin-kbd">↑↓</span> navigate</span>
          <span><span className="admin-kbd">↵</span> open</span>
          <span><span className="admin-kbd">ESC</span> close</span>
          <span style={{marginLeft: 'auto', color: 'var(--muted)'}}>{results.length} results</span>
        </div>
      </div>
    </div>
  );
};

function kindLabel(k) {
  return ({
    hebrew: 'Hebrew text',
    english: 'English',
    attribution: 'Attribution',
    theme: 'Theme',
    commentary: 'Commentary',
    story: 'Kids story',
  }[k] || k);
}

function computeResults(query, data) {
  if (!query.trim()) return [];
  const q = query.toLowerCase().trim();
  const out = [];
  data.perakim.forEach(p => {
    p.mishnayot.forEach(m => {
      const candidates = [];
      if (m.hebrew && m.hebrew.toLowerCase().includes(q)) candidates.push({ kind: 'hebrew', snippet: snippetOf(m.hebrew, q, true) });
      if (m.english && m.english.toLowerCase().includes(q)) candidates.push({ kind: 'english', snippet: snippetOf(m.english, q) });
      if (m.attribution.en.toLowerCase().includes(q) || m.attribution.he.toLowerCase().includes(q)) candidates.push({ kind: 'attribution', snippet: m.attribution.en });
      (m.themes || []).forEach(t => {
        if (t.toLowerCase().includes(q)) candidates.push({ kind: 'theme', snippet: `Theme: ${t}` });
      });
      Object.entries(m.commentary || {}).forEach(([cid, text]) => {
        if (text.toLowerCase().includes(q)) {
          const c = window.COMMENTATORS.find(x => x.id === cid);
          candidates.push({ kind: 'commentary', snippet: `${c?.name || cid}: ${snippetOf(text, q)}` });
        }
      });
      if (m.kidsStory && m.kidsStory.toLowerCase().includes(q)) candidates.push({ kind: 'story', snippet: snippetOf(m.kidsStory, q) });
      candidates.slice(0, 2).forEach(c => out.push({
        perek: p.num,
        mishnah: m.num,
        attribution: m.attribution,
        themes: m.themes,
        ...c,
      }));
    });
  });
  return out.slice(0, 40);
}

function snippetOf(text, q, rtl) {
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  const start = Math.max(0, i - 30);
  const end = Math.min(text.length, i + q.length + 60);
  const before = (start > 0 ? '…' : '') + text.slice(start, i);
  const match = text.slice(i, i + q.length);
  const after = text.slice(i + q.length, end) + (end < text.length ? '…' : '');
  return <span style={rtl ? {direction: 'rtl', fontFamily: 'var(--hebrew)'} : {}}>{before}<mark>{match}</mark>{after}</span>;
}

Object.assign(window, { SearchOverlay });

export { SearchOverlay, computeResults, kindLabel, snippetOf };
