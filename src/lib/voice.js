// voice.js — Web Speech API wrapper + Hebrew recitation matching engine
// ---------------------------------------------------------------------------
// Matching strategy: reduce both the English-ASR phonetic capture and the
// expected Hebrew text to a coarse PHONETIC KEY that discards the distinctions
// that cause false negatives:
//   * Ashkenazic vs Sephardic vowels  => all vowels collapse to one symbol
//   * bet/vet, pe/fe, kaf/chaf        => folded into single consonant classes
//   * s/sh/samech/sin/tzadi/zayin     => folded (ASR confuses them all)
//   * matres lectionis (vav/yod)      => handled so they don't add spurious consonants
// Recall is prioritised over precision by design.
// ---------------------------------------------------------------------------

export function createVoiceRecognition({ onInterim, onFinal, onError, onEnd, continuous = false, lang = 'en-US', maxAlternatives = 5 } = {}) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    return { supported: false, start: () => {}, stop: () => {} };
  }

  const r = new SR();
  r.continuous = continuous;
  r.interimResults = true;
  r.lang = lang;
  // Ask the recognizer for several guesses, not just its single best one.
  // Matching can then accept a word if ANY guess got it right — much more
  // forgiving when the top guess mishears.
  r.maxAlternatives = maxAlternatives;

  r.onresult = (e) => {
    let interim = '';
    let final = '';
    const alternatives = []; // extra guesses for the final chunks
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const res = e.results[i];
      if (res.isFinal) {
        final += res[0].transcript;
        for (let a = 1; a < res.length; a++) {
          if (res[a] && res[a].transcript) alternatives.push(res[a].transcript);
        }
      } else {
        interim += res[0].transcript;
      }
    }
    if (interim) onInterim?.(interim);
    if (final) onFinal?.(final.trim(), alternatives);
  };

  r.onerror = (e) => onError?.(e.error);
  r.onend = () => onEnd?.();

  return {
    supported: true,
    start() { try { r.start(); } catch (_) {} },
    stop()  { try { r.stop();  } catch (_) {} },
  };
}

// ── Hebrew => Latin transliteration ───────────────────────────────────────

const NIKUD_VOWELS = {
  'ְ': 'e', // sheva
  'ֱ': 'e', // hataf segol
  'ֲ': 'a', // hataf patach
  'ֳ': 'o', // hataf kamatz
  'ִ': 'i', // hiriq
  'ֵ': 'e', // tzere
  'ֶ': 'e', // segol
  'ַ': 'a', // patach
  'ָ': 'a', // kamatz (Sephardic 'a' / Ashkenazic 'o' — folded later anyway)
  'ֹ': 'o', // holam
  'ֺ': 'o', // holam haser
  'ֻ': 'u', // qubuts
  'ׇ': 'o', // kamatz katan
};

const LETTERS = {
  'א': '', 'ב': 'b', 'ג': 'g', 'ד': 'd', 'ה': 'h', 'ז': 'z',
  'ח': 'ch', 'ט': 't', 'י': 'y', 'כ': 'k', 'ל': 'l', 'מ': 'm', 'נ': 'n',
  'ס': 's', 'ע': '', 'פ': 'p', 'צ': 'tz', 'ק': 'k', 'ר': 'r', 'ש': 'sh',
  'ת': 't', 'ך': 'ch', 'ם': 'm', 'ן': 'n', 'ף': 'f', 'ץ': 'tz',
};

const DAGESH = 'ּ';
const HOLAM  = 'ֹ';

export function transliterateHebrew(word) {
  const chars = [...word];
  let out = '';
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const cp = ch.codePointAt(0);
    // Vav: can be consonant (v) or vowel mater
    if (ch === 'ו') {
      const next = chars[i + 1];
      if (next === DAGESH) { out += 'u'; i++; continue; }
      if (next === HOLAM)  { out += 'o'; i++; continue; }
      out += 'v';
      continue;
    }
    if (cp >= 0x0591 && cp <= 0x05C7) {
      if (ch === DAGESH) continue;
      out += NIKUD_VOWELS[ch] || '';
      continue;
    }
    out += LETTERS[ch] !== undefined ? LETTERS[ch] : '';
  }
  return out.toLowerCase();
}

