// Kids V2 state — Duolingo-style learning loop.
//
// Stored in localStorage under `avot.kidsV2.v1` as a single blob so
// future schema changes can bump the version.

const KEY = 'avot.kidsV2.v1';
const CHANGE_EVENT = 'avot:kidsV2-changed';

const HEART_FULL = 5;
const HEART_REFILL_MS = 30 * 60 * 1000; // one heart back every 30 minutes

const DEFAULT_STATE = {
  xp: 0,
  hearts: HEART_FULL,
  heartsRefillAt: null, // timestamp when next heart returns
  streak: 0,
  lastPracticeDate: null, // YYYY-MM-DD
  completed: {}, // { "1.1": { stars: 3, xpEarned: 25, completedAt: 1234567890 } }
  dailyXp: 0,
  dailyDate: null, // YYYY-MM-DD this day's XP counter applies to
  dailyGoal: 30,
};

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...parsed };
  } catch (e) { return { ...DEFAULT_STATE }; }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  } catch (e) {}
}

export function onStateChange(handler) {
  window.addEventListener(CHANGE_EVENT, handler);
  return () => window.removeEventListener(CHANGE_EVENT, handler);
}

// Apply automatic transitions on read: refill hearts, reset daily XP on
// a new day, drop streak if a day was missed.
export function tick(state) {
  const now = Date.now();
  const today = todayStr();
  let dirty = false;

  // Hearts refill
  if (state.hearts < HEART_FULL && state.heartsRefillAt && now >= state.heartsRefillAt) {
    const elapsed = now - state.heartsRefillAt;
    const gain = 1 + Math.floor(elapsed / HEART_REFILL_MS);
    const newHearts = Math.min(HEART_FULL, state.hearts + gain);
    const remaining = HEART_FULL - newHearts;
    state.hearts = newHearts;
    state.heartsRefillAt = remaining > 0 ? now + HEART_REFILL_MS : null;
    dirty = true;
  }

  // Daily XP reset
  if (state.dailyDate !== today) {
    state.dailyDate = today;
    state.dailyXp = 0;
    dirty = true;
  }

  // Streak: drop if last practice was not today and not yesterday
  if (state.lastPracticeDate && state.lastPracticeDate !== today) {
    const last = new Date(state.lastPracticeDate);
    const t = new Date(today);
    const diff = Math.round((t - last) / (24 * 60 * 60 * 1000));
    if (diff > 1) {
      state.streak = 0;
      dirty = true;
    }
  }

  return { state, dirty };
}

export function awardXp(amount) {
  const s = loadState();
  s.xp += amount;
  s.dailyXp += amount;
  const today = todayStr();
  if (s.lastPracticeDate !== today) {
    // First completion today bumps streak
    s.streak = (s.streak || 0) + 1;
    s.lastPracticeDate = today;
  }
  saveState(s);
  return s;
}

export function loseHeart() {
  const s = loadState();
  if (s.hearts > 0) {
    s.hearts -= 1;
    if (!s.heartsRefillAt) s.heartsRefillAt = Date.now() + HEART_REFILL_MS;
  }
  saveState(s);
  return s;
}

export function markCompleted(mishnahKey, stars, xpEarned) {
  const s = loadState();
  const prev = s.completed[mishnahKey];
  // Keep the best stars/xp if completed multiple times
  s.completed[mishnahKey] = {
    stars: Math.max(prev?.stars || 0, stars),
    xpEarned: (prev?.xpEarned || 0) + xpEarned,
    completedAt: Date.now(),
  };
  saveState(s);
  return s;
}

export function resetState() {
  saveState({ ...DEFAULT_STATE, dailyDate: todayStr() });
}

// ============================================================
// Skill-tree path definition
// ============================================================
// Each stop is one mishnah. Animal cycles through the 5:23 quartet.
// "Bonus" stops can be inserted later for review / mastery.

const ANIMALS = ['namer', 'nesher', 'tzvi', 'ari']; // Avot 5:23 order

export function buildPath(perakim) {
  const stops = [];
  let idx = 0;
  for (const perek of perakim) {
    for (const m of perek.mishnayot) {
      stops.push({
        key: `${perek.num}.${m.num}`,
        perek: perek.num,
        mishnah: m.num,
        animal: ANIMALS[idx % ANIMALS.length],
        // For phase 1 we only have lesson data for 1:1 - 1:3.
        hasLesson: perek.num === 1 && m.num <= 3,
      });
      idx++;
    }
  }
  return stops;
}

export { HEART_FULL, HEART_REFILL_MS, todayStr };
