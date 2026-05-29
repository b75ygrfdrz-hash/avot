import React from 'react';

// ── Custom image assets (drop PNGs/JPGs into src/assets/icons/ and add here) ─
import img_1_1 from '../assets/icons/stop-1-1.jpg';
import img_1_2 from '../assets/icons/stop-1-2.jpg';
import img_1_3 from '../assets/icons/stop-1-3.jpg';
import img_1_4 from '../assets/icons/stop-1-4.jpg';
import img_1_5 from '../assets/icons/stop-1-5.jpg';
import img_1_6 from '../assets/icons/stop-1-6.jpg';

// Map of stop key → image URL. When present, overrides the SVG icon.
const STOP_IMAGES = {
  '1.1': img_1_1,
  '1.2': img_1_2,
  '1.3': img_1_3,
  '1.4': img_1_4,
  '1.5': img_1_5,
  '1.6': img_1_6,
};

// Full-colour illustrated SVG icons for each mishnah stop.
// Each icon is designed to sit on the coloured gradient button background.
// viewBox 48 48, white canvas disc underneath, bright illustration on top.
// All gradients are defined inline (no shared <defs> across icons).

// ─── 1:1  Torah scroll — parchment roll, wooden handles, Hebrew lines ───────
export const IconScroll = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="s1-bg" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#fff9ed"/><stop offset="1" stopColor="#ffe9b0"/></linearGradient>
      <linearGradient id="s1-wood" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#c17f3e"/><stop offset="1" stopColor="#7a4a18"/></linearGradient>
    </defs>
    {/* knobs top */}
    <ellipse cx="11" cy="10" rx="5" ry="3" fill="#c17f3e"/>
    <ellipse cx="37" cy="10" rx="5" ry="3" fill="#c17f3e"/>
    {/* handles */}
    <rect x="8"  y="10" width="6" height="28" rx="3" fill="url(#s1-wood)"/>
    <rect x="34" y="10" width="6" height="28" rx="3" fill="url(#s1-wood)"/>
    {/* knobs bottom */}
    <ellipse cx="11" cy="38" rx="5" ry="3" fill="#c17f3e"/>
    <ellipse cx="37" cy="38" rx="5" ry="3" fill="#c17f3e"/>
    {/* parchment */}
    <rect x="13" y="9" width="22" height="30" rx="2" fill="url(#s1-bg)"/>
    {/* text lines */}
    <line x1="17" y1="17" x2="31" y2="17" stroke="#b8860b" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="17" y1="22" x2="31" y2="22" stroke="#b8860b" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="17" y1="27" x2="25" y2="27" stroke="#b8860b" strokeWidth="1.8" strokeLinecap="round"/>
    {/* shine */}
    <ellipse cx="19" cy="13" rx="3" ry="1.5" fill="rgba(255,255,255,0.6)" transform="rotate(-15 19 13)"/>
  </svg>
);

// ─── 1:2  Three pillars — Torah, service, and kind deeds ────────────────────
export const IconPillars = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="s2-col" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#e8dfc8"/><stop offset="1" stopColor="#c9b88a"/></linearGradient>
      <linearGradient id="s2-sky" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#a8d8f0"/><stop offset="1" stopColor="#7bbfdf"/></linearGradient>
    </defs>
    {/* sky backdrop */}
    <rect x="6" y="8" width="36" height="24" rx="4" fill="url(#s2-sky)"/>
    {/* left pillar */}
    <rect x="9"  y="12" width="8" height="22" rx="2" fill="url(#s2-col)"/>
    <rect x="8"  y="10" width="10" height="4"  rx="1.5" fill="#e0d0a0"/>
    <rect x="8"  y="32" width="10" height="3"  rx="1.5" fill="#e0d0a0"/>
    {/* centre pillar (taller) */}
    <rect x="20" y="9" width="8" height="25" rx="2" fill="url(#s2-col)"/>
    <rect x="19" y="7" width="10" height="4"  rx="1.5" fill="#e8d8a8"/>
    <rect x="19" y="32" width="10" height="3"  rx="1.5" fill="#e0d0a0"/>
    {/* right pillar */}
    <rect x="31" y="12" width="8" height="22" rx="2" fill="url(#s2-col)"/>
    <rect x="30" y="10" width="10" height="4"  rx="1.5" fill="#e0d0a0"/>
    <rect x="30" y="32" width="10" height="3"  rx="1.5" fill="#e0d0a0"/>
    {/* base step */}
    <rect x="6" y="35" width="36" height="5" rx="2" fill="#c9b88a"/>
  </svg>
);

