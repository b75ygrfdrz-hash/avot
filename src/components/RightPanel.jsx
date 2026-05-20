import React from 'react';
import { Icon } from './Icon.jsx';
import { Select } from './admin.jsx';

const { useState, useEffect, useRef, useCallback, useMemo } = React;
const useS = useState, useE = useEffect, useR = useRef, useC = useCallback;
const useState_p = useState, useEffect_p = useEffect, useState_k = useState;
const useState_m = useState, useEffect_m = useEffect, useRef_m = useRef;
const useS_s = useState, useE_s = useEffect, useR_s = useRef;
const useState_a = useState, useEffect_a = useEffect;
const useState_mc = useState, useRef_mc = useRef, useEffect_mc = useEffect;
const useEffect_h = useEffect, useState_ms = useState, useEffect_ms = useEffect;
const useS_o = useState, useE_o = useEffect;

// Right panel: Commentary, Videos, Notes, Chevruta, Cross-refs


const RightPanel = ({ mishnah, perek, highlights, onJumpToHighlight }) => {
  const [tab, setTab] = useState_p('commentary');
  const myHighlights = highlights.filter(h => h.mishnah === mishnah.num && h.perek === perek.num);

  return (
    <aside className="panel" data-screen-label={`P${perek.num}:M${mishnah.num} Panel`}>
      <div className="panel-tabs">
        <button className={`panel-tab ${tab === 'commentary' ? 'active' : ''}`} onClick={() => setTab('commentary')} data-tip="Classical & modern commentary on this Mishnah" data-tip-pos="bottom">
          Commentary
          <span className="badge">{Object.keys(mishnah.commentary || {}).length}</span>
        </button>
        <button className={`panel-tab ${tab === 'cross' ? 'active' : ''}`} onClick={() => setTab('cross')} data-tip="Cross-references to Tanach, Talmud, Midrash" data-tip-pos="bottom">
          Sources
          <span className="badge">{(mishnah.crossRefs || []).length}</span>
        </button>
        <button className={`panel-tab ${tab === 'videos' ? 'active' : ''}`} onClick={() => setTab('videos')} data-tip="Video shiurim from YouTube, YUTorah, TorahAnytime" data-tip-pos="bottom">
          Shiurim
          <span className="badge">{(mishnah.videos || []).length}</span>
        </button>
        <button className={`panel-tab ${tab === 'notes' ? 'active' : ''}`} onClick={() => setTab('notes')} data-tip="Your highlights and notes on this Mishnah" data-tip-pos="bottom">
          Notes
          {myHighlights.length > 0 && <span className="badge">{myHighlights.length}</span>}
        </button>
      </div>
      <div className="panel-body">
        {tab === 'commentary' && <CommentaryPanel mishnah={mishnah} />}
        {tab === 'cross' && <CrossRefsPanel mishnah={mishnah} />}
        {tab === 'videos' && <VideosPanel mishnah={mishnah} />}
        {tab === 'notes' && <NotesPanel highlights={myHighlights} onJump={onJumpToHighlight} />}
      </div>
    </aside>
  );
};

