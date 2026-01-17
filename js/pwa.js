// js/pwa.js
// - Android/PC (Chrome/Edge): bouton "Installer l'app" -> prompt natif.
// - iPhone/iPad (Safari): bouton -> affiche une aide inline (pas de banniere, pas de popup).

let deferredPrompt = null;

const installButtons = Array.from(document.querySelectorAll('.js-install'));
const helpBox = document.getElementById('installHelp');

function detectIOS() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function isStandalone() {
  // iOS
  if (window.navigator.standalone === true) return true;
  // Android/desktop
  return !!(window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
}

function showInstallButtons() {
  installButtons.forEach((b) => (b.hidden = false));
}

function hideInstallButtons() {
  installButtons.forEach((b) => (b.hidden = true));
}

function showIOSHelp() {
  if (!helpBox) return;
  helpBox.hidden = false;
  helpBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideIOSHelp() {
  if (!helpBox) return;
  helpBox.hidden = true;
}

// Etat initial
if (isStandalone()) {
  hideInstallButtons();
  hideIOSHelp();
} else if (detectIOS()) {
  // iOS: pas de beforeinstallprompt -> on montre le bouton tout de suite
  showInstallButtons();
}

// Android/PC: on recupere l'evenement pour declencher le prompt via NOTRE bouton
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (!isStandalone()) showInstallButtons();
});

// Clic sur le bouton
installButtons.forEach((btn) => {
  btn.addEventListener('click', async () => {
    // Android/PC
    if (deferredPrompt) {
      deferredPrompt.prompt();
      try {
        await deferredPrompt.userChoice;
      } catch (_) {
        // ignore
      }
      deferredPrompt = null;
      // Le navigateur gerera la suite; on masque le bouton pour eviter de spam.
      hideInstallButtons();
      hideIOSHelp();
      return;
    }

    // iOS (ou autre cas sans prompt): on affiche l'aide inline
    if (detectIOS()) {
      showIOSHelp();
    }
  });
});

// Quand l'app est installee
window.addEventListener('appinstalled', () => {
  hideInstallButtons();
  hideIOSHelp();
});