// ─── 1:3  Cupped hands — serve not for reward ───────────────────────────────
export const IconHands = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="s3-skin" x1="0" y1="1" x2="0" y2="0"><stop stopColor="#f7b88a"/><stop offset="1" stopColor="#e8956a"/></linearGradient>
      <radialGradient id="s3-glow" cx="50%" cy="50%" r="50%"><stop stopColor="#ffe08a" stopOpacity="0.9"/><stop offset="1" stopColor="#ffbe00" stopOpacity="0"/></radialGradient>
    </defs>
    {/* glowing gift in hands */}
    <ellipse cx="24" cy="22" rx="10" ry="8" fill="url(#s3-glow)"/>
    <path d="M24 14 L28 20 L24 18 L20 20 Z" fill="#ffe066"/>
    <circle cx="24" cy="14" r="3" fill="#ffcd00"/>
    {/* left hand */}
    <path d="M6 32 Q6 24 11 22 Q14 21 15 24 L15 30 Q16 28 18 28 Q20 28 20 30 L20 34 Q18 38 13 38 Q7 38 6 34 Z" fill="url(#s3-skin)"/>
    {/* right hand */}
    <path d="M42 32 Q42 24 37 22 Q34 21 33 24 L33 30 Q32 28 30 28 Q28 28 28 30 L28 34 Q30 38 35 38 Q41 38 42 34 Z" fill="url(#s3-skin)"/>
    {/* highlight */}
    <ellipse cx="12" cy="28" rx="2.5" ry="1.5" fill="rgba(255,255,255,0.4)" transform="rotate(-20 12 28)"/>
    <ellipse cx="36" cy="28" rx="2.5" ry="1.5" fill="rgba(255,255,255,0.4)" transform="rotate(20 36 28)"/>
  </svg>
);

// ─── 1:4  Welcoming house — make your home a meeting place ──────────────────
export const IconHouse = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="s4-wall" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#fff0d8"/><stop offset="1" stopColor="#f5ddb0"/></linearGradient>
      <linearGradient id="s4-roof" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#e05c3a"/><stop offset="1" stopColor="#b83820"/></linearGradient>
    </defs>
    {/* roof */}
    <polygon points="24,6 42,22 6,22" fill="url(#s4-roof)"/>
    <rect x="20" y="5" width="8" height="6" rx="1" fill="#c84020" opacity="0.6"/>
    {/* chimney */}
    <rect x="32" y="9" width="5" height="8" rx="1" fill="#c84020"/>
    {/* walls */}
    <rect x="8" y="21" width="32" height="20" rx="2" fill="url(#s4-wall)"/>
    {/* door */}
    <rect x="19" y="29" width="10" height="12" rx="3" fill="#7a4a18"/>
    <circle cx="27" cy="35" r="1.3" fill="#f5c060"/>
    {/* windows */}
    <rect x="10" y="25" width="7" height="6" rx="1.5" fill="#a8d8f0"/>
    <rect x="31" y="25" width="7" height="6" rx="1.5" fill="#a8d8f0"/>
    <line x1="13.5" y1="25" x2="13.5" y2="31" stroke="rgba(255,255,255,0.7)" strokeWidth="1"/>
    <line x1="10" y1="28" x2="17" y2="28" stroke="rgba(255,255,255,0.7)" strokeWidth="1"/>
    <line x1="34.5" y1="25" x2="34.5" y2="31" stroke="rgba(255,255,255,0.7)" strokeWidth="1"/>
    <line x1="31" y1="28" x2="38" y2="28" stroke="rgba(255,255,255,0.7)" strokeWidth="1"/>
    {/* path/doorstep */}
    <ellipse cx="24" cy="41" rx="6" ry="1.5" fill="rgba(0,0,0,0.08)"/>
  </svg>
);

