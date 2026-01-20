// /js/app-entry.js
// Point d’entrée PWA :
// - En navigateur normal -> renvoie vers le site web (/index.html)
// - En PWA installée sur téléphone -> ouvre directement login ou dashboard selon session

(function () {
  function isStandalone() {
    return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
      window.navigator.standalone === true;
  }

  function isPhone() {
    // On reste volontairement simple et robuste.
    return window.matchMedia ? window.matchMedia('(max-width: 900px)').matches : (window.innerWidth <= 900);
  }

  async function go() {
    if (!isStandalone() || !isPhone()) {
      window.location.replace('/index.html');
      return;
    }

    // On marque l’expérience app (sert à activer app.css via app-mode.js)
    document.documentElement.classList.add('app-mode');
    document.documentElement.classList.add('app-phone');

    try {
      if (typeof getSession === 'function') {
        const session = await getSession();
        if (session) {
          window.location.replace('/dashboard.html');
          return;
        }
      }
    } catch (e) {
      // Ignore, on bascule login
      console.log('session check skipped:', e && (e.message || e));
    }

    window.location.replace('/login.html?app=1');
  }

  document.addEventListener('DOMContentLoaded', go);
})();
