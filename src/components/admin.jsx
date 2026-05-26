import React from 'react';
import { Icon } from './Icon.jsx';
import { ILLUSTRATIONS } from './illustrations.jsx';
import { AdminLogin, Select } from './admin-shared.jsx';
import {
  ADMIN_PASSWORD,
  isAdminAuthed,
  setAdminAuthed,
  getHiddenCommentators,
  setCommentatorHidden,
  onCommentatorsChange,
  checkAdminRole,
} from '../lib/admin.js';
import { useAuth } from '../lib/useAuth.js';

const { useState, useEffect, useRef, useCallback, useMemo } = React;
const useS = useState, useE = useEffect, useR = useRef, useC = useCallback;
const useState_p = useState, useEffect_p = useEffect, useState_k = useState;
const useState_m = useState, useEffect_m = useEffect, useRef_m = useRef;
const useS_s = useState, useE_s = useEffect, useR_s = useRef;
const useState_a = useState, useEffect_a = useEffect;
const useState_mc = useState, useRef_mc = useRef, useEffect_mc = useEffect;
const useEffect_h = useEffect, useState_ms = useState, useEffect_ms = useEffect;
const useS_o = useState, useE_o = useEffect;

// Admin / CMS Panel — full-screen content management view


// A single toggle row for a commentator's visibility.
const CommToggle = ({ commentator, hidden, onChange }) => (
  <label className="admin-cv-row">
    <span className="admin-cv-text">
      <span className="admin-cv-dot" style={{background: commentator.color}} />
      <span className="admin-cv-name">{commentator.name}</span>
      <span className="admin-cv-he" style={{fontFamily:'var(--hebrew)'}}>{commentator.he}</span>
    </span>
    <span className={`admin-toggle ${hidden ? '' : 'is-on'}`} role="switch" aria-checked={!hidden}>
      <input
        type="checkbox"
        checked={!hidden}
        onChange={e => onChange(!e.target.checked)}
      />
      <span className="admin-toggle-track"><span className="admin-toggle-thumb" /></span>
      <span className="admin-toggle-state">{hidden ? 'Hidden' : 'Visible'}</span>
    </span>
  </label>
);

const VisibilityPanel = () => {
  const [hidden, setHidden] = useState_a(() => getHiddenCommentators());
  useEffect_a(() => onCommentatorsChange(() => setHidden(getHiddenCommentators())), []);
  const all = window.COMMENTATORS || [];
  const toggle = (id, hide) => setCommentatorHidden(id, hide);
  return (
    <div className="admin-card admin-visibility">
      <div className="admin-card-head">
        <div>
          <div className="admin-card-eyebrow">Public Visibility</div>
          <div className="admin-card-title">Commentators in the Reader</div>
          <div className="admin-card-sub">
            Turn a commentator off and their tab is hidden from every learner
            until you turn them back on. Saved on this device.
          </div>
        </div>
      </div>
      <div className="admin-cv-list">
        {all.map(c => (
          <CommToggle
            key={c.id}
            commentator={c}
            hidden={hidden.has(c.id)}
            onChange={(hide) => toggle(c.id, hide)}
          />
        ))}
      </div>
    </div>
  );
};

