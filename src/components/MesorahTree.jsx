import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { Icon } from './Icon.jsx';
import { MESORAH_CHAIN } from '../data/mesorah.js';

// ── Layout constants ──────────────────────────────────────────────────────────
const NODE_W  = 172;
const NODE_H  = 86;
const ROW_H   = 152;
const COL_GAP = 30;
const PAD_X   = 154;   // left margin — timeline labels live here
const PAD_Y   = 56;

// ── Era definitions ───────────────────────────────────────────────────────────
const ERAS = [
  { id: 'sinai',    label: 'Sinai',             fromGen: 0,  toGen: 0,
    color: '#a06800', bg: 'rgba(201,152,0,0.12)',    years: '~1300 BCE' },
  { id: 'prophets', label: 'Judges & Prophets',  fromGen: 1,  toGen: 3,
    color: '#256840', bg: 'rgba(46,125,79,0.10)',    years: '~1250–450 BCE' },
  { id: 'assembly', label: 'Great Assembly',     fromGen: 4,  toGen: 6,
    color: '#164e80', bg: 'rgba(26,94,150,0.10)',    years: '~450–200 BCE' },
  { id: 'zugot',    label: 'The Zugot',          fromGen: 7,  toGen: 11,
    color: '#5c2a98', bg: 'rgba(109,53,176,0.10)',   years: '~200–10 BCE' },
  { id: 'tannaim',  label: 'The Tannaim',        fromGen: 12, toGen: 17,
    color: '#802020', bg: 'rgba(150,46,46,0.10)',    years: '~10–220 CE' },
];

const GEN_YEAR = {
  0: '~1300 BCE', 1: '~1250 BCE', 2: '~1200 BCE', 3:  '~900 BCE',
  4:  '~450 BCE', 5:  '~300 BCE', 6:  '~250 BCE',
  7:  '~175 BCE', 8:  '~125 BCE', 9:   '~80 BCE', 10:  '~50 BCE', 11: '~30 BCE',
  12:   '~30 CE', 13:   '~70 CE', 14:  '~100 CE', 15: '~135 CE',
  16:  '~170 CE', 17:  '~200 CE',
};

function getEra(gen) {
  return ERAS.find(e => gen >= e.fromGen && gen <= e.toGen) || ERAS[ERAS.length - 1];
}

// BFS: return all ancestors of id (inclusive), walking receivedFrom edges.
function computeAncestors(id, byId) {
  const result = new Set([id]);
  const queue  = [id];
  while (queue.length) {
    const curr = queue.shift();
    const node = byId[curr];
    if (!node) continue;
    (node.receivedFrom || []).forEach(pid => {
      if (!result.has(pid)) { result.add(pid); queue.push(pid); }
    });
  }
  return result;
}

// ── Layout ────────────────────────────────────────────────────────────────────
function computeLayout() {
  const byGen = {};
  MESORAH_CHAIN.forEach(n => { (byGen[n.generation] = byGen[n.generation] || []).push(n); });
  const pos  = {};
  const gens = Object.keys(byGen).map(Number).sort((a, b) => a - b);
  const step = NODE_W + COL_GAP;

  for (const g of gens) {
    const tier = byGen[g];
    tier.forEach(n => {
      const px = n.receivedFrom.map(p => pos[p]?.x).filter(x => x != null);
      n.__want = px.length ? px.reduce((a, b) => a + b, 0) / px.length : 0;
    });
    tier.sort((a, b) => a.__want - b.__want);
    const xs = tier.map(n => n.__want);
    for (let i = 1; i < xs.length; i++) {
      if (xs[i] - xs[i - 1] < step) xs[i] = xs[i - 1] + step;
    }
    const wantMean = tier.reduce((a, n) => a + n.__want, 0) / tier.length;
    const haveMean = xs.reduce((a, b) => a + b, 0) / xs.length;
    const shift = wantMean - haveMean;
    tier.forEach((n, i) => { pos[n.id] = { x: xs[i] + shift, y: g * ROW_H + PAD_Y }; });
  }

  const allX = Object.values(pos).map(p => p.x);
  const minX = Math.min(...allX);
  const maxX = Math.max(...allX);
  Object.keys(pos).forEach(id => { pos[id].x += -minX + PAD_X + NODE_W / 2; });
  const width  = (maxX - minX) + NODE_W + PAD_X + 80;
  const maxGen = Math.max(...gens);
  const height = maxGen * ROW_H + NODE_H + PAD_Y * 2;
  return { pos, width, height };
}

