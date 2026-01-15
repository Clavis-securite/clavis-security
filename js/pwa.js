// js/pwa.js
(function () {
  // --- Service Worker ---
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/service-worker.js").catch(() => {});
    });
  }

  // --- Détection iPhone/iPad ---
  const isIOS = () => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const iOS = /iPad|iPhone|iPod/.test(ua);
    const iPadOS = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
    return iOS || iPadOS;
  };

  // --- Petit pop-up guide iPhone ---
  function showIOSInstallHelp() {
    const existing = document.getElementById("iosInstallHelp");
    if (existing) existing.remove();

    const wrap = document.createElement("div");
    wrap.id = "iosInstallHelp";
    wrap.style.position = "fixed";
    wrap.style.inset = "0";
    wrap.style.background = "rgba(0,0,0,.55)";
    wrap.style.backdropFilter = "blur(6px)";
    wrap.style.zIndex = "9999";
    wrap.style.display = "grid";
    wrap.style.placeItems = "center";
    wrap.style.padding = "16px";

    wrap.innerHTML = `
      <div style="
        width:min(520px, 92vw);
        border-radius:22px;
        border:1px solid rgba(255,255,255,.14);
        background: rgba(15,23,42,.92);
        box-shadow: 0 20px 70px rgba(0,0,0,.45);
        padding:16px 16px 14px;
        color: rgba(255,255,255,.9);
        font-family: inherit;
      ">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
          <div style="font-weight:700; font-size:16px;">Installer sur iPhone</div>
          <button id="iosClose" style="
            border:0; background:rgba(255,255,255,.10);
            color:#fff; border-radius:12px; padding:8px 10px; cursor:pointer;
          ">Fermer</button>
        </div>

        <div style="margin-top:10px; color: rgba(255,255,255,.75); line-height:1.45;">
          Apple ne permet pas l’installation automatique.
          Mais c’est très simple :
        </div>

        <ol style="margin:10px 0 0; padding-left:18px; color: rgba(255,255,255,.9);">
          <li>Ouvre ce site dans <b>Safari</b></li>
          <li>Appuie sur <b>Partager</b> (⬆️)</li>
          <li>Choisis <b>“Sur l’écran d’accueil”</b></li>
        </ol>

        <div style="margin-top:12px; color: rgba(255,255,255,.65); font-size:13px;">
          Ensuite, Clavis-security apparaîtra comme une vraie app sur ton écran.
        </div>
      </div>
    `;

    wrap.addEventListener("click", (e) => {
      if (e.target === wrap) wrap.remove();
    });

    document.body.appendChild(wrap);
    document.getElementById("iosClose")?.addEventListener("click", () => wrap.remove());
  }

  // --- Gestion bouton Installer ---
  const installBtn = document.getElementById("installBtn");
  let deferredPrompt = null;

  // Si iPhone -> on peut afficher un bouton qui ouvre l'aide
  if (installBtn && isIOS()) {
    installBtn.style.display = "inline-flex";
    installBtn.addEventListener("click", () => showIOSInstallHelp());
  }

  // Android / Desktop -> vrai prompt d'installation
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;

    if (installBtn) {
      installBtn.style.display = "inline-flex";
      installBtn.addEventListener("click", async () => {
        try {
          deferredPrompt.prompt();
          await deferredPrompt.userChoice;
        } catch {}
        deferredPrompt = null;
      }, { once: true });
    }
  });

  // Si déjà installée -> on cache le bouton
  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    if (installBtn) installBtn.style.display = "none";
  });
})();
