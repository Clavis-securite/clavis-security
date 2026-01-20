// /js/dashboard-app.js
// Dashboard APP (PWA installée sur téléphone) : UI simple, sans overlays.
// Gère uniquement : topbar app (🔍 / 🌐), vue Ajouter via le bouton ＋, et placement de la barre de recherche.

(function () {
  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  function isAppPhone() {
    return document.documentElement.classList.contains('app-phone');
  }

  const qs = (sel, root) => (root || document).querySelector(sel);

  function show(el) { if (el) el.hidden = false; }
  function hide(el) { if (el) el.hidden = true; }

  function ensureSearchRow() {
    const row = qs('#appSearchRow');
    const search = qs('#search');
    if (!row || !search) return { row, search };

    // Move search input into the app row (once)
    if (!row.contains(search)) {
      row.innerHTML = '';
      row.appendChild(search);
      search.classList.add('app-search-input');
    }

    // i18n placeholder
    try {
      if (window.clavisT) search.setAttribute('placeholder', window.clavisT('search_placeholder'));
    } catch (_) {}
    return { row, search };
  }

  ready(() => {
    if (!isAppPhone()) return;

    // Show app topbar
    const topbar = qs('.app-topbar');
    show(topbar);

    // Show FAB (+)
    const fab = qs('#btnAdd');
    if (fab) fab.style.display = 'grid';

    const { row: searchRow, search } = ensureSearchRow();

    const langRow = qs('#appLangRow');
    const langSelect = qs('#appLangSelect');

    // Toggle search
    const searchBtn = qs('#appSearchBtn');
    if (searchBtn && searchRow) {
      searchBtn.addEventListener('click', () => {
        const isHidden = searchRow.hidden === true;
        if (isHidden) {
          show(searchRow);
          hide(langRow);
          setTimeout(() => { try { search && search.focus(); } catch (_) {} }, 50);
        } else {
          hide(searchRow);
        }
      });
    }

    // Toggle language
    const langBtn = qs('#appLangBtn');
    if (langBtn && langRow) {
      langBtn.addEventListener('click', () => {
        const isHidden = langRow.hidden === true;
        if (isHidden) {
          show(langRow);
          hide(searchRow);
          setTimeout(() => { try { langSelect && langSelect.focus(); } catch (_) {} }, 50);
        } else {
          hide(langRow);
        }
      });
    }

    if (langSelect) {
      langSelect.addEventListener('change', () => {
        try { if (window.clavisSetLang) window.clavisSetLang(langSelect.value); } catch (_) {}
      });
    }

    // Add view: show the existing Add card, hide list/detail
    const addForm = qs('#addForm');
    const addCard = addForm ? addForm.closest('.card') : null;
    const list = qs('#itemsList');
    const listCard = list ? list.closest('.card') : null;
    const detail = qs('#appDetail');

    function showList() {
      if (listCard) listCard.style.display = '';
      if (addCard) addCard.style.display = 'none';
      if (detail) detail.hidden = true;
      if (list) list.hidden = false;
    }

    function showAdd() {
      if (listCard) listCard.style.display = 'none';
      if (addCard) addCard.style.display = '';
      if (detail) detail.hidden = true;
      if (list) list.hidden = true;

      // Focus first field (Nom)
      setTimeout(() => {
        try {
          const name = qs('#title');
          if (name) name.focus();
        } catch (_) {}
      }, 50);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Default to list
    showList();

    if (fab) fab.addEventListener('click', showAdd);

    // When saving, the inline script will re-render and we can go back to list.
    if (addForm) {
      addForm.addEventListener('submit', () => {
        // Let inline submit run; switch back after a short delay.
        setTimeout(() => showList(), 400);
      });
    }

    // If detail view closes, ensure list is visible (inline script toggles list/detail)
    document.addEventListener('click', (e) => {
      const back = e.target && e.target.closest && e.target.closest('[data-detail-back]');
      if (back) {
        setTimeout(() => showList(), 0);
      }
    });
  });
})();
