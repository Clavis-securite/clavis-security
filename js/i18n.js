// /js/i18n.js
// Simple i18n (FR/EN). Uses data-i18n and data-i18n-placeholder attributes.

(function () {
  const STORE_KEY = 'clavis_lang';

  const STRINGS = {
    fr: {
      language: 'Langue',

      // Topbar / nav
      nav_offers: 'Offres',
      nav_faq: 'FAQ',
      nav_contact: 'Contact',
      action_login: 'Connexion',
      action_register: 'Créer mon coffre',
      action_logout: 'Déconnexion',
      action_install: "Installer l’app",
      action_menu: 'Menu',

      // Dashboard (web + app)
      vault_title: 'Coffre',
      vault_controls_title: 'Ouvrir / fermer mon coffre',
      vault_note_closed: 'Pour afficher ou copier vos informations, vous devez ouvrir votre coffre.',
      vault_open: 'Ouvrir mon coffre',
      vault_close: 'Fermer',
      vault_export_pdf: 'Faire une copie PDF',

      search_title: 'Rechercher',
      search_label: 'Tapez un nom',
      search_ph: 'Rechercher...',
      search_help: 'Le nom sert juste à retrouver plus vite.',

      add_title: 'Ajouter',
      add_note: "Renseigne le nom, l’identifiant et le mot de passe.",
      add_info_title: 'Ajouter une information',
      add_name_label: 'Nom (ex : Gmail)',
      identifier: 'Identifiant',
      password: 'Mot de passe',
      url_label: 'Site (optionnel)',
      url_ph: 'https://...',
      notes_label: 'Notes (optionnel)',
      save_btn: 'Enregistrer',
      update_btn: 'Mettre à jour',

      my_items_title: 'Mes informations',
      items_count: 'élément(s) enregistré(s).',
      view_btn: 'Voir',
      edit_btn: 'Modifier',
      delete_btn: 'Supprimer',

      // Auth
      login_title: 'Connexion',
      register_title: 'Créer un compte',
      email_label: 'Email',
      password_label: 'Mot de passe',
      confirm_password_label: 'Confirmer le mot de passe',
      sign_in_btn: 'Se connecter',
      sign_up_btn: 'Créer mon coffre',

      // Offers
      offers_title: 'Offres',
      annual: 'Annuel',
      lifetime: 'À vie',

      // Legal footer links
      legal_hub: 'Légales',
      legal_cgu: 'CGU',
      legal_cgv: 'CGV',
      legal_mentions: 'Mentions légales'
    },
    en: {
      language: 'Language',

      // Topbar / nav
      nav_offers: 'Plans',
      nav_faq: 'FAQ',
      nav_contact: 'Contact',
      action_login: 'Sign in',
      action_register: 'Create my vault',
      action_logout: 'Sign out',
      action_install: 'Install app',
      action_menu: 'Menu',

      // Dashboard (web + app)
      vault_title: 'Vault',
      vault_controls_title: 'Open / lock my vault',
      vault_note_closed: 'To view or copy your items, you must open your vault.',
      vault_open: 'Open my vault',
      vault_close: 'Lock',
      vault_export_pdf: 'Export PDF copy',

      search_title: 'Search',
      search_label: 'Type a name',
      search_ph: 'Search...',
      search_help: 'Name is only used to find items faster.',

      add_title: 'Add',
      add_note: 'Enter the name, username and password.',
      add_info_title: 'Add an item',
      add_name_label: 'Name (e.g., Gmail)',
      identifier: 'Username',
      password: 'Password',
      url_label: 'Website (optional)',
      url_ph: 'https://...',
      notes_label: 'Notes (optional)',
      save_btn: 'Save',
      update_btn: 'Update',

      my_items_title: 'My items',
      items_count: 'item(s) saved.',
      view_btn: 'View',
      edit_btn: 'Edit',
      delete_btn: 'Delete',

      // Auth
      login_title: 'Sign in',
      register_title: 'Create account',
      email_label: 'Email',
      password_label: 'Password',
      confirm_password_label: 'Confirm password',
      sign_in_btn: 'Sign in',
      sign_up_btn: 'Create my vault',

      // Offers
      offers_title: 'Plans',
      annual: 'Annual',
      lifetime: 'Lifetime',

      // Legal footer links
      legal_hub: 'Legal',
      legal_cgu: 'Terms of use',
      legal_cgv: 'Terms of sale',
      legal_mentions: 'Legal notice'
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

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const k = el.getAttribute('data-i18n');
      if (!k) return;
      el.textContent = tr(lang, k);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const k = el.getAttribute('data-i18n-placeholder');
      if (!k) return;
      el.setAttribute('placeholder', tr(lang, k));
    });

    const lab = document.querySelector('.cs-lang-label');
    if (lab) lab.textContent = tr(lang, 'language');
  }

  function injectWebLangMenu() {
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

  window.ClavisI18n = { getLang, setLang, tr };
})();
