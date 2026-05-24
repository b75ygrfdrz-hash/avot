# Avot — Pirkei Avot reader

Single-page React app for learning Pirkei Avot (Ethics of the Fathers):
Hebrew/English text, classical commentary, a Kids mode, search, and a
mock Admin/CMS. Originally built as one 11.5k-line HTML file, then
migrated to a Vite + React project.

## Running it

- Node lives at `~/.local/node` (local install, no sudo). New terminal
  windows have it on PATH; older ones need `source ~/.zshrc` first.
- `npm run dev` starts the dev server on http://localhost:5173
- `npm run build` produces a production build
- `npm install` if `node_modules` is missing

## Stack and conventions

- Vite 5 + React 18.3, plain JSX (no TypeScript).
- Components are feature-grouped in `src/components/` (~15 files), not
  one file per component.
- Styling is one global stylesheet: `src/styles/index.css` (~6.5k
  lines, a real design-token system). No CSS modules.
- `src/data/pirkeiAvot.js` sets `window.PIRKEI_AVOT` and
  `window.COMMENTATORS`. `src/lib/{routes,swipe,motion}.js` attach
  `window.AvotRoutes` and friends. These run as side-effect imports in
  `src/main.jsx` before `<App>` mounts.
- Each component file carries a generated hook-alias header
  (`const useS = useState, ...`), a leftover of the migration from the
  original concatenated-script file. Harmless, leave it.
- Entry point: `main.jsx` renders `<ErrorBoundary><App/></ErrorBoundary>`.
- **Mobile responsiveness is non-negotiable.** Every component, every
  new feature, every CSS rule must work at 320px width on up. Test
  layouts at 360, 414, 768, and desktop before considering them done.
  Use the existing breakpoints in `src/styles/index.css` (search for
  `@media`). Avoid fixed pixel widths on containers, prefer flex/grid
  with min-width:0 on flex children, and verify long Hebrew strings
  and side panels collapse cleanly on narrow viewports.

## State of the app

Migrated, crash-proofed, and the known real bugs are fixed. Done so far:

- Vite migration (faithful 1:1 split of the original single file).
- UI refinements: onboarding cards advance on click; the top mesorah
  bar was replaced with a per-rabbi info popover; smooth dark-mode
  transition; reader toolbar layout options grouped as a segmented
  control.
- Crash fixes: an error boundary; empty or missing chapters render an
  `EmptyChapter` state instead of white-screening; reader nav and swipe
  skip empty chapters; stale localStorage indices are clamped.
- Removed the unused, non-functional Chevruta AI panel.
- Fixed the highlight text-offset bug (highlights used to land on the
  first matching word instead of the selected one).

## What is next: content

The biggest gap is content, not code. Only Perek 1 has real data;
mishnayot 1:4 to 1:18 are stubs (text only), and perakim 2 to 6 are
empty (they no longer crash, they show the EmptyChapter state).

Pirkei Avot has 6 chapters and ~70 mishnayot. To fill them:

- Hebrew text is public domain and can be added directly and verifiably.
- Do NOT AI-fabricate English translations, commentary attributed to
  Rashi/Rambam/etc., kids stories, or quizzes. Those need a real
  source. Sefaria's open API (sefaria.org) is the obvious option and
  also fits the eventual CMS goal.
- Data shape: see `src/data/pirkeiAvot.js`. Each mishnah has `num`,
  `attribution`, `hebrew`, `english`, `words[]`, `commentary{}`,
  `crossRefs[]`, `videos[]`, `themes[]`, `kidsStory`, `kidsQuestion`.

## Known minor issues (not yet addressed)

- The JS bundle is ~6.8MB because the Kids illustrations are embedded
  as base64 in `src/components/illustrations.jsx`. Extracting them to
  real image assets would slim it down a lot.
- HMR logs "Failed to reload" for `Reader.jsx` and `RightPanel.jsx`.
  This is a React Fast Refresh limitation (those files export helper
  functions alongside components). Cosmetic, a full reload always works.
- `npm install` reports 2 moderate advisories in Vite's dev-only deps.
- The Admin/CMS panel is a visual mock with no persistence.
- Minor dead code and accessibility gaps remain.

## Git

Branch `main`. Clean history: migration, UI refinements, crash fixes,
highlight fix. The original single-file prototype is untouched in the
user's Downloads folder.
