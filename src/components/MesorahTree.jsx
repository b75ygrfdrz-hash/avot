import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { Icon } from './Icon.jsx';
import { MESORAH_CHAIN } from '../data/mesorah.js';

// Layout geometry
const NODE_W = 158;
const NODE_H = 64;
const ROW_H = 124;
const COL_GAP = 28;
const PAD = 80;

// Layered DAG layout: y by generation, x near the average of parents.
function computeLayout() {
  const byGen = {};
  MESORAH_CHAIN.forEach(n => {
    (byGen[n.generation] = byGen[n.generation] || []).push(n);
  });
  const pos = {};
  const gens = Object.keys(byGen).map(Number).sort((a, b) => a - b);
  const step = NODE_W + COL_GAP;

  for (const g of gens) {
    const tier = byGen[g];
    tier.forEach(n => {
      const px = n.receivedFrom.map(p => pos[p] && pos[p].x).filter(x => x != null);
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
    tier.forEach((n, i) => { pos[n.id] = { x: xs[i] + shift, y: g * ROW_H }; });
  }

  // Normalize so the leftmost node sits at PAD
  const allX = Object.values(pos).map(p => p.x);
  const minX = Math.min(...allX);
  const maxX = Math.max(...allX);
  Object.keys(pos).forEach(id => { pos[id].x += -minX + PAD + NODE_W / 2; });
  const width = (maxX - minX) + NODE_W + PAD * 2;
  const maxGen = Math.max(...gens);
  const height = maxGen * ROW_H + NODE_H + PAD * 2;
  return { pos, width, height };
}

const SECTIONS = [
  { label: 'From Sinai', from: 0, to: 4 },
  { label: 'Second Temple', from: 5, to: 6 },
  { label: 'The Zugot', from: 7, to: 11 },
  { label: 'The Tannaim', from: 12, to: 17 },
];

const MesorahTree = ({ onClose, onJump, focusId }) => {
  const { pos, width, height } = useMemo(computeLayout, []);
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

  const canvasRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: PAD });
  const [selectedId, setSelectedId] = useState(focusId || null);
  const drag = useRef(null);
  const moved = useRef(false);

  // Fit the tree to the canvas width (or centre on a focused node)
  const fitView = useCallback((focus) => {
    const c = canvasRef.current;
    if (!c) return;
    const cw = c.clientWidth, ch = c.clientHeight;
    if (focus && pos[focus]) {
      const z = 1;
      setZoom(z);
      setPan({ x: cw / 2 - pos[focus].x * z, y: ch / 2 - (pos[focus].y + NODE_H / 2) * z });
    } else {
      const z = Math.min(cw / width, 1);
      setZoom(z);
      setPan({ x: (cw - width * z) / 2, y: PAD });
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

  // Non-passive wheel zoom (centred on the cursor)
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const onWheel = (e) => {
      e.preventDefault();
      const rect = c.getBoundingClientRect();
      const mx = e.clientX - rect.left, my = e.clientY - rect.top;
      setZoom(z => {
        const nz = Math.min(1.8, Math.max(0.3, z * (e.deltaY < 0 ? 1.12 : 0.89)));
        setPan(p => ({
          x: mx - (mx - p.x) * (nz / z),
          y: my - (my - p.y) * (nz / z),
        }));
        return nz;
      });
    };
    c.addEventListener('wheel', onWheel, { passive: false });
    return () => c.removeEventListener('wheel', onWheel);
  }, []);

  const onPointerDown = (e) => {
    if (e.button === 2) return;
    drag.current = { x: e.clientX, y: e.clientY, pan: { ...pan } };
    moved.current = false;
  };
  useEffect(() => {
    const onMove = (e) => {
      if (!drag.current) return;
      const dx = e.clientX - drag.current.x;
      const dy = e.clientY - drag.current.y;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved.current = true;
      setPan({ x: drag.current.pan.x + dx, y: drag.current.pan.y + dy });
    };
    const onUp = () => { drag.current = null; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
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

  const pickNode = (id) => {
    if (moved.current) return;
    setSelectedId(id);
  };

  const selected = selectedId ? byId[selectedId] : null;
  const taughtBy = selected ? selected.receivedFrom.map(id => byId[id]).filter(Boolean) : [];
  const students = selected
    ? MESORAH_CHAIN.filter(n => n.receivedFrom.includes(selected.id))
    : [];

  return (
    <div className="mtree">
      <div className="mtree-header">
        <div>
          <div className="mtree-eyebrow">The Chain of Mesorah</div>
          <div className="mtree-title">From Sinai to the Mishnah</div>
        </div>
        <button className="mtree-close" onClick={onClose} aria-label="Close">
          <Icon name="close" size={18} />
        </button>
      </div>

      <div className="mtree-stage">
        <div
          className="mtree-canvas"
          ref={canvasRef}
          onMouseDown={onPointerDown}
        >
          <div
            className="mtree-world"
            style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
          >
            <svg className="mtree-edges" width={width} height={height} aria-hidden="true">
              {edges.map((e, i) => {
                const a = pos[e.from], b = pos[e.to];
                const y1 = a.y + NODE_H, y2 = b.y;
                const d = `M ${a.x} ${y1} C ${a.x} ${y1 + ROW_H * 0.45}, ${b.x} ${y2 - ROW_H * 0.45}, ${b.x} ${y2}`;
                const active = selected && (e.from === selectedId || e.to === selectedId);
                return (
                  <path
                    key={i}
                    d={d}
                    className={`mtree-edge ${active ? 'active' : ''} ${e.documented ? '' : 'mtree-edge-soft'}`}
                  />
                );
              })}
            </svg>

            {MESORAH_CHAIN.map(n => {
              const p = pos[n.id];
              return (
                <button
                  key={n.id}
                  className={`mtree-node ${selectedId === n.id ? 'selected' : ''}`}
                  style={{
                    left: p.x - NODE_W / 2,
                    top: p.y,
                    width: NODE_W,
                    height: NODE_H,
                  }}
                  onClick={() => pickNode(n.id)}
                >
                  <span className="mtree-node-he">{n.nameHe}</span>
                  <span className="mtree-node-en">{n.nameEn}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mtree-controls">
          <button onClick={() => zoomBy(1.2)} aria-label="Zoom in"><Icon name="plus" size={15} /></button>
          <button onClick={() => zoomBy(0.83)} aria-label="Zoom out">
            <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="4" y1="10" x2="16" y2="10" /></svg>
          </button>
          <button onClick={fitAll} aria-label="Fit to view"><Icon name="grid" size={14} /></button>
        </div>

        {selected && (
          <aside className="mtree-detail">
            <button className="mtree-detail-close" onClick={() => setSelectedId(null)} aria-label="Close detail">
              <Icon name="close" size={16} />
            </button>
            <div className="mtree-detail-he">{selected.nameHe}</div>
            <div className="mtree-detail-en">{selected.nameEn}</div>
            <div className="mtree-detail-meta">
              {selected.role && <span className="mtree-tag">{selected.role}</span>}
              <span>{selected.era}</span>
            </div>
            <p className="mtree-detail-bio">{selected.bio}</p>

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
                    <button
                      key={i}
                      className="mtree-ref"
                      onClick={() => onJump && onJump(m.perek, m.mishnah)}
                    >
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
