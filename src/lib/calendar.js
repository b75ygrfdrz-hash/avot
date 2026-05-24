// Client-side iCalendar (.ics) generation — no backend required.
//
// Produces a weekly recurring event, every Friday, that reminds the
// family to open Avot and print the week's Shabbat Table sheet before
// Shabbat begins. The file imports into Apple Calendar, Google Calendar,
// Outlook, and anything else that reads RFC 5545.

// Escape a value for an iCalendar TEXT field (RFC 5545 §3.3.11).
function escapeICS(s) {
  return String(s)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

// Fold a content line to 75 octets, per RFC 5545 §3.1.
function foldLine(line) {
  if (line.length <= 75) return line;
  const out = [line.slice(0, 75)];
  let i = 75;
  while (i < line.length) {
    out.push(' ' + line.slice(i, i + 74));
    i += 74;
  }
  return out.join('\r\n');
}

const pad = (n) => String(n).padStart(2, '0');

// The next Friday on or after a given date (today by default).
function nextFriday(from = new Date()) {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  d.setDate(d.getDate() + ((5 - d.getDay() + 7) % 7)); // 5 = Friday
  return d;
}

// A floating local date-time stamp: YYYYMMDDTHHMMSS (no timezone — it
// renders at the same wall-clock time wherever the calendar is opened).
function localStamp(d) {
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
    `T${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

// A UTC stamp: YYYYMMDDTHHMMSSZ
function utcStamp(d) {
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}

// Build the full .ics document for the recurring Friday reminder.
function buildShabbatReminderICS(opts = {}) {
  const hour = opts.hour != null ? opts.hour : 10; // 10:00 local time
  const url = opts.url ||
    (location.origin + location.pathname + '#avot/shabbat');

  const start = nextFriday();
  start.setHours(hour, 0, 0, 0);
  const end = new Date(start);
  end.setMinutes(30);

  const description =
    "It's almost Shabbat. Open Avot to read this week's Shabbat Table " +
    'mishnayot and print the family discussion sheet: ' + url;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Avot//Shabbat Table//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:shabbat-table-reminder@avot.app',
    'DTSTAMP:' + utcStamp(new Date()),
    'DTSTART:' + localStamp(start),
    'DTEND:' + localStamp(end),
    'RRULE:FREQ=WEEKLY;BYDAY=FR',
    'SUMMARY:' + escapeICS('Prepare the Avot Shabbat Table sheet'),
    'DESCRIPTION:' + escapeICS(description),
    'URL:' + escapeICS(url),
    'TRANSP:TRANSPARENT',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:' + escapeICS('Print this week’s Shabbat Table sheet'),
    'TRIGGER:-PT30M',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.map(foldLine).join('\r\n');
}

// Trigger a browser download of the .ics file. Returns true on success,
// false if the browser blocked it or something went wrong.
function downloadShabbatReminder(opts) {
  try {
    const ics = buildShabbatReminderICS(opts);
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const href = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = href;
    a.download = 'avot-shabbat-reminder.ics';
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(href), 1000);
    return true;
  } catch (err) {
    console.error('Shabbat reminder download failed:', err);
    return false;
  }
}

export { buildShabbatReminderICS, downloadShabbatReminder, nextFriday };
