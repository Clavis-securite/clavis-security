// /js/i18n.js
// Lightweight i18n for Clavis-security (FR/EN/ES/IT).
// Safe behavior: if a key is missing, we KEEP the existing text (never show raw keys).

(function () {
  const STORE_KEY = 'clavis_lang';

  const STRINGS = {
    fr: {
      // Nav / common
      app_name: 'Clavis-security',
      nav_offers: 'Offres',
      nav_faq: 'FAQ',
      nav_contact: 'Contact',
      nav_login: 'Connexion',
      nav_register: 'Créer un compte',
      nav_menu: 'Menu',
      btn_install: 'Installer l’application',
      btn_logout: 'Déconnexion',
      btn_back: 'Retour',

      // Login / Register
      login_title: 'Connexion',
      register_title: 'Créer un compte',
      login_hint: 'Connecte-toi pour ouvrir ton coffre.',
      register_hint: 'Crée ton compte en quelques secondes.',
      label_email: 'Email',
      label_password: 'Mot de passe',
      btn_login: 'Se connecter',
      btn_create_account: 'Créer un compte',
      btn_register: 'Créer mon compte',
      login_no_account: 'Pas encore de compte ?',
      register_have_account: 'Déjà un compte ?',
      link_login: 'Se connecter',
      link_register: 'Créer un compte',

      // Dashboard / Vault
      vault_title: 'Coffre',
      vault_locked: 'Coffre verrouillé',
      vault_unlocked: 'Coffre ouvert',
      btn_unlock: 'Ouvrir',
      btn_lock: 'Verrouiller',
      btn_add: 'Ajouter',
      btn_save: 'Enregistrer',
      btn_delete: 'Supprimer',
      btn_copy: 'Copier',
      btn_close: 'Fermer',
      btn_premium: 'Passer à Premium',

      label_name: 'Nom',
      label_username: 'Identifiant',
      label_secret: 'Mot de passe',
      label_url: 'Site (optionnel)',
      label_notes: 'Notes (optionnel)',

      search_placeholder: 'Rechercher…',

      items_count: '{count} élément(s) enregistré(s).',

      // Messages
      msg_generic_error: 'Une erreur est survenue. Recharge la page.',
      msg_copied: '✅ Copié !',
      msg_copy_failed: 'Impossible de copier.',
      msg_delete_failed: 'Impossible de supprimer.',
      msg_checkout_failed: 'Impossible d’ouvrir le paiement. Réessaie.',
      msg_fill_email_password: 'Merci de renseigner ton email et ton mot de passe.',
      msg_fill_required: 'Merci de compléter les champs obligatoires.',
      msg_account_created: 'Compte créé ! Vérifie tes emails pour confirmer.'
    },

    en: {
      app_name: 'Clavis-security',
      nav_offers: 'Pricing',
      nav_faq: 'Help',
      nav_contact: 'Contact',
      nav_login: 'Sign in',
      nav_register: 'Create account',
      nav_menu: 'Menu',
      btn_install: 'Install the app',
      btn_logout: 'Sign out',
      btn_back: 'Back',

      login_title: 'Sign in',
      register_title: 'Create account',
      login_hint: 'Sign in to open your vault.',
      register_hint: 'Create your account in seconds.',
      label_email: 'Email',
      label_password: 'Password',
      btn_login: 'Sign in',
      btn_create_account: 'Create account',
      btn_register: 'Create my account',
      login_no_account: 'No account yet?',
      register_have_account: 'Already have an account?',
      link_login: 'Sign in',
      link_register: 'Create account',

      vault_title: 'Vault',
      vault_locked: 'Vault locked',
      vault_unlocked: 'Vault open',
      btn_unlock: 'Unlock',
      btn_lock: 'Lock',
      btn_add: 'Add',
      btn_save: 'Save',
      btn_delete: 'Delete',
      btn_copy: 'Copy',
      btn_close: 'Close',
      btn_premium: 'Go Premium',

      label_name: 'Name',
      label_username: 'Username',
      label_secret: 'Password',
      label_url: 'Website (optional)',
      label_notes: 'Notes (optional)',

      search_placeholder: 'Search…',

      items_count: '{count} item(s) saved.',

      msg_generic_error: 'Something went wrong. Please reload.',
      msg_copied: '✅ Copied!',
      msg_copy_failed: 'Could not copy.',
      msg_delete_failed: 'Could not delete.',
      msg_checkout_failed: 'Could not open payment. Try again.',
      msg_fill_email_password: 'Please enter your email and password.',
      msg_fill_required: 'Please fill in the required fields.',
      msg_account_created: 'Account created! Check your email to confirm.'
    },

    es: {
      app_name: 'Clavis-security',
      nav_offers: 'Planes',
      nav_faq: 'Ayuda',
      nav_contact: 'Contacto',
      nav_login: 'Iniciar sesión',
      nav_register: 'Crear cuenta',
      nav_menu: 'Menú',
      btn_install: 'Instalar la app',
      btn_logout: 'Cerrar sesión',
      btn_back: 'Volver',

      login_title: 'Iniciar sesión',
      register_title: 'Crear cuenta',
      login_hint: 'Inicia sesión para abrir tu caja.',
      register_hint: 'Crea tu cuenta en segundos.',
      label_email: 'Email',
      label_password: 'Contraseña',
      btn_login: 'Entrar',
      btn_create_account: 'Crear cuenta',
      btn_register: 'Crear mi cuenta',
      login_no_account: '¿Aún no tienes cuenta?',
      register_have_account: '¿Ya tienes cuenta?',
      link_login: 'Entrar',
      link_register: 'Crear cuenta',

      vault_title: 'Caja',
      vault_locked: 'Caja bloqueada',
      vault_unlocked: 'Caja abierta',
      btn_unlock: 'Abrir',
      btn_lock: 'Bloquear',
      btn_add: 'Añadir',
      btn_save: 'Guardar',
      btn_delete: 'Eliminar',
      btn_copy: 'Copiar',
      btn_close: 'Cerrar',
      btn_premium: 'Pasar a Premium',

      label_name: 'Nombre',
      label_username: 'Usuario',
      label_secret: 'Contraseña',
      label_url: 'Sitio (opcional)',
      label_notes: 'Notas (opcional)',

      search_placeholder: 'Buscar…',

      items_count: '{count} elemento(s) guardado(s).',

      msg_generic_error: 'Ocurrió un error. Recarga la página.',
      msg_copied: '✅ ¡Copiado!',
      msg_copy_failed: 'No se pudo copiar.',
      msg_delete_failed: 'No se pudo eliminar.',
      msg_checkout_failed: 'No se pudo abrir el pago. Inténtalo de nuevo.',
      msg_fill_email_password: 'Introduce tu email y contraseña.',
      msg_fill_required: 'Completa los campos obligatorios.',
      msg_account_created: '¡Cuenta creada! Revisa tu email para confirmar.'
    },

    it: {
      app_name: 'Clavis-security',
      nav_offers: 'Offerte',
      nav_faq: 'Aiuto',
      nav_contact: 'Contatto',
      nav_login: 'Accedi',
      nav_register: 'Crea account',
      nav_menu: 'Menu',
      btn_install: "Installa l'app",
      btn_logout: 'Esci',
      btn_back: 'Indietro',

      login_title: 'Accedi',
      register_title: 'Crea account',
      login_hint: 'Accedi per aprire il tuo vault.',
      register_hint: 'Crea il tuo account in pochi secondi.',
      label_email: 'Email',
      label_password: 'Password',
      btn_login: 'Accedi',
      btn_create_account: 'Crea account',
      btn_register: 'Crea il mio account',
      login_no_account: 'Non hai un account?',
      register_have_account: 'Hai già un account?',
      link_login: 'Accedi',
      link_register: 'Crea account',

      vault_title: 'Vault',
      vault_locked: 'Vault bloccato',
      vault_unlocked: 'Vault aperto',
      btn_unlock: 'Apri',
      btn_lock: 'Blocca',
      btn_add: 'Aggiungi',
      btn_save: 'Salva',
      btn_delete: 'Elimina',
      btn_copy: 'Copia',
      btn_close: 'Chiudi',
      btn_premium: 'Passa a Premium',

      label_name: 'Nome',
      label_username: 'Utente',
      label_secret: 'Password',
      label_url: 'Sito (opzionale)',
      label_notes: 'Note (opzionale)',

      search_placeholder: 'Cerca…',

      items_count: '{count} elemento(i) salvato(i).',

      msg_generic_error: 'Si è verificato un errore. Ricarica la pagina.',
      msg_copied: '✅ Copiato!',
      msg_copy_failed: 'Impossibile copiare.',
      msg_delete_failed: 'Impossibile eliminare.',
      msg_checkout_failed: 'Impossibile aprire il pagamento. Riprova.',
      msg_fill_email_password: 'Inserisci email e password.',
      msg_fill_required: 'Compila i campi obbligatori.',
      msg_account_created: "Account creato! Controlla l'email per confermare."
    }
  };

  const normalize = (lang) => (['fr','en','es','it'].includes(lang) ? lang : 'fr');

  function getLang() {
    const saved = localStorage.getItem(STORE_KEY);
    if (saved) return normalize(saved);
    const nav = (navigator.language || 'fr').slice(0,2).toLowerCase();
    return normalize(nav);
  }

  function setLang(lang) {
    const l = normalize(lang);
    localStorage.setItem(STORE_KEY, l);
    apply(l);
  }

  function format(str, vars) {
    if (!vars) return str;
    return String(str).replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? String(vars[k]) : ''));
  }

  function t(key, vars) {
    const lang = getLang();
    const dict = STRINGS[lang] || STRINGS.fr;

    const v = (dict && dict[key]) || STRINGS.fr[key];
    if (v == null) return format(String(key), vars);
    return format(v, vars);
  }

  function rememberDefault(el, attr, val) {
    const k = `i18nDefault${attr}`;
    if (el.dataset[k] == null) el.dataset[k] = val;
  }

  function pickFallback(el, attr, key) {
    const k = `i18nDefault${attr}`;
    const current = el.dataset[k];
    const v = (STRINGS[getLang()] && STRINGS[getLang()][key]) || STRINGS.fr[key];
    // If we don't have a translation, keep original (avoid showing raw keys)
    if (v == null) return current != null ? current : null;
    return v;
  }

  function apply(lang) {
    lang = normalize(lang);
    const dict = STRINGS[lang] || STRINGS.fr;

    // Text content
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const original = (el.textContent || '').trim();
      rememberDefault(el, 'Text', original);
      const next = (dict[key] || STRINGS.fr[key]);
      if (next != null) el.textContent = next;
      // else keep existing text
    });

    // Placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      const original = el.getAttribute('placeholder') || '';
      rememberDefault(el, 'Placeholder', original);
      const next = (dict[key] || STRINGS.fr[key]);
      if (next != null) el.setAttribute('placeholder', next);
    });

    // Title
    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      const key = el.getAttribute('data-i18n-title');
      const original = el.getAttribute('title') || '';
      rememberDefault(el, 'Title', original);
      const next = (dict[key] || STRINGS.fr[key]);
      if (next != null) el.setAttribute('title', next);
    });

    // Aria-label
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      const key = el.getAttribute('data-i18n-aria');
      const original = el.getAttribute('aria-label') || '';
      rememberDefault(el, 'Aria', original);
      const next = (dict[key] || STRINGS.fr[key]);
      if (next != null) el.setAttribute('aria-label', next);
    });

    // Sync language selects
    document.querySelectorAll('select[data-lang-select], #appLangSelect').forEach((sel) => {
      try { if (sel.value !== lang) sel.value = lang; } catch (_) {}
    });

    document.documentElement.setAttribute('lang', lang);
  }

  window.clavisT = t;
  window.clavisGetLang = getLang;
  window.clavisSetLang = setLang;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => apply(getLang()));
  } else {
    apply(getLang());
  }
})();