// ─── 1:5  Open door — let your house be wide open ───────────────────────────
export const IconDoor = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="s5-frame" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#a0724a"/><stop offset="1" stopColor="#6b4220"/></linearGradient>
      <linearGradient id="s5-door" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#d4935a"/><stop offset="1" stopColor="#b87038"/></linearGradient>
      <linearGradient id="s5-inside" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#ffe8b0"/><stop offset="1" stopColor="#ffd070"/></linearGradient>
    </defs>
    {/* frame */}
    <rect x="8" y="6" width="32" height="38" rx="4" fill="url(#s5-frame)"/>
    {/* door (half-open) */}
    <path d="M14 10 L34 10 Q36 10 36 12 L36 40 L14 40 Z" fill="url(#s5-door)"/>
    {/* warm light inside */}
    <rect x="9" y="7" width="13" height="32" rx="2" fill="url(#s5-inside)"/>
    {/* door panels */}
    <rect x="17" y="13" width="16" height="10" rx="1.5" fill="rgba(0,0,0,0.1)"/>
    <rect x="17" y="26" width="16" height="10" rx="1.5" fill="rgba(0,0,0,0.1)"/>
    {/* handle */}
    <circle cx="16" cy="25" r="2.2" fill="#f5c060"/>
    {/* stars from welcome light */}
    <circle cx="14" cy="14" r="1.5" fill="#ffe066" opacity="0.9"/>
    <circle cx="11" cy="20" r="1" fill="#ffe066" opacity="0.7"/>
    <circle cx="16" cy="30" r="1" fill="#ffe066" opacity="0.6"/>
  </svg>
);

// ─── 1:6  Teacher & friend — get yourself both ──────────────────────────────
export const IconPeople = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="s6-a" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#6b9edf"/><stop offset="1" stopColor="#3a72c0"/></linearGradient>
      <linearGradient id="s6-b" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#f49e6a"/><stop offset="1" stopColor="#d4703a"/></linearGradient>
    </defs>
    {/* taller figure — teacher, left */}
    <circle cx="16" cy="13" r="7" fill="#f7c4a0"/>
    <path d="M5 42 Q5 28 16 28 Q27 28 27 42" fill="url(#s6-a)"/>
    {/* face detail */}
    <circle cx="14" cy="12" r="1.2" fill="#7a4a18"/>
    <circle cx="18" cy="12" r="1.2" fill="#7a4a18"/>
    <path d="M13 16 Q16 18.5 19 16" stroke="#e07050" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    {/* shorter figure — student, right */}
    <circle cx="33" cy="17" r="6" fill="#ffd6b0"/>
    <path d="M23 42 Q23 31 33 31 Q43 31 43 42" fill="url(#s6-b)"/>
    {/* face detail */}
    <circle cx="31" cy="16" r="1" fill="#7a4a18"/>
    <circle cx="35" cy="16" r="1" fill="#7a4a18"/>
    <path d="M30 20 Q33 22 36 20" stroke="#e07050" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
    {/* connection spark */}
    <circle cx="24.5" cy="22" r="2" fill="#ffe066"/>
    <path d="M22 22 L27 22" stroke="#ffe066" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// ─── 1:7  Shield — distance yourself from a bad neighbour ───────────────────
export const IconShield = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="s7-sh" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#5ba8f5"/><stop offset="1" stopColor="#2968c8"/></linearGradient>
      <linearGradient id="s7-sh2" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#e84040"/><stop offset="1" stopColor="#a81818"/></linearGradient>
    </defs>
    {/* outer shield */}
    <path d="M24 5 L40 11 L40 26 Q40 38 24 44 Q8 38 8 26 L8 11 Z" fill="url(#s7-sh)"/>
    {/* left half accent */}
    <path d="M24 5 L8 11 L8 26 Q8 38 24 44 Z" fill="url(#s7-sh2)"/>
    {/* inner emblem star */}
    <polygon points="24,15 26,21 32,21 27.5,25 29.5,31 24,27.5 18.5,31 20.5,25 16,21 22,21" fill="rgba(255,230,60,0.95)"/>
    {/* rim highlight */}
    <path d="M24 7 L38 12.5 L38 26 Q38 36.5 24 42" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none"/>
  </svg>
);

