import React from 'react';
import { Header } from './components/Header.jsx';
import { Home, PerekPicker } from './components/Home.jsx';
import { LeftRail } from './components/LeftRail.jsx';
import { Onboarding } from './components/Onboarding.jsx';
import { Reader } from './components/Reader.jsx';
import { RightPanel } from './components/RightPanel.jsx';
import { SearchOverlay } from './components/SearchOverlay.jsx';
import { MesorahTree } from './components/MesorahTree.jsx';
import { ShabbatTable } from './components/ShabbatTable.jsx';
import { IdeasList } from './components/IdeasList.jsx';
import { AuthModal } from './components/AuthModal.jsx';
import { AskPanel } from './components/AskPanel.jsx';

// Lazy-loaded: kids.jsx and admin.jsx both pull in illustrations.jsx
// (6.3MB of base64 artwork). Loading them on demand drops the initial
// bundle from ~7MB to ~700KB for Adult-mode visitors.
const AdminPanel = React.lazy(() => import('./components/admin.jsx').then(m => ({ default: m.AdminPanel })));

// Two parallel Kids implementations. Toggle which one renders by
// appending ?kids=v2 to the URL (or storing 'v2' under 'avot.kids.v')
// in localStorage). Default is V1, the live experience. V2 is a
// playground we can iterate on without risking V1.
const KidsModeV1 = React.lazy(() => import('./components/kids.jsx').then(m => ({ default: m.KidsMode })));
const KidsModeV2 = React.lazy(() => import('./components/kidsV2.jsx').then(m => ({ default: m.KidsMode })));

function pickKidsVersion() {
  try {
    // ?kids=v2 may appear in window.location.search (plain URL)
    // or inside the hash fragment (e.g. /#avot/home?kids=v2).
    // Check both so hash-based routing doesn't silently drop the param.
    let p = new URLSearchParams(window.location.search).get('kids');
    if (!p) {
      const hashQuery = window.location.hash.split('?')[1];
      if (hashQuery) p = new URLSearchParams(hashQuery).get('kids');
    }
    if (p === 'v2' || p === 'v1') {
      localStorage.setItem('avot.kids.v', p);
      return p;
    }
    return localStorage.getItem('avot.kids.v') || 'v2';
  } catch (e) { return 'v2'; }
}

const LoadingSplash = () => (
  <div style={{position:'fixed', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'var(--paper, #faf6ee)', zIndex: 9999, color:'var(--muted, #888)', fontSize:14, letterSpacing:'0.1em', textTransform:'uppercase'}}>
    Loading…
  </div>
);
import { MobileBottomNav, MobilePanelSheet } from './components/mobile.jsx';
import { ColoringPage, MemorizeMode, NotePopover, ParentDashboard, QuoteCard, SelectionToolbar, SourceSheet } from './components/overlays.jsx';
import { AvotTweaks } from './components/tweaks.jsx';
import { useSync } from './lib/useSync.js';

const { useState, useEffect, useRef, useCallback, useMemo } = React;
const useS = useState, useE = useEffect, useR = useRef, useC = useCallback;
const useState_p = useState, useEffect_p = useEffect, useState_k = useState;
const useState_m = useState, useEffect_m = useEffect, useRef_m = useRef;
const useS_s = useState, useE_s = useEffect, useR_s = useRef;
const useState_a = useState, useEffect_a = useEffect;
const useState_mc = useState, useRef_mc = useRef, useEffect_mc = useEffect;
const useEffect_h = useEffect, useState_ms = useState, useEffect_ms = useEffect;
const useS_o = useState, useE_o = useEffect;

// Main App — orchestrates state, selection, highlights, modals


const STORAGE_KEYS = {
  pos: 'avot.position.v1',
  highlights: 'avot.highlights.v1',
  layout: 'avot.layout.v1',
  mode: 'avot.mode.v1',
  dark: 'avot.dark.v1',
};

