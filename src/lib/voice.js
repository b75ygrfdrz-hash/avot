// voice.js — thin Web Speech API wrapper
// Usage:
//   const rec = createVoiceRecognition({ onInterim, onFinal, onError, onEnd });
//   rec.start(); / rec.stop();

export function createVoiceRecognition({ onInterim, onFinal, onError, onEnd } = {}) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    return { supported: false, start: () => {}, stop: () => {} };
  }

  const r = new SR();
  r.continuous = false;
  r.interimResults = true;
  r.lang = 'en-US';
  r.maxAlternatives = 1;

  r.onresult = (e) => {
    let interim = '';
    let final = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) {
        final += e.results[i][0].transcript;
      } else {
        interim += e.results[i][0].transcript;
      }
    }
    if (interim) onInterim?.(interim);
    if (final) onFinal?.(final.trim());
  };

  r.onerror = (e) => onError?.(e.error);
  r.onend = () => onEnd?.();

  return {
    supported: true,
    start() { try { r.start(); } catch (_) {} },
    stop()  { try { r.stop();  } catch (_) {} },
  };
}

// askClaude — streams a response from the Claude API.
// Returns a cleanup function. Calls onChunk(text) as tokens arrive,
// onDone() when finished, onError(msg) on failure.
export async function askClaude({ question, mishnah, perek, onChunk, onDone, onError }) {
  const key = import.meta.env.VITE_CLAUDE_API_KEY;
  if (!key) {
    // Demo mode: simulate a streaming response so the UI can be previewed
    // without a real API key. Replace this with a real key in .env.local.
    const demo = `Here's a preview of how Claude answers your question — character by character, just like the real thing.\n\nOnce you add VITE_CLAUDE_API_KEY to .env.local, this becomes a real answer grounded in the mishnah text and its classical commentators: Rashi, Rambam, Bartenura, and others.\n\nThe response is kept to 2–3 paragraphs, focused on your specific question rather than just restating the mishnah.`;
    let i = 0;
    const id = setInterval(() => {
      if (i < demo.length) {
        onChunk?.(demo[i]);
        i++;
      } else {
        clearInterval(id);
        onDone?.();
      }
    }, 16);
    return () => clearInterval(id);
  }

  // Build the context block from the current mishnah
  const commentaryLines = Object.entries(mishnah.commentary || {}).map(([id, text]) => {
    const c = window.COMMENTATORS?.find(x => x.id === id);
    return `${c?.name || id}: ${text}`;
  }).join('\n\n');

  const context = [
    `Mishnah ${perek.num}:${mishnah.num} — ${mishnah.attribution?.en || ''}`,
    '',
    `Hebrew: ${mishnah.hebrew || ''}`,
    '',
    `English: ${mishnah.english || ''}`,
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
        system: `You are a warm, knowledgeable teacher of Pirkei Avot (Ethics of the Fathers). \
Answer the student's question with depth and care, grounded in the mishnah text and its classical commentators. \
Keep your answer to 2-3 concise paragraphs. Write in plain English. Do not simply paraphrase the mishnah — \
connect it to the student's specific question and offer insight.`,
        messages: [
          {
            role: 'user',
            content: `Here is the mishnah I am learning:\n\n${context}\n\nMy question: ${question}`,
          },
        ],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
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

    pump().catch(err => {
      if (err.name !== 'AbortError') onError?.('stream-error');
    });

  } catch (err) {
    if (err.name !== 'AbortError') onError?.('network');
  }

  return () => controller.abort();
}