// ─── 1:8  Scales — do not judge alone ───────────────────────────────────────
export const IconScales = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="s8-gold" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#ffe566"/><stop offset="1" stopColor="#c8940a"/></linearGradient>
      <linearGradient id="s8-pan" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#f5d080"/><stop offset="1" stopColor="#d4a020"/></linearGradient>
    </defs>
    {/* pole */}
    <rect x="22.5" y="7" width="3" height="32" rx="1.5" fill="url(#s8-gold)"/>
    {/* crossbar */}
    <rect x="8" y="12" width="32" height="3" rx="1.5" fill="url(#s8-gold)"/>
    {/* left chain */}
    <line x1="11" y1="15" x2="8"  y2="25" stroke="#d4a020" strokeWidth="1.5" strokeDasharray="2 2"/>
    {/* right chain */}
    <line x1="37" y1="15" x2="40" y2="25" stroke="#d4a020" strokeWidth="1.5" strokeDasharray="2 2"/>
    {/* left pan */}
    <path d="M4 26 Q8 30 12 26" stroke="#d4a020" strokeWidth="2" fill="url(#s8-pan)" strokeLinecap="round"/>
    <ellipse cx="8" cy="26" rx="5" ry="2" fill="url(#s8-pan)"/>
    {/* right pan */}
    <path d="M36 26 Q40 30 44 26" stroke="#d4a020" strokeWidth="2" fill="url(#s8-pan)" strokeLinecap="round"/>
    <ellipse cx="40" cy="26" rx="5" ry="2" fill="url(#s8-pan)"/>
    {/* base */}
    <rect x="18" y="38" width="12" height="4" rx="2" fill="url(#s8-gold)"/>
    {/* top knob */}
    <circle cx="24" cy="8" r="3" fill="#ffe566"/>
  </svg>
);

// ─── 1:9  Magnifying glass — examine the witnesses carefully ─────────────────
export const IconSearch = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <defs>
      <radialGradient id="s9-lens" cx="40%" cy="35%" r="60%"><stop stopColor="#d0ecff"/><stop offset="1" stopColor="#7bbfee"/></radialGradient>
      <linearGradient id="s9-handle" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#d4a050"/><stop offset="1" stopColor="#8b5820"/></linearGradient>
    </defs>
    {/* lens */}
    <circle cx="20" cy="20" r="13" fill="url(#s9-lens)"/>
    <circle cx="20" cy="20" r="13" stroke="#8b5820" strokeWidth="3.5" fill="none"/>
    {/* stars/detail inside lens */}
    <circle cx="17" cy="16" r="2" fill="rgba(255,255,255,0.7)"/>
    <circle cx="23" cy="23" r="1.2" fill="rgba(255,255,255,0.5)"/>
    {/* handle */}
    <line x1="30" y1="30" x2="42" y2="42" stroke="url(#s9-handle)" strokeWidth="5" strokeLinecap="round"/>
    {/* rim shine */}
    <path d="M11 13 Q14 8 20 8" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
  </svg>
);

// ─── 1:10 Heart — love work, love people ───────────────────────────────────
export const IconHeart = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="s10-h" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#ff7eb3"/><stop offset="1" stopColor="#d8004a"/></linearGradient>
    </defs>
    <path d="M24 40 L8 24 Q4 18 8 13 Q12 8 18 11 Q21 12.5 24 17 Q27 12.5 30 11 Q36 8 40 13 Q44 18 40 24 Z" fill="url(#s10-h)"/>
    {/* shine */}
    <ellipse cx="16" cy="17" rx="4" ry="2.5" fill="rgba(255,255,255,0.4)" transform="rotate(-30 16 17)"/>
    {/* small hearts */}
    <path d="M33 10 L35 12.5 L33 14 L31 12.5 Z" fill="#ff7eb3" opacity="0.7"/>
    <path d="M38 18 L40 20 L38 21.5 L36 20 Z" fill="#ff7eb3" opacity="0.5"/>
  </svg>
);

// ─── 1:11 Megaphone — guard your words ─────────────────────────────────────
export const IconMegaphone = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="s11-horn" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#ffce54"/><stop offset="1" stopColor="#f0a000"/></linearGradient>
    </defs>
    {/* body */}
    <path d="M9 18 L9 30 L16 30 L36 40 L36 8 L16 18 Z" fill="url(#s11-horn)"/>
    {/* bell opening */}
    <ellipse cx="36" cy="24" rx="5" ry="16" fill="#f0a000" opacity="0.6"/>
    {/* handle base */}
    <rect x="6" y="18" width="5" height="12" rx="2" fill="#c87800"/>
    {/* sound waves */}
    <path d="M40 17 Q44 20 44 24 Q44 28 40 31" stroke="#ffe080" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <path d="M41 21 Q43 22.5 43 24 Q43 25.5 41 27" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" fill="none"/>
    {/* shine */}
    <path d="M16 11 L30 11" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// ─── 1:12 Dove — love peace, love people, draw them near ───────────────────
