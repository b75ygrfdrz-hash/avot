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

// Home — the arrival experience
// Today's mishnah hero · Continue reading · Stats · Perek shelf · Curated highlight


const Home = ({ data, lastRead, onJump, stats, onOpenMesorah }) => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  // Pick today's mishnah deterministically by day-of-year
  const doy = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const allMishnayot = data.perakim.flatMap(p => p.mishnayot.filter(m => !m.stub).map(m => ({...m, perek: p.num})));
  const daily = allMishnayot[doy % Math.max(1, allMishnayot.length)] || allMishnayot[0];

  useEffect_h(() => {
    const el = document.querySelector('.home-inner');
    if (!el) return;
    requestAnimationFrame(() => el.classList.add('is-in'));
  }, []);

  const curated = data.perakim[0].mishnayot.find(m => m.num === 14) || allMishnayot[0];

  return (
    <div className="home" data-screen-label="Home">
      <div className="home-inner">
        <header className="home-hero">
          <div className="home-eyebrow stagger-1">{today}</div>
          <h1 className="home-greeting stagger-2">Welcome back.</h1>
          <p className="home-sub stagger-3">Pick up where you left off — or begin today's teaching.</p>
        </header>

        <section className="home-today stagger-4">
          <div className="home-card-eyebrow">Today's Mishnah</div>
          <div className="home-today-grid">
            <div>
              <div className="home-today-ref">{daily.perek}:{daily.num}</div>
              <div className="home-today-attr">{daily.attribution.en}</div>
              <div className="home-today-he" dir="rtl">{daily.hebrew}</div>
              <div className="home-today-en">{daily.english}</div>
              <div className="home-today-actions">
                <button className="home-cta-primary" onClick={() => onJump(daily.perek, daily.num)}>
                  Begin learning
                  <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="10" x2="16" y2="10" /><polyline points="12 6 16 10 12 14" />
                  </svg>
                </button>
                <button className="home-cta-secondary">
                  <svg viewBox="0 0 20 20" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="6 4 6 16 16 10" />
                  </svg>
                  Listen · 1:42
                </button>
              </div>
            </div>
            <aside className="home-today-aside">
              <div className="home-today-themes">
                {(daily.themes || []).slice(0,3).map(t => <span key={t} className="theme-pill">{t}</span>)}
              </div>
              <div className="home-today-meta">
                <div><strong>{Object.keys(daily.commentary || {}).length}</strong> commentators</div>
                <div><strong>{(daily.videos || []).length}</strong> shiurim</div>
                <div><strong>{(daily.crossRefs || []).length}</strong> cross-refs</div>
              </div>
            </aside>
          </div>
        </section>

        <section className="home-mesorah stagger-5">
          <button className="home-mesorah-card" onClick={onOpenMesorah}>
            <div className="home-mesorah-main">
              <div className="home-mesorah-eyebrow">Explore</div>
              <div className="home-mesorah-title">The Chain of Mesorah</div>
              <div className="home-mesorah-desc">
                Trace the tradition from Moshe at Sinai, through the Zugot, down to
                the sages who gave us the Mishnah.
              </div>
              <span className="home-mesorah-cta">
                Open the chain
                <svg viewBox="0 0 20 20" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="10" x2="16" y2="10" /><polyline points="12 6 16 10 12 14" />
                </svg>
              </span>
            </div>
            <div className="home-mesorah-chain" aria-hidden="true">
              {[0, 1, 2, 3, 4, 5].map(i => <span key={i} className="home-mesorah-dot" />)}
            </div>
          </button>
        </section>

        {lastRead && (
          <section className="home-resume stagger-5">
            <div className="home-section-label">Continue where you left off</div>
            <button className="home-resume-card" onClick={() => onJump(lastRead.perek, lastRead.mishnah)}>
              <div className="home-resume-num">{lastRead.perek}:{lastRead.mishnah}</div>
              <div>
                <div className="home-resume-attr">{lastRead.attribution}</div>
                <div className="home-resume-time">{lastRead.timeAgo}</div>
              </div>
              <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft:'auto'}}>
                <line x1="3" y1="10" x2="16" y2="10" /><polyline points="12 6 16 10 12 14" />
              </svg>
            </button>
          </section>
        )}

        <section className="home-stats stagger-6">
          {[
            { label: 'Day streak', value: stats?.streak ?? 5 },
            { label: 'Mishnayot studied', value: stats?.studied ?? 7 },
            { label: 'Highlights', value: stats?.highlights ?? 4 },
            { label: 'Days learning', value: stats?.days ?? 18 },
          ].map(s => (
            <div className="home-stat" key={s.label}>
              <div className="home-stat-val">{s.value}</div>
              <div className="home-stat-label">{s.label}</div>
            </div>
          ))}
        </section>

        <section className="home-shelf-section stagger-7">
          <div className="home-section-label">Pirkei Avot</div>
          <div className="home-shelf">
            {data.perakim.map((p, i) => (
              <button key={p.num} className="home-perek-card" onClick={() => onJump(p.num, 1)} style={{animationDelay: `${i * 60}ms`}}>
                <div className="home-perek-he">{p.title.he.replace('פרק ', '')}</div>
                <div className="home-perek-num">Chapter {p.num}</div>
                <div className="home-perek-count">{p.mishnayot.length} mishnayot</div>
                <div className="home-perek-summary">{p.summary || 'More content coming.'}</div>
                <div className="home-perek-spine"></div>
              </button>
            ))}
          </div>
        </section>

        <section className="home-curate stagger-8">
          <div className="home-section-label">Editor's pick</div>
          <div className="home-quote-card">
            <div className="home-quote-mark">“</div>
            <div className="home-quote-he" dir="rtl">{curated.hebrew}</div>
            <div className="home-quote-divider">✦</div>
            <div className="home-quote-en">{curated.english}</div>
            <div className="home-quote-attribution">— {curated.attribution.en} · Avot {curated.perek || 1}:{curated.num}</div>
            <button className="home-quote-cta" onClick={() => onJump(curated.perek || 1, curated.num)}>
              Read with commentary
              <svg viewBox="0 0 20 20" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="10" x2="16" y2="10" /><polyline points="12 6 16 10 12 14" />
              </svg>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

window.Home = Home;

// Perek/Mishnah jump picker — opens from header pill
const PerekPicker = ({ data, perek, mishnah, onClose, onJump }) => {
  return (
    <div className="picker-back" onClick={onClose}>
      <div className="picker-modal" onClick={e => e.stopPropagation()}>
        <div className="picker-head">
          <div className="picker-title">Jump to a Mishnah</div>
          <button className="icon-btn" onClick={onClose} aria-label="Close" style={{color: 'var(--ink-soft)'}}>
            <Icon name="close" />
          </button>
        </div>
        <div className="picker-body">
          {data.perakim.map(p => (
            <div key={p.num} className="picker-perek">
              <div className="picker-perek-head">
                <span className="picker-perek-he">{p.title.he}</span>
                <span className="picker-perek-en">Chapter {p.num}</span>
                <span className="picker-perek-meta">{p.mishnayot.length} mishnayot</span>
              </div>
              <div className="picker-grid">
                {p.mishnayot.map(m => (
                  <button key={m.num}
                    className={`picker-mishnah ${perek.num === p.num && mishnah.num === m.num ? 'active' : ''}`}
                    onClick={() => onJump(p.num, m.num)}>
                    <span className="ref">{p.num}:{m.num}</span>
                    <span className="name">{m.attribution.en}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

window.PerekPicker = PerekPicker;

export { Home, PerekPicker };