// ── Phonetic key system ────────────────────────────────────────────────────
// Consonant classes:
//   B = b v w        (bet / vet)
//   P = p f          (pe / fe)
//   K = k q c + ch   (kaf / chaf / chet / kuf)
//   G = g j
//   T = t            (tet / tav)
//   D = d
//   S = s z sh + tz  (samech/sin/shin/zayin/tzadi — ASR can't tell these)
//   R L M N H Y = themselves
//   A = every vowel  (kills Ashkenazic/Sephardic vowel-quality differences)

function classifyLatin(latin) {
  let s = latin.toLowerCase().replace(/[^a-z]/g, '');
  s = s.replace(/tz|ts/g, 'S').replace(/sh/g, 'S').replace(/ch|kh/g, 'K');
  let out = '';
  for (const c of s) {
    if (c === 'S' || c === 'K') { out += c; continue; }
    if ('aeiou'.includes(c))    { out += 'A'; continue; }
    switch (c) {
      case 'b': case 'v': case 'w': out += 'B'; break;
      case 'p': case 'f':           out += 'P'; break;
      case 'k': case 'q': case 'c': out += 'K'; break;
      case 'g': case 'j':           out += 'G'; break;
      case 's': case 'z':           out += 'S'; break;
      case 't':                     out += 'T'; break;
      case 'd':                     out += 'D'; break;
      case 'r':                     out += 'R'; break;
      case 'l':                     out += 'L'; break;
      case 'm':                     out += 'M'; break;
      case 'n':                     out += 'N'; break;
      case 'h':                     out += 'H'; break;
      case 'y':                     out += 'Y'; break;
      default: break;
    }
  }
  return out.replace(/(.)\1+/g, '$1');
}

function keyFromLatin(latin)   { return classifyLatin(latin); }
function keyFromHebrew(hebrew) { return classifyLatin(transliterateHebrew(hebrew)); }

// Consonant skeleton: remove vowel placeholders (Semitic root matching)
const skeleton    = key => key.replace(/A/g, '');
// Strip a single leading inseparable prefix (ו ל ב כ מ ש ה)
const stripPrefix = sk  => sk.replace(/^[BLKMSH]/, '');

// ── Levenshtein edit distance ──────────────────────────────────────────────

export function editDistance(a, b) {
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  let cur = new Array(n + 1);
  for (let i = 1; i <= m; i++) {
    cur[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
    }
    [prev, cur] = [cur, prev];
  }
  return prev[n];
}

// ── wordsMatch ─────────────────────────────────────────────────────────────
// spoken   = English-ASR text (Latin, phonetic capture of Hebrew speech)
// expected = Hebrew word token (may have nikud)
// lang     = 'he' for Hebrew recitation mode, 'en' for English mode