export const IconDove = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="s12-sky" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#daf0ff"/><stop offset="1" stopColor="#90cffa"/></linearGradient>
    </defs>
    {/* sky backdrop */}
    <rect x="4" y="6" width="40" height="28" rx="6" fill="url(#s12-sky)"/>
    {/* wings */}
    <path d="M24 22 Q14 12 8 15 Q12 20 18 22 Z" fill="white"/>
    <path d="M24 22 Q34 12 40 15 Q36 20 30 22 Z" fill="rgba(255,255,255,0.85)"/>
    {/* body */}
    <ellipse cx="24" cy="25" rx="8" ry="6" fill="white"/>
    {/* head */}
    <circle cx="30" cy="20" r="4.5" fill="white"/>
    <circle cx="32" cy="19" r="1.2" fill="#4a6080"/>
    {/* beak */}
    <path d="M33 21 L37 22 L33 23 Z" fill="#f5b060"/>
    {/* olive branch */}
    <path d="M14 32 Q18 28 22 30 Q26 32 28 36" stroke="#4a9a20" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <ellipse cx="17" cy="30" rx="2.5" ry="1.5" fill="#5cb830" transform="rotate(-30 17 30)"/>
    <ellipse cx="21" cy="29" rx="2.5" ry="1.5" fill="#5cb830" transform="rotate(-10 21 29)"/>
    <ellipse cx="25" cy="33" rx="2.5" ry="1.5" fill="#5cb830" transform="rotate(20 25 33)"/>
    {/* tail feathers */}
    <path d="M18 27 Q12 30 10 28 Q14 26 18 27 Z" fill="white" opacity="0.9"/>
  </svg>
);

// ─── 1:13 Wave — a name that grows or a name that is lost ──────────────────
export const IconWave = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="s13-sea" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#38bdf8"/><stop offset="1" stopColor="#0369a1"/></linearGradient>
      <linearGradient id="s13-foam" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#e0f7ff"/><stop offset="1" stopColor="#b0e8ff"/></linearGradient>
    </defs>
    {/* sea base */}
    <rect x="4" y="28" width="40" height="16" rx="4" fill="url(#s13-sea)"/>
    {/* big wave crest */}
    <path d="M4 28 Q12 18 20 24 Q28 30 36 18 Q42 12 44 20 L44 28 Z" fill="url(#s13-sea)"/>
    {/* foam crest */}
    <path d="M4 28 Q12 20 20 26 Q28 32 36 20 Q40 14 44 22" stroke="url(#s13-foam)" strokeWidth="4" strokeLinecap="round" fill="none"/>
    {/* foam dots */}
    <circle cx="11" cy="24" r="2.5" fill="white" opacity="0.8"/>
    <circle cx="27" cy="27" r="2" fill="white" opacity="0.7"/>
    <circle cx="38" cy="19" r="2.5" fill="white" opacity="0.8"/>
    {/* sparkle on water */}
    <path d="M8 34 L9 32 L10 34 L8 34Z" fill="rgba(255,255,255,0.6)"/>
    <path d="M30 34 L31 32 L32 34 L30 34Z" fill="rgba(255,255,255,0.6)"/>
  </svg>
);

// ─── 1:14 Hourglass — if not now, when? ────────────────────────────────────
export const IconHourglass = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="s14-frame" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#ffe566"/><stop offset="1" stopColor="#c87800"/></linearGradient>
      <linearGradient id="s14-sand" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#fff0c0"/><stop offset="1" stopColor="#ffd060"/></linearGradient>
    </defs>
    {/* frame top & bottom bars */}
    <rect x="9"  y="6"  width="30" height="5" rx="2.5" fill="url(#s14-frame)"/>
    <rect x="9"  y="37" width="30" height="5" rx="2.5" fill="url(#s14-frame)"/>
    {/* side rods */}
    <rect x="10" y="9" width="3" height="30" rx="1.5" fill="#c87800"/>
    <rect x="35" y="9" width="3" height="30" rx="1.5" fill="#c87800"/>
    {/* upper sand cone */}
    <path d="M13 11 L35 11 L25 24 L23 24 Z" fill="url(#s14-sand)"/>
    {/* lower sand pile */}
    <path d="M13 37 L35 37 L27 28 L21 28 Z" fill="url(#s14-sand)" opacity="0.6"/>
    {/* falling sand grain */}
    <line x1="24" y1="24" x2="24" y2="28" stroke="#ffd060" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 1"/>
    {/* glass glint */}
    <path d="M15 13 Q19 14 22 18" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
  </svg>
);

