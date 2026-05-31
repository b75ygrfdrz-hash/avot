import React from 'react';
import { Icon } from './Icon.jsx';
import { AdminLogin } from './admin-shared.jsx';
import { AuthModal } from './AuthModal.jsx';
import { isAdminAuthed } from '../lib/admin.js';
import {
  isConfigured,
  getSession,
  onAuthChange,
  fetchIdeas,
  saveIdeas as saveIdeasRemote,
} from '../lib/supabase.js';

const { useState, useEffect, useRef, useMemo } = React;
const useS = useState, useE = useEffect, useR = useRef;

// Hidden ideas list — reachable only via #avot/list.
// When the database is configured, the board is gated behind a real login
// and saved online (private to that account). Otherwise it falls back to the
// old admin-password gate with browser-only storage.

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
  const [session, setSession] = useS(undefined); // undefined = checking, null = logged out

  useE(() => {
    if (!isConfigured) { setSession(null); return; }
    let active = true;
    getSession().then(s => { if (active) setSession(s || null); });
    const unsub = onAuthChange(s => { if (active) setSession(s || null); });
    return () => { active = false; unsub(); };
  }, []);

  // No database configured → old behaviour: admin password + browser-only board.
  if (!isConfigured) return <LocalGate onClose={onClose} />;

  if (session === undefined) {
    return (
      <div className="ideas-shell">
        <div style={{ padding: 48, textAlign: 'center', color: 'var(--muted)' }}>Loading…</div>
      </div>
    );
  }
  if (!session) {
    // AuthModal calls onClose both on the X button and after a successful
    // sign-in. Only close the whole list if the user actually backed out
    // (still logged out); a successful sign-in just reveals the board.
    const handleAuthClose = async () => {
      const s = await getSession();
      if (s) setSession(s);
      else onClose && onClose();
    };
    return <AuthModal onClose={handleAuthClose} defaultMode="signin" defaultMethod="password" />;
  }
  return <IdeasBoard onClose={onClose} userId={session.user.id} />;
};

// Fallback used only when Supabase is not configured: the original
// admin-password gate with a browser-only board.
const LocalGate = ({ onClose }) => {
  const [authed, setAuthed] = useS(isAdminAuthed());
  if (!authed) return <AdminLogin onAuth={() => setAuthed(true)} onClose={onClose} />;
  return <IdeasBoard onClose={onClose} />;
};