export function wordsMatch(spoken, expected, lang) {
  if (lang === 'he') {
    // Both spoken and expected are Hebrew text (he-IL ASR → Hebrew chars).
    // Run both through keyFromHebrew so nikud differences, sofit vs regular,
    // and consonant-class ambiguities all collapse before comparing.
    const ks = keyFromHebrew(spoken);
    const ke = keyFromHebrew(expected);
    if (!ks || !ke) return false;

    // Pass 1: full phonetic key, 38% tolerance
    if (editDistance(ks, ke) <= Math.max(1, Math.floor(ke.length * 0.38))) return true;

    // Pass 2: consonant skeletons — strips all vowel markers
    const ss = skeleton(ks), se = skeleton(ke);
    if (ss && se) {
      if (editDistance(ss, se) <= Math.max(1, Math.floor(se.length * 0.40))) return true;

      // Pass 3: strip leading prefix consonant (handles dropped ו/ל/ב/כ/מ/ש/ה)
      const sp = stripPrefix(ss), ep = stripPrefix(se);
      if (editDistance(sp, ep) <= Math.max(1, Math.floor(Math.max(ep.length, 2) * 0.45))) return true;
    }
    return false;
  }

  // English mode: case-insensitive, 35% tolerance
  const s = spoken.toLowerCase().replace(/[^a-z']/g, '');
  const e = expected.toLowerCase().replace(/[^a-z']/g, '');
  if (!s || !e) return false;
  return editDistance(s, e) <= Math.max(1, Math.floor(e.length * 0.35));
}

// ── alignRecitation ────────────────────────────────────────────────────────
// Bidirectional alignment that handles:
//   A) direct 1:1 match
//   B) ASR split: 2-3 spoken tokens = 1 expected word ("tall me deem" = "talmidim")
//   C) ASR merge: 1 spoken token = 2 expected words
//   D) extra inserted spoken words (filler, false starts)
//   E) skipped expected words (user omitted them)
//   F) genuine mismatch
// Returns one { expected, spoken, status } per expected word.

export function alignRecitation(spokenWords, expectedWords, lang) {
  const E = expectedWords, S = spokenWords;
  const n = E.length, m = S.length;
  const join = arr => arr.join(lang === 'he' ? '' : ' ');

  if (n === 0) return [];

  // Global (Needleman–Wunsch style) alignment over WORD sequences.
  // A match costs 0; every other edit costs ≥1, so the optimal path
  // maximises the number of correctly-recited words and never lets one
  // misheard / extra / skipped token knock the rest out of sync.
  const DEL = 1;   // expected word the reciter skipped (or ASR dropped)
  const INS = 1;   // extra spoken token (filler, repeat, ASR noise)
  const SUB = 2;   // spoken word aligned to expected but doesn't match
  const INF = Infinity;

  const dp   = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(INF));
  const back = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(null));
  dp[0][0] = 0;
  for (let i = 1; i <= n; i++) { dp[i][0] = dp[i - 1][0] + DEL; back[i][0] = { op: 'del' }; }
  for (let j = 1; j <= m; j++) { dp[0][j] = dp[0][j - 1] + INS; back[0][j] = { op: 'ins' }; }

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      let best = INF, bop = null;
      const consider = (cost, op) => { if (cost < best) { best = cost; bop = op; } };

      // align E[i-1] with S[j-1] (match or substitution)
      const matched = wordsMatch(S[j - 1], E[i - 1], lang);
      consider(dp[i - 1][j - 1] + (matched ? 0 : SUB), { op: matched ? 'match' : 'sub', si: j - 1 });
      // skip an expected word (missed) / drop an extra spoken word
      consider(dp[i - 1][j] + DEL, { op: 'del' });
      consider(dp[i][j - 1] + INS, { op: 'ins' });
      // ASR split: one expected word came out as 2–3 spoken tokens
      for (let k = 2; k <= 3; k++) {
        if (j - k >= 0 && wordsMatch(join(S.slice(j - k, j)), E[i - 1], lang)) {
          consider(dp[i - 1][j - k], { op: 'split', k, si: j - k });
        }
      }
      // ASR merge: two expected words came out as one spoken token
      if (i >= 2 && wordsMatch(S[j - 1], join(E.slice(i - 2, i)), lang)) {
        consider(dp[i - 2][j - 1], { op: 'merge', si: j - 1 });
      }

      dp[i][j] = best; back[i][j] = bop;
    }
  }

  // Backtrack — emit exactly one result per expected word, in order.
  const out = [];
  let i = n, j = m;
  while ((i > 0 || j > 0) && back[i][j]) {
    const b = back[i][j];
    if (b.op === 'del')        { out.push({ expected: E[i - 1], spoken: null, status: 'missed' }); i -= 1; }
    else if (b.op === 'ins')   { j -= 1; }
    else if (b.op === 'match') { out.push({ expected: E[i - 1], spoken: S[b.si], status: 'correct' }); i -= 1; j -= 1; }
    else if (b.op === 'sub')   { out.push({ expected: E[i - 1], spoken: S[b.si], status: 'wrong' });   i -= 1; j -= 1; }
    else if (b.op === 'split') { out.push({ expected: E[i - 1], spoken: join(S.slice(b.si, b.si + b.k)), status: 'correct' }); i -= 1; j -= b.k; }
    else if (b.op === 'merge') {
      out.push({ expected: E[i - 1], spoken: S[b.si], status: 'correct' });
      out.push({ expected: E[i - 2], spoken: S[b.si], status: 'correct' });
      i -= 2; j -= 1;
    } else break;
  }
  // Any expected words left (i>0) were never reached → missed.
  while (i > 0) { out.push({ expected: E[i - 1], spoken: null, status: 'missed' }); i -= 1; }
  out.reverse();
  return out;
}