// ─── 1:15 Smile — receive every person with a cheerful face ────────────────
export const IconSmile = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <defs>
      <radialGradient id="s15-face" cx="40%" cy="35%" r="65%"><stop stopColor="#ffe566"/><stop offset="1" stopColor="#f5a800"/></radialGradient>
    </defs>
    <circle cx="24" cy="24" r="18" fill="url(#s15-face)"/>
    {/* eyes */}
    <ellipse cx="17" cy="20" rx="3" ry="3.5" fill="#3a2800"/>
    <ellipse cx="31" cy="20" rx="3" ry="3.5" fill="#3a2800"/>
    {/* eye shine */}
    <circle cx="18.5" cy="18.5" r="1.2" fill="white"/>
    <circle cx="32.5" cy="18.5" r="1.2" fill="white"/>
    {/* big smile */}
    <path d="M14 28 Q24 38 34 28" stroke="#c84000" strokeWidth="3" strokeLinecap="round" fill="none"/>
    <path d="M14 28 Q24 36 34 28" fill="#ff8a60" opacity="0.5"/>
    {/* cheeks */}
    <ellipse cx="12" cy="27" rx="4" ry="2.5" fill="#ffb060" opacity="0.5"/>
    <ellipse cx="36" cy="27" rx="4" ry="2.5" fill="#ffb060" opacity="0.5"/>
    {/* shine */}
    <ellipse cx="18" cy="16" rx="5" ry="3" fill="rgba(255,255,255,0.35)" transform="rotate(-20 18 16)"/>
  </svg>
);

// ─── 1:16 Stack of books — get yourself a teacher ──────────────────────────
export const IconBooks = () => (
  <svg viewBox="0 0 48 48" fill="none">
    {/* book 1 — bottom, red */}
    <rect x="7"  y="32" width="34" height="9" rx="2.5" fill="#e84040"/>
    <rect x="7"  y="32" width="4"  height="9" rx="2.5" fill="#c82020"/>
    <line x1="13" y1="32" x2="13" y2="41" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
    {/* book 2 — middle, blue */}
    <rect x="9"  y="23" width="30" height="9" rx="2.5" fill="#3a82f0"/>
    <rect x="9"  y="23" width="4"  height="9" rx="2.5" fill="#1a5cd0"/>
    <line x1="15" y1="23" x2="15" y2="32" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
    {/* book 3 — top-middle, green */}
    <rect x="11" y="15" width="26" height="8" rx="2" fill="#28b050"/>
    <rect x="11" y="15" width="4"  height="8" rx="2" fill="#188038"/>
    <line x1="17" y1="15" x2="17" y2="23" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
    {/* book 4 — top, orange */}
    <rect x="14" y="8" width="20" height="7" rx="2" fill="#f5a020"/>
    <rect x="14" y="8" width="4"  height="7" rx="2" fill="#d07800"/>
    <line x1="20" y1="8" x2="20" y2="15" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
    {/* shine on top book */}
    <rect x="20" y="9" width="10" height="2" rx="1" fill="rgba(255,255,255,0.4)"/>
  </svg>
);

// ─── 1:17 Silence — silence is a fence for wisdom ──────────────────────────
export const IconSilence = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="s17-lips" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#ff8a9a"/><stop offset="1" stopColor="#d0405a"/></linearGradient>
      <linearGradient id="s17-skin" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#f7c4a0"/><stop offset="1" stopColor="#e09070"/></linearGradient>
    </defs>
    {/* face oval */}
    <ellipse cx="24" cy="28" rx="16" ry="14" fill="url(#s17-skin)"/>
    {/* eyes */}
    <ellipse cx="18" cy="22" rx="2" ry="2.5" fill="#3a2800"/>
    <ellipse cx="30" cy="22" rx="2" ry="2.5" fill="#3a2800"/>
    <circle cx="19" cy="21" r="0.9" fill="white"/>
    <circle cx="31" cy="21" r="0.9" fill="white"/>
    {/* lips */}
    <path d="M15 30 Q24 37 33 30 Q28 35 24 35 Q20 35 15 30 Z" fill="url(#s17-lips)"/>
    <path d="M15 30 Q24 27 33 30" stroke="#c03050" strokeWidth="1.5" fill="none"/>
    {/* finger (vertical, from top) */}
    <rect x="22" y="6" width="5" height="16" rx="2.5" fill="url(#s17-skin)"/>
    <rect x="22" y="6" width="5"  height="4"  rx="2.5" fill="#e09070"/>
    {/* fingernail */}
    <ellipse cx="24.5" cy="8" rx="1.8" ry="1.2" fill="rgba(255,255,255,0.6)"/>
    {/* shine on finger */}
    <line x1="24" y1="10" x2="24" y2="18" stroke="rgba(255,255,255,0.35)" strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

