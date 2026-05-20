import React from 'react';
import { Header } from './components/Header.jsx';
import { Home, PerekPicker } from './components/Home.jsx';
import { LeftRail } from './components/LeftRail.jsx';
import { MesorahChain } from './components/MesorahChain.jsx';
import { Onboarding } from './components/Onboarding.jsx';
import { Reader } from './components/Reader.jsx';
import { RightPanel } from './components/RightPanel.jsx';
import { SearchOverlay } from './components/SearchOverlay.jsx';
import { AdminPanel } from './components/admin.jsx';
import { KidsMode } from './components/kids.jsx';
import { MobileBottomNav, MobilePanelSheet } from './components/mobile.jsx';
import { ColoringPage, MemorizeMode, NotePopover, ParentDashboard, QuoteCard, SelectionToolbar, SourceSheet } from './components/overlays.jsx';
import { AvotTweaks } from './components/tweaks.jsx';

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

const App = () => {
  const data = window.PIRKEI_AVOT;
  const savedPos = JSON.parse(localStorage.getItem(STORAGE_KEYS.pos) || '{"p":0,"m":0}');

  const [onboarded, setOnboarded] = useS(localStorage.getItem('avot.onboarded.v1') === 'true');
  const [showHome, setShowHome] = useS(true);
  const [perekIdx, setPerekIdx] = useS(savedPos.p);
  const [mishnahIdx, setMishnahIdx] = useS(savedPos.m);
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
  const [showSearch, setShowSearch] = useS(false);
  const [railCollapsed, setRailCollapsed] = useS(localStorage.getItem('avot.railCollapsed.v1') === 'true');
  const [showPicker, setShowPicker] = useS(false);

  const perek = data.perakim[perekIdx];
  const mishnah = perek.mishnayot[mishnahIdx] || perek.mishnayot[0];

  // Persist
  useE(() => { localStorage.setItem(STORAGE_KEYS.pos, JSON.stringify({p: perekIdx, m: mishnahIdx})); }, [perekIdx, mishnahIdx]);  useE(() => { localStorage.setItem(STORAGE_KEYS.mode, mode); }, [mode]);
  useE(() => { localStorage.setItem(STORAGE_KEYS.layout, layout); }, [layout]);
  useE(() => { localStorage.setItem(STORAGE_KEYS.dark, String(dark)); }, [dark]);
  useE(() => { localStorage.setItem('avot.wordhover.v1', String(showWordHover)); }, [showWordHover]);
  useE(() => { localStorage.setItem(STORAGE_KEYS.highlights, JSON.stringify(highlights)); }, [highlights]);

  // Apply dark mode class
  useE(() => {
    document.documentElement.classList.toggle('dark', dark);
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
    } else if (route.kind === 'home') {
      setShowHome(true);
    }
  }, []);

  // Sync URL hash whenever position or view changes
  useE(() => {
    if (!window.AvotRoutes) return;
    if (showHome) AvotRoutes.home();
    else AvotRoutes.update(perek.num, mishnah.num, { view: layout });
  }, [showHome, perekIdx, mishnahIdx, layout]);

  // React to manual hash changes (back/forward, paste)
  useE(() => {
    const onHash = () => {
      const route = window.AvotRoutes?.parseHash?.();
      if (!route) return;
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
      else if (perekIdx < data.perakim.length - 1) { setPerekIdx(perekIdx + 1); setMishnahIdx(0); }
    };
    const onRight = () => {
      if (mishnahIdx > 0) setMishnahIdx(i => i - 1);
      else if (perekIdx > 0) { const prev = data.perakim[perekIdx - 1]; setPerekIdx(perekIdx - 1); setMishnahIdx(Math.max(0, prev.mishnayot.length - 1)); }
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
      // compute start/end offsets within the english text
      const container = ev.currentTarget;
      const fullText = container.innerText;
      const start = fullText.indexOf(text);
      if (start === -1) { return; }
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

  const lastReadCard = perekIdx > 0 || mishnahIdx > 0 ? {
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

  // Render
  if (!onboarded) {
    return <Onboarding setMode={setMode} onDone={() => setOnboarded(true)} />;
  }

  if (mode === 'kids') {
    return (
      <div className="app">
        <Header mode={mode} setMode={setMode} perek={perek} mishnah={mishnah}
          onMenuClick={() => {}} onSearchOpen={() => setShowSearch(true)} onMemorize={() => setShowMemorize(true)}
          onAdmin={() => setShowAdmin(true)}
          onTour={() => { localStorage.removeItem('avot.onboarded.v1'); setOnboarded(false); }}
          dark={dark} setDark={setDark} />
        <KidsMode perek={perek} perakim={data.perakim} perekIdx={perekIdx} setPerekIdx={setPerekIdx}
          mishnah={mishnah} mishnahIdx={mishnahIdx} setMishnahIdx={setMishnahIdx}
          onColoring={() => setShowColoring(true)}
          onParentDash={() => setShowParentDash(true)}
        />
        {showParentDash && <ParentDashboard onClose={() => setShowParentDash(false)} />}
        {showColoring && <ColoringPage mishnah={mishnah} onClose={() => setShowColoring(false)} />}
        {showSearch && <SearchOverlay data={data} onClose={() => setShowSearch(false)} onNavigate={(p, m) => {
          const pi = data.perakim.findIndex(x => x.num === p);
          if (pi >= 0) { setPerekIdx(pi); const mi = data.perakim[pi].mishnayot.findIndex(x => x.num === m); setMishnahIdx(Math.max(0, mi)); }
          setShowSearch(false);
        }} />}
        {showAdmin && <AdminPanel data={data} onClose={() => setShowAdmin(false)} />}
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
        atHome={showHome}
        onTour={() => { localStorage.removeItem('avot.onboarded.v1'); setOnboarded(false); }}
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
              lastRead={(perekIdx > 0 || mishnahIdx > 0) ? {
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
          <MesorahChain mishnah={mishnah} perek={perek} onNavigate={jumpTo} />
          <div className={`main ${railCollapsed ? 'rail-collapsed' : ''}`}>
        <LeftRail data={data} perekIdx={perekIdx} mishnahIdx={mishnahIdx}
          setPerekIdx={setPerekIdx} setMishnahIdx={setMishnahIdx}
          lastRead={lastReadCard} onResume={() => {}}
          onAdmin={() => setShowAdmin(true)} />
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
        />
        <RightPanel mishnah={mishnah} perek={perek} highlights={highlights} />
      </div>
        </>
      )}
      <SelectionToolbar pos={selPos} onHighlight={applyHighlight}
        onNote={addNoteToSelection} onShare={shareHighlight} currentColor={activeColor} />
      {notePop && editingHl && (
        <NotePopover pos={notePop} hl={editingHl}
          onSave={saveNote} onClose={() => { setNotePop(null); setEditingHl(null); }} />
      )}
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
      {showAdmin && <AdminPanel data={data} onClose={() => setShowAdmin(false)} />}
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
      <MobilePanelSheet open={mobileSheet && !showHome}
        onClose={() => setMobileSheet(false)}
        mishnah={mishnah} perek={perek} highlights={highlights} />
    </div>
  );
};

export { App, STORAGE_KEYS };
