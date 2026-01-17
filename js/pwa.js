// js/pwa.js
let deferredPrompt = null;

// Supporte 2 IDs possibles (au cas où selon les pages)
const installBtn =
  document.getElementById("installAppBtn") ||
  document.getElementById("installBtn");

// 1) ✅ Enregistrement du Service Worker (sinon "Service workers" reste vide)
window.addEventListener("load", async () => {
  try {
    if ("serviceWorker" in navigator) {
      await navigator.serviceWorker.register("/service-worker.js");
      // console.log("✅ Service Worker enregistré");
    }
  } catch (err) {
    console.warn("Service Worker non enregistré:", err);
  }
});

// 2) ✅ Android / PC : interception du prompt d'installation
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  if (installBtn) installBtn.hidden = false;
});

// 3) ✅ Click bouton : lance l'installation (si possible)
if (installBtn) {
  installBtn.addEventListener("click", async () => {
    // iOS : pas de prompt automatique
    const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    const isInStandalone =
      window.matchMedia?.("(display-mode: standalone)")?.matches ||
      window.navigator.standalone === true;

    if (isIOS && !isInStandalone) {
      alert(
        "Pour installer l’application :\n\n" +
          "1) Appuie sur Partager (⬆️)\n" +
          "2) Choisis “Sur l’écran d’accueil”\n" +
          "3) Valide\n\n" +
          "Clavis sera installée comme une vraie application."
      );
      return;
    }

    // Android / PC
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;

    deferredPrompt = null;
    installBtn.hidden = true;
  });
}

// 4) ✅ Si déjà installée : on cache le bouton
(() => {
  const isInStandalone =
    window.matchMedia?.("(display-mode: standalone)")?.matches ||
    window.navigator.standalone === true;

  if (installBtn && isInStandalone) installBtn.hidden = true;
})();
// Auto refresh quand un nouveau SW prend la main
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    window.location.reload();
  });
}