// ─── 1:18 Peace — truth, justice, and peace ─────────────────────────────────
export const IconPeace = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <defs>
      <radialGradient id="s18-bg" cx="50%" cy="50%" r="50%"><stop stopColor="#c8f0c0"/><stop offset="1" stopColor="#60c040"/></radialGradient>
    </defs>
    {/* filled disc */}
    <circle cx="24" cy="24" r="18" fill="url(#s18-bg)"/>
    {/* peace symbol */}
    <circle cx="24" cy="24" r="13" stroke="white" strokeWidth="3.5" fill="none"/>
    <line x1="24" y1="11" x2="24" y2="37" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
    <line x1="24" y1="24" x2="15" y2="33" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
    <line x1="24" y1="24" x2="33" y2="33" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
    {/* shine */}
    <path d="M14 14 Q18 10 24 10" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    {/* small stars around */}
    <circle cx="8"  cy="10" r="2" fill="#ffe566"/>
    <circle cx="40" cy="10" r="1.5" fill="#ffe566" opacity="0.8"/>
    <circle cx="6"  cy="36" r="1.5" fill="#ffe566" opacity="0.6"/>
  </svg>
);

// ── Fallback icons for future chapters ──────────────────────────────────────
export const IconStar = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <defs><radialGradient id="fb-star" cx="40%" cy="35%" r="65%"><stop stopColor="#ffe566"/><stop offset="1" stopColor="#f5a800"/></radialGradient></defs>
    <path d="M24 6 L28.5 17 L41 17 L31 24.5 L34.5 36 L24 29 L13.5 36 L17 24.5 L7 17 L19.5 17 Z" fill="url(#fb-star)"/>
    <ellipse cx="20" cy="14" rx="4" ry="2" fill="rgba(255,255,255,0.45)" transform="rotate(-20 20 14)"/>
  </svg>
);
export const IconGem = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <defs><linearGradient id="fb-gem" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#80d8ff"/><stop offset="1" stopColor="#0288d1"/></linearGradient></defs>
    <path d="M24 6 L38 18 L24 42 L10 18 Z" fill="url(#fb-gem)"/>
    <path d="M24 6 L38 18 L10 18 Z" fill="rgba(255,255,255,0.25)"/>
    <path d="M10 18 L24 42 L24 6 Z" fill="rgba(0,0,0,0.1)"/>
    <path d="M16 11 Q20 8 24 8" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" fill="none"/>
  </svg>
);
export const IconFire = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="fb-fire" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#ffe566"/><stop offset="1" stopColor="#e84000"/></linearGradient>
      <linearGradient id="fb-inner" x1="0" y1="0" x2="0" y2="1"><stop stopColor="white" stopOpacity="0.8"/><stop offset="1" stopColor="#ffe566"/></linearGradient>
    </defs>
    <path d="M24 5 Q32 12 30 20 Q28 14 24 16 Q26 22 22 28 Q18 22 20 14 Q16 18 18 26 Q10 20 12 12 Q16 8 24 5Z" fill="url(#fb-fire)"/>
    <path d="M24 22 Q27 26 25 30 Q22 28 23 24 Q21 26 22 30 Q18 26 20 22 Q22 20 24 22Z" fill="url(#fb-inner)"/>
  </svg>
);
export const IconTarget = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="18" fill="#e84040" opacity="0.15"/>
    <circle cx="24" cy="24" r="18" stroke="#e84040" strokeWidth="3" fill="none"/>
    <circle cx="24" cy="24" r="11" stroke="#e84040" strokeWidth="3" fill="white"/>
    <circle cx="24" cy="24" r="5"  fill="#e84040"/>
    <line x1="24" y1="4"  x2="24" y2="10" stroke="#e84040" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="24" y1="38" x2="24" y2="44" stroke="#e84040" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="4"  y1="24" x2="10" y2="24" stroke="#e84040" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="38" y1="24" x2="44" y2="24" stroke="#e84040" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);
