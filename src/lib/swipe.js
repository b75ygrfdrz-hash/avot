// Mobile gestures: swipe left/right between mishnayot
// Wires once on first reader mount

(function () {
  let touchStartX = null;
  let touchStartY = null;
  let touchStartTime = 0;
  const THRESHOLD = 60;     // min horizontal px
  const MAX_DEVIATION = 50; // max vertical px
  const MAX_TIME = 600;

  function onTouchStart(e) {
    if (e.touches.length !== 1) return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchStartTime = Date.now();
  }

  function onTouchEnd(e) {
    if (touchStartX == null) return;
    const dt = Date.now() - touchStartTime;
    if (dt > MAX_TIME) { touchStartX = null; return; }
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;
    touchStartX = null;
    if (Math.abs(dy) > MAX_DEVIATION) return;
    if (Math.abs(dx) < THRESHOLD) return;
    // Ignore swipes that begin on interactive elements (buttons, links, scrolling rails)
    if (e.target.closest('button, a, input, textarea, .text-toolbar, .selection-toolbar, .mc-pop, .panel, .picker-back, .modal-back, .menu-drawer, .mobile-sheet')) return;

    window.dispatchEvent(new CustomEvent(dx > 0 ? 'avot:swipe-right' : 'avot:swipe-left'));
  }

  document.addEventListener('touchstart', onTouchStart, { passive: true });
  document.addEventListener('touchend', onTouchEnd, { passive: true });
})();

