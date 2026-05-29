// Kids V2 state — Duolingo-style learning loop.
//
// Stored in localStorage under `avot.kidsV2.v1` as a single blob so
// future schema changes can bump the version.

const KEY = 'avot.kidsV2.v1';
const CHANGE_EVENT = 'avot:kidsV2-changed';

const HEART_FULL = 5;
const HEART_REFILL_MS = 30 * 60 * 1000; // one heart back every 30 minutes

// Zuzim — ancient Judean silver coins, used as the in-app currency.
// Earned by completing lessons; spent to refill hearts.
const ZUZIM_PER_LESSON   = 3;   // base reward per lesson
const ZUZIM_PERFECT_BONUS = 5;  // extra for a 3-star (≥95% accuracy) lesson
const ZUZIM_HEART_COST    = 10; // cost to refill one heart
const ZUZIM_FULL_COST     = 25; // cost to refill all hearts at once

const DEFAULT_STATE = {
  xp: 0,
  hearts: HEART_FULL,
  heartsRefillAt: null, // timestamp when next heart returns
  streak: 0,
  longestStreak: 0,
  lastPracticeDate: null, // YYYY-MM-DD
  practiceDates: [], // all dates with at least one completed lesson
  completed: {}, // { "1.1": { stars: 3, xpEarned: 25, completedAt: 1234567890 } }
  dailyXp: 0,
  dailyDate: null, // YYYY-MM-DD this day's XP counter applies to
  dailyGoal: 30,
  zuzim: 0,       // spendable coin balance
  avatar: null,   // chosen animal: 'ari' | 'namer' | 'nesher' | 'tzvi'
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
    s.streak = (s.streak || 0) + 1;
    s.lastPracticeDate = today;
  }
  if (!Array.isArray(s.practiceDates)) s.practiceDates = [];
  if (!s.practiceDates.includes(today)) s.practiceDates.push(today);
  s.longestStreak = Math.max(s.longestStreak || 0, s.streak || 0);
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

// Lazy import to avoid a top-level circular dep — checked at build time
// against the lesson data file's exported map.
function lessonAvailable(perek, mishnah) {
  try {
    // Pull from the global lesson map (loaded by data file at module-init).
    if (typeof window !== 'undefined' && window.__avotKidsV2Lessons) {
      return !!window.__avotKidsV2Lessons[`${perek}.${mishnah}`];
    }
  } catch (e) {}
  return false;
}

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
        // A stop is "playable" only when a real lesson exists for it.
        hasLesson: lessonAvailable(perek.num, m.num),
      });
      idx++;
    }
  }
  return stops;
}

// ============================================================
// Perek progression helpers
// ============================================================
// Group the path stops by perek. Returns:
//   [{ perek: 1, stops: [...] }, { perek: 2, stops: [...] }, ...]
export function groupByPerek(stops) {
  const groups = [];
  let current = null;
  for (const s of stops) {
    if (!current || current.perek !== s.perek) {
      current = { perek: s.perek, stops: [] };
      groups.push(current);
    }
    current.stops.push(s);
  }
  return groups;
}

// Has every stop in this perek with a lesson been completed?
export function isPerekComplete(perekStops, completed) {
  const playable = perekStops.filter(s => s.hasLesson);
  if (playable.length === 0) return false;
  return playable.every(s => completed[s.key]);
}

// Aggregate stats for a perek (total XP earned, average stars).
export function perekStats(perekStops, completed) {
  const done = perekStops.filter(s => completed[s.key]);
  const totalXp = done.reduce((sum, s) => sum + (completed[s.key]?.xpEarned || 0), 0);
  const totalStars = done.reduce((sum, s) => sum + (completed[s.key]?.stars || 0), 0);
  const maxStars = done.length * 3;
  return { totalXp, totalStars, maxStars, lessonsDone: done.length };
}

// ============================================================
// Zuzim helpers
// ============================================================

export function awardZuzim(amount) {
  const s = loadState();
  s.zuzim = (s.zuzim || 0) + amount;
  saveState(s);
  return s;
}

// Spend zuzim. Returns true on success, false if insufficient balance.
export function spendZuzim(amount) {
  const s = loadState();
  if ((s.zuzim || 0) < amount) return false;
  s.zuzim -= amount;
  saveState(s);
  return true;
}

// Refill one heart for ZUZIM_HEART_COST. Returns true on success.
export function refillOneHeart() {
  const s = loadState();
  if (s.hearts >= HEART_FULL) return false;
  if ((s.zuzim || 0) < ZUZIM_HEART_COST) return false;
  s.hearts = Math.min(HEART_FULL, s.hearts + 1);
  s.zuzim -= ZUZIM_HEART_COST;
  if (s.hearts >= HEART_FULL) s.heartsRefillAt = null;
  saveState(s);
  return true;
}

// Refill all hearts for ZUZIM_FULL_COST. Returns true on success.
export function refillAllHearts() {
  const s = loadState();
  if (s.hearts >= HEART_FULL) return false;
  if ((s.zuzim || 0) < ZUZIM_FULL_COST) return false;
  s.hearts = HEART_FULL;
  s.heartsRefillAt = null;
  s.zuzim -= ZUZIM_FULL_COST;
  saveState(s);
  return true;
}

// Set the player's chosen avatar animal.
export function setAvatar(animal) {
  const s = loadState();
  saveState({ ...s, avatar: animal });
}

export { HEART_FULL, HEART_REFILL_MS, todayStr, ZUZIM_PER_LESSON, ZUZIM_PERFECT_BONUS, ZUZIM_HEART_COST, ZUZIM_FULL_COST };