const AdminPanel = ({ onClose, data }) => {
  const [authed, setAuthed] = useState_a(isAdminAuthed());
  const [checkingRole, setCheckingRole] = useState_a(!isAdminAuthed());
  const [section, setSection] = useState_a('visibility');
  const [editingMishnah, setEditingMishnah] = useState_a(null);
  const { user } = useAuth();

  // If not already locally authed, check if the signed-in Supabase user
  // has admin role — if so, bypass the password screen entirely.
  useEffect_a(() => {
    if (authed) { setCheckingRole(false); return; }
    checkAdminRole(user?.id).then(isAdmin => {
      if (isAdmin) { setAdminAuthed(true); setAuthed(true); }
      setCheckingRole(false);
    });
  }, [user?.id, authed]);

  if (checkingRole) {
    return (
      <div className="admin-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: 14 }}>
        Checking credentials…
      </div>
    );
  }

  if (!authed) {
    return <AdminLogin onAuth={() => setAuthed(true)} onClose={onClose} />;
  }

  const signOut = () => {
    setAdminAuthed(false);
    setAuthed(false);
  };

  return (
    <div className="admin-shell" data-screen-label="Admin · CMS">
      <header className="admin-header">
        <div className="admin-brand">
          <span style={{fontFamily:'var(--hebrew)', color:'var(--wine)', fontSize: 20}}>אבות</span>
          <span style={{fontFamily:'var(--serif)', fontWeight: 600}}>Avot</span>
          <span className="admin-chip">Admin</span>
        </div>
        <div className="admin-search">
          <Icon name="search" size={14} />
          <input placeholder="Search content, users, settings…" />
          <span className="admin-kbd">⌘K</span>
        </div>
        <div className="admin-right">
          <div className="admin-env">
            <span className="env-dot" /> Production
          </div>
          <button className="admin-btn ghost" data-tip="View as a learner">
            <Icon name="eye" size={13} /> Preview
          </button>
          <button className="admin-btn primary" data-tip="Publish all pending changes">
            <Icon name="bolt" size={13} /> Publish
            <span className="admin-pill">3</span>
          </button>
          <div className="avatar" data-tip="Daniel Goldstein · Owner" data-tip-pos="left">DG</div>
          <button className="admin-btn ghost" onClick={signOut} data-tip="End the admin session" data-tip-pos="left">
            Sign out
          </button>
          <button className="icon-btn" onClick={onClose} data-tip="Exit admin" data-tip-pos="left">
            <Icon name="close" />
          </button>
        </div>
      </header>

      <div className="admin-main">
        <aside className="admin-rail">
          <div className="admin-rail-label">Content</div>
          <AdminNav active={section} setActive={setSection} items={[
            { id: 'perakim', icon: 'book', label: 'Perakim', count: 6 },
            { id: 'mishnayot', icon: 'menu', label: 'Mishnayot', count: 70 },
            { id: 'commentary', icon: 'note', label: 'Commentary', count: 24 },
            { id: 'videos', icon: 'play', label: 'Shiurim', count: 47 },
            { id: 'translations', icon: 'link', label: 'Translations', count: 3 },
            { id: 'crossrefs', icon: 'link', label: 'Cross-refs', count: 18 },
          ]} />
          <div className="admin-rail-label">Kids</div>
          <AdminNav active={section} setActive={setSection} items={[
            { id: 'stories', icon: 'sparkle', label: 'Kids stories', count: 12 },
            { id: 'illustrations', icon: 'palette', label: 'Illustrations', count: 8 },
            { id: 'quizzes', icon: 'star', label: 'Quizzes', count: 12 },
          ]} />
          <div className="admin-rail-label">People</div>
          <AdminNav active={section} setActive={setSection} items={[
            { id: 'users', icon: 'user', label: 'Learners', count: 1284 },
            { id: 'editors', icon: 'user', label: 'Editors & Roles', count: 7 },
            { id: 'comments', icon: 'note', label: 'Community', count: 12 },
          ]} />
          <div className="admin-rail-label">System</div>
          <AdminNav active={section} setActive={setSection} items={[
            { id: 'visibility', icon: 'eye', label: 'Visibility' },
            { id: 'media', icon: 'palette', label: 'Media library' },
            { id: 'settings', icon: 'settings', label: 'Settings' },
            { id: 'audit', icon: 'eye', label: 'Audit log' },
          ]} />
        </aside>

        <main className="admin-content">
          {section === 'visibility' && <VisibilityPanel />}
          {section === 'mishnayot' && <MishnayotTable data={data} onEdit={setEditingMishnah} />}
          {section === 'commentary' && <CommentaryAdmin />}
          {section === 'videos' && <VideosAdmin />}
          {section === 'editors' && <EditorsAdmin />}
          {section === 'perakim' && <PerakimAdmin data={data} />}
          {section === 'stories' && <StoriesAdmin data={data} />}
          {section === 'illustrations' && <IllustrationsAdmin />}
          {section === 'translations' && <TranslationsAdmin />}
          {section === 'quizzes' && <QuizzesAdmin data={data} />}
          {section === 'users' && <UsersAdmin />}
          {section === 'comments' && <CommentsAdmin />}
          {section === 'media' && <MediaAdmin />}
          {section === 'crossrefs' && <CrossRefsAdmin />}
          {section === 'settings' && <SettingsAdmin />}
          {section === 'audit' && <AuditAdmin />}
        </main>
      </div>

      {editingMishnah && <MishnahEditDrawer mishnah={editingMishnah} onClose={() => setEditingMishnah(null)} />}
    </div>
  );
};

const AdminNav = ({ active, setActive, items }) => (
  <nav className="admin-nav">
    {items.map(it => (
      <button key={it.id}
        className={`admin-nav-item ${active === it.id ? 'active' : ''}`}
        onClick={() => setActive(it.id)}>
        <Icon name={it.icon} size={14} />
        <span>{it.label}</span>
        {it.count !== undefined && <span className="admin-nav-count">{it.count.toLocaleString()}</span>}
      </button>
    ))}
  </nav>
);

