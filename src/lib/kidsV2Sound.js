// Kids V2 sound effects — synthesized with Web Audio API.
//
// No external audio files: every cue is built from oscillators and
// gain envelopes at call time. Tiny, instant, free, no licensing.
//
// Mute state lives in localStorage so it persists across sessions.

const MUTE_KEY = 'avot.kidsV2.muted';

let ctx = null;

function getCtx() {
  if (ctx) return ctx;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  } catch (e) { ctx = null; }
  return ctx;
}

export function isMuted() {
  try { return localStorage.getItem(MUTE_KEY) === 'yes'; } catch (e) { return false; }
}

export function setMuted(yes) {
  try {
    if (yes) localStorage.setItem(MUTE_KEY, 'yes');
    else localStorage.removeItem(MUTE_KEY);
    window.dispatchEvent(new CustomEvent('avot:kidsV2-mute-changed'));
  } catch (e) {}
}

export function onMuteChange(handler) {
  window.addEventListener('avot:kidsV2-mute-changed', handler);
  return () => window.removeEventListener('avot:kidsV2-mute-changed', handler);
}

// --- Primitive: play a single tone ---
function tone({ freq, duration = 0.18, type = 'sine', gain = 0.18, when = 0, attack = 0.005, release = 0.05 }) {
  const c = getCtx();
  if (!c || isMuted()) return;
  const t0 = c.currentTime + when;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + attack);
  g.gain.setValueAtTime(gain, t0 + duration - release);
  g.gain.linearRampToValueAtTime(0, t0 + duration);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

// --- Primitive: pitch slide ---
function slide({ from, to, duration = 0.2, type = 'sine', gain = 0.18, when = 0 }) {
  const c = getCtx();
  if (!c || isMuted()) return;
  const t0 = c.currentTime + when;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t0);
  osc.frequency.exponentialRampToValueAtTime(to, t0 + duration);
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.01);
  g.gain.linearRampToValueAtTime(0, t0 + duration);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

// --- Cues ---
export function playCorrect() {
  // Rising major triad: C5 (523), E5 (659), G5 (784)
  tone({ freq: 523.25, duration: 0.10, gain: 0.16, when: 0.00 });
  tone({ freq: 659.25, duration: 0.10, gain: 0.16, when: 0.07 });
  tone({ freq: 783.99, duration: 0.18, gain: 0.16, when: 0.14 });
}

export function playWrong() {
  // Low buzz: square wave on A3 then dip
  slide({ from: 220, to: 110, duration: 0.28, type: 'square', gain: 0.10 });
}

export function playLessonComplete() {
  // Fanfare arpeggio
  tone({ freq: 523.25, duration: 0.10, gain: 0.16, when: 0.00 });
  tone({ freq: 659.25, duration: 0.10, gain: 0.16, when: 0.10 });
  tone({ freq: 783.99, duration: 0.10, gain: 0.16, when: 0.20 });
  tone({ freq: 1046.50, duration: 0.30, gain: 0.20, when: 0.30 });
}

export function playPerekComplete() {
  // Bigger fanfare with sparkle on top
  tone({ freq: 523.25, duration: 0.12, gain: 0.18, when: 0.00 });
  tone({ freq: 659.25, duration: 0.12, gain: 0.18, when: 0.10 });
  tone({ freq: 783.99, duration: 0.12, gain: 0.18, when: 0.20 });
  tone({ freq: 1046.50, duration: 0.30, gain: 0.22, when: 0.30 });
  // Sparkle: high random pings
  for (let i = 0; i < 6; i++) {
    const f = 1200 + Math.random() * 800;
    tone({ freq: f, duration: 0.08, gain: 0.08, type: 'triangle', when: 0.4 + i * 0.06 });
  }
}

export function playHeartLost() {
  // Heart-break: minor descending third
  tone({ freq: 392, duration: 0.12, gain: 0.14, type: 'triangle', when: 0.00 });
  tone({ freq: 311, duration: 0.20, gain: 0.14, type: 'triangle', when: 0.10 });
}

export function playTap() {
  tone({ freq: 880, duration: 0.05, gain: 0.06, type: 'sine' });
}
