// js/pwa.js — Install banner (sans pop-up) + mémorisation fermeture
(() => {
  let deferredPrompt = null;

  // Bannière install (présente sur index/offers/faq/contact si tu veux)
  const banner = document.getElementById("installBanner");
  const btnNow = document.getElementById("installNowBtn");
  const btnHow = document.getElementById("installHowBtn");
  const btnClose = document.getElementById("installCloseBtn");
  const iosHint = document.getElementById("iosHint");

  // Ancien bouton éventuel (si certaines pages l'ont encore)
  const legacyInstallBtn =
    document.getElementById("installAppBtn") ||
    document.getElementById("installBtn");

  const ua = navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(ua);

  const isStandalone = () => {
    return (
      window.navigator.standalone === true ||
      (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches)
    );
  };

  // 1) Enregistre le SW (comme tu faisais)
  window.addEventListener("load", async () => {
    try {
      if ("serviceWorker" in navigator) {
        await navigator.serviceWorker.register("/service-worker.js");
      }
    } catch (err) {
      console.warn("Service Worker non enregistré:", err);
    }
  });

  // Déjà installé => on cache tout
  if (isStandalone()) {
    if (banner) banner.hidden = true;
    if (legacyInstallBtn) legacyInstallBtn.hidden = true;
    return;
  }

  // Si l'utilisateur a fermé la bannière une fois, on ne la montre plus
  const dismissed = localStorage.getItem("clavis_install_dismissed") === "1";
  if (dismissed) {
    if (banner) banner.hidden = true;
    if (legacyInstallBtn) legacyInstallBtn.hidden = true;
    return;
  }

  // Helpers
  const showBanner = () => {
    if (banner) banner.hidden = false;
  };
  const hideBanner = (remember = false) => {
    if (remember) localStorage.setItem("clavis_install_dismissed", "1");
    if (banner) banner.hidden = true;
    if (legacyInstallBtn) legacyInstallBtn.hidden = true;
  };

  // Fermeture bannière
  btnClose?.addEventListener("click", () => hideBanner(true));

  // iOS : pas de prompt => on affiche la bannière + bouton "Comment faire"
  if (isIOS) {
    showBanner();
    if (btnHow) btnHow.hidden = false;
    if (btnNow) btnNow.hidden = true;

    btnHow?.addEventListener("click", () => {
      if (!iosHint) return;
      iosHint.hidden = !iosHint.hidden;
    });

    // Si tu as encore un vieux bouton sur une page, on le masque
    if (legacyInstallBtn) legacyInstallBtn.hidden = true;

    return;
  }

  // Android / PC : capture prompt
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // On montre la bannière
    showBanner();
    if (btnNow) btnNow.hidden = false;
    if (btnHow) btnHow.hidden = true;

    // On masque un bouton legacy s'il existe
    if (legacyInstallBtn) legacyInstallBtn.hidden = true;
  });

  // Clic installer
  btnNow?.addEventListener("click", async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    try {
      await deferredPrompt.userChoice;
    } finally {
      deferredPrompt = null;
      hideBanner(true);
    }
  });

  window.addEventListener("appinstalled", () => {
    hideBanner(true);
  });

  // Auto refresh quand un nouveau SW prend la main (anti-cache)
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      window.location.reload();
    });
  }
})();
