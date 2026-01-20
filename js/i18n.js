// /js/i18n.js
// Language UI (FR/EN/ES/IT) - no technical words.

(function () {
  const STORE_KEY = 'clavis_lang';

  const STRINGS = {
    fr: {
      page_login_title: 'Connexion — Clavis-security',
      page_register_title: 'Créer mon coffre — Clavis-security',
      language: 'Langue',
      nav_vault: 'Coffre',
      nav_offers: 'Offres',
      nav_account: 'Compte',
      vault_title: 'Coffre',
      add_title: 'Ajouter',
      add_note: "Renseigne le nom, l'identifiant et le mot de passe.",
      search_ph: 'Rechercher...',
      identifier: 'Identifiant',
      password: 'Mot de passe',
      name: 'Nom',
      btn_save: 'Enregistrer',
      btn_back: 'Retour',
      page_account_title: 'Compte — Clavis-security',
      account_heading: 'Votre compte',
      account_text: 'Gérez votre langue et déconnectez-vous en un geste.',
      btn_logout: 'Déconnexion',
      btn_back_vault: 'Retour au coffre',
      login_title: 'Connexion',
      register_title: 'Créer un compte',
      btn_login: 'Se connecter',
      btn_create_account: 'Créer un compte',
      email: 'Email'
    },
    en: {
      page_login_title: 'Sign in — Clavis-security',
      page_register_title: 'Create account — Clavis-security',
      language: 'Language',
      nav_vault: 'Vault',
      nav_offers: 'Plans',
      nav_account: 'Account',
      vault_title: 'Vault',
      add_title: 'Add',
      add_note: 'Enter the name, username and password.',
      search_ph: 'Search...',
      identifier: 'Username',
      password: 'Password',
      name: 'Name',
      btn_save: 'Save',
      btn_back: 'Back',
      page_account_title: 'Account — Clavis-security',
      account_heading: 'Your account',
      account_text: 'Change your language and sign out anytime.',
      btn_logout: 'Sign out',
      btn_back_vault: 'Back to vault',
      login_title: 'Sign in',
      register_title: 'Create an account',
      btn_login: 'Sign in',
      btn_create_account: 'Create an account',
      email: 'Email'
    },
    es: {
      page_login_title: 'Iniciar sesion — Clavis-security',
      page_register_title: 'Crear cuenta — Clavis-security',
      language: 'Idioma',
      nav_vault: 'Caja',
      nav_offers: 'Planes',
      nav_account: 'Cuenta',
      vault_title: 'Caja',
      add_title: 'Anadir',
      add_note: 'Introduce el nombre, el usuario y la contrasena.',
      search_ph: 'Buscar...',
      identifier: 'Usuario',
      password: 'Contrasena',
      name: 'Nombre',
      btn_save: 'Guardar',
      btn_back: 'Atras',
      page_account_title: 'Cuenta — Clavis-security',
      account_heading: 'Tu cuenta',
      account_text: 'Cambia el idioma y cierra sesion cuando quieras.',
      btn_logout: 'Cerrar sesion',
      btn_back_vault: 'Volver a la caja',
      login_title: 'Iniciar sesion',
      register_title: 'Crear cuenta',
      btn_login: 'Entrar',
      btn_create_account: 'Crear cuenta',
      email: 'Email'
    },
    it: {
      page_login_title: 'Accedi — Clavis-security',
      page_register_title: 'Crea account — Clavis-security',
      language: 'Lingua',
      nav_vault: 'Cofano',
      nav_offers: 'Piani',
      nav_account: 'Account',
      vault_title: 'Cofano',
      add_title: 'Aggiungi',
      add_note: 'Inserisci nome, nome utente e password.',
      search_ph: 'Cerca...',
      identifier: 'Nome utente',
      password: 'Password',
      name: 'Nome',
      btn_save: 'Salva',
      btn_back: 'Indietro',
      page_account_title: 'Account — Clavis-security',
      account_heading: 'Il tuo account',
      account_text: 'Cambia lingua e disconnettiti quando vuoi.',
      btn_logout: 'Disconnetti',
      btn_back_vault: 'Torna al cofano',
      login_title: 'Accedi',
      register_title: 'Crea un account',
      btn_login: 'Accedi',
      btn_create_account: 'Crea un account',
      email: 'Email'
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

    // Attributes
    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      const k = el.getAttribute('data-i18n-title');
      if (!k) return;
      el.setAttribute('title', tr(lang, k));
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
      const k = el.getAttribute('data-i18n-aria-label');
      if (!k) return;
      el.setAttribute('aria-label', tr(lang, k));
    });
    document.querySelectorAll('[data-i18n-value]').forEach((el) => {
      const k = el.getAttribute('data-i18n-value');
      if (!k) return;
      el.value = tr(lang, k);
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