// ============================================================
// Commentary
// ============================================================
const CommentaryPanel = ({ mishnah }) => {
  const available = window.COMMENTATORS.filter(c => mishnah.commentary && mishnah.commentary[c.id]);
  const [active, setActive] = useState_p(available[0]?.id || null);
  useEffect_p(() => { setActive(available[0]?.id || null); }, [mishnah.num]);

  if (available.length === 0) {
    return <div style={{color: 'var(--muted)', fontSize: 13, padding: '20px 0'}}>No commentary added yet for this Mishnah.</div>;
  }
  const current = available.find(c => c.id === active);
  const text = mishnah.commentary[active];

  return (
    <div>
      <div className="comm-tabs">
        {available.map(c => (
          <button key={c.id} className={`comm-tab ${c.id === active ? 'active' : ''} ${c.id === 'chiefRabbi' ? 'comm-tab-cr' : ''}`}
            onClick={() => setActive(c.id)}
            data-tip={`${c.he} · ${c.era}${c.note ? ' · ' + c.note : ''}`}
            data-tip-pos="bottom">
            <span className="dot" style={{background: c.color}} />
            {c.name}
          </button>
        ))}
      </div>
      {current && (
        <>
          <div className={`comm-author ${current.id === 'chiefRabbi' ? 'comm-author-cr' : ''}`}>
            <span className="name">{current.name}</span>
            <span className="he">{current.he}</span>
            <span className="era">{current.era}</span>
          </div>
          <div className={`comm-content ${current.id === 'chiefRabbi' ? 'comm-content-cr' : ''}`}>{text}</div>
        </>
      )}
      <button className="add-source">
        <Icon name="plus" size={13} /> Add a commentator
      </button>
    </div>
  );
};

// ============================================================
// Cross references (Tanach / Talmud)
// ============================================================
const CrossRefsPanel = ({ mishnah }) => {
  const refs = mishnah.crossRefs || [];
  const labelFor = (t) => ({tanach: 'Tanach', talmud: 'Talmud', midrash: 'Midrash', halacha: 'Halacha'}[t] || t);
  const colorFor = (t) => ({tanach: 'var(--wine)', talmud: 'var(--indigo)', midrash: 'var(--gold)', halacha: 'var(--olive)'}[t]);
  if (refs.length === 0) {
    return <div style={{color: 'var(--muted)', fontSize: 13, padding: '20px 0'}}>No cross-references yet for this Mishnah.</div>;
  }
  return (
    <div className="cross-list">
      {refs.map((r, i) => (
        <div key={i} className="cross-ref">
          <div className="cross-head">
            <span className="cross-tag" style={{background: colorFor(r.type)}}>{labelFor(r.type)}</span>
            <span className="cross-src">{r.source}</span>
            <button className="cross-link" aria-label="Open"><Icon name="arrow_right" size={13} /></button>
          </div>
          <p className="cross-body">{r.text}</p>
        </div>
      ))}
      <button className="add-source"><Icon name="plus" size={13} /> Link another source</button>
    </div>
  );
};

// ============================================================
// Videos
// ============================================================
const VideosPanel = ({ mishnah }) => {
  const videos = mishnah.videos || [];
  return (
    <div>
      <div className="video-filter">
        <button className="vf active">All</button>
        <button className="vf">YouTube</button>
        <button className="vf">YUTorah</button>
        <button className="vf">TorahAnytime</button>
        <button className="vf">Aleph Beta</button>
      </div>
      <div className="video-list">
        {videos.map((v, i) => (
          <div key={i} className="video-card">
            <div className={`video-thumb ${v.thumb || ''}`}>
              <div className="play"><Icon name="play" size={12} /></div>
              <span className="duration">{v.duration}</span>
            </div>
            <div className="video-meta">
              <div className="title">{v.title}</div>
              <div className="teacher">{v.teacher}</div>
              <div className="source">{v.source}</div>
            </div>
          </div>
        ))}
        {videos.length === 0 && (
          <div style={{color:'var(--muted)', fontSize:13, padding:'20px 0'}}>No shiurim linked yet.</div>
        )}
      </div>
      <button className="add-source">
        <Icon name="plus" size={13} /> Add a video or shiur link
      </button>
    </div>
  );
};

