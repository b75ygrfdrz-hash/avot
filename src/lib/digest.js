// Friday-digest email signup.
//
// UI-only for now. The signup form in the Shabbat Table section is fully
// built, but the actual sending is not wired up yet. Until DIGEST_ENDPOINT
// is set, a valid submission resolves as { ok: false, reason: 'not-configured' }
// and the form treats that as a successful demo signup, so the finished
// interaction can be seen and clicked through.
//
// To make it real later, set DIGEST_ENDPOINT to either:
//   - a newsletter provider that accepts a JSON { email } POST and allows
//     cross-origin requests (e.g. Kit / ConvertKit), or
//   - your own serverless function (Vercel, Cloudflare, Netlify) that
//     forwards to Buttondown, Mailchimp, Resend, etc.
//
// The endpoint receives JSON { email, source, url } and owns the rest:
// the confirmation email, storage, the weekly Friday send, and unsubscribe.

const DIGEST_ENDPOINT = '';

function hasEndpoint() {
  return typeof DIGEST_ENDPOINT === 'string' && DIGEST_ENDPOINT.length > 0;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

// Submit one email address. Resolves to { ok, reason? }:
//   reason 'invalid'        — the address did not look like an email
//   reason 'not-configured' — no DIGEST_ENDPOINT is set yet (UI-only mode)
//   reason 'server'         — the endpoint responded with an error
//   reason 'network'        — the request could not be made
async function submitDigestSignup(email) {
  const clean = String(email || '').trim();
  if (!isValidEmail(clean)) return { ok: false, reason: 'invalid' };
  if (!hasEndpoint()) return { ok: false, reason: 'not-configured' };

  try {
    const res = await fetch(DIGEST_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: clean,
        source: 'avot-shabbat-table',
        url: location.origin + location.pathname + '#avot/shabbat',
      }),
    });
    if (!res.ok) return { ok: false, reason: 'server' };
    return { ok: true };
  } catch (err) {
    console.error('Digest signup failed:', err);
    return { ok: false, reason: 'network' };
  }
}

export { submitDigestSignup, isValidEmail };
