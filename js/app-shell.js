// /js/app-shell.js
// UI shell for "app mode" (PWA installed / standalone).
// ⚠️ v3.1: bottom navigation disabled on mobile (replaced by Premium CTA on dashboard).

(function () {
  function isAppMode() {
    return document.documentElement.classList.contains('app-mode');
  }

  document.addEventListener('DOMContentLoaded', () => {
    const bottom = document.querySelector('.app-bottom');
    if (bottom) {
      // Always hide bottom bar (mobile/iPhone request)
      bottom.style.display = 'none';
    }

    // Optional: show FAB if present on page (dashboard only) in app mode.
    if (isAppMode()) {
      const fab = document.getElementById('btnAdd');
      if (fab) fab.style.display = 'grid';
    }
  });
})();