// ============================================================
// Mishnayot table
// ============================================================
const MishnayotTable = ({ data, onEdit }) => {
  const [filterPerek, setFilterPerek] = useState_a('all');
  const [filterStatus, setFilterStatus] = useState_a('all');
  const [query, setQuery] = useState_a('');

  const rows = [];
  data.perakim.forEach(p => {
    p.mishnayot.forEach(m => {
      const status = m.stub ? 'draft' : (Object.keys(m.commentary || {}).length >= 4 ? 'published' : 'review');
      const completeness = computeCompleteness(m);
      rows.push({ ...m, perek: p.num, status, completeness });
    });
  });

  const filtered = rows.filter(r => {
    if (filterPerek !== 'all' && r.perek !== Number(filterPerek)) return false;
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    if (query && !`${r.attribution.en} ${r.attribution.he} ${r.english}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="admin-head">
        <div>
          <h1 className="admin-title">Mishnayot</h1>
          <p className="admin-subtitle">{rows.length} total · {rows.filter(r => r.status === 'published').length} published · {rows.filter(r => r.status === 'draft').length} drafts</p>
        </div>
        <div className="admin-head-actions">
          <button className="admin-btn ghost" data-tip="Import from Sefaria"><Icon name="download" size={13} /> Import</button>
          <button className="admin-btn ghost" data-tip="Export as JSON"><Icon name="share" size={13} /> Export</button>
          <button className="admin-btn primary"><Icon name="plus" size={13} /> New Mishnah</button>
        </div>
      </div>

      <div className="admin-filters">
        <div className="admin-search-row">
          <Icon name="search" size={13} />
          <input placeholder="Search by attribution, theme, or text…"
            value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <Select value={filterPerek} onChange={setFilterPerek} options={[
          { v: 'all', l: 'All perakim' },
          ...data.perakim.map(p => ({ v: String(p.num), l: `Perek ${p.num}` })),
        ]} />
        <Select value={filterStatus} onChange={setFilterStatus} options={[
          { v: 'all', l: 'All statuses' },
          { v: 'published', l: 'Published' },
          { v: 'review', l: 'In review' },
          { v: 'draft', l: 'Draft' },
        ]} />
        <div className="admin-bulk">{filtered.length} of {rows.length}</div>
      </div>

      <div className="admin-table">
        <div className="admin-table-head">
          <div className="cell-check"><input type="checkbox" /></div>
          <div className="cell-num">Ref</div>
          <div className="cell-attr">Attribution</div>
          <div className="cell-status">Status</div>
          <div className="cell-meta">Commentary · Videos · Cross-refs</div>
          <div className="cell-prog">Completeness</div>
          <div className="cell-actions"></div>
        </div>
        {filtered.map(r => (
          <div key={`${r.perek}.${r.num}`} className="admin-table-row" onClick={() => onEdit(r)}>
            <div className="cell-check" onClick={e => e.stopPropagation()}><input type="checkbox" /></div>
            <div className="cell-num">{r.perek}:{r.num}</div>
            <div className="cell-attr">
              <div className="attr-en">{r.attribution.en}</div>
              <div className="attr-he">{r.attribution.he}</div>
            </div>
            <div className="cell-status">
              <span className={`status-pill ${r.status}`}>{statusLabel(r.status)}</span>
            </div>
            <div className="cell-meta">
              <span className="meta-chip">📖 {Object.keys(r.commentary || {}).length}</span>
              <span className="meta-chip">▶ {(r.videos || []).length}</span>
              <span className="meta-chip">↗ {(r.crossRefs || []).length}</span>
              {r.kidsStory && <span className="meta-chip">✨ Kids</span>}
            </div>
            <div className="cell-prog">
              <div className="prog-bar"><div className="prog-fill" style={{width: `${r.completeness}%`}} /></div>
              <span className="prog-text">{r.completeness}%</span>
            </div>
            <div className="cell-actions" onClick={e => e.stopPropagation()}>
              <button className="cell-act" data-tip="Quick edit"><Icon name="note" size={13} /></button>
              <button className="cell-act" data-tip="More"><Icon name="menu" size={13} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function statusLabel(s) {
  return { published: 'Published', draft: 'Draft', review: 'In review' }[s] || s;
}

function computeCompleteness(m) {
  let score = 0;
  if (m.hebrew) score += 15;
  if (m.english) score += 15;
  if (m.commentary && Object.keys(m.commentary).length) score += Math.min(25, Object.keys(m.commentary).length * 4);
  if (m.crossRefs && m.crossRefs.length) score += 10;
  if (m.videos && m.videos.length) score += 10;
  if (m.kidsStory) score += 10;
  if (m.kidsQuestion) score += 5;
  if (m.words && m.words.length > 5) score += 10;
  return Math.min(100, score);
}

// ============================================================
// Mishnah edit drawer
// ============================================================
const MishnahEditDrawer = ({ mishnah, onClose }) => {
  const [tab, setTab] = useState_a('text');
  return (
    <div className="drawer-back" onClick={onClose}>
      <div className="drawer" onClick={e => e.stopPropagation()}>
        <div className="drawer-head">
          <div>
            <div className="drawer-eyebrow">Editing Mishnah {mishnah.perek}:{mishnah.num}</div>
            <div className="drawer-title">{mishnah.attribution.en}</div>
          </div>
          <div className="drawer-actions">
            <span className={`status-pill ${mishnah.status}`}>{statusLabel(mishnah.status)}</span>
            <button className="admin-btn ghost"><Icon name="eye" size={13} /> Preview</button>
            <button className="admin-btn primary">Save changes</button>
            <button className="icon-btn" onClick={onClose}><Icon name="close" /></button>
          </div>
        </div>
        <div className="drawer-tabs">
          {['text', 'commentary', 'crossrefs', 'videos', 'kids', 'history'].map(t => (
            <button key={t} className={`drawer-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {{
                text: 'Text',
                commentary: `Commentary · ${Object.keys(mishnah.commentary || {}).length}`,
                crossrefs: `Cross-refs · ${(mishnah.crossRefs || []).length}`,
                videos: `Videos · ${(mishnah.videos || []).length}`,
                kids: 'Kids mode',
                history: 'History',
              }[t]}
            </button>
          ))}
        </div>
        <div className="drawer-body">
          {tab === 'text' && <DrawerText mishnah={mishnah} />}
          {tab === 'commentary' && <DrawerCommentary mishnah={mishnah} />}
          {tab === 'crossrefs' && <DrawerCrossRefs mishnah={mishnah} />}
          {tab === 'videos' && <DrawerVideos mishnah={mishnah} />}
          {tab === 'kids' && <DrawerKids mishnah={mishnah} />}
          {tab === 'history' && <DrawerHistory />}
        </div>
      </div>
    </div>
  );
};

