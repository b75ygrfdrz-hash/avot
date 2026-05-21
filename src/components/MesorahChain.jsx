import React, { useRef, useEffect } from 'react';
import { MESORAH_CHAIN } from '../data/mesorah.js';

// Match a mishnah's attribution to a node in the chain of transmission.
function findActiveIdx(attribution, perek, mishnah) {
  if (perek != null && mishnah != null) {
    const byRef = MESORAH_CHAIN.findIndex(n =>
      n.mishnayot.some(m => m.perek === perek && m.mishnah === mishnah));
    if (byRef >= 0) return byRef;
  }
  if (!attribution) return -1;
  const attr = attribution.toLowerCase();
  if (attr.includes('moshe') && attr.includes('great assembly')) {
    return MESORAH_CHAIN.findIndex(n => n.id === 'knesset');
  }
  let best = -1, bestLen = 0;
  MESORAH_CHAIN.forEach((n, i) => {
    const en = n.nameEn.toLowerCase();
    if ((attr.includes(en) || en.includes(attr)) && en.length > bestLen) {
      best = i;
      bestLen = en.length;
    }
  });
  return best;
}

// Popover anchored to the rabbi-info button in the Reader.
const NodePopover = ({ node, anchor, onClose, onNavigate, onViewInChain }) => {
  const popRef = useRef(null);
  useEffect(() => {
    if (!anchor || !popRef.current) return;
    const ar = anchor.getBoundingClientRect();
    const pop = popRef.current;
    const pw = pop.offsetWidth;
    let left = ar.left + ar.width / 2 - pw / 2;
    left = Math.max(12, Math.min(window.innerWidth - pw - 12, left));
    pop.style.left = left + 'px';
    pop.style.top = (ar.bottom + 10) + 'px';
  }, [anchor]);

  return (
    <div className="mc-pop" ref={popRef} role="dialog">
      <div className="mc-pop-arrow" />
      <div className="mc-pop-head">
        <div className="mc-pop-he">{node.nameHe}</div>
        <div className="mc-pop-en">{node.nameEn}</div>
        <div className="mc-pop-era">{node.era}</div>
      </div>
      <p className="mc-pop-bio">{node.bio}</p>
      {onViewInChain && (
        <button className="mc-pop-link" onClick={() => { onViewInChain(node.id); onClose(); }}>
          View in the Chain of Mesorah
          <svg viewBox="0 0 20 20" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="10" x2="16" y2="10" /><polyline points="12 6 16 10 12 14" />
          </svg>
        </button>
      )}
      {node.mishnayot.length > 0 && onNavigate && (
        <button className="mc-pop-link mc-pop-link-soft" onClick={() => {
          onNavigate(node.mishnayot[0].perek, node.mishnayot[0].mishnah);
          onClose();
        }}>
          See all their mishnayot
          <span className="mc-pop-count">{node.mishnayot.length}</span>
        </button>
      )}
    </div>
  );
};

export { MESORAH_CHAIN, NodePopover, findActiveIdx };