// ============================================================
// Notes
// ============================================================
const NotesPanel = ({ highlights, onJump }) => {
  if (highlights.length === 0) {
    return (
      <div className="empty-state">
        <Icon name="note" size={26} />
        <div className="empty-title">No notes on this Mishnah yet</div>
        <div className="empty-desc">Select any phrase in the text to highlight it and attach a note.</div>
      </div>
    );
  }
  return (
    <div>
      <div className="notes-actions">
        <button className="notes-btn"><Icon name="download" size={12} /> Export to Anki</button>
        <button className="notes-btn"><Icon name="print" size={12} /> Print</button>
      </div>
      {highlights.map(h => (
        <div key={h.id} className="note-card" onClick={() => onJump && onJump(h)} style={{borderLeftColor: highlightColor(h.color), cursor: 'pointer'}}>
          <div className="hl-snippet" style={{background: hlPale(h.color)}}>"{h.text}"</div>
          {h.note && <div className="body">{h.note}</div>}
          {h.tags && h.tags.length > 0 && (
            <div className="tags">
              {h.tags.map(t => <span key={t} className="tag">#{t}</span>)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

function highlightColor(c) {
  return ({yellow: '#e0b840', rose: '#c46e72', sky: '#5a8aaa', mint: '#6aa56a'})[c] || '#888';
}
function hlPale(c) {
  return ({yellow: '#fef5d0', rose: '#fbe0e3', sky: '#dce8f0', mint: '#dcecda'})[c] || '#f0f0f0';
}

// ============================================================
// Chevruta AI
// ============================================================
const ChevrutaPanel = ({ mishnah }) => {
  const [messages, setMessages] = useState_p([
    { role: 'ai', text: `Let's learn this Mishnah together. I'm grounded in classical commentators — ask me anything about Pirkei Avot ${mishnah.num === undefined ? '' : `${mishnah.num}`} or this teaching specifically.` },
  ]);
  const [input, setInput] = useState_p('');
  const [loading, setLoading] = useState_p(false);

  const prompts = [
    "Explain this Mishnah in one sentence",
    "What would Rashi and Rambam disagree on here?",
    "How does this apply to my daily life?",
    "What's the deeper meaning of the Hebrew word choice?",
  ];

  const send = async (text) => {
    if (!text.trim()) return;
    setMessages(m => [...m, { role: 'user', text }]);
    setInput('');
    setLoading(true);
    try {
      const prompt = `You are a Torah scholar teaching Pirkei Avot. The current Mishnah is:

Hebrew: "${mishnah.hebrew}"
English: "${mishnah.english}"
Attributed to: ${mishnah.attribution.en}

The student asks: "${text}"

Answer briefly (3-5 sentences), warmly, and where possible cite a classical commentator (Rashi, Rambam, Bartenura, Maharal) or modern voice. Use simple English. Do not pretend you have access to the user's notes.`;
      const reply = await window.claude.complete(prompt);
      setMessages(m => [...m, { role: 'ai', text: reply }]);
    } catch (e) {
      setMessages(m => [...m, { role: 'ai', text: "I couldn't reach the chevruta service just now — please try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="chev-intro">
        <div className="label">AI Chevruta · Beta</div>
        <div className="ttl">Learn alongside an AI study partner</div>
        <div className="desc">Trained on classical commentary. Always verify with your rav or a primary source.</div>
      </div>
      <div className="chev-messages">
        {messages.map((m, i) => (
          <div key={i} className={`chev-msg ${m.role}`}>
            {m.text}
            {m.role === 'ai' && i > 0 && <div className="source">↗ Grounded in classical commentary</div>}
          </div>
        ))}
        {loading && <div className="chev-msg ai" style={{opacity: 0.7}}>thinking…</div>}
      </div>
      {messages.length <= 1 && (
        <div className="chev-prompts">
          {prompts.map(p => (
            <button key={p} className="chev-prompt" onClick={() => send(p)}>{p}</button>
          ))}
        </div>
      )}
      <div className="chev-input-wrap">
        <input className="chev-input"
          placeholder="Ask anything about this Mishnah…"
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send(input)} />
        <button className="chev-send" disabled={!input.trim() || loading} onClick={() => send(input)}>
          <Icon name="arrow_right" size={14} />
        </button>
      </div>
    </div>
  );
};

Object.assign(window, { RightPanel });

export { ChevrutaPanel, CommentaryPanel, CrossRefsPanel, NotesPanel, RightPanel, VideosPanel, highlightColor, hlPale };
