// /js/dashboard-app.js
// Dashboard "APP" (PWA installee sur telephone) : UX simple, pratique, sans superposition.
// - Bouton + : ouvre une vue "Ajouter" (pas de modal)
// - Loupe : affiche/masque la recherche
// - Ajout ultra simple : Identifiant + Mot de passe
// - Reutilise le formulaire existant (ne casse rien)

(function () {
  function isAppPhone() {
    return document.documentElement.classList.contains('app-phone');
  }

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function setHidden(el, hidden) {
    if (!el) return;
    el.hidden = !!hidden;
  }

  function init() {
    if (!isAppPhone()) return;
    if (!document.body || document.body.getAttribute('data-page') !== 'dashboard') return;

    const main = qs('main');
    const container = qs('main .container');
    if (!main || !container) return;

    const fab = document.getElementById('btnAdd');
    const searchInput = document.getElementById('search');
    const addForm = document.getElementById('addForm');
    const addCard = addForm ? addForm.closest('.card') : null;

    const titleInput = document.getElementById('title');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('secretPassword');
    const urlInput = document.getElementById('url');
    const notesInput = document.getElementById('notes');

    // Elements list side
    const listCard = document.getElementById('itemsList') ? document.getElementById('itemsList').closest('.card') : null;
    const grid2Blocks = Array.from(container.querySelectorAll('.grid2'));

    // --- Build App Header (no overlay) ---
    let appHeader = document.getElementById('appDashHeader');
    if (!appHeader) {
      appHeader = document.createElement('header');
      appHeader.id = 'appDashHeader';
      appHeader.className = 'app-dash-header';
      appHeader.innerHTML = `
        <div class="app-dash-bar">
          <div class="app-dash-title" data-i18n="vault_title">Coffre</div>
          <div class="app-dash-actions">
            <button type="button" class="app-icon-btn" id="appSearchBtn" aria-label="Rechercher">\uD83D\uDD0D</button>
            <button type="button" class="app-icon-btn" id="appLangBtn" aria-label="Langue">\uD83C\uDF10</button>
          </div>
        </div>
        <div class="app-dash-row" id="appSearchRow" hidden>
          <input id="appSearchClone" class="app-search" type="text" placeholder="Rechercher..." data-i18n-placeholder="search_ph" />
        </div>
        <div class="app-dash-row" id="appLangRow" hidden>
          <label class="app-lang-label" data-i18n="language">Langue</label>
          <select id="appLangSelect" class="app-lang-select" aria-label="Langue">
            <option value="fr">Francais</option>
            <option value="en">English</option>
            <option value="es">Espanol</option>
            <option value="it">Italiano</option>
          </select>
        </div>
      `;
      document.body.insertBefore(appHeader, document.body.firstChild);
    }

    // --- Screens: LIST and ADD (no sheet/modal) ---
    let screenList = document.getElementById('appScreenList');
    let screenAdd = document.getElementById('appScreenAdd');

    if (!screenList) {
      screenList = document.createElement('section');
      screenList.id = 'appScreenList';
      screenList.className = 'app-screen';
      // Move existing content blocks (vault controls, search card, list card) into list screen
      // We keep original nodes to preserve all existing event listeners on buttons.
      grid2Blocks.forEach((g) => screenList.appendChild(g));
      container.appendChild(screenList);
    }

    if (!screenAdd) {
      screenAdd = document.createElement('section');
      screenAdd.id = 'appScreenAdd';
      screenAdd.className = 'app-screen';
      screenAdd.hidden = true;

      const head = document.createElement('div');
      head.className = 'app-add-head';
      head.innerHTML = `
        <button type="button" class="app-back" id="appAddBack" aria-label="Retour">\u2190</button>
        <div class="app-add-title" data-i18n="add_title">Ajouter</div>
      `;

      screenAdd.appendChild(head);

      if (addCard) {
        // Move the existing addCard into add screen
        screenAdd.appendChild(addCard);
      }

      // Add a small helper note
      const note = document.createElement('p');
      note.className = 'app-add-note';
      note.setAttribute('data-i18n', 'add_note');
      note.textContent = "Renseigne juste l'identifiant et le mot de passe.";
      screenAdd.insertBefore(note, addCard);

      container.appendChild(screenAdd);
    }

    function showAdd() {
      screenList.hidden = true;
      screenAdd.hidden = false;
      // Force the form to be simple
      simplifyAddForm();
      // Focus identifier
      setTimeout(() => usernameInput && usernameInput.focus(), 50);
    }

    function showList() {
      screenAdd.hidden = true;
      screenList.hidden = false;
      // Close rows
      setHidden(qs('#appLangRow'), true);
      setHidden(qs('#appSearchRow'), true);
    }

    // + button
    if (fab) {
      fab.style.display = 'grid';
      fab.addEventListener('click', (e) => {
        e.preventDefault();
        showAdd();
      });
    }

    // Back in add screen
    const backBtn = document.getElementById('appAddBack');
    if (backBtn) {
      backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showList();
      });
    }

    // When saved, go back to list (does not change logic)
    if (addForm) {
      addForm.addEventListener('submit', () => {
        setTimeout(() => {
          showList();
        }, 250);
      });
    }

    // --- Search: clone input in header, keep original id=search for existing logic ---
    const searchBtn = document.getElementById('appSearchBtn');
    const searchRow = document.getElementById('appSearchRow');
    const searchClone = document.getElementById('appSearchClone');

    if (searchInput && searchClone) {
      // Keep values in sync both ways
      const sync = (from, to) => {
        to.value = from.value;
        // Trigger input on the original field so existing filtering runs
        if (to === searchInput) {
          try { searchInput.dispatchEvent(new Event('input', { bubbles: true })); } catch (_) {}
        }
      };

      searchClone.value = searchInput.value || '';
      searchInput.style.display = 'none'; // avoid double field

      searchClone.addEventListener('input', () => {
        searchInput.value = searchClone.value;
        try { searchInput.dispatchEvent(new Event('input', { bubbles: true })); } catch (_) {}
      });

      searchInput.addEventListener('input', () => {
        if (searchClone.value !== searchInput.value) searchClone.value = searchInput.value;
      });
    }

    if (searchBtn && searchRow) {
      searchBtn.addEventListener('click', () => {
        const open = !searchRow.hidden;
        setHidden(searchRow, open);
        if (!open) {
          setHidden(qs('#appLangRow'), true);
          setTimeout(() => searchClone && searchClone.focus(), 50);
        }
      });
    }

    // --- Language row ---
    const langBtn = document.getElementById('appLangBtn');
    const langRow = document.getElementById('appLangRow');
    const langSelect = document.getElementById('appLangSelect');

    if (langSelect) {
      try {
        langSelect.value = localStorage.getItem('clavis_lang') || 'fr';
      } catch (_) {}
    }

    if (langBtn && langRow) {
      langBtn.addEventListener('click', () => {
        const open = !langRow.hidden;
        setHidden(langRow, open);
        if (!open) setHidden(qs('#appSearchRow'), true);
      });
    }

    if (langSelect) {
      langSelect.addEventListener('change', () => {
        try { localStorage.setItem('clavis_lang', langSelect.value); } catch (_) {}
        try { window.dispatchEvent(new CustomEvent('clavis:lang', { detail: { lang: langSelect.value } })); } catch (_) {}
      });
    }

    // --- Simplify add form: keep only identifier + password visible ---
    function simplifyAddForm() {
      if (!addForm) return;

      // Title: keep required but auto-fill to something useful
      if (titleInput) {
        titleInput.required = false;
        titleInput.value = titleInput.value || (usernameInput && usernameInput.value ? usernameInput.value : 'Compte');
      }

      // Hide title field row (but keep input in DOM)
      const titleField = titleInput ? titleInput.closest('.field') : null;
      if (titleField) titleField.style.display = 'none';

      // Hide URL and Notes fields
      const urlField = urlInput ? urlInput.closest('.field') : null;
      if (urlField) urlField.style.display = 'none';
      const notesField = notesInput ? notesInput.closest('.field') : null;
      if (notesField) notesField.style.display = 'none';

      // Relabel visible fields (no jargon)
      const uLabel = usernameInput ? addForm.querySelector('label[for="username"]') : null;
      if (uLabel) uLabel.textContent = 'Identifiant';
      const pLabel = passwordInput ? addForm.querySelector('label[for="secretPassword"]') : null;
      if (pLabel) pLabel.textContent = 'Mot de passe';

      // Make sure inputs are password type
      if (passwordInput && passwordInput.type !== 'password') passwordInput.type = 'password';

      // When user types, keep title in sync (so list/search has a name)
      if (usernameInput && titleInput) {
        usernameInput.addEventListener('input', () => {
          if (!titleInput.value || titleInput.value === 'Compte') {
            titleInput.value = usernameInput.value || 'Compte';
          }
        }, { once: true });
      }

      // Ensure submit button is full width
      const submit = addForm.querySelector('button[type="submit"]');
      if (submit) submit.classList.add('app-primary');
    }

    // Ensure we start on list screen
    showList();

    // Make sure list card is not pushed off screen
    if (listCard) {
      listCard.style.width = '100%';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
