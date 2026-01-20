// /js/i18n.js
// Lightweight i18n for Clavis-security (FR/EN/ES/IT).
// Usage in HTML:
//  - data-i18n="key" (textContent)
//  - data-i18n-placeholder="key" (placeholder)
//  - data-i18n-title="key" (title)
//  - data-i18n-aria="key" (aria-label)
// API:
//  - window.clavisT(key, vars)
//  - window.clavisGetLang()
//  - window.clavisSetLang(lang)

(function () {
  const STORE_KEY = 'clavis_lang';

  const STRINGS = {
    fr: {
      language: 'Langue',
      nav_home: 'Accueil',
      nav_vault: 'Coffre',
      nav_offers: 'Offres',
      nav_account: 'Compte',

      vault_title: 'Coffre',
      vault_open: 'Coffre ouvert',
      vault_closed: 'Coffre verrouillé',

      btn_go_premium: 'Passer à Premium',
      btn_back: 'Retour',
      btn_add: 'Ajouter',
      btn_save: 'Enregistrer',
      btn_delete: 'Supprimer',
      btn_copy: 'Copier',
      btn_close: 'Fermer',
      btn_logout: 'Déconnexion',

      label_name: 'Nom',
      label_username: 'Identifiant',
      label_password: 'Mot de passe',

      search_placeholder: 'Rechercher…',

      msg_generic_error: 'Une erreur est survenue. Recharge la page.',
      msg_checkout_failed: 'Impossible d’ouvrir le paiement. Réessaie dans un instant.',
      msg_copied: '✅ Copié !',
      msg_copy_failed: 'Impossible de copier.',
      confirm_delete: 'Supprimer "{name}" ?',
      loading: 'Chargement…',
    },

    en: {
      language: 'Language',
      nav_home: 'Home',
      nav_vault: 'Vault',
      nav_offers: 'Plans',
      nav_account: 'Account',

      vault_title: 'Vault',
      vault_open: 'Unlocked',
      vault_closed: 'Locked',

      btn_go_premium: 'Go Premium',
      btn_back: 'Back',
      btn_add: 'Add',
      btn_save: 'Save',
      btn_delete: 'Delete',
      btn_copy: 'Copy',
      btn_close: 'Close',
      btn_logout: 'Sign out',

      label_name: 'Name',
      label_username: 'Username',
      label_password: 'Password',

      search_placeholder: 'Search…',

      msg_generic_error: 'Something went wrong. Please reload the page.',
      msg_checkout_failed: 'Unable to open the payment page. Please try again.',
      msg_copied: '✅ Copied!',
      msg_copy_failed: 'Unable to copy.',
      confirm_delete: 'Delete "{name}"?',
      loading: 'Loading…',
    },

    es: {
      language: 'Idioma',
      nav_home: 'Inicio',
      nav_vault: 'Caja',
      nav_offers: 'Planes',
      nav_account: 'Cuenta',

      vault_title: 'Caja',
      vault_open: 'Abierta',
      vault_closed: 'Bloqueada',

      btn_go_premium: 'Pasar a Premium',
      btn_back: 'Volver',
      btn_add: 'Añadir',
      btn_save: 'Guardar',
      btn_delete: 'Eliminar',
      btn_copy: 'Copiar',
      btn_close: 'Cerrar',
      btn_logout: 'Cerrar sesión',

      label_name: 'Nombre',
      label_username: 'Usuario',
      label_password: 'Contraseña',

      search_placeholder: 'Buscar…',

      msg_generic_error: 'Algo salió mal. Recarga la página.',
      msg_checkout_failed: 'No se puede abrir el pago. Inténtalo de nuevo.',
      msg_copied: '✅ ¡Copiado!',
      msg_copy_failed: 'No se puede copiar.',
      confirm_delete: '¿Eliminar "{name}"?',
      loading: 'Cargando…',
    },

    it: {
      language: 'Lingua',
      nav_home: 'Home',
      nav_vault: 'Cassetto',
      nav_offers: 'Piani',
      nav_account: 'Account',

      vault_title: 'Cassetto',
      vault_open: 'Sbloccato',
      vault_closed: 'Bloccato',

      btn_go_premium: 'Passa a Premium',
      btn_back: 'Indietro',
      btn_add: 'Aggiungi',
      btn_save: 'Salva',
      btn_delete: 'Elimina',
      btn_copy: 'Copia',
      btn_close: 'Chiudi',
      btn_logout: 'Esci',

      label_name: 'Nome',
      label_username: 'Utente',
      label_password: 'Password',

      search_placeholder: 'Cerca…',

      msg_generic_error: 'Qualcosa è andato storto. Ricarica la pagina.',
      msg_checkout_failed: 'Impossibile aprire il pagamento. Riprova.',
      msg_copied: '✅ Copiato!',
      msg_copy_failed: 'Impossibile copiare.',
      confirm_delete: 'Eliminare "{name}"?',
      loading: 'Caricamento…',
    },
  };

  function getLang() {
    try {
      const v = localStorage.getItem(STORE_KEY);
      if (v && STRINGS[v]) return v;
    } catch (_) {}
    return 'fr';
  }

  function setLang(lang) {
    if (!STRINGS[lang]) lang = 'fr';
    try { localStorage.setItem(STORE_KEY, lang); } catch (_) {}
    apply(lang);
    window.dispatchEvent(new CustomEvent('clavis:lang', { detail: { lang } }));
  }

  function t(key, vars) {
    const lang = getLang();
    const dict = STRINGS[lang] || STRINGS.fr;
    let s = (dict && dict[key]) || (STRINGS.fr && STRINGS.fr[key]) || key;
    if (vars && typeof vars === 'object') {
      Object.keys(vars).forEach((k) => {
        s = s.replace(new RegExp('{'+k+'}', 'g'), String(vars[k]));
      });
    }
    return s;
  }

  function apply(lang) {
    const dict = STRINGS[lang] || STRINGS.fr;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (!key) return;
      el.textContent = (dict[key] || STRINGS.fr[key] || key);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (!key) return;
      el.setAttribute('placeholder', (dict[key] || STRINGS.fr[key] || key));
    });

    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      const key = el.getAttribute('data-i18n-title');
      if (!key) return;
      el.setAttribute('title', (dict[key] || STRINGS.fr[key] || key));
    });

    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      const key = el.getAttribute('data-i18n-aria');
      if (!key) return;
      el.setAttribute('aria-label', (dict[key] || STRINGS.fr[key] || key));
    });

    // Sync any language selects
    document.querySelectorAll('select[data-lang-select], #appLangSelect').forEach((sel) => {
      try { if (sel.value !== lang) sel.value = lang; } catch (_) {}
    });

    document.documentElement.setAttribute('lang', lang);
  }

  // Expose API
  window.clavisT = t;
  window.clavisGetLang = getLang;
  window.clavisSetLang = setLang;

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => apply(getLang()));
  } else {
    apply(getLang());
  }
})();
