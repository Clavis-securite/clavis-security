let deferredPrompt;
const installBtn = document.getElementById("installAppBtn");

// ANDROID / PC (Chrome, Edge)
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  if (installBtn) {
    installBtn.hidden = false;
  }
});

if (installBtn) {
  installBtn.addEventListener("click", async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;

    deferredPrompt = null;
    installBtn.hidden = true;
  });
}

// iOS (Safari)
const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
const isInStandalone = window.navigator.standalone === true;

if (isIOS && !isInStandalone && installBtn) {
  installBtn.hidden = false;
  installBtn.addEventListener("click", () => {
    alert(
      "Pour installer l’application :\n\n" +
      "1. Appuie sur le bouton Partager (⬆️)\n" +
      "2. Choisis “Sur l’écran d’accueil”\n" +
      "3. Valide\n\n" +
      "Clavis sera alors installée comme une vraie application."
    );
  });
}