export const IconTrophy = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <defs><linearGradient id="fb-tr" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#ffe566"/><stop offset="1" stopColor="#c87800"/></linearGradient></defs>
    <path d="M15 9 L15 26 Q15 36 24 36 Q33 36 33 26 L33 9 Z" fill="url(#fb-tr)"/>
    <path d="M9 12 Q7 12 7 17 Q7 23 15 23" stroke="#c87800" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M39 12 Q41 12 41 17 Q41 23 33 23" stroke="#c87800" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <rect x="20" y="36" width="8"  height="5"  rx="1" fill="#c87800"/>
    <rect x="15" y="41" width="18" height="4"  rx="2" fill="url(#fb-tr)"/>
    <polygon points="24,14 26,20 32,20 27.5,23.5 29,29 24,26 19,29 20.5,23.5 16,20 22,20" fill="rgba(255,255,255,0.5)"/>
  </svg>
);
export const IconRainbow = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <defs><linearGradient id="fb-sun" cx="40%" cy="35%" r="65%" gradientUnits="objectBoundingBox"><stop stopColor="#ffe566"/><stop offset="1" stopColor="#f5a800"/></linearGradient></defs>
    <path d="M5 34 Q5 14 24 14 Q43 14 43 34" stroke="#e84040" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <path d="M9 34 Q9 18 24 18 Q39 18 39 34" stroke="#f5a800" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <path d="M13 34 Q13 22 24 22 Q35 22 35 34" stroke="#28b050" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <path d="M17 34 Q17 26 24 26 Q31 26 31 34" stroke="#3a82f0" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <circle cx="36" cy="12" r="6" fill="#ffe566"/>
    <path d="M36 4 L36 6" stroke="#ffe566" strokeWidth="2" strokeLinecap="round"/>
    <path d="M36 18 L36 20" stroke="#ffe566" strokeWidth="2" strokeLinecap="round"/>
    <path d="M28 12 L30 12" stroke="#ffe566" strokeWidth="2" strokeLinecap="round"/>
    <path d="M42 12 L44 12" stroke="#ffe566" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
export const IconButterfly = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <path d="M24 24 Q16 12 8 14 Q6 18 10 22 Q16 26 24 24Z"  fill="#b060f0"/>
    <path d="M24 24 Q32 12 40 14 Q42 18 38 22 Q32 26 24 24Z" fill="#9040d0"/>
    <path d="M24 24 Q14 34 10 30 Q8 24 12 22 Q18 21 24 24Z"  fill="#e090ff"/>
    <path d="M24 24 Q34 34 38 30 Q40 24 36 22 Q30 21 24 24Z" fill="#c870f0"/>
    <ellipse cx="24" cy="24" rx="2.5" ry="10" fill="#4a2070"/>
    <circle cx="24" cy="15" r="2.5" fill="#4a2070"/>
    <path d="M22 14 Q19 10 17 8" stroke="#4a2070" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    <path d="M26 14 Q29 10 31 8" stroke="#4a2070" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
  </svg>
);

// ── Export map ───────────────────────────────────────────────────────────────
export const STOP_SVG_ICONS = {
  '1.1':  IconScroll,
  '1.2':  IconPillars,
  '1.3':  IconHands,
  '1.4':  IconHouse,
  '1.5':  IconDoor,
  '1.6':  IconPeople,
  '1.7':  IconShield,
  '1.8':  IconScales,
  '1.9':  IconSearch,
  '1.10': IconHeart,
  '1.11': IconMegaphone,
  '1.12': IconDove,
  '1.13': IconWave,
  '1.14': IconHourglass,
  '1.15': IconSmile,
  '1.16': IconBooks,
  '1.17': IconSilence,
  '1.18': IconPeace,
};

const FALLBACK_ICONS = [
  IconStar, IconGem, IconFire, IconTarget, IconTrophy,
  IconRainbow, IconButterfly, IconHeart, IconShield, IconDove,
];

// Returns { type: 'img', src } or { type: 'svg', Component }
export function getStopIcon(stop) {
  const key = `${stop.perek}.${stop.mishnah}`;
  if (STOP_IMAGES[key]) return { type: 'img', src: STOP_IMAGES[key] };
  const Component = STOP_SVG_ICONS[key] ||
    FALLBACK_ICONS[(stop.perek * 10 + stop.mishnah) % FALLBACK_ICONS.length];
  return { type: 'svg', Component };
}

// Legacy alias kept for any direct SVG-only callers
export function getStopSvgIcon(stop) {
  return getStopIcon(stop).Component || IconScroll;
}
