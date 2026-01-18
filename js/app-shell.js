// /js/app-shell.js
// UI shell for "app mode" (PWA installed / standalone): bottom navigation + optional FAB.
// Safe: does nothing on desktop web mode.

(function () {
  function isAppMode() {
    return document.documentElement.classList.contains('app-mode');
  }

  function currentPath() {
    try {
      return (new URL(window.location.href)).pathname || '/';
    } catch (_) {
      return window.location.pathname || '/';
    }
  }

  function normalize(p) {
    if (!p) return '/';
    // Netlify serves / as /index.html, we normalise for active tab.
    if (p === '/index.html') return '/';
    return p;
  }

  function setActiveTab(navEl) {
    const p = normalize(currentPath());
    navEl.querySelectorAll('.app-tab').forEach((a) => a.classList.remove('active'));

    const match = navEl.querySelector(`.app-tab[data-path="${p}"]`)
      || navEl.querySelector(`.app-tab[data-path="${normalize(p)}"]`);

    if (match) match.classList.add('active');
  }

  document.addEventListener('DOMContentLoaded', () => {
    const bottom = document.querySelector('.app-bottom');
    if (!bottom) return;

    if (!isAppMode()) {
      bottom.style.display = 'none';
      return;
    }

    bottom.style.display = 'block';
    setActiveTab(bottom);

    // Optional: show FAB if present on page (dashboard only).
    const fab = document.getElementById('btnAdd');
    if (fab) fab.style.display = 'grid';
  });
})();