const IdeasBoard = ({ onClose, userId }) => {
  const online = !!userId;
  const [ideas, setIdeas] = useS([]);
  const [loading, setLoading] = useS(true);
  const [draft, setDraft] = useS('');
  const [draftNotes, setDraftNotes] = useS('');
  const [editingId, setEditingId] = useS(null);
  const [dragOverCol, setDragOverCol] = useS(null);
  const dragIdRef = useR(null);
  const titleRef = useR(null);
  const loadedRef = useR(false);
  const saveTimer = useR(null);

  // Initial load: online from the account (migrating any browser ideas the
  // first time), or browser-only when there is no login.
  useE(() => {
    let cancelled = false;
    (async () => {
      if (!online) {
        if (!cancelled) { setIdeas(loadIdeas()); setLoading(false); loadedRef.current = true; }
        return;
      }
      const local = loadIdeas();
      const { data: remote } = await fetchIdeas(userId);
      if (cancelled) return;
      let initial;
      if (remote && remote.length) {
        initial = remote;
      } else if (local.length) {
        initial = local;            // first move from browser → account
        saveIdeasRemote(userId, local);
      } else {
        initial = remote || [];
      }
      setIdeas(initial);
      setLoading(false);
      loadedRef.current = true;
    })();
    return () => { cancelled = true; };
  }, [userId]);

  // Persist on every change (after the first load). Browser cache is instant;
  // the online save is debounced so quick edits don't spam the database.
  useE(() => {
    if (!loadedRef.current) return;
    saveIdeas(ideas);
    if (online) {
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => saveIdeasRemote(userId, ideas), 400);
    }
  }, [ideas]);

  // ---- Kanban drag + drop ----
  // Move a card to a status. If beforeId is given, insert it just before that
  // card (lets you reorder within a column); otherwise append to the column.
  function moveCard(fromId, toStatus, beforeId = null) {
    setIdeas(prev => {
      const fromIdx = prev.findIndex(i => i.id === fromId);
      if (fromIdx < 0) return prev;
      const moved = { ...prev[fromIdx], status: toStatus };
      const arr = prev.filter(i => i.id !== fromId);
      if (beforeId && beforeId !== fromId) {
        const toIdx = arr.findIndex(i => i.id === beforeId);
        arr.splice(toIdx < 0 ? arr.length : toIdx, 0, moved);
      } else {
        arr.push(moved);
      }
      return arr;
    });
  }

  function onCardDragStart(e, id) {
    dragIdRef.current = id;
    e.dataTransfer.effectAllowed = 'move';
  }
  function onCardDragEnd() { dragIdRef.current = null; setDragOverCol(null); }

  function onColDragOver(e, statusId) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCol(statusId);
  }
  function onColDragLeave(e) {
    // Only clear when leaving the column itself, not its children.
    if (!e.currentTarget.contains(e.relatedTarget)) setDragOverCol(null);
  }
  function onColDrop(e, statusId) {
    e.preventDefault();
    setDragOverCol(null);
    const fromId = dragIdRef.current;
    if (fromId) moveCard(fromId, statusId);
    dragIdRef.current = null;
  }
  function onCardDrop(e, targetCard) {
    e.preventDefault();
    e.stopPropagation();
    setDragOverCol(null);
    const fromId = dragIdRef.current;
    if (fromId && fromId !== targetCard.id) moveCard(fromId, targetCard.status, targetCard.id);
    dragIdRef.current = null;
  }

  const counts = useMemo(() => {
    const c = { all: ideas.length };
    STATUSES.forEach(s => { c[s.id] = ideas.filter(i => i.status === s.id).length; });
    return c;
  }, [ideas]);

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

  if (loading) {
    return (
      <div className="ideas-shell">
        <div style={{ padding: 48, textAlign: 'center', color: 'var(--muted)' }}>Loading your ideas…</div>
      </div>
    );
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
            <span className="ideas-hint">{online ? 'Saved to your account · synced across devices.' : 'Stored locally in your browser.'}</span>
            <button className="ideas-add" onClick={add} disabled={!draft.trim()}>
              <Icon name="plus" size={13} /> Add idea
            </button>
          </div>
        </div>

        {ideas.length === 0 && (
          <div className="ideas-empty">No ideas yet. Type one above and hit Enter to add your first card.</div>
        )}

        <div className="ideas-columns">
          {STATUSES.map(s => {
            const cards = ideas.filter(i => i.status === s.id);
            return (
              <div key={s.id}
                className={`ideas-column${dragOverCol === s.id ? ' ideas-column--drop' : ''}`}
                onDragOver={e => onColDragOver(e, s.id)}
                onDragLeave={onColDragLeave}
                onDrop={e => onColDrop(e, s.id)}
              >
                <div className="ideas-col-head">
                  <span className="ideas-dot" style={{ background: s.color }} />
                  <span className="ideas-col-label">{s.label}</span>
                  <span className="ideas-count">{cards.length}</span>
                </div>
                <div className="ideas-col-cards">
                  {cards.length === 0 && <div className="ideas-col-empty">Drop a card here</div>}
                  {cards.map(i => {
                    const editing = editingId === i.id;
                    return (
                      <div key={i.id}
                        className="ideas-card"
                        draggable
                        onDragStart={e => onCardDragStart(e, i.id)}
                        onDragOver={e => e.preventDefault()}
                        onDrop={e => onCardDrop(e, i)}
                        onDragEnd={onCardDragEnd}
                      >
                        <span className="ideas-drag-handle" title="Drag to another column">⠿</span>
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
                          <button className="ideas-icon-btn" onClick={() => cycleStatus(i)} title="Move to next column">→</button>
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
            );
          })}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { IdeasList });

export { IdeasList };
