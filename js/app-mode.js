// /js/app-mode.js
// Détecte le contexte "App" (PWA installée / standalone) et applique :
// - une classe HTML (app-mode)
// - une feuille CSS spécifique (css/app.css)
// - une redirection douce pour éviter d'afficher la partie "site" dans l'app

(function () {
  function isStandalone() {
    return (
      (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) ||
      window.navigator.standalone === true
    );
  }

  // L'expérience "App" doit s'appliquer UNIQUEMENT sur téléphone.
  // - PWA installée (standalone)
  // - écran <= 900px
  // - pointeur tactile quand dispo
  function isPhoneLike() {
    const w = Math.min(window.innerWidth || 0, (screen && screen.width) ? screen.width : 9999);
    const small = w <= 900;
    const coarse = window.matchMedia ? window.matchMedia('(pointer: coarse)').matches : true;
    return small && coarse;
  }

  const standalone = isStandalone();
  if (!standalone) return; // IMPORTANT : en navigateur normal, aucune différence.

  // Standalone sur desktop/tablette : on garde le style "site web".
  if (!isPhoneLike()) return;

  document.documentElement.classList.add("app-mode");
  document.documentElement.classList.add("app-phone");

  // Charge la CSS app uniquement en standalone (ne touche jamais le site web)
  try {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/css/app.css";
    document.head.appendChild(link);
  } catch (_) {}

  // Bonus : éviter le bounce/scroll chelou iOS en mode app
  try {
    document.documentElement.style.height = "100%";
    document.body.style.height = "100%";
  } catch (_) {}

  // Routing app : en standalone, on limite l'expérience à 4 pages utiles.
  // L'app démarre via /app.html (manifest start_url), mais si l'utilisateur ouvre autre chose,
  // on le ramène vers une page utile (connexion ou coffre).
  const allowed = new Set([
    "/app.html",
    "/login.html",
    "/register.html",
    "/dashboard.html",
    "/offers.html",
  ]);

  const path = window.location.pathname || "/";

  // Normalisation : / et /index.html -> site web. En app, on n'affiche pas la home marketing.
  const isHome = path === "/" || path === "/index.html";

  if (isHome) {
    // On laisse le temps au navigateur de peindre (évite un blanc sur certains iPhone)
    window.addEventListener("load", () => {
      window.location.replace("/app.html");
    });
    return;
  }

  if (!allowed.has(path)) {
    window.addEventListener("load", () => {
      window.location.replace("/app.html");
    });
  }
})();