// ── Component ─────────────────────────────────────────────────────────────────
const MesorahTree = ({ onClose, onJump, focusId }) => {
  const { pos, width, height } = useMemo(computeLayout, []);
  const edgeCanvasRef = useRef(null);

  const byId = useMemo(() => {
    const m = {};
    MESORAH_CHAIN.forEach(n => { m[n.id] = n; });
    return m;
  }, []);

  const edges = useMemo(() => {
    const list = [];
    MESORAH_CHAIN.forEach(n => {
      n.receivedFrom.forEach(pid => {
        if (pos[pid]) list.push({ from: pid, to: n.id, documented: n.documented });
      });
    });
    return list;
  }, [pos]);

  // Era background bands (computed in world coordinates)
  const eraBands = useMemo(() => ERAS.map(era => {
    const y1 = era.fromGen * ROW_H + PAD_Y - ROW_H * 0.5;
    const y2 = (era.toGen)  * ROW_H + PAD_Y + NODE_H + ROW_H * 0.5;
    return { ...era, y1: Math.max(0, y1), y2, midY: (Math.max(0, y1) + y2) / 2 };
  }), []);

  const canvasRef = useRef(null);
  const [zoom, setZoom]         = useState(1);
  const [pan,  setPan]          = useState({ x: 0, y: 0 });
  const [selectedId, setSelectedId] = useState(focusId || null);
  const drag  = useRef(null);
  const moved = useRef(false);

  // Ancestors of the selected node (for path-from-Sinai highlight)
  const pathIds = useMemo(() =>
    selectedId ? computeAncestors(selectedId, byId) : new Set(),
  [selectedId, byId]);
  const hasPath = pathIds.size > 1;

  useEffect(() => {
    const cv = edgeCanvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    ctx.clearRect(0, 0, width, height);
    edges.forEach(e => {
      const a = pos[e.from], b = pos[e.to];
      if (!a || !b) return;
      const y1 = a.y + NODE_H, y2 = b.y;
      const gap = y2 - y1;
      const offset = Math.min(ROW_H * 0.42, gap * 0.42);
      const isActive = !!(selectedId && (e.from === selectedId || e.to === selectedId));
      const isOnPath = hasPath && pathIds.has(e.from) && pathIds.has(e.to) && !isActive;
      ctx.beginPath();
      ctx.moveTo(a.x, y1);
      ctx.bezierCurveTo(a.x, y1 + offset, b.x, y2 - offset, b.x, y2);
      ctx.strokeStyle = isActive ? '#c9a840' : isOnPath ? '#7a1c2e' : e.documented ? '#6b5040' : '#a06030';
      ctx.lineWidth = isActive ? 2.5 : isOnPath ? 2 : 1.5;
      ctx.setLineDash(e.documented ? [] : [7, 4]);
      ctx.stroke();
    });
    ctx.setLineDash([]);
  }, [edges, pos, selectedId, hasPath, pathIds, width, height]);

  const fitView = useCallback((focus) => {
    const c = canvasRef.current;
    if (!c) return;
    const cw = c.clientWidth, ch = c.clientHeight;
    if (focus && pos[focus]) {
      const z = 1;
      setZoom(z);
      setPan({ x: cw / 2 - pos[focus].x * z, y: ch / 2 - (pos[focus].y + NODE_H / 2) * z });
    } else {
      // Fit width, but clamp so nodes stay readable (never smaller than 0.55x).
      // Start at the top of the tree; user can scroll/pan down.
      const z = Math.min(Math.max(cw / width, 0.55), 1);
      setZoom(z);
      setPan({ x: (cw - width * z) / 2, y: PAD_Y });
    }
  }, [pos, width]);

  const fitAll = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const cw = c.clientWidth, ch = c.clientHeight;
    const z = Math.min(cw / width, ch / height, 1);
    setZoom(z);
    setPan({ x: (cw - width * z) / 2, y: (ch - height * z) / 2 });
  }, [width, height]);

  useEffect(() => { fitView(focusId); }, []); // eslint-disable-line

  // Non-passive wheel zoom
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const onWheel = (e) => {
      e.preventDefault();
      const rect = c.getBoundingClientRect();
      const mx = e.clientX - rect.left, my = e.clientY - rect.top;
      setZoom(z => {
        const nz = Math.min(1.8, Math.max(0.3, z * (e.deltaY < 0 ? 1.12 : 0.89)));
        setPan(p => ({ x: mx - (mx - p.x) * (nz / z), y: my - (my - p.y) * (nz / z) }));
        return nz;
      });
    };
    c.addEventListener('wheel', onWheel, { passive: false });
    return () => c.removeEventListener('wheel', onWheel);
  }, []);

  const onPointerDown = (e) => {
    if (e.button === 2) return;
    drag.current  = { x: e.clientX, y: e.clientY, pan: { ...pan } };
    moved.current = false;
  };
  useEffect(() => {
    const onMove = (e) => {
      if (!drag.current) return;
      const dx = e.clientX - drag.current.x, dy = e.clientY - drag.current.y;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved.current = true;
      setPan({ x: drag.current.pan.x + dx, y: drag.current.pan.y + dy });
    };
    const onUp = () => { drag.current = null; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, []);

  const zoomBy = (factor) => {
    const c = canvasRef.current;
    if (!c) return;
    const cx = c.clientWidth / 2, cy = c.clientHeight / 2;
    setZoom(z => {
      const nz = Math.min(1.8, Math.max(0.3, z * factor));
      setPan(p => ({ x: cx - (cx - p.x) * (nz / z), y: cy - (cy - p.y) * (nz / z) }));
      return nz;
    });
  };

  const pickNode = (id) => { if (!moved.current) setSelectedId(prev => prev === id ? null : id); };

  const selected  = selectedId ? byId[selectedId] : null;
  const taughtBy  = selected ? selected.receivedFrom.map(id => byId[id]).filter(Boolean) : [];
  const students  = selected ? MESORAH_CHAIN.filter(n => n.receivedFrom.includes(selected.id)) : [];
  const selectedEra = selected ? getEra(selected.generation) : null;

  // Role-based node colours — Nasi gets gold, Av Beit Din gets indigo, others use era colour.
  const nodeColors = (n, era) => {
    if (n.role === 'Nasi')         return { color: '#9a6800', bg: 'rgba(185,140,30,0.12)' };
    if (n.role === 'Av Beit Din')  return { color: '#5c2a98', bg: 'rgba(92,42,152,0.12)' };
    return { color: era.color, bg: era.bg };
  };

  return (
    <div className="mtree">
      {/* ── Header ── */}
      <div className="mtree-header">
        <div>
          <div className="mtree-eyebrow">The Chain of Mesorah</div>
          <div className="mtree-title">From Sinai to the Mishnah</div>
        </div>
        <button className="mtree-close" onClick={onClose} aria-label="Close">
          <Icon name="close" size={18} />
        </button>
      </div>

      {/* ── Key bar: eras, roles, line types ── */}
      <div className="mtree-key-bar">
        <div className="mtree-key-section">
          {ERAS.map(era => (
            <div key={era.id} className="mtree-key-era" style={{ '--era-color': era.color, '--era-bg': era.bg }}>
              <span className="mtree-key-dot" />
              <span className="mtree-key-era-name">{era.label}</span>
              <span className="mtree-key-era-dates">{era.years}</span>
            </div>
          ))}
        </div>
        <div className="mtree-key-sep" />
        <div className="mtree-key-section">
          <div className="mtree-key-line">
            <svg width="26" height="10" aria-hidden="true">
              <line x1="2" y1="5" x2="24" y2="5" stroke="#8a6850" strokeWidth="2"/>
            </svg>
            Pirkei Avot
          </div>
          <div className="mtree-key-line">
            <svg width="26" height="10" aria-hidden="true">
              <line x1="2" y1="5" x2="24" y2="5" stroke="#a06030" strokeWidth="2" strokeDasharray="8 5"/>
            </svg>
            Talmudic source
          </div>
        </div>
      </div>

      <div className="mtree-stage">
        {/* ── Canvas ── */}
        <div className="mtree-canvas" ref={canvasRef} onMouseDown={onPointerDown}>
          <div
            className={`mtree-world ${hasPath ? 'has-path' : ''}`}
            style={{ transform: `translate(${pan.x}px,${pan.y}px) scale(${zoom})` }}
          >
            <svg className="mtree-edges" width={width} height={height} aria-hidden="true">
              <defs>
                <marker id="arr"        markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L7,3 z" fill="#8a6850" />
                </marker>
                <marker id="arr-path"   markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L7,3 z" fill="#7a1c2e" />
                </marker>
                <marker id="arr-active" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L7,3 z" fill="#c9a840" />
                </marker>
              </defs>

              {/* Era background bands — coloured stripes, one per era */}
              {eraBands.map(era => (
                <g key={era.id}>
                  <rect x={0} y={era.y1} width={width} height={era.y2 - era.y1} fill={era.bg} />
                  {/* Prominent era border line on left of node area */}
                  <line x1={PAD_X - 8} y1={era.y1} x2={PAD_X - 8} y2={era.y2}
                    stroke={era.color} strokeWidth="3" opacity="0.5" />
                  {/* Era top boundary rule */}
                  {era.y1 > 0 && (
                    <line x1={0} y1={era.y1} x2={width} y2={era.y1}
                      stroke={era.color} strokeWidth="1" opacity="0.25" strokeDasharray="4 4" />
                  )}
                  {/* Era label block */}
                  <text x={14} y={era.midY - 10} className="mtree-era-label" fill={era.color}>{era.label}</text>
                  <text x={14} y={era.midY + 10} className="mtree-era-years" fill={era.color} opacity="0.75">{era.years}</text>
                </g>
              ))}

              {/* Generation year ticks */}
              {Object.entries(GEN_YEAR).map(([genStr, year]) => {
                const g = parseInt(genStr);
                const y = g * ROW_H + PAD_Y + NODE_H / 2;
                return (
                  <g key={g}>
                    <line x1={PAD_X - 16} y1={y} x2={PAD_X - 6} y2={y} stroke="#8a7060" strokeWidth="1" opacity="0.5" />
                    <text x={PAD_X - 20} y={y} className="mtree-gen-year" textAnchor="end" dominantBaseline="middle" fill="#7a6050">{year}</text>
                  </g>
                );
              })}

              {/* edges drawn on canvas below — nothing here */}
            </svg>

            {/* Edge canvas */}
            <canvas
              ref={edgeCanvasRef}
              width={width}
              height={height}
              style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
            />

            {/* Nodes */}
            {MESORAH_CHAIN.map(n => {
              const p      = pos[n.id];
              const era    = getEra(n.generation);
              const nc     = nodeColors(n, era);
              const isSel  = selectedId === n.id;
              const onPath = hasPath && pathIds.has(n.id) && !isSel;
              return (
                <button
                  key={n.id}
                  className={`mtree-node ${isSel ? 'selected' : ''} ${onPath ? 'on-path' : ''} ${n.role === 'Nasi' ? 'mtree-node-nasi' : n.role === 'Av Beit Din' ? 'mtree-node-avbd' : ''}`}
                  style={{
                    left: p.x - NODE_W / 2, top: p.y,
                    width: NODE_W, height: NODE_H,
                    '--era-color': nc.color,
                    '--era-bg':    nc.bg,
                  }}
                  onClick={() => pickNode(n.id)}
                  aria-pressed={isSel}
                >
                  <span className="mtree-node-he">{n.nameHe}</span>
                  <span className="mtree-node-en">{n.nameEn}</span>
                  {n.role && (
                    <span className="mtree-node-role">
                      {n.role === 'Nasi' ? 'Nasi' : 'Av BD'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Zoom controls ── */}
        <div className="mtree-controls">
          <button onClick={() => zoomBy(1.2)}  aria-label="Zoom in"><Icon name="plus" size={15} /></button>
          <button onClick={() => zoomBy(0.83)} aria-label="Zoom out">
            <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <line x1="4" y1="10" x2="16" y2="10" />
            </svg>
          </button>
          <button onClick={fitAll} aria-label="Fit to view"><Icon name="grid" size={14} /></button>
        </div>

        {/* ── Detail panel ── */}
        {selected && (
          <aside className="mtree-detail" style={{ '--era-color': selectedEra?.color }}>
            <button className="mtree-detail-close" onClick={() => setSelectedId(null)} aria-label="Close detail">
              <Icon name="close" size={16} />
            </button>

            <div className="mtree-detail-era-bar" />

            <div className="mtree-detail-he">{selected.nameHe}</div>
            <div className="mtree-detail-en">{selected.nameEn}</div>
            <div className="mtree-detail-meta">
              {selected.role && <span className="mtree-tag">{selected.role}</span>}
              <span>{selected.era}</span>
            </div>
            <p className="mtree-detail-bio">{selected.bio}</p>

            {hasPath && pathIds.size > 1 && (
              <div className="mtree-detail-path-note">
                ✦ Path from Sinai highlighted
              </div>
            )}

            {taughtBy.length > 0 && (
              <div className="mtree-detail-block">
                <div className="mtree-detail-label">Received from</div>
                <div className="mtree-detail-links">
                  {taughtBy.map(t => (
                    <button key={t.id} className="mtree-link" onClick={() => setSelectedId(t.id)}>
                      {t.nameEn}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {students.length > 0 && (
              <div className="mtree-detail-block">
                <div className="mtree-detail-label">Transmitted to</div>
                <div className="mtree-detail-links">
                  {students.map(s => (
                    <button key={s.id} className="mtree-link" onClick={() => setSelectedId(s.id)}>
                      {s.nameEn}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selected.mishnayot.length > 0 && (
              <div className="mtree-detail-block">
                <div className="mtree-detail-label">Speaks in Pirkei Avot</div>
                <div className="mtree-detail-links">
                  {selected.mishnayot.map((m, i) => (
                    <button key={i} className="mtree-ref" onClick={() => onJump && onJump(m.perek, m.mishnah)}>
                      {m.perek}:{m.mishnah}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
};

export { MesorahTree };
