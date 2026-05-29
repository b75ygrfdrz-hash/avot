import React from 'react';

const { useState, useEffect, useRef, useCallback, useMemo } = React;
const useS = useState, useE = useEffect, useR = useRef, useC = useCallback;
const useState_p = useState, useEffect_p = useEffect, useState_k = useState;
const useState_m = useState, useEffect_m = useEffect, useRef_m = useRef;
const useS_s = useState, useE_s = useEffect, useR_s = useRef;
const useState_a = useState, useEffect_a = useEffect;
const useState_mc = useState, useRef_mc = useRef, useEffect_mc = useEffect;
const useEffect_h = useEffect, useState_ms = useState, useEffect_ms = useEffect;
const useS_o = useState, useE_o = useEffect;

// Inline SVG icons — stroke-based, contemporary
const Icon = ({ name, size = 16 }) => {
  const paths = {
    chevronL: <polyline points="13 4 6 10 13 16" />,
    chevronR: <polyline points="7 4 14 10 7 16" />,
    chevronD: <polyline points="4 7 10 14 16 7" />,
    chevronU: <polyline points="4 13 10 6 16 13" />,
    search: <><circle cx="9" cy="9" r="5.5" /><line x1="14" y1="14" x2="17" y2="17" /></>,
    book: <><path d="M3 4 L10 4 L10 17 L3 17 Z" /><path d="M17 4 L10 4 L10 17 L17 17 Z" /></>,
    bookmark: <path d="M5 3 L15 3 L15 17 L10 13 L5 17 Z" />,
    share: <><circle cx="5" cy="10" r="2" /><circle cx="15" cy="5" r="2" /><circle cx="15" cy="15" r="2" /><line x1="7" y1="9" x2="13" y2="6" /><line x1="7" y1="11" x2="13" y2="14" /></>,
    note: <><path d="M4 4 L13 4 L16 7 L16 16 L4 16 Z" /><line x1="7" y1="9" x2="13" y2="9" /><line x1="7" y1="12" x2="11" y2="12" /></>,
    play: <polygon points="6 4 6 16 16 10" />,
    pause: <><rect x="5" y="4" width="4" height="12" /><rect x="11" y="4" width="4" height="12" /></>,
    sparkle: <path d="M10 2 L11.5 8.5 L18 10 L11.5 11.5 L10 18 L8.5 11.5 L2 10 L8.5 8.5 Z" />,
    quote: <path d="M3 8 Q3 4 7 4 L7 7 Q5 7 5 9 L8 9 L8 14 L3 14 Z M11 8 Q11 4 15 4 L15 7 Q13 7 13 9 L16 9 L16 14 L11 14 Z" />,
    print: <><rect x="5" y="2" width="10" height="5" /><rect x="3" y="7" width="14" height="7" rx="1" /><rect x="5" y="12" width="10" height="6" /></>,
    palette: <><circle cx="10" cy="10" r="7" /><circle cx="6.5" cy="9" r="1" /><circle cx="9" cy="6" r="1" /><circle cx="13" cy="7" r="1" /><circle cx="14" cy="11" r="1" /></>,
    brain: <path d="M7 3 C5 3 4 5 5 7 C3 8 3 11 5 12 C4 14 6 17 8 16 C9 18 12 18 12 15 C15 16 16 13 14 11 C16 9 15 6 13 6 C13 3 9 2 7 3 Z" />,
    grid: <><rect x="3" y="3" width="6" height="6" /><rect x="11" y="3" width="6" height="6" /><rect x="3" y="11" width="6" height="6" /><rect x="11" y="11" width="6" height="6" /></>,
    admin: <><rect x="3" y="5" width="14" height="11" rx="1.5" /><line x1="6" y1="9" x2="14" y2="9" /><line x1="6" y1="12" x2="11" y2="12" /><circle cx="6.5" cy="3" r="0.8" fill="currentColor" /><circle cx="10" cy="3" r="0.8" fill="currentColor" /><circle cx="13.5" cy="3" r="0.8" fill="currentColor" /><path d="M6 5 L6 4 M10 5 L10 4 M14 5 L14 4" /></>,
    settings: <><circle cx="10" cy="10" r="2.5" /><path d="M10 2 L10 4 M10 16 L10 18 M2 10 L4 10 M16 10 L18 10 M4.5 4.5 L6 6 M14 14 L15.5 15.5 M4.5 15.5 L6 14 M14 6 L15.5 4.5" /></>,
    user: <><circle cx="10" cy="7" r="3" /><path d="M4 17 C4 13 7 12 10 12 C13 12 16 13 16 17" /></>,
    menu: <><line x1="3" y1="6" x2="17" y2="6" /><line x1="3" y1="10" x2="17" y2="10" /><line x1="3" y1="14" x2="17" y2="14" /></>,
    close: <><line x1="5" y1="5" x2="15" y2="15" /><line x1="15" y1="5" x2="5" y2="15" /></>,
    plus: <><line x1="10" y1="4" x2="10" y2="16" /><line x1="4" y1="10" x2="16" y2="10" /></>,
    download: <><path d="M10 3 L10 13 M6 9 L10 13 L14 9" /><line x1="4" y1="16" x2="16" y2="16" /></>,
    link: <><path d="M8 12 L12 8 M7 13 L5 11 C4 10 4 8 5 7 L7 5 C8 4 10 4 11 5 L13 7 M13 7 L15 9 C16 10 16 12 15 13 L13 15 C12 16 10 16 9 15 L7 13" /></>,
    arrow_right: <><line x1="3" y1="10" x2="16" y2="10" /><polyline points="12 6 16 10 12 14" /></>,
    home: <><path d="M3 10 L10 3 L17 10 L17 17 L3 17 Z" /><line x1="8" y1="17" x2="8" y2="11" /><line x1="12" y1="17" x2="12" y2="11" /></>,
    bell: <path d="M5 14 L5 9 C5 6 7 4 10 4 C13 4 15 6 15 9 L15 14 L17 14 L3 14 Z M8 16 C8 17 9 18 10 18 C11 18 12 17 12 16" />,
    bolt: <polygon points="11 2 5 11 9 11 7 18 14 9 10 9" />,
    tanach: <path d="M3 4 L17 4 L17 16 L3 16 Z M10 4 L10 16 M3 8 L17 8 M3 12 L17 12" />,
    sun: <><circle cx="10" cy="10" r="3.5" /><path d="M10 2 L10 4 M10 16 L10 18 M2 10 L4 10 M16 10 L18 10 M4.5 4.5 L6 6 M14 14 L15.5 15.5 M4.5 15.5 L6 14 M14 6 L15.5 4.5" /></>,
    moon: <path d="M14 4 C10 4 7 7 7 11 C7 14 10 16 13 16 C15 16 17 15 17 13 C13 14 10 11 11 7 C11 5 13 4 14 4 Z" />,
    star: <polygon points="10 2 12 8 18 8 13 12 15 18 10 14 5 18 7 12 2 8 8 8" />,
    cards: <><rect x="3" y="6" width="11" height="12" rx="1" /><rect x="6" y="3" width="11" height="12" rx="1" /></>,
    eye: <><path d="M2 10 C4 6 7 4 10 4 C13 4 16 6 18 10 C16 14 13 16 10 16 C7 16 4 14 2 10 Z" /><circle cx="10" cy="10" r="2.5" /></>,
    check: <polyline points="4 10 8 14 16 6" />,
    info: <><circle cx="10" cy="10" r="7.5" /><line x1="10" y1="9" x2="10" y2="14" /><line x1="10" y1="6.3" x2="10" y2="6.5" /></>,
    mic: <><rect x="7" y="2.5" width="6" height="9" rx="3" /><path d="M4.5 10 C4.5 13 7 15.5 10 15.5 C13 15.5 15.5 13 15.5 10" /><line x1="10" y1="15.5" x2="10" y2="18" /></>,
    candle: <><path d="M10 3 C8.6 4.8 8.8 7 10 7.6 C11.2 7 11.4 4.8 10 3 Z" /><rect x="7.8" y="8.4" width="4.4" height="7.2" rx="0.9" /><line x1="5.5" y1="16" x2="14.5" y2="16" /></>,
    mail: <><rect x="2.5" y="4.5" width="15" height="11" rx="1.6" /><path d="M3 6 L10 11 L17 6" /></>,
    edit: <><path d="M3 14 L3 17 L6 17 L15 8 L12 5 L3 14 Z" /><line x1="12" y1="5" x2="15" y2="8" /></>,
    trash: <><polyline points="3 5 17 5" /><path d="M5 5 L6 17 L14 17 L15 5" /><line x1="8" y1="3" x2="12" y2="3" /><line x1="8" y1="8" x2="8" y2="14" /><line x1="12" y1="8" x2="12" y2="14" /></>,
    flame: <path d="M10 2 C8 5 6 6 7 9 C5 8 5 6 6 4 C3 7 3 11 6 13 C6 15 8 16 10 16 C12 16 14 15 14 13 C17 11 17 7 14 4 C15 6 13 8 12 7 C13 4 11 3 10 2 Z M9 12 C9 13.5 10 14 10.5 14 C11 14 12 13 11.5 11.5 C11 10 12 9 12 9 C10.5 10 9 10.5 9 12 Z" />,
  };
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
};

window.Icon = Icon;

export { Icon };