// ── askClaude ──────────────────────────────────────────────────────────────
// Streams a response from the Claude API grounded in the current mishnah.

export async function askClaude({ question, mishnah, perek, onChunk, onDone, onError }) {
  const key = import.meta.env.VITE_CLAUDE_API_KEY;
  if (!key) {
    // Demo mode: simulate streaming so the UI can be previewed without a key.
    const demo = `Here's a preview of how Claude answers your question — character by character, just like the real thing.\n\nOnce you add VITE_CLAUDE_API_KEY to .env.local, this becomes a real answer grounded in the mishnah text and its classical commentators: Rashi, Rambam, Bartenura, and others.\n\nThe response is kept to 2–3 paragraphs, focused on your specific question rather than just restating the mishnah.`;
    let i = 0;
    const id = setInterval(() => {
      if (i < demo.length) { onChunk?.(demo[i]); i++; }
      else { clearInterval(id); onDone?.(); }
    }, 16);
    return () => clearInterval(id);
  }

  const commentaryLines = Object.entries(mishnah.commentary || {}).map(([id, text]) => {
    const c = window.COMMENTATORS?.find(x => x.id === id);
    return `${c?.name || id}: ${text}`;
  }).join('\n\n');

  const context = [
    `Mishnah ${perek.num}:${mishnah.num} — ${mishnah.attribution?.en || ''}`,
    '', `Hebrew: ${mishnah.hebrew || ''}`,
    '', `English: ${mishnah.english || ''}`,
    commentaryLines ? `\nCommentary:\n${commentaryLines}` : '',
  ].filter(Boolean).join('\n');

  const controller = new AbortController();
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      signal: controller.signal,
      method: 'POST',
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 500,
        stream: true,
        system: `You are a warm, knowledgeable teacher of Pirkei Avot (Ethics of the Fathers). Answer the student's question with depth and care, grounded in the mishnah text and its classical commentators. Keep your answer to 2-3 concise paragraphs. Write in plain English. Do not simply paraphrase the mishnah — connect it to the student's specific question and offer insight.`,
        messages: [{ role: 'user', content: `Here is the mishnah I am learning:\n\n${context}\n\nMy question: ${question}` }],
      }),
    });

    if (!res.ok) {
      onError?.(res.status === 401 ? 'bad-key' : `api-${res.status}`);
      return () => controller.abort();
    }

    const reader = res.body.getReader();
    const dec = new TextDecoder();
    const pump = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const raw = dec.decode(value, { stream: true });
        for (const line of raw.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const payload = line.slice(6).trim();
          if (payload === '[DONE]') break;
          try {
            const ev = JSON.parse(payload);
            if (ev.type === 'content_block_delta' && ev.delta?.type === 'text_delta') {
              onChunk?.(ev.delta.text);
            }
          } catch (_) {}
        }
      }
      onDone?.();
    };
    pump().catch(err => { if (err.name !== 'AbortError') onError?.('stream-error'); });
  } catch (err) {
    if (err.name !== 'AbortError') onError?.('network');
  }
  return () => controller.abort();
}
