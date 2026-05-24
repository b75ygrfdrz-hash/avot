import React from 'react';
import { Icon } from './Icon.jsx';
import { AdminLogin } from './admin.jsx';
import { isAdminAuthed } from '../lib/admin.js';

const { useState, useEffect, useRef, useMemo } = React;
const useS = useState, useE = useEffect, useR = useRef;

// Hidden ideas list — reachable only via #avot/list
// Gated behind the existing admin password.

const STORAGE_KEY = 'avot.ideas.v1';

const STATUSES = [
  { id: 'idea',  label: 'Idea',  color: '#9aa0a6' },
  { id: 'next',  label: 'Next',  color: '#5a8aaa' },
  { id: 'doing', label: 'Doing', color: '#e0b840' },
  { id: 'done',  label: 'Done',  color: '#6aa56a' },
];

function loadIdeas() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch (e) { return []; }
}

function saveIdeas(arr) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); } catch (e) {}
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

const IdeasList = ({ onClose }) => {
  const [authed, setAuthed] = useS(isAdminAuthed());
  if (!authed) {
    return <AdminLogin onAuth={() => setAuthed(true)} onClose={onClose} />;
  }
  return <IdeasBoard onClose={onClose} />;
};

const IdeasBoard = ({ onClose }) => {
  const [ideas, setIdeas] = useS(loadIdeas);
  const [draft, setDraft] = useS('');
  const [draftNotes, setDraftNotes] = useS('');
  const [filter, setFilter] = useS('all');
  const [editingId, setEditingId] = useS(null);
  const titleRef = useR(null);

  useE(() => { saveIdeas(ideas); }, [ideas]);

  const counts = useMemo(() => {
    const c = { all: ideas.length };
    STATUSES.forEach(s => { c[s.id] = ideas.filter(i => i.status === s.id).length; });
    return c;
  }, [ideas]);

  const filtered = filter === 'all' ? ideas : ideas.filter(i => i.status === filter);

  function add() {
    const title = draft.trim();
    if (!title) return;
    const item = {
      id: uid(),
      title,
      notes: draftNotes.trim(),
      status: 'idea',
      createdAt: Date.now(),
    };
    setIdeas([item, ...ideas]);
    setDraft('');
    setDraftNotes('');
    setTimeout(() => titleRef.current && titleRef.current.focus(), 0);
  }

  function updateIdea(id, patch) {
    setIdeas(ideas.map(i => i.id === id ? { ...i, ...patch } : i));
  }

  function removeIdea(id) {
    setIdeas(ideas.filter(i => i.id !== id));
  }

  function cycleStatus(idea) {
    const i = STATUSES.findIndex(s => s.id === idea.status);
    const next = STATUSES[(i + 1) % STATUSES.length];
    updateIdea(idea.id, { status: next.id });
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(ideas, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `avot-ideas-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="ideas-shell">
      <div className="ideas-header">
        <div className="ideas-brand">
          <span className="ideas-mark">★</span>
          <div>
            <div className="ideas-title">Ideas</div>
            <div className="ideas-sub">Future growth · private</div>
          </div>
        </div>
        <div className="ideas-actions">
          <button className="ideas-act" onClick={exportJson} title="Export JSON">
            <Icon name="download" size={13} /> Export
          </button>
          <button className="ideas-close" onClick={onClose} aria-label="Close">
            <Icon name="close" size={14} />
          </button>
        </div>
      </div>

      <div className="ideas-body">
        <div className="ideas-compose">
          <input
            ref={titleRef}
            className="ideas-input-title"
            placeholder="What's the idea?"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) add();
              if (e.key === 'Enter' && !e.shiftKey && !draftNotes) { e.preventDefault(); add(); }
            }}
          />
          <textarea
            className="ideas-input-notes"
            placeholder="Notes (optional). Cmd/Ctrl + Enter to save."
            value={draftNotes}
            onChange={e => setDraftNotes(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) add();
            }}
            rows={2}
          />
          <div className="ideas-compose-foot">
            <span className="ideas-hint">Stored locally in your browser.</span>
            <button className="ideas-add" onClick={add} disabled={!draft.trim()}>
              <Icon name="plus" size={13} /> Add idea
            </button>
          </div>
        </div>

        <div className="ideas-filters">
          <button className={`ideas-filter ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
            All <span className="ideas-count">{counts.all}</span>
          </button>
          {STATUSES.map(s => (
            <button key={s.id}
              className={`ideas-filter ${filter === s.id ? 'active' : ''}`}
              onClick={() => setFilter(s.id)}>
              <span className="ideas-dot" style={{ background: s.color }} />
              {s.label} <span className="ideas-count">{counts[s.id] || 0}</span>
            </button>
          ))}
        </div>

        <div className="ideas-list">
          {filtered.length === 0 && (
            <div className="ideas-empty">
              {ideas.length === 0
                ? 'No ideas yet. Type one above and hit Enter.'
                : 'Nothing in this status.'}
            </div>
          )}
          {filtered.map(i => {
            const s = STATUSES.find(x => x.id === i.status) || STATUSES[0];
            const editing = editingId === i.id;
            return (
              <div key={i.id} className="ideas-card">
                <button className="ideas-status" style={{ background: s.color }} onClick={() => cycleStatus(i)} title="Click to cycle status">
                  {s.label}
                </button>
                <div className="ideas-card-body">
                  {editing ? (
                    <>
                      <input className="ideas-edit-title" defaultValue={i.title}
                        onBlur={e => { updateIdea(i.id, { title: e.target.value.trim() || i.title }); }} />
                      <textarea className="ideas-edit-notes" defaultValue={i.notes} rows={3}
                        onBlur={e => { updateIdea(i.id, { notes: e.target.value }); }} />
                    </>
                  ) : (
                    <>
                      <div className="ideas-card-title">{i.title}</div>
                      {i.notes && <div className="ideas-card-notes">{i.notes}</div>}
                      <div className="ideas-card-date">
                        {new Date(i.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </>
                  )}
                </div>
                <div className="ideas-card-actions">
                  <button className="ideas-icon-btn" onClick={() => setEditingId(editing ? null : i.id)} title={editing ? 'Done' : 'Edit'}>
                    <Icon name={editing ? 'check' : 'edit'} size={13} />
                  </button>
                  <button className="ideas-icon-btn ideas-danger" onClick={() => removeIdea(i.id)} title="Delete">
                    <Icon name="trash" size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { IdeasList });

export { IdeasList };