const DrawerText = ({ mishnah }) => (
  <div className="drawer-form">
    <div className="form-row">
      <label>Attribution (Hebrew)</label>
      <input className="form-input" defaultValue={mishnah.attribution.he} dir="rtl" style={{fontFamily:'var(--hebrew)'}} />
    </div>
    <div className="form-row">
      <label>Attribution (English)</label>
      <input className="form-input" defaultValue={mishnah.attribution.en} />
    </div>
    <div className="form-row">
      <label>Hebrew text <span className="form-hint">Vowelized · public domain</span></label>
      <textarea className="form-textarea" defaultValue={mishnah.hebrew} dir="rtl" style={{fontFamily:'var(--hebrew)', fontSize: 18}} rows={4} />
    </div>
    <div className="form-row">
      <label>English translation
        <span className="form-hint">Source: Sefaria CC-0 · <button className="form-link">Change source</button></span>
      </label>
      <textarea className="form-textarea" defaultValue={mishnah.english} rows={4} />
    </div>
    <div className="form-row">
      <label>Themes <span className="form-hint">Tags shown to readers</span></label>
      <div className="chip-input">
        {(mishnah.themes || []).map(t => (
          <span key={t} className="form-chip">{t} <button>×</button></span>
        ))}
        <input className="chip-add" placeholder="Add theme…" />
      </div>
    </div>
    <div className="form-row">
      <label>Word-by-word lexicon
        <span className="form-hint">{(mishnah.words || []).length} entries · <button className="form-link">Auto-generate from translation</button></span>
      </label>
      <div className="lex-grid">
        {(mishnah.words || []).slice(0, 6).map((w, i) => (
          <div key={i} className="lex-row">
            <input dir="rtl" defaultValue={w.he} style={{fontFamily:'var(--hebrew)'}} />
            <span>→</span>
            <input defaultValue={w.en} />
            <button className="lex-del">×</button>
          </div>
        ))}
        {(mishnah.words || []).length === 0 && <div className="empty-mini">No words yet — try auto-generate.</div>}
      </div>
    </div>
  </div>
);

