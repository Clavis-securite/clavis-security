// /js/i18n.js
// Language UI (FR/EN/ES/IT) - no technical words.

(function () {
  const STORE_KEY = 'clavis_lang';

  const STRINGS = {
    fr: {
      language: 'Langue',
      nav_vault: 'Coffre',
      nav_offers: 'Offres',
      nav_account: 'Compte',
      vault_title: 'Coffre',
      add_title: 'Ajouter',
      add_note: "Renseigne juste l'identifiant et le mot de passe.",
      search_ph: 'Rechercher...',
      identifier: 'Identifiant',
      password: 'Mot de passe'
    },
    en: {
      language: 'Language',
      nav_vault: 'Vault',
      nav_offers: 'Plans',
      nav_account: 'Account',
      vault_title: 'Vault',
      add_title: 'Add',
      add_note: 'Just enter the username and password.',
      search_ph: 'Search...',
      identifier: 'Username',
      password: 'Password'
    },
    es: {
      language: 'Idioma',
      nav_vault: 'Caja',
      nav_offers: 'Planes',
      nav_account: 'Cuenta',
      vault_title: 'Caja',
      add_title: 'Anadir',
      add_note: 'Solo introduce el usuario y la contrasena.',
      search_ph: 'Buscar...',
      identifier: 'Usuario',
      password: 'Contrasena'
    },
    it: {
      language: 'Lingua',
      nav_vault: 'Cofano',
      nav_offers: 'Piani',
      nav_account: 'Account',
      vault_title: 'Cofano',
      add_title: 'Aggiungi',
      add_note: 'Inserisci solo nome utente e password.',
      search_ph: 'Cerca...',
      identifier: 'Nome utente',
      password: 'Password'
    }
  };

  function getLang() {
    try {
      const v = localStorage.getItem(STORE_KEY);
      return STRINGS[v] ? v : 'fr';
    } catch (_) {
      return 'fr';
    }
  }

  function setLang(lang) {
    if (!STRINGS[lang]) lang = 'fr';
    try { localStorage.setItem(STORE_KEY, lang); } catch (_) {}
    applyLang(lang);
    try {
      window.dispatchEvent(new CustomEvent('clavis:lang', { detail: { lang } }));
    } catch (_) {}
  }

  function tr(lang, key) {
    return (STRINGS[lang] && STRINGS[lang][key]) || (STRINGS.fr[key] || key);
  }

  function applyLang(lang) {
    document.documentElement.lang = lang;

    // Text nodes
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const k = el.getAttribute('data-i18n');
      if (!k) return;
      el.textContent = tr(lang, k);
    });

    // Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const k = el.getAttribute('data-i18n-placeholder');
      if (!k) return;
      el.setAttribute('placeholder', tr(lang, k));
    });
  }

  function injectWebLangMenu() {
    // Optional web menu in topbar (same on desktop and mobile browser)
    const actions = document.querySelector('.cs-topbar .cs-actions');
    if (!actions) return;
    if (actions.querySelector('#webLangSelect')) return;

    const wrap = document.createElement('div');
    wrap.className = 'cs-lang-wrap';
    wrap.innerHTML = `
      <label class="cs-lang-label" for="webLangSelect">${tr(getLang(), 'language')}</label>
      <select id="webLangSelect" class="cs-lang-select" aria-label="${tr(getLang(), 'language')}">
        <option value="fr">FR</option>
        <option value="en">EN</option>
        <option value="es">ES</option>
        <option value="it">IT</option>
      </select>
    `;

    actions.insertBefore(wrap, actions.firstChild);

    const sel = wrap.querySelector('#webLangSelect');
    sel.value = getLang();
    sel.addEventListener('change', () => setLang(sel.value));
  }

  function init() {
    injectWebLangMenu();
    applyLang(getLang());

    window.addEventListener('clavis:lang', (e) => {
      const lang = e && e.detail && e.detail.lang ? e.detail.lang : getLang();
      applyLang(lang);
      const webSel = document.getElementById('webLangSelect');
      if (webSel && webSel.value !== lang) webSel.value = lang;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
