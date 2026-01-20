// /js/dashboard-app.js
// Dashboard APP (PWA installed on phone): simple, no overlays.
// Views:
// - List (items)
// - Add (form)
// - Detail (handled by inline script)
// Controls:
// - 🔍 toggles search
// - 🌐 toggles language selector
// - ＋ opens Add view
(function () {
  function isAppPhone() {
    return document.documentElement.classList.contains('app-phone');
  }

  const qs = (sel, root) => (root || document).querySelector(sel);

  function setHidden(el, hidden) {
    if (!el) return;
    el.hidden = !!hidden;
  }

  function init() {
    if (!isAppPhone()) return;

    const topbar = qs('.app-topbar[data-app-only]');
    const searchBtn = qs('#appSearchBtn');
    const langBtn = qs('#appLangBtn');
    const searchRow = qs('#appSearchRow');
    const langRow = qs('#appLangRow');
    const langSelect = qs('#appLangSelect');

    const addBtn = qs('#btnAdd');
    const addForm = qs('#addForm');
    const addCard = addForm ? addForm.closest('.card') : null;

    const list = qs('#itemsList');
    const listCard = list ? list.closest('.card') : null;
    const detail = qs('#appDetail'); // injected container

    // Show app topbar
    if (topbar) topbar.hidden = false;

    // Ensure + button is visible and above bottom nav
    if (addBtn) addBtn.style.display = 'grid';

    // Move the existing search input into the app search row
    const searchInput = qs('#search');
    if (searchInput && searchRow && !searchRow.contains(searchInput)) {
      searchRow.appendChild(searchInput);
      searchInput.placeholder = (window.clavisT ? window.clavisT('search_placeholder') : (searchInput.placeholder || 'Rechercher…'));
    }

    // Simplify add form: show only Name + Username + Password in app
    function simplifyAddForm() {
      const title = qs('#title');
      const username = qs('#username');
      const pwd = qs('#secretPassword');
      const url = qs('#url');
      const notes = qs('#notes');

      if (title) {
        title.required = true;
        title.placeholder = title.placeholder || 'ex : Gmail';
      }

      if (url) url.closest('.field')?.classList.add('app-hide');
      if (notes) notes.closest('.field')?.classList.add('app-hide');

      // keep fields present (no breaking), only hide in app
      if (username) username.placeholder = username.placeholder || '';
      if (pwd) pwd.placeholder = pwd.placeholder || '';
    }
    simplifyAddForm();

    function showList() {
      setHidden(searchRow, true);
      setHidden(langRow, true);
      if (detail) setHidden(detail, true);
      if (addCard) addCard.style.display = 'none';
      if (listCard) listCard.style.display = 'block';
      if (addBtn) addBtn.hidden = false;
    }

    function showAdd() {
      setHidden(searchRow, true);
      setHidden(langRow, true);
      if (detail) setHidden(detail, true);
      if (listCard) listCard.style.display = 'none';
      if (addCard) addCard.style.display = 'block';
      if (addBtn) addBtn.hidden = true;
      // focus first field
      setTimeout(() => { qs('#title')?.focus(); }, 50);
    }

    // Buttons
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        const nowOpen = !searchRow.hidden;
        setHidden(searchRow, nowOpen);
        if (!nowOpen) {
          setHidden(langRow, true);
          qs('#search')?.focus();
        }
      });
    }

    if (langBtn) {
      langBtn.addEventListener('click', () => {
        const nowOpen = !langRow.hidden;
        setHidden(langRow, nowOpen);
        if (!nowOpen) setHidden(searchRow, true);
      });
    }

    if (langSelect) {
      try { langSelect.value = localStorage.getItem('clavis_lang') || 'fr'; } catch (_) {}
      langSelect.addEventListener('change', () => {
        try { localStorage.setItem('clavis_lang', langSelect.value); } catch (_) {}
        if (window.clavisSetLang) window.clavisSetLang(langSelect.value);
      });
    }

    if (addBtn) addBtn.addEventListener('click', showAdd);

    // When add form submits successfully, inline script already refreshes list.
    // We return to list on submit (safe).
    if (addForm) {
      addForm.addEventListener('submit', () => {
        setTimeout(showList, 250);
      });
    }

    // If user taps "Compte" tab, login page handles account screen in app.
    // Start on list.
    showList();

    // If user changed language elsewhere, keep select in sync
    window.addEventListener('clavis:lang', () => {
      try {
        const lang = localStorage.getItem('clavis_lang') || 'fr';
        if (langSelect && langSelect.value !== lang) langSelect.value = lang;
        if (searchInput) searchInput.placeholder = (window.clavisT ? window.clavisT('search_placeholder') : searchInput.placeholder);
      } catch (_) {}
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
