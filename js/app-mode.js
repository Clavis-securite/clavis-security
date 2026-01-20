// /js/app-mode.js
(function () {
  const standalone =
    (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) ||
    window.navigator.standalone === true;

  const phone = window.matchMedia ? window.matchMedia("(max-width: 900px)").matches : (window.innerWidth <= 900);

  if (standalone) {
    document.documentElement.classList.add("app-mode");
  }
  if (standalone && phone) {
    document.documentElement.classList.add("app-phone");
  }

  // Bonus : éviter le bounce/scroll chelou iOS en mode app
  if (standalone && phone) {
    document.documentElement.style.height = "100%";
    document.body.style.height = "100%";
  }

  // APP_GUARD : en PWA téléphone, on limite volontairement l’expérience
  if (standalone && phone) {
    const allowed = new Set(['/app.html','/login.html','/register.html','/dashboard.html']);
    const path = (window.location.pathname || '/').toLowerCase();
    if (!allowed.has(path)) {
      // On renvoie vers l’écran utile (dashboard si connecté, sinon login)
      try {
        if (typeof getSession === 'function') {
          getSession().then((s) => {
            window.location.replace(s ? '/dashboard.html' : '/login.html?app=1');
          }).catch(() => window.location.replace('/login.html?app=1'));
          return;
        }
      } catch (_) {}
      window.location.replace('/login.html?app=1');
    }
  }

})();
