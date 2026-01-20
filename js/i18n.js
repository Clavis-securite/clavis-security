// /js/i18n.js
// Simple i18n (FR/EN/ES/IT) for Clavis-security.
// - Works for Web + App
// - No technical words in UI
// - Supports: data-i18n, data-i18n-placeholder, data-i18n-title, data-i18n-aria
// - Provides: window.clavisT(key, vars), window.clavisSetLang(lang), window.clavisGetLang()

(function () {
  const STORE_KEY = 'clavis_lang';

  const STRINGS = {
    fr: {
      language: 'Langue',
      nav_home: 'Accueil',
      nav_vault: 'Coffre',
      nav_offers: 'Offres',
      nav_faq: 'FAQ',
      nav_contact: 'Contact',
      nav_account: 'Compte',
      nav_login: 'Connexion',
      nav_register: 'Créer mon coffre',
      nav_menu: 'Menu',

      btn_install: 'Installer l’app',
      btn_login: 'Se connecter',
      btn_create_account: 'Créer un compte',
      btn_continue: 'Continuer',
      btn_cancel: 'Annuler',
      btn_logout: 'Se déconnecter',

      // Dashboard / Vault
      vault_open: 'Coffre ouvert',
      vault_closed: 'Coffre fermé',
      vault_open_small: 'coffre ouvert',
      vault_closed_small: 'coffre fermé',
      items_count: '{count} élément(s) enregistré(s).',
      no_results: 'Aucun résultat.',
      btn_view: 'Voir',
      btn_copy_username: 'Copier identifiant',
      btn_copy_password: 'Copier mot de passe',
      btn_delete: 'Supprimer',
      btn_back: 'Retour',
      details_subtitle: 'Détails',
      label_username: 'Identifiant',
      label_password: 'Mot de passe',

      msg_open_vault_first: 'Ouvre ton coffre pour continuer.',
      msg_copied: '✅ Copié !',
      msg_copy_failed: 'Impossible de copier.',
      msg_delete_failed: 'Oups… impossible de supprimer.',
      msg_save_failed: 'Oups… impossible d’enregistrer.',
      msg_cannot_show: 'Impossible d’afficher.',
      confirm_delete: 'Supprimer "{name}" ?',
      unlock_wrong: 'Mot de passe incorrect. Réessaie.',
      pdf_title: 'Clavis-security — Copie PDF'
    
      page_login_title: 'Connexion — Clavis-security',
      page_register_title: 'Créer mon coffre — Clavis-security',
      login_tagline: '🔒 Ton coffre personnel',
      login_welcome: 'Content de te revoir.',
      login_desc: 'Connecte-toi et retrouve tes informations en quelques secondes.',
      login_title: 'Connexion',
      login_hint: 'Ouvre ton coffre.',
      label_email: 'Email',
      label_password: 'Mot de passe',
      login_no_account: 'Pas encore de coffre ?',
      register_tagline: 'Créer mon coffre.',
      register_desc: 'Un espace simple pour garder tes informations importantes.',
      register_title: 'Créer un compte',
      register_hint: 'Crée ton coffre en 30 secondes.',
      register_have_account: 'J’ai déjà un coffre',
      field_name: 'Nom (ex : Gmail)',
      add_info_heading: 'Ajouter une information',
      my_info_heading: 'Mes informations',
      loading: 'Chargement…',
      search_placeholder: 'Rechercher…',
      unlock_heading: 'Ouvrir mon coffre',
      unlock_label: 'Mot de passe secondaire',
      unlock_open: 'Ouvrir',
      lock_btn: 'Verrouiller',
      export_pdf: 'Exporter PDF',
      vault_locked_note: 'Votre coffre est verrouillé.',
      vault_open_note: 'Votre coffre est ouvert.',
    },

    en: {
      language: 'Language',
      nav_home: 'Home',
      nav_vault: 'Vault',
      nav_offers: 'Plans',
      nav_faq: 'Help',
      nav_contact: 'Contact',
      nav_account: 'Account',
      nav_login: 'Sign in',
      nav_register: 'Create my vault',
      nav_menu: 'Menu',

      btn_install: 'Install the app',
      btn_login: 'Sign in',
      btn_create_account: 'Create an account',
      btn_continue: 'Continue',
      btn_cancel: 'Cancel',
      btn_logout: 'Sign out',

      vault_open: 'Vault unlocked',
      vault_closed: 'Vault locked',
      vault_open_small: 'vault unlocked',
      vault_closed_small: 'vault locked',
      items_count: '{count} item(s) saved.',
      no_results: 'No results.',
      btn_view: 'View',
      btn_copy_username: 'Copy username',
      btn_copy_password: 'Copy password',
      btn_delete: 'Delete',
      btn_back: 'Back',
      details_subtitle: 'Details',
      label_username: 'Username',
      label_password: 'Password',

      msg_open_vault_first: 'Unlock your vault to continue.',
      msg_copied: '✅ Copied!',
      msg_copy_failed: 'Could not copy.',
      msg_delete_failed: 'Oops… could not delete.',
      msg_save_failed: 'Oops… could not save.',
      msg_cannot_show: 'Could not display.',
      confirm_delete: 'Delete "{name}"?',
      unlock_wrong: 'Wrong password. Try again.',
      pdf_title: 'Clavis-security — PDF copy'
    
      page_login_title: 'Sign in — Clavis-security',
      page_register_title: 'Create my vault — Clavis-security',
      login_tagline: '🔒 Your personal vault',
      login_welcome: 'Welcome back.',
      login_desc: 'Sign in and find your info in seconds.',
      login_title: 'Sign in',
      login_hint: 'Open your vault.',
      label_email: 'Email',
      label_password: 'Password',
      login_no_account: 'No vault yet?',
      register_tagline: 'Create my vault.',
      register_desc: 'A simple space for your important info.',
      register_title: 'Create an account',
      register_hint: 'Create your vault in 30 seconds.',
      register_have_account: 'I already have a vault',
      field_name: 'Name (e.g. Gmail)',
      add_info_heading: 'Add an item',
      my_info_heading: 'My items',
      loading: 'Loading…',
      search_placeholder: 'Search…',
      unlock_heading: 'Unlock my vault',
      unlock_label: 'Secondary password',
      unlock_open: 'Unlock',
      lock_btn: 'Lock',
      export_pdf: 'Export PDF',
      vault_locked_note: 'Your vault is locked.',
      vault_open_note: 'Your vault is unlocked.',
    },

    es: {
      language: 'Idioma',
      nav_home: 'Inicio',
      nav_vault: 'Caja',
      nav_offers: 'Planes',
      nav_faq: 'Ayuda',
      nav_contact: 'Contacto',
      nav_account: 'Cuenta',
      nav_login: 'Entrar',
      nav_register: 'Crear mi caja',
      nav_menu: 'Menú',

      btn_install: 'Instalar la app',
      btn_login: 'Entrar',
      btn_create_account: 'Crear una cuenta',
      btn_continue: 'Continuar',
      btn_cancel: 'Cancelar',
      btn_logout: 'Salir',

      vault_open: 'Caja abierta',
      vault_closed: 'Caja cerrada',
      vault_open_small: 'caja abierta',
      vault_closed_small: 'caja cerrada',
      items_count: '{count} elemento(s) guardado(s).',
      no_results: 'Sin resultados.',
      btn_view: 'Ver',
      btn_copy_username: 'Copiar usuario',
      btn_copy_password: 'Copiar contraseña',
      btn_delete: 'Eliminar',
      btn_back: 'Volver',
      details_subtitle: 'Detalles',
      label_username: 'Usuario',
      label_password: 'Contraseña',

      msg_open_vault_first: 'Abre tu caja para continuar.',
      msg_copied: '✅ Copiado!',
      msg_copy_failed: 'No se pudo copiar.',
      msg_delete_failed: 'Ups… no se pudo eliminar.',
      msg_save_failed: 'Ups… no se pudo guardar.',
      msg_cannot_show: 'No se pudo mostrar.',
      confirm_delete: '¿Eliminar "{name}"?',
      unlock_wrong: 'Contraseña incorrecta. Inténtalo de nuevo.',
      pdf_title: 'Clavis-security — Copia PDF'
    
      page_login_title: 'Entrar — Clavis-security',
      page_register_title: 'Crear mi caja — Clavis-security',
      login_tagline: '🔒 Tu caja personal',
      login_welcome: 'Qué gusto verte.',
      login_desc: 'Entra y encuentra tu info en segundos.',
      login_title: 'Entrar',
      login_hint: 'Abre tu caja.',
      label_email: 'Email',
      label_password: 'Contraseña',
      login_no_account: '¿Aún no tienes caja?',
      register_tagline: 'Crear mi caja.',
      register_desc: 'Un espacio simple para tu información importante.',
      register_title: 'Crear una cuenta',
      register_hint: 'Crea tu caja en 30 segundos.',
      register_have_account: 'Ya tengo una caja',
      field_name: 'Nombre (ej. Gmail)',
      add_info_heading: 'Añadir un elemento',
      my_info_heading: 'Mis elementos',
      loading: 'Cargando…',
      search_placeholder: 'Buscar…',
      unlock_heading: 'Abrir mi caja',
      unlock_label: 'Contraseña secundaria',
      unlock_open: 'Abrir',
      lock_btn: 'Cerrar',
      export_pdf: 'Exportar PDF',
      vault_locked_note: 'Tu caja está cerrada.',
      vault_open_note: 'Tu caja está abierta.',
    },

    it: {
      language: 'Lingua',
      nav_home: 'Home',
      nav_vault: 'Cassaforte',
      nav_offers: 'Piani',
      nav_faq: 'Aiuto',
      nav_contact: 'Contatto',
      nav_account: 'Account',
      nav_login: 'Accedi',
      nav_register: 'Crea la cassaforte',
      nav_menu: 'Menu',

      btn_install: 'Installa l’app',
      btn_login: 'Accedi',
      btn_create_account: 'Crea un account',
      btn_continue: 'Continua',
      btn_cancel: 'Annulla',
      btn_logout: 'Esci',

      vault_open: 'Cassaforte aperta',
      vault_closed: 'Cassaforte chiusa',
      vault_open_small: 'cassaforte aperta',
      vault_closed_small: 'cassaforte chiusa',
      items_count: '{count} elemento(i) salvato(i).',
      no_results: 'Nessun risultato.',
      btn_view: 'Vedi',
      btn_copy_username: 'Copia utente',
      btn_copy_password: 'Copia password',
      btn_delete: 'Elimina',
      btn_back: 'Indietro',
      details_subtitle: 'Dettagli',
      label_username: 'Utente',
      label_password: 'Password',

      msg_open_vault_first: 'Apri la cassaforte per continuare.',
      msg_copied: '✅ Copiato!',
      msg_copy_failed: 'Impossibile copiare.',
      msg_delete_failed: 'Ops… impossibile eliminare.',
      msg_save_failed: 'Ops… impossibile salvare.',
      msg_cannot_show: 'Impossibile mostrare.',
      confirm_delete: 'Eliminare "{name}"?',
      unlock_wrong: 'Password errata. Riprova.',
      pdf_title: 'Clavis-security — Copia PDF'
    
      page_login_title: 'Accedi — Clavis-security',
      page_register_title: 'Crea la cassaforte — Clavis-security',
      login_tagline: '🔒 La tua cassaforte personale',
      login_welcome: 'Bentornato.',
      login_desc: 'Accedi e ritrova i tuoi dati in pochi secondi.',
      login_title: 'Accedi',
      login_hint: 'Apri la cassaforte.',
      label_email: 'Email',
      label_password: 'Password',
      login_no_account: 'Non hai ancora una cassaforte?',
      register_tagline: 'Crea la cassaforte.',
      register_desc: 'Uno spazio semplice per le informazioni importanti.',
      register_title: 'Crea un account',
      register_hint: 'Crea la cassaforte in 30 secondi.',
      register_have_account: 'Ho già una cassaforte',
      field_name: 'Nome (es. Gmail)',
      add_info_heading: 'Aggiungi un elemento',
      my_info_heading: 'I miei elementi',
      loading: 'Caricamento…',
      search_placeholder: 'Cerca…',
      unlock_heading: 'Apri la mia cassaforte',
      unlock_label: 'Password secondaria',
      unlock_open: 'Apri',
      lock_btn: 'Blocca',
      export_pdf: 'Esporta PDF',
      vault_locked_note: 'La cassaforte è bloccata.',
      vault_open_note: 'La cassaforte è aperta.',
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

  function interpolate(str, vars) {
    if (!vars) return str;
    return String(str).replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? String(vars[k]) : ''));
  }

  function tr(lang, key, vars) {
    const pack = STRINGS[lang] || STRINGS.fr;
    const base = pack[key] != null ? pack[key] : (STRINGS.fr[key] != null ? STRINGS.fr[key] : key);
    return interpolate(base, vars);
  }

  function applyLang(lang) {
    // lang attribute
    try { document.documentElement.setAttribute('lang', lang); } catch (_) {}

    // data-i18n text
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (!key) return;
      el.textContent = tr(lang, key);
    });

    // placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (!key) return;
      el.setAttribute('placeholder', tr(lang, key));
    });

    // title attribute
    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      const key = el.getAttribute('data-i18n-title');
      if (!key) return;
      el.setAttribute('title', tr(lang, key));
    });

    // aria-label
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      const key = el.getAttribute('data-i18n-aria');
      if (!key) return;
      el.setAttribute('aria-label', tr(lang, key));
    });

    // sync selects
    const webSel = document.getElementById('webLangSelect');
    if (webSel && webSel.value !== lang) webSel.value = lang;

    const appSel = document.getElementById('appLangSelect');
    if (appSel && appSel.value !== lang) appSel.value = lang;
  }

  function setLang(lang) {
    if (!STRINGS[lang]) lang = 'fr';
    try { localStorage.setItem(STORE_KEY, lang); } catch (_) {}
    applyLang(lang);
    try { window.dispatchEvent(new CustomEvent('clavis:lang', { detail: { lang } })); } catch (_) {}
  }

  // Public API for JS-generated UI
  window.clavisGetLang = getLang;
  window.clavisSetLang = setLang;
  window.clavisT = function (key, vars) { return tr(getLang(), key, vars); };

  function init() {
    const lang = getLang();
    applyLang(lang);

    const webSel = document.getElementById('webLangSelect');
    if (webSel) {
      webSel.value = lang;
      webSel.addEventListener('change', () => setLang(webSel.value));
    }

    // App selector (if present)
    const appSel = document.getElementById('appLangSelect');
    if (appSel) {
      appSel.value = lang;
      appSel.addEventListener('change', () => setLang(appSel.value));
    }

    window.addEventListener('clavis:lang', (e) => {
      const next = e && e.detail && e.detail.lang ? e.detail.lang : getLang();
      applyLang(next);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
