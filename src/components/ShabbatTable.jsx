import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Icon } from './Icon.jsx';
import { DISCUSSION, BARTENURA, CHIEF_RABBI, SHABBAT_WEEKS } from '../data/discussion.js';
import { downloadShabbatReminder, nextFriday } from '../lib/calendar.js';
import { submitDigestSignup } from '../lib/digest.js';

// The Shabbat Table — a curated set of mishnayot with family discussion
// questions, designed to be read aloud at the Shabbat table and printed
// beforehand. Full-screen routed view, like the Chain of Mesorah.

// Which curated set belongs to the week of a given Friday.
function weekIndexFor(friday) {
  const jan1 = new Date(friday.getFullYear(), 0, 1);
  const doy = Math.floor((friday - jan1) / 86400000);
  return Math.floor(doy / 7) % SHABBAT_WEEKS.length;
}

const ShabbatTable = ({ data, onClose, onJump }) => {
  const friday = useMemo(() => nextFriday(), []);
  const week = SHABBAT_WEEKS[weekIndexFor(friday)];
  const dateLabel = friday.toLocaleDateString(undefined, {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  // Calendar-download confirmation toast.
  const [toast, setToast] = useState(null); // 'ok' | 'err' | null
  const toastTimer = useRef(null);
  useEffect(() => () => clearTimeout(toastTimer.current), []);
  const addReminder = () => {
    const ok = downloadShabbatReminder();
    setToast(ok ? 'ok' : 'err');
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 9000);
  };

  // Friday-digest email signup. The form is UI-only for now: until a
  // provider endpoint is wired up in lib/digest.js, a valid submission
  // resolves as 'not-configured', which we treat as a successful demo
  // signup so the finished interaction can be seen.
  const [email, setEmail] = useState('');
  const [digestState, setDigestState] = useState('idle'); // idle|submitting|done|error
  const [digestMsg, setDigestMsg] = useState('');
  const onDigestSubmit = async (e) => {
    e.preventDefault();
    if (digestState === 'submitting') return;
    setDigestState('submitting');
    const res = await submitDigestSignup(email);
    if (res.ok || res.reason === 'not-configured') {
      setDigestState('done');
      return;
    }
    setDigestState('error');
    setDigestMsg(
      res.reason === 'invalid'
        ? 'Please enter a valid email address.'
        : 'Something went wrong. Please try again in a moment.'
    );
  };

  // Resolve each reference to its mishnah and discussion questions.
  const items = useMemo(() => (
    week.refs
      .map(([p, m]) => {
        const perek = data.perakim.find(x => x.num === p);
        const mishnah = perek && perek.mishnayot.find(x => x.num === m);
        return { p, m, mishnah, questions: DISCUSSION[`${p}.${m}`] || [] };
      })
      .filter(it => it.mishnah)
  ), [week, data]);

  return (
    <div className="shabbat">
      <div className="shabbat-bar">
        <div>
          <div className="shabbat-bar-eyebrow">The Shabbat Table</div>
          <div className="shabbat-bar-title">{week.theme}</div>
        </div>
        <div className="shabbat-bar-actions">
          <button className="shabbat-act" onClick={addReminder}>
            <Icon name="bell" size={14} />
            Add the Friday reminder
          </button>
          <button className="shabbat-act shabbat-act-primary" onClick={() => window.print()}>
            <Icon name="print" size={14} />
            Print this sheet
          </button>
          <button className="shabbat-close" onClick={onClose} aria-label="Close">
            <Icon name="close" size={18} />
          </button>
        </div>
      </div>

      <div className="shabbat-scroll">
        <div className="shabbat-hero">
          <img
            className="shabbat-hero-img"
            src="/shabbos-project.png"
            alt="The Shabbos Project — Keeping It Together"
          />
          <div className="shabbat-hero-tag">#TheShabbosProject</div>
        </div>

        <div className="shabbat-sheet">
          <header className="shabbat-sheet-head">
            <div className="shabbat-sheet-brand">
              <div className="shabbat-sheet-brand-he">אבות</div>
              <div className="shabbat-sheet-brand-en">The Shabbat Table</div>
            </div>
            <div className="shabbat-sheet-date">For Shabbat of {dateLabel}</div>
          </header>

          <div className="shabbat-sheet-theme">
            <div className="shabbat-sheet-theme-label">This week</div>
            <div className="shabbat-sheet-theme-title">{week.theme}</div>
            <div className="shabbat-sheet-theme-blurb">{week.blurb}</div>
          </div>

          <div className="shabbat-mishnah-grid">
          {items.map(it => {
            const key = `${it.p}.${it.m}`;
            const bartenura = BARTENURA[key];
            const chiefRabbi = CHIEF_RABBI[key];
            return (
              <section className="shabbat-mishnah" key={key}>
                <div className="shabbat-mishnah-head">
                  <button
                    className="shabbat-ref"
                    onClick={() => onJump && onJump(it.p, it.m)}
                    title="Open in the reader"
                  >
                    Avot {it.p}:{it.m}
                  </button>
                  <div className="shabbat-attr">
                    <span className="shabbat-attr-he">{it.mishnah.attribution.he}</span>
                    <span className="shabbat-attr-en">{it.mishnah.attribution.en}</span>
                  </div>
                </div>

                <div className="shabbat-he" dir="rtl">{it.mishnah.hebrew}</div>
                <div className="shabbat-en">{it.mishnah.english}</div>

                {bartenura && (
                  <div className="shabbat-bartenura">
                    <div className="shabbat-bartenura-label">
                      <span className="shabbat-bartenura-icon" aria-hidden="true">📜</span>
                      Bartenura
                    </div>
                    <p className="shabbat-bartenura-text">{bartenura}</p>
                  </div>
                )}

                {chiefRabbi && (
                  <div className="shabbat-chief-rabbi">
                    <div className="shabbat-chief-rabbi-label">
                      Chief Rabbi Goldstein
                    </div>
                    <p className="shabbat-chief-rabbi-text">{chiefRabbi}</p>
                  </div>
                )}

                {it.questions.length > 0 && (
                  <div className="shabbat-questions">
                    <div className="shabbat-questions-label">At the table</div>
                    <ol className="shabbat-questions-list">
                      {it.questions.map((q, qi) => <li key={qi}>{q}</li>)}
                    </ol>
                  </div>
                )}
              </section>
            );
          })}
          </div>

          <footer className="shabbat-sheet-foot">
            <span>Avot · The Shabbat Table</span>
            <span className="shabbat-sheet-foot-he">שבת שלום</span>
          </footer>
        </div>

        <div className="shabbat-digest">
          {digestState === 'done' ? (
            <div className="shabbat-digest-done">
              <span className="shabbat-digest-check">
                <Icon name="check" size={18} />
              </span>
              <div>
                <div className="shabbat-digest-title">You're on the list.</div>
                <div className="shabbat-digest-sub">
                  Watch for a short note this Friday with the week's sheet.
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="shabbat-digest-head">
                <span className="shabbat-digest-icon">
                  <Icon name="mail" size={16} />
                </span>
                <div>
                  <div className="shabbat-digest-title">Get the Friday digest</div>
                  <div className="shabbat-digest-sub">
                    A short note every Friday with a link to that week's
                    Shabbat Table sheet.
                  </div>
                </div>
              </div>
              <form className="shabbat-digest-form" onSubmit={onDigestSubmit}>
                <input
                  type="email"
                  className="shabbat-digest-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (digestState === 'error') setDigestState('idle');
                  }}
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  className="shabbat-digest-btn"
                  disabled={digestState === 'submitting'}
                >
                  {digestState === 'submitting' ? 'Signing up…' : 'Sign me up'}
                </button>
              </form>
              {digestState === 'error' && (
                <div className="shabbat-digest-err">{digestMsg}</div>
              )}
            </>
          )}
        </div>
      </div>

      {toast && (
        <div className={`shabbat-toast ${toast === 'err' ? 'is-err' : ''}`} role="status">
          <span className="shabbat-toast-icon">
            <Icon name={toast === 'err' ? 'info' : 'check'} size={15} />
          </span>
          <div className="shabbat-toast-text">
            {toast === 'ok' ? (
              <>
                <strong>Calendar file downloaded.</strong>
                <span>
                  Open <code>avot-shabbat-reminder.ics</code> from your
                  downloads to add a repeating Friday reminder to your calendar.
                </span>
              </>
            ) : (
              <>
                <strong>The download was blocked.</strong>
                <span>
                  Your browser stopped the file. Allow downloads for this site,
                  then try again.
                </span>
              </>
            )}
          </div>
          <button
            className="shabbat-toast-x"
            onClick={() => setToast(null)}
            aria-label="Dismiss"
          >
            <Icon name="close" size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export { ShabbatTable };