const DrawerCommentary = ({ mishnah }) => {
  const all = window.COMMENTATORS;
  return (
    <div className="drawer-form">
      <div className="comm-checklist">
        {all.map(c => {
          const has = mishnah.commentary && mishnah.commentary[c.id];
          return (
            <div key={c.id} className={`comm-check-row ${has ? 'has' : ''}`}>
              <div className="comm-check-head">
                <span className="dot" style={{background: c.color}} />
                <span className="comm-check-name">{c.name}</span>
                <span className="comm-check-he" style={{fontFamily:'var(--hebrew)'}}>{c.he}</span>
                <span className="comm-check-era">{c.era}</span>
                {has ? <span className="check-yes">✓ Added</span> : <button className="form-link">+ Add commentary</button>}
              </div>
              {has && <div className="comm-check-preview">{(mishnah.commentary[c.id] || '').slice(0, 140)}…</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DrawerCrossRefs = ({ mishnah }) => (
  <div className="drawer-form">
    <div className="form-row">
      <label>Linked sources <span className="form-hint">Tanach · Talmud · Midrash · Halacha</span></label>
      {(mishnah.crossRefs || []).map((r, i) => (
        <div key={i} className="cross-edit">
          <span className="cross-tag" style={{background: 'var(--wine)'}}>{r.type}</span>
          <input defaultValue={r.source} className="form-input" style={{width: 180}} />
          <input defaultValue={r.text.slice(0, 60) + '…'} className="form-input" style={{flex: 1}} />
          <button className="lex-del">×</button>
        </div>
      ))}
      <button className="admin-btn ghost" style={{marginTop: 10}}><Icon name="plus" size={13} /> Link a source</button>
    </div>
  </div>
);

const DrawerVideos = ({ mishnah }) => (
  <div className="drawer-form">
    {(mishnah.videos || []).map((v, i) => (
      <div key={i} className="video-edit">
        <div className={`video-thumb small ${v.thumb || ''}`}><Icon name="play" size={11} /></div>
        <input className="form-input" defaultValue={v.title} style={{flex:1}} />
        <input className="form-input" defaultValue={v.teacher} style={{width: 180}} />
        <span className="meta-chip">{v.source}</span>
        <button className="lex-del">×</button>
      </div>
    ))}
    <button className="admin-btn ghost" style={{marginTop: 10}}><Icon name="plus" size={13} /> Add a video link</button>
    <div className="hint-box">Paste a YouTube, YUTorah, TorahAnytime, or Aleph Beta URL — we'll auto-fetch title, teacher, and thumbnail.</div>
  </div>
);

const DrawerKids = ({ mishnah }) => (
  <div className="drawer-form">
    <div className="form-row">
      <label>Story retelling <span className="form-hint">Ages 5–10 · simple language · ~80 words</span></label>
      <textarea className="form-textarea" defaultValue={mishnah.kidsStory || ''} rows={5} placeholder="Tell the story in language a 7-year-old will understand…" />
    </div>
    <div className="form-row">
      <label>Illustration <span className="form-hint">Used on the kids card</span></label>
      <div className="illus-picker">
        <div className="illus-current">
          <div className="illus-preview">{mishnah.kidsScene || '📜'}</div>
          <div>
            <div style={{fontWeight: 600}}>Mountain at Sinai</div>
            <div style={{fontSize: 12, color: 'var(--muted)'}}>Hand-drawn series · By Sarah Klein</div>
          </div>
          <button className="form-link">Change</button>
        </div>
      </div>
    </div>
    <div className="form-row">
      <label>Quiz question</label>
      <input className="form-input" defaultValue={mishnah.kidsQuestion?.q || ''} placeholder="What did the Mishnah teach us?" />
    </div>
    <div className="form-row">
      <label>Answer options <span className="form-hint">Mark the correct one</span></label>
      {(mishnah.kidsQuestion?.options || []).map((opt, i) => (
        <div key={i} className="quiz-edit">
          <input type="radio" name="correct" defaultChecked={i === mishnah.kidsQuestion?.correct} />
          <input className="form-input" defaultValue={opt} />
          <button className="lex-del">×</button>
        </div>
      ))}
      <button className="admin-btn ghost" style={{marginTop: 8}}><Icon name="plus" size={13} /> Add option</button>
    </div>
  </div>
);

const DrawerHistory = () => (
  <div className="drawer-form">
    <div className="history-list">
      {[
        { who: 'Daniel Goldstein', what: 'Updated commentary (Rashi)', when: '2 hours ago', avatar: 'DG' },
        { who: 'Rabbi M. Cohen', what: 'Added video: "Three Pillars" by R. Fohrman', when: '3 days ago', avatar: 'MC' },
        { who: 'Daniel Goldstein', what: 'Published Mishnah 1:1', when: '1 week ago', avatar: 'DG' },
        { who: 'System', what: 'Imported Hebrew text from Sefaria', when: '2 weeks ago', avatar: 'SY' },
      ].map((h, i) => (
        <div key={i} className="history-item">
          <div className="avatar">{h.avatar}</div>
          <div>
            <div><strong>{h.who}</strong> <span style={{color:'var(--muted)'}}>{h.what}</span></div>
            <div style={{fontSize: 11, color: 'var(--muted)', marginTop: 2}}>{h.when}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ============================================================
// Other admin sections (lighter — stat cards + tables)
// ============================================================
const CommentaryAdmin = () => (
  <SimpleAdmin title="Commentary" subtitle="8 commentator voices across all Mishnayot · 24 entries">
    <div className="admin-stat-grid">
      {window.COMMENTATORS.map(c => (
        <div key={c.id} className="admin-stat-card">
          <div className="stat-head">
            <span className="dot" style={{background: c.color}} />
            <span className="stat-name">{c.name}</span>
            <span className="stat-he" style={{fontFamily:'var(--hebrew)'}}>{c.he}</span>
          </div>
          <div className="stat-era">{c.era}</div>
          <div className="stat-numbers">
            <div><strong>{3}</strong><span>entries</span></div>
            <div><strong>{67}</strong><span>missing</span></div>
            <div><strong>{c.note ? '✓' : '—'}</strong><span>source</span></div>
          </div>
          <div className="stat-bar"><div className="stat-fill" style={{width: '4%', background: c.color}} /></div>
        </div>
      ))}
    </div>
  </SimpleAdmin>
);

const VideosAdmin = () => (
  <SimpleAdmin title="Shiurim & Videos" subtitle="47 videos linked across 3 sources · 12 pending review">
    <div className="admin-source-grid">
      {[
        { name: 'YouTube', count: 22, color: '#cc2828' },
        { name: 'YUTorah', count: 14, color: '#1a4a8a' },
        { name: 'TorahAnytime', count: 8, color: '#2a7a4a' },
        { name: 'Aleph Beta', count: 3, color: '#8a4a1a' },
      ].map(s => (
        <div key={s.name} className="admin-source-card">
          <div className="source-name" style={{color: s.color}}>{s.name}</div>
          <div className="source-count">{s.count}</div>
          <div className="source-label">videos</div>
          <button className="admin-btn ghost" style={{marginTop: 12}}><Icon name="plus" size={12} /> Add</button>
        </div>
      ))}
    </div>
    <div className="hint-box">Tip: paste any YouTube/YUTorah/TorahAnytime URL into the Mishnah editor and metadata is fetched automatically.</div>
  </SimpleAdmin>
);

const EditorsAdmin = () => {
  const roles = [
    { name: 'Daniel Goldstein', role: 'Owner', email: 'daniel@avot.app', last: 'now', perm: 'all' },
    { name: 'Rabbi M. Cohen', role: 'Editor', email: 'm.cohen@avot.app', last: '3 days ago', perm: 'content' },
    { name: 'Sarah Klein', role: 'Contributor', email: 'sarah@avot.app', last: '1 week ago', perm: 'kids' },
    { name: 'Eli Levin', role: 'Translator', email: 'eli.l@avot.app', last: '2 weeks ago', perm: 'translations' },
    { name: 'Dvora Roth', role: 'Reviewer', email: 'dvora.r@avot.app', last: '1 month ago', perm: 'review' },
  ];
  return (
    <SimpleAdmin title="Editors & Roles" subtitle="5 team members · 4 role levels"
      action={<button className="admin-btn primary"><Icon name="plus" size={13} /> Invite teammate</button>}>
      <div className="role-legend">
        {['Owner', 'Editor', 'Contributor', 'Translator', 'Reviewer'].map(r => (
          <div key={r} className="role-pill">{r}</div>
        ))}
      </div>
      <div className="admin-table">
        <div className="admin-table-head">
          <div className="cell-attr">Name</div>
          <div className="cell-status">Role</div>
          <div className="cell-meta">Permissions</div>
          <div className="cell-meta">Last active</div>
          <div className="cell-actions"></div>
        </div>
        {roles.map((r, i) => (
          <div key={i} className="admin-table-row">
            <div className="cell-attr">
              <div className="attr-en">{r.name}</div>
              <div className="attr-he">{r.email}</div>
            </div>
            <div className="cell-status"><span className={`role-tag role-${r.role.toLowerCase()}`}>{r.role}</span></div>
            <div className="cell-meta"><span className="meta-chip">{r.perm}</span></div>
            <div className="cell-meta" style={{color: 'var(--muted)', fontSize: 12}}>{r.last}</div>
            <div className="cell-actions">
              <button className="cell-act"><Icon name="settings" size={13} /></button>
            </div>
          </div>
        ))}
      </div>
    </SimpleAdmin>
  );
};

const PerakimAdmin = ({ data }) => (
  <SimpleAdmin title="Perakim" subtitle="6 chapters · Perek 1 complete · 5 in progress">
    <div className="perakim-grid">
      {data.perakim.map(p => (
        <div key={p.num} className="perakim-card">
          <div className="perakim-num">פרק {p.title.he.replace('פרק ', '')}</div>
          <div className="perakim-title">Chapter {p.num}</div>
          <div className="perakim-sum">{p.summary || 'No summary yet'}</div>
          <div className="perakim-stats">
            <span><strong>{p.mishnayot.length}</strong> mishnayot</span>
            <span><strong>{p.mishnayot.filter(m => !m.stub).length}</strong> published</span>
          </div>
          <button className="admin-btn ghost" style={{marginTop: 12, width: '100%'}}>Edit chapter</button>
        </div>
      ))}
    </div>
  </SimpleAdmin>
);

const StoriesAdmin = ({ data }) => {
  const mishnayot = data.perakim[0].mishnayot;
  return (
    <SimpleAdmin title="Kids stories" subtitle={`${mishnayot.filter(m => m.kidsStory).length} of ${mishnayot.length} have a retelling`}>
      <div className="hint-box">Stories should be written for ages 5–10. Keep to ~80 words. Read aloud test: can a 7-year-old follow without help?</div>
      {mishnayot.map(m => (
        <div key={m.num} className={`story-row ${m.kidsStory ? 'done' : 'missing'}`}>
          <div className="story-num">1:{m.num}</div>
          <div className="story-attr">{m.attribution.en}</div>
          <div className="story-status">
            {m.kidsStory ? <span className="status-pill published">✓ Written</span> : <span className="status-pill draft">Missing</span>}
          </div>
          <div className="story-preview">{m.kidsStory ? m.kidsStory.slice(0, 100) + '…' : <em style={{color:'var(--muted)'}}>No story yet</em>}</div>
          <button className="admin-btn ghost">{m.kidsStory ? 'Edit' : 'Write'}</button>
        </div>
      ))}
    </SimpleAdmin>
  );
};

const QuizzesAdmin = ({ data }) => (
  <SimpleAdmin title="Quizzes" subtitle="Kids quizzes — one per Mishnah">
    {data.perakim[0].mishnayot.map(m => (
      <div key={m.num} className="story-row">
        <div className="story-num">1:{m.num}</div>
        <div className="story-attr">{m.attribution.en}</div>
        <div className="story-status">
          {m.kidsQuestion
            ? <span className="status-pill published">✓ {m.kidsQuestion.options.length} options</span>
            : <span className="status-pill draft">Missing</span>}
        </div>
        <div className="story-preview" style={{fontStyle:'italic'}}>{m.kidsQuestion?.q || '—'}</div>
        <button className="admin-btn ghost">{m.kidsQuestion ? 'Edit' : 'Write'}</button>
      </div>
    ))}
  </SimpleAdmin>
);

const TranslationsAdmin = () => (
  <SimpleAdmin title="Translations" subtitle="3 translation sources active">
    <div className="trans-list">
      {[
        { name: 'Sefaria Community', lic: 'CC-BY · public', cov: '100%', active: true },
        { name: 'Original (in-house)', lic: 'Proprietary', cov: '4%', active: true },
        { name: 'Rabbi Sacks (z"l)', lic: 'Licensed', cov: '38%', active: false },
        { name: 'Steinsaltz', lic: 'Licensed · pending', cov: '0%', active: false },
      ].map(t => (
        <div key={t.name} className="trans-row">
          <div>
            <div className="trans-name">{t.name}</div>
            <div className="trans-lic">{t.lic}</div>
          </div>
          <div className="trans-cov">
            <div className="prog-bar"><div className="prog-fill" style={{width: t.cov}} /></div>
            <span>{t.cov} coverage</span>
          </div>
          <label className="trans-toggle">
            <input type="checkbox" defaultChecked={t.active} />
            <span>Active</span>
          </label>
        </div>
      ))}
    </div>
  </SimpleAdmin>
);

const IllustrationsAdmin = () => {
  const entries = window.ILLUSTRATIONS || {};
  return (
    <SimpleAdmin title="Illustrations" subtitle={`Kids illustration system — ${Object.keys(entries).length} scenes`}>
      <div className="hint-box">Each illustration is a React/SVG component — easy to swap with commissioned art. Designed as a consistent flat-color system: warm palette, friendly geometric shapes, no fine line work.</div>
      <div className="illus-grid">
        {Object.entries(entries).map(([num, e]) => {
          const C = e.Component;
          return (
            <div key={num} className="illus-card">
              <div className="illus-thumb">
                {e.url ? <img src={e.url} alt={e.name} className="illus-thumb-img" /> : <C />}
              </div>
              <div className="illus-meta">
                <div className="illus-name">
                  {e.name}
                  {e.url && <span className="illus-badge">Real art</span>}
                </div>
                <div className="illus-desc">Mishnah 1:{num}</div>
                <div className="illus-file">{e.url ? e.url.split('/').pop() : 'svg · placeholder'}</div>
              </div>
            </div>
          );
        })}
        <div className="illus-card empty">
          <div style={{textAlign: 'center', color: 'var(--muted)'}}>
            <Icon name="plus" size={20} />
            <div style={{marginTop: 6, fontSize: 11.5}}>Upload commissioned art</div>
          </div>
        </div>
      </div>
    </SimpleAdmin>
  );
};

const UsersAdmin = () => (
  <SimpleAdmin title="Learners" subtitle="1,284 registered · 412 active this week · 89 paid">
    <div className="user-stats">
      {[
        { l: 'Daily active', v: '218', d: '+12%' },
        { l: 'Weekly active', v: '412', d: '+8%' },
        { l: 'Avg session', v: '14m', d: '+1m' },
        { l: 'Kids profiles', v: '189', d: '+24%' },
      ].map(s => (
        <div key={s.l} className="user-stat">
          <div className="user-stat-label">{s.l}</div>
          <div className="user-stat-val">{s.v}</div>
          <div className="user-stat-delta">{s.d}</div>
        </div>
      ))}
    </div>
    <div className="hint-box">User-level admin (search, ban, refund, etc.) coming after auth integration.</div>
  </SimpleAdmin>
);

const CommentsAdmin = () => (
  <SimpleAdmin title="Community" subtitle="Discussion threads per Mishnah · moderation queue">
    <div className="hint-box">Community is currently off. Threads can be enabled per-Mishnah once moderators are assigned.</div>
  </SimpleAdmin>
);

const MediaAdmin = () => (
  <SimpleAdmin title="Media library" subtitle="Illustrations, audio files, video thumbnails">
    <div className="hint-box">All uploaded files appear here. Connect S3 / R2 for storage. (Coming with Code build-out.)</div>
  </SimpleAdmin>
);

const CrossRefsAdmin = () => (
  <SimpleAdmin title="Cross-references" subtitle="Tanach, Talmud, Midrash and Halacha sources">
    <div className="hint-box">Cross-references are managed inline within each Mishnah's editor. This page will show global statistics and orphan source detection.</div>
  </SimpleAdmin>
);

const SettingsAdmin = () => (
  <SimpleAdmin title="Settings" subtitle="Site-wide configuration">
    <div className="settings-grid">
      {[
        { l: 'Site name', v: 'Avot' },
        { l: 'Tagline', v: 'Pirkei Avot, reborn' },
        { l: 'Default translation', v: 'Sefaria Community' },
        { l: 'Default Hebrew font', v: 'Heebo' },
        { l: 'Comments enabled', v: 'No' },
        { l: 'Kids mode default', v: 'Off' },
        { l: 'Analytics', v: 'Plausible' },
      ].map(s => (
        <div key={s.l} className="settings-row">
          <div className="settings-label">{s.l}</div>
          <div className="settings-val">{s.v}</div>
          <button className="form-link">Edit</button>
        </div>
      ))}
    </div>
  </SimpleAdmin>
);

const AuditAdmin = () => (
  <SimpleAdmin title="Audit log" subtitle="Every content change is recorded">
    <div className="hint-box">Audit log enabled. Recent events:</div>
    <div className="history-list" style={{marginTop: 12}}>
      {[
        { who: 'Daniel Goldstein', what: 'Updated Mishnah 1:1 commentary (Rashi)', when: '2 hours ago', avatar: 'DG' },
        { who: 'Rabbi M. Cohen', what: 'Added 3 videos to Mishnah 1:2', when: '3 days ago', avatar: 'MC' },
        { who: 'Sarah Klein', what: 'Uploaded illustration "Three Pillars"', when: '5 days ago', avatar: 'SK' },
        { who: 'Daniel Goldstein', what: 'Invited Eli Levin as Translator', when: '1 week ago', avatar: 'DG' },
        { who: 'System', what: 'Imported full Sefaria Hebrew text', when: '2 weeks ago', avatar: 'SY' },
      ].map((h, i) => (
        <div key={i} className="history-item">
          <div className="avatar">{h.avatar}</div>
          <div>
            <div><strong>{h.who}</strong> <span style={{color:'var(--muted)'}}>{h.what}</span></div>
            <div style={{fontSize: 11, color: 'var(--muted)', marginTop: 2}}>{h.when}</div>
          </div>
        </div>
      ))}
    </div>
  </SimpleAdmin>
);

const SimpleAdmin = ({ title, subtitle, action, children }) => (
  <div>
    <div className="admin-head">
      <div>
        <h1 className="admin-title">{title}</h1>
        <p className="admin-subtitle">{subtitle}</p>
      </div>
      {action}
    </div>
    {children}
  </div>
);

Object.assign(window, { AdminPanel });

export { AdminLogin, AdminNav, AdminPanel, AuditAdmin, CommentaryAdmin, CommentsAdmin, CrossRefsAdmin, DrawerCommentary, DrawerCrossRefs, DrawerHistory, DrawerKids, DrawerText, DrawerVideos, EditorsAdmin, IllustrationsAdmin, MediaAdmin, MishnahEditDrawer, MishnayotTable, PerakimAdmin, QuizzesAdmin, Select, SettingsAdmin, SimpleAdmin, StoriesAdmin, TranslationsAdmin, UsersAdmin, VideosAdmin, computeCompleteness, statusLabel };
