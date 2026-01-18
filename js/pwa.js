// /js/pwa.js
// PWA helper:
// 1) Registers service-worker safely (no frameworks, static Netlify).
// 2) Handles "Installer l'application" button:
//    - Android/desktop (Chrome/Edge): native prompt.
//    - iPhone/iPad (Safari): inline help (no intrusive banner / pop-up).

(function () {
  const SW_URL = '/service-worker.js';
  const SW_SCOPE = '/';

  function detectIOS() {
    return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
  }

  function isStandalone() {
    // iOS
    if (window.navigator.standalone === true) return true;
    // Android/desktop
    return !!(window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
  }

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;

    // Avoid running on file:// and other unsupported schemes
    if (!window.location.origin.startsWith('http')) return;

    window.addEventListener('load', async () => {
      try {
        const reg = await navigator.serviceWorker.register(SW_URL, { scope: SW_SCOPE });

        // If a new SW is waiting, ask it to activate now.
        if (reg.waiting) {
          reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        }

        // When we detect an update installing, auto-activate once installed.
        reg.addEventListener('updatefound', () => {
          const nw = reg.installing;
          if (!nw) return;
          nw.addEventListener('statechange', () => {
            if (nw.state === 'installed' && navigator.serviceWorker.controller) {
              try { nw.postMessage({ type: 'SKIP_WAITING' }); } catch (_) {}
            }
          });
        });

        // Once the new SW takes control, reload ONCE to avoid stale bundles/caches.
        let reloaded = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (reloaded) return;
          reloaded = true;
          window.location.reload();
        });
      } catch (e) {
        // Silent: PWA must never break the site.
        console.log('SW registration skipped:', e?.message || e);
      }
    });
  }

  function setupInstallButton() {
    let deferredPrompt = null;

    const installButtons = Array.from(document.querySelectorAll('.js-install'));
    const helpBox = document.getElementById('installHelp');

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

    // Initial state
    if (isStandalone()) {
      hideInstallButtons();
      hideIOSHelp();
    } else if (detectIOS()) {
      // iOS: no beforeinstallprompt
      showInstallButtons();
    }

    // Android/desktop: capture native prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      if (!isStandalone()) showInstallButtons();
    });

    // Click handler
    installButtons.forEach((btn) => {
      btn.addEventListener('click', async () => {
        // Android/desktop
        if (deferredPrompt) {
          deferredPrompt.prompt();
          try { await deferredPrompt.userChoice; } catch (_) {}
          deferredPrompt = null;
          hideInstallButtons();
          hideIOSHelp();
          return;
        }

        // iOS help
        if (detectIOS()) {
          showIOSHelp();
        }
      });
    });

    // Installed
    window.addEventListener('appinstalled', () => {
      hideInstallButtons();
      hideIOSHelp();
    });

    // Optional: copy link helper (if the page provides a button)
    const copyBtn = document.querySelector('[data-copy-install-link]');
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          copyBtn.textContent = 'Lien copié ✅';
          setTimeout(() => (copyBtn.textContent = 'Copier le lien'), 1800);
        } catch (_) {
          // fallback: nothing
        }
      });
    }
  }

  // Boot
  registerServiceWorker();
  document.addEventListener('DOMContentLoaded', setupInstallButton);
})();