// Shown when the current perek has no mishnayot loaded yet
const EmptyChapter = ({ perek, onGoToStart }) => (
  <div className="empty-chapter">
    <div className="empty-chapter-inner">
      <div className="empty-chapter-eyebrow">{perek?.title?.he || `פרק ${perek?.num || ''}`}</div>
      <h2 className="empty-chapter-title">This chapter isn't here yet</h2>
      <p className="empty-chapter-text">
        {perek?.title?.en || `Chapter ${perek?.num || ''}`} hasn't been added to the
        library yet. Chapter 1 is fully available to learn.
      </p>
      <button className="empty-chapter-btn" onClick={onGoToStart}>Go to Chapter 1</button>
    </div>
  </div>
);

const App = () => {
  const data = window.PIRKEI_AVOT;
  const savedPos = (() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.pos) || '{"p":0,"m":0}'); }
    catch { return { p: 0, m: 0 }; }
  })();

  // Determine which Kids implementation to show. Evaluated at render time
  // (not module-level) so the URL param and localStorage are read after the
  // page has fully loaded and after hash-based routing has settled.
  const [kidsVersion] = useS(() => pickKidsVersion());
  if (typeof window !== 'undefined') window.AvotKidsVersion = kidsVersion;

  const [onboarded, setOnboarded] = useS(localStorage.getItem('avot.onboarded.v1') === 'true');
  const [showHome, setShowHome] = useS(true);
  const [perekIdx, setPerekIdx] = useS(Math.min(Math.max(0, savedPos.p | 0), data.perakim.length - 1));
  const [mishnahIdx, setMishnahIdx] = useS(Math.max(0, savedPos.m | 0));
  const [mode, setMode] = useS(localStorage.getItem(STORAGE_KEYS.mode) || 'adult');
  const [layout, setLayout] = useS(localStorage.getItem(STORAGE_KEYS.layout) || 'stacked');
  const [showWordHover, setShowWordHover] = useS(localStorage.getItem('avot.wordhover.v1') !== 'false');
  const [dropcap, setDropcap] = useS(true);
  const [dark, setDark] = useS(localStorage.getItem(STORAGE_KEYS.dark) === 'true');

  const [highlights, setHighlights] = useS(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.highlights) || '[]');
    } catch { return []; }
  });

  // Sync highlights + kids progress to/from Supabase on sign-in.
  const onMergeHighlights = useC((remoteHls) => {
    setHighlights(prev => {
      const ids = new Set(prev.map(h => h.id));
      const newOnes = remoteHls.filter(h => !ids.has(h.id));
      return newOnes.length ? [...prev, ...newOnes] : prev;
    });
  }, []);

  const { syncUser, showUploadPrompt, syncing, doUpload, dismissUpload } = useSync({
    highlights,
    onMergeHighlights,
  });

  const [selPos, setSelPos] = useS(null);
  const [selData, setSelData] = useS(null);
  const [activeColor, setActiveColor] = useS(null);
  const [notePop, setNotePop] = useS(null);
  const [editingHl, setEditingHl] = useS(null);

  // Modals
  const [showQuote, setShowQuote] = useS(false);
  const [showMemorize, setShowMemorize] = useS(false);
  const [showSheet, setShowSheet] = useS(false);
  const [showParentDash, setShowParentDash] = useS(false);
  const [showColoring, setShowColoring] = useS(false);
  const [showAdmin, setShowAdmin] = useS(false);
  const [showMesorah, setShowMesorah] = useS(false);
  const [mesorahFocus, setMesorahFocus] = useS(null);
  const [showShabbat, setShowShabbat] = useS(false);
  const [showList, setShowList] = useS(false);
  const [showAuth, setShowAuth] = useS(false);
  const [showAsk, setShowAsk] = useS(false);
  const [authMode, setAuthMode] = useS('signin'); // 'signin' | 'signup'
  const openAuth = (mode = 'signin') => { setAuthMode(mode); setShowAuth(true); };
  const cameFromInApp = useR(false);
  // The hash-sync effect must skip its first run: on a deep-link load it
  // would otherwise overwrite the incoming hash before the initial-route
  // effect's state update has settled.
  const routeSyncFirst = useR(true);
  const [showSearch, setShowSearch] = useS(false);
  const [railCollapsed, setRailCollapsed] = useS(localStorage.getItem('avot.railCollapsed.v1') === 'true');
  const [showPicker, setShowPicker] = useS(false);

  const perek = data.perakim[perekIdx] || data.perakim[0];
  const mishnah = perek.mishnayot[mishnahIdx] || perek.mishnayot[0] || null;
  const chapterEmpty = !mishnah;

  // Persist
  useE(() => { localStorage.setItem(STORAGE_KEYS.pos, JSON.stringify({p: perekIdx, m: mishnahIdx})); }, [perekIdx, mishnahIdx]);  useE(() => { localStorage.setItem(STORAGE_KEYS.mode, mode); }, [mode]);
  useE(() => { localStorage.setItem(STORAGE_KEYS.layout, layout); }, [layout]);
  useE(() => { localStorage.setItem(STORAGE_KEYS.dark, String(dark)); }, [dark]);
  useE(() => { localStorage.setItem('avot.wordhover.v1', String(showWordHover)); }, [showWordHover]);
  useE(() => { localStorage.setItem(STORAGE_KEYS.highlights, JSON.stringify(highlights)); }, [highlights]);

  // Apply dark mode class, with a smooth one-shot color transition on toggle
  const themeFirstRun = useR(true);
  useE(() => {
    const html = document.documentElement;
    if (themeFirstRun.current) {
      themeFirstRun.current = false;
      html.classList.toggle('dark', dark);
      return;
    }
    html.classList.add('theme-transition');
    html.classList.toggle('dark', dark);
    const t = setTimeout(() => html.classList.remove('theme-transition'), 480);
    return () => clearTimeout(t);
  }, [dark]);

  // Initial route — read on first paint
  useE(() => {
    const route = window.AvotRoutes?.parseHash?.();
    if (!route) return;
    if (route.kind === 'mishnah') {
      const pi = data.perakim.findIndex(p => p.num === route.perek);
      if (pi >= 0) {
        setPerekIdx(pi);
        const mi = data.perakim[pi].mishnayot.findIndex(m => m.num === route.mishnah);
        setMishnahIdx(Math.max(0, mi));
        setShowHome(false);
        if (route.view) setLayout(route.view);
      }
    } else if (route.kind === 'chain') {
      setShowMesorah(true);
      setMesorahFocus(route.focus || null);
    } else if (route.kind === 'shabbat') {
      setShowShabbat(true);
    } else if (route.kind === 'list') {
      setShowList(true);
    } else if (route.kind === 'home') {
      setShowHome(true);
    }
  }, []);

  // Sync URL hash whenever position or view changes
  useE(() => {
    if (!window.AvotRoutes) return;
    if (routeSyncFirst.current) { routeSyncFirst.current = false; return; }
    if (showMesorah || showShabbat) return;
    if (showHome) AvotRoutes.home();
    else if (mishnah) AvotRoutes.update(perek.num, mishnah.num, { view: layout });
  }, [showHome, perekIdx, mishnahIdx, layout, showMesorah, showShabbat]);

  // React to manual hash changes (back/forward, paste)
  useE(() => {
    const onHash = () => {
      const route = window.AvotRoutes?.parseHash?.();
      if (!route) { setShowMesorah(false); setShowShabbat(false); return; }
      if (route.kind === 'chain') {
        setShowShabbat(false);
        setMesorahFocus(route.focus || null);
        setShowMesorah(true);
        return;
      }
      if (route.kind === 'shabbat') {
        setShowMesorah(false);
        setShowList(false);
        setShowShabbat(true);
        return;
      }
      if (route.kind === 'list') {
        setShowMesorah(false);
        setShowShabbat(false);
        setShowList(true);
        return;
      }
      setShowMesorah(false);
      setShowShabbat(false);
      setShowList(false);
      if (route.kind === 'mishnah') {
        const pi = data.perakim.findIndex(p => p.num === route.perek);
        if (pi >= 0) {
          setPerekIdx(pi);
          const mi = data.perakim[pi].mishnayot.findIndex(m => m.num === route.mishnah);
          setMishnahIdx(Math.max(0, mi));
          setShowHome(false);
        }
      } else if (route.kind === 'home') {
        setShowHome(true);
      }
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  useE(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Mobile swipe — only when reading
  useE(() => {
    if (showHome || mode === 'kids') return;
    const onLeft = () => {
      if (mishnahIdx < perek.mishnayot.length - 1) setMishnahIdx(i => i + 1);
      else {
        for (let p = perekIdx + 1; p < data.perakim.length; p++) {
          if (data.perakim[p].mishnayot.length) { setPerekIdx(p); setMishnahIdx(0); break; }
        }
      }
    };
    const onRight = () => {
      if (mishnahIdx > 0) setMishnahIdx(i => i - 1);
      else {
        for (let p = perekIdx - 1; p >= 0; p--) {
          if (data.perakim[p].mishnayot.length) { setPerekIdx(p); setMishnahIdx(data.perakim[p].mishnayot.length - 1); break; }
        }
      }
    };
    window.addEventListener('avot:swipe-left', onLeft);
    window.addEventListener('avot:swipe-right', onRight);
    return () => { window.removeEventListener('avot:swipe-left', onLeft); window.removeEventListener('avot:swipe-right', onRight); };
  }, [showHome, mode, perekIdx, mishnahIdx]);

  // PWA install registration
  useE(() => {
    if ('serviceWorker' in navigator) { /* future: register sw */ }
  }, []);

  // Mobile bottom-sheet open state
  const [mobileSheet, setMobileSheet] = useS(false);

  // Selection handler
  const onSelection = (ev, lang) => {
    setTimeout(() => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.toString().trim().length === 0) {
        setSelPos(null);
        setSelData(null);
        return;
      }
      const text = sel.toString();
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      // Offset of the selection start within the container's text,
      // measured against rendered characters (including any inside
      // existing highlight marks) so it maps onto the raw mishnah text.
      const container = ev.currentTarget;
      const pre = range.cloneRange();
      pre.selectNodeContents(container);
      pre.setEnd(range.startContainer, range.startOffset);
      const start = pre.toString().length;
      setSelData({ text, lang, start, end: start + text.length });
      setSelPos({ x: rect.left + rect.width / 2 - 110, y: rect.top - 50 });
    }, 10);
  };

  const closeSelection = () => {
    setSelPos(null);
    setSelData(null);
    window.getSelection().removeAllRanges();
  };

  const applyHighlight = (color) => {
    if (!selData) return;
    const id = 'hl_' + Date.now();
    const newHl = {
      id,
      perek: perek.num,
      mishnah: mishnah.num,
      lang: selData.lang,
      text: selData.text,
      start: selData.start,
      end: selData.end,
      color,
      note: '',
      tags: [],
      createdAt: new Date().toISOString(),
    };
    setHighlights(h => [...h, newHl]);
    setActiveColor(color);
    closeSelection();
  };

  const addNoteToSelection = () => {
    if (!selData) return;
    const id = 'hl_' + Date.now();
    const newHl = {
      id,
      perek: perek.num,
      mishnah: mishnah.num,
      lang: selData.lang,
      text: selData.text,
      start: selData.start,
      end: selData.end,
      color: 'yellow',
      note: '',
      tags: [],
      createdAt: new Date().toISOString(),
    };
    setHighlights(h => [...h, newHl]);
    setEditingHl(newHl);
    setNotePop({ x: selPos.x, y: selPos.y + 50 });
    closeSelection();
  };

  const shareHighlight = () => {
    const url = `${location.origin}${location.pathname}${window.AvotRoutes ? AvotRoutes.buildHash(perek.num, mishnah.num, { highlight: selData.text.slice(0, 40) }) : `#avot/${perek.num}.${mishnah.num}`}`;
    navigator.clipboard?.writeText(url).catch(() => {});
    closeSelection();
    alert('Link copied to clipboard:\n' + url);
  };

  const onHighlightClick = (h, ev) => {
    setEditingHl(h);
    setNotePop({ x: ev.clientX - 140, y: ev.clientY + 14 });
  };

  const saveNote = (updated) => {
    setHighlights(hs => hs.map(h => h.id === updated.id ? updated : h));
    setNotePop(null);
    setEditingHl(null);
  };

  const lastReadCard = mishnah && (perekIdx > 0 || mishnahIdx > 0) ? {
    perek: perek.num,
    mishnah: mishnah.num,
    attribution: mishnah.attribution.en,
    timeAgo: '2 days ago',
  } : null;

  // Wrap nav in View Transitions when possible
  const jumpTo = (p, m) => {
    const navigate = () => {
      const pi = data.perakim.findIndex(x => x.num === p);
      if (pi >= 0) {
        setPerekIdx(pi);
        const mi = data.perakim[pi].mishnayot.findIndex(x => x.num === m);
        setMishnahIdx(Math.max(0, mi));
      }
      setShowHome(false);
    };
    if (window.navTransition) window.navTransition(navigate);
    else navigate();
  };

  // The Mesorah section is a routed view; open/close drives the URL hash
  const openMesorah = (focusId) => {
    cameFromInApp.current = true;
    location.hash = '#avot/chain' + (focusId ? '/' + focusId : '');
  };
  const closeMesorah = () => {
    if (cameFromInApp.current) {
      cameFromInApp.current = false;
      window.history.back();
    } else {
      location.hash = '#avot/home';
    }
  };

  // The Shabbat Table is a routed view as well
  const openShabbat = () => {
    cameFromInApp.current = true;
    location.hash = '#avot/shabbat';
  };
  const closeShabbat = () => {
    if (cameFromInApp.current) {
      cameFromInApp.current = false;
      window.history.back();
    } else {
      location.hash = '#avot/home';
    }
  };

  const closeList = () => {
    setShowList(false);
    location.hash = '#avot/home';
  };

  // Render
  if (!onboarded) {
    return <Onboarding setMode={setMode} onDone={() => setOnboarded(true)} />;
  }

  if (mode === 'kids') {
    return (
      <div className="app">
        <Header mode={mode} setMode={setMode} perek={perek} mishnah={mishnah}
          onMenuClick={() => {
            const next = !railCollapsed;
            setRailCollapsed(next);
            localStorage.setItem('avot.railCollapsed.v1', String(next));
          }}
          onSearchOpen={() => setShowSearch(true)} onMemorize={() => setShowMemorize(true)}
          onAdmin={() => setShowAdmin(true)}
          onShabbat={openShabbat}
          onTour={() => { localStorage.removeItem('avot.onboarded.v1'); setOnboarded(false); }}
          onOpenAuth={openAuth}
          dark={dark} setDark={setDark} />
        {chapterEmpty ? (
          <EmptyChapter perek={perek} onGoToStart={() => jumpTo(1, 1)} />
        ) : (
          <div className={`kids-with-rail ${railCollapsed ? 'rail-collapsed' : ''}`}>
            <LeftRail data={data} perekIdx={perekIdx} mishnahIdx={mishnahIdx}
              setPerekIdx={setPerekIdx} setMishnahIdx={setMishnahIdx}
              lastRead={lastReadCard} onResume={() => {}}
              onAdmin={() => setShowAdmin(true)} />
            <React.Suspense fallback={<LoadingSplash />}>
              {kidsVersion === 'v2'
                ? <KidsModeV2 perek={perek} perakim={data.perakim} perekIdx={perekIdx} setPerekIdx={setPerekIdx}
                    mishnah={mishnah} mishnahIdx={mishnahIdx} setMishnahIdx={setMishnahIdx}
                    onColoring={() => setShowColoring(true)}
                    onParentDash={() => setShowParentDash(true)}
                  />
                : <KidsModeV1 perek={perek} perakim={data.perakim} perekIdx={perekIdx} setPerekIdx={setPerekIdx}
                    mishnah={mishnah} mishnahIdx={mishnahIdx} setMishnahIdx={setMishnahIdx}
                    onColoring={() => setShowColoring(true)}
                    onParentDash={() => setShowParentDash(true)}
                  />
              }
            </React.Suspense>
          </div>
        )}
        {showParentDash && <ParentDashboard onClose={() => setShowParentDash(false)} />}
        {showColoring && <ColoringPage mishnah={mishnah} onClose={() => setShowColoring(false)} />}
        {showSearch && <SearchOverlay data={data} onClose={() => setShowSearch(false)} onNavigate={(p, m) => {
          const pi = data.perakim.findIndex(x => x.num === p);
          if (pi >= 0) { setPerekIdx(pi); const mi = data.perakim[pi].mishnayot.findIndex(x => x.num === m); setMishnahIdx(Math.max(0, mi)); }
          setShowSearch(false);
        }} />}
        {showAdmin && <React.Suspense fallback={<LoadingSplash />}><AdminPanel data={data} onClose={() => setShowAdmin(false)} /></React.Suspense>}
        {showMesorah && <MesorahTree onClose={closeMesorah}
          onJump={(p, m) => { location.hash = '#avot/' + p + '.' + m; }}
          focusId={mesorahFocus} />}
        {showShabbat && <ShabbatTable data={data} onClose={closeShabbat}
          onJump={(p, m) => { location.hash = '#avot/' + p + '.' + m; }} />}
        {showList && <IdeasList onClose={closeList} />}
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} defaultMode={authMode} defaultMethod={authMode === 'signup' ? 'password' : 'magic'} />}
        {showUploadPrompt && (
          <SyncBanner syncing={syncing}
            onSave={() => doUpload(syncUser?.id)}
            onDismiss={() => dismissUpload(syncUser?.id)} />
        )}
      </div>
    );
  }

  return (
    <div className="app">
      <Header mode={mode} setMode={setMode} perek={perek} mishnah={mishnah}
        onMenuClick={() => {
          const next = !railCollapsed;
          setRailCollapsed(next);
          localStorage.setItem('avot.railCollapsed.v1', String(next));
        }} onSearchOpen={() => setShowSearch(true)}
        onMemorize={() => setShowMemorize(true)}
        onAdmin={() => setShowAdmin(true)}
        onHome={() => setShowHome(true)}
        onPicker={() => setShowPicker(true)}
        onShabbat={openShabbat}
        atHome={showHome}
        onTour={() => { localStorage.removeItem('avot.onboarded.v1'); setOnboarded(false); }}
        onOpenAuth={openAuth}
        dark={dark} setDark={setDark} />
      {showHome ? (
        <>
          <div className={`home-with-rail ${railCollapsed ? 'rail-collapsed' : ''}`}>
            <LeftRail data={data} perekIdx={perekIdx} mishnahIdx={mishnahIdx}
              setPerekIdx={(i) => { setPerekIdx(i); setShowHome(false); }}
              setMishnahIdx={(i) => { setMishnahIdx(i); setShowHome(false); }}
              lastRead={lastReadCard} onResume={() => {}}
              onAdmin={() => setShowAdmin(true)} />
            <Home data={data}
              onOpenMesorah={() => openMesorah()}
              onOpenShabbat={openShabbat}
              lastRead={mishnah && (perekIdx > 0 || mishnahIdx > 0) ? {
                perek: perek.num,
                mishnah: mishnah.num,
                attribution: mishnah.attribution.en,
                timeAgo: '2 days ago',
              } : null}
              onJump={jumpTo}
              stats={{ streak: 5, studied: 7, highlights: highlights.length, days: 18 }}
            />
          </div>
        </>
      ) : (
        <>
          <div className={`main ${railCollapsed ? 'rail-collapsed' : ''}`}>
        <LeftRail data={data} perekIdx={perekIdx} mishnahIdx={mishnahIdx}
          setPerekIdx={setPerekIdx} setMishnahIdx={setMishnahIdx}
          lastRead={lastReadCard} onResume={() => {}}
          onAdmin={() => setShowAdmin(true)} />
        {chapterEmpty ? (
          <EmptyChapter perek={perek} onGoToStart={() => jumpTo(1, 1)} />
        ) : (
          <>
            <Reader perek={perek} mishnah={mishnah}
              mishnahIdx={mishnahIdx} perekIdx={perekIdx}
              setMishnahIdx={setMishnahIdx} setPerekIdx={setPerekIdx}
              perakim={data.perakim}
              onSelection={onSelection}
              highlights={highlights}
              onHighlightClick={onHighlightClick}
              layout={layout} setLayout={setLayout}
              showWordHover={showWordHover} setShowWordHover={setShowWordHover}
              onShareQuote={() => setShowQuote(true)}
              onSourceSheet={() => setShowSheet(true)}
              dropcap={dropcap}
              onViewInChain={(id) => openMesorah(id)}
              onAsk={() => setShowAsk(true)}
            />
            <RightPanel mishnah={mishnah} perek={perek} highlights={highlights} />
          </>
        )}
      </div>
        </>
      )}
      <SelectionToolbar pos={selPos} onHighlight={applyHighlight}
        onNote={addNoteToSelection} onShare={shareHighlight} currentColor={activeColor} />
      {notePop && editingHl && (
        <NotePopover pos={notePop} hl={editingHl}
          onSave={saveNote} onClose={() => { setNotePop(null); setEditingHl(null); }} />
      )}
      {showAsk && mishnah && <AskPanel mishnah={mishnah} perek={perek} onClose={() => setShowAsk(false)} />}
      {showQuote && <QuoteCard mishnah={mishnah} perek={perek} onClose={() => setShowQuote(false)} />}
      {showMemorize && <MemorizeMode perek={perek} onClose={() => setShowMemorize(false)} />}
      {showSheet && <SourceSheet mishnah={mishnah} perek={perek} onClose={() => setShowSheet(false)} />}
      {showSearch && <SearchOverlay data={data} onClose={() => setShowSearch(false)} onNavigate={(p, m) => {
        const pi = data.perakim.findIndex(x => x.num === p);
        if (pi >= 0) {
          setPerekIdx(pi);
          const mi = data.perakim[pi].mishnayot.findIndex(x => x.num === m);
          setMishnahIdx(Math.max(0, mi));
        }
        setShowSearch(false);
      }} />}
      {showAdmin && <React.Suspense fallback={<LoadingSplash />}><AdminPanel data={data} onClose={() => setShowAdmin(false)} /></React.Suspense>}
      {showMesorah && <MesorahTree onClose={closeMesorah}
        onJump={(p, m) => { location.hash = '#avot/' + p + '.' + m; }}
        focusId={mesorahFocus} />}
      {showShabbat && <ShabbatTable data={data} onClose={closeShabbat}
        onJump={(p, m) => { location.hash = '#avot/' + p + '.' + m; }} />}
      {showList && <IdeasList onClose={closeList} />}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} defaultMode={authMode} defaultMethod={authMode === 'signup' ? 'password' : 'magic'} />}
      {showPicker && (
        <PerekPicker data={data} perek={perek} mishnah={mishnah}
          onClose={() => setShowPicker(false)}
          onJump={(p, m) => { jumpTo(p, m); setShowPicker(false); }} />
      )}
      <AvotTweaks />
      <MobileBottomNav
        atHome={showHome}
        onHome={() => setShowHome(true)}
        onRead={() => setShowHome(false)}
        onLibrary={() => setShowPicker(true)}
        onShowSheet={() => { setShowHome(false); setMobileSheet(true); }}
      />
      {mishnah && <MobilePanelSheet open={mobileSheet && !showHome}
        onClose={() => setMobileSheet(false)}
        mishnah={mishnah} perek={perek} highlights={highlights} />}
      {showUploadPrompt && (
        <SyncBanner syncing={syncing}
          onSave={() => doUpload(syncUser?.id)}
          onDismiss={() => dismissUpload(syncUser?.id)} />
      )}
    </div>
  );
};

// Upload-prompt banner — shown once per account on first sign-in when
// local data exists but Supabase is empty.
const SyncBanner = ({ syncing, onSave, onDismiss }) => (
  <div className="sync-banner" role="status">
    <span className="sync-banner-icon">☁️</span>
    <span className="sync-banner-text">
      Save your highlights and progress to your account?
    </span>
    <button className="sync-banner-save" onClick={onSave} disabled={syncing}>
      {syncing ? 'Saving…' : 'Save'}
    </button>
    <button className="sync-banner-dismiss" onClick={onDismiss} disabled={syncing} aria-label="Dismiss">
      Not now
    </button>
  </div>
);

export { App, STORAGE_KEYS };
