// Motion overhaul — cursor spotlight, scroll-linked effects, page-load choreography

(function () {
  // Clear any old accent picker selection — accent is now fixed
  document.documentElement.removeAttribute('data-accent');
  try { localStorage.removeItem('avot.accent.v1'); } catch (e) {}

  // --- Cursor spotlight on the reader ---
  // Updates --mx / --my CSS vars on .reader as the user moves
  let raf = null;
  const onMove = (e) => {
    const r = e.currentTarget;
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const rect = r.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      r.style.setProperty('--mx', x + '%');
      r.style.setProperty('--my', y + '%');
    });
  };

  // Wire up via MutationObserver since reader mounts after React boots
  const wire = () => {
    document.querySelectorAll('.reader:not([data-cursor-wired])').forEach(el => {
      el.dataset.cursorWired = '1';
      el.addEventListener('mousemove', onMove, {passive: true});
      el.addEventListener('mouseleave', () => {
        el.style.removeProperty('--mx');
        el.style.removeProperty('--my');
      }, {passive: true});
    });
  };

  const observer = new MutationObserver(wire);
  observer.observe(document.body, {childList: true, subtree: true});
  document.addEventListener('DOMContentLoaded', wire);

  // --- View Transitions API for mishnah nav (where supported) ---
  // Apps that want page-style transitions can call window.navTransition(fn)
  window.navTransition = (fn) => {
    if (document.startViewTransition) {
      document.startViewTransition(fn);
    } else {
      fn();
    }
  };

  // --- Subtle press feedback: emit a ripple on button mousedown ---
  // No DOM mutation; uses a CSS attribute for "pressed" state via transform
  // (handled in CSS — we just need to add will-change on heavy elements)
})();

