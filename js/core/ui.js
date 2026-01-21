// js/core/ui.js
// Lightweight UI helpers: toast + query helpers.
// No dependencies.

(function () {
  function ensureToastRoot() {
    let root = document.getElementById("cs-toast-root");
    if (root) return root;
    root = document.createElement("div");
    root.id = "cs-toast-root";
    root.setAttribute("aria-live", "polite");
    root.setAttribute("aria-atomic", "true");
    document.body.appendChild(root);
    return root;
  }

  function toast(message, type = "info", timeout = 3200) {
    try {
      const root = ensureToastRoot();
      const el = document.createElement("div");
      el.className = `cs-toast cs-toast--${type}`;
      el.textContent = String(message || "");
      root.appendChild(el);
      requestAnimationFrame(() => el.classList.add("show"));
      window.setTimeout(() => {
        el.classList.remove("show");
        window.setTimeout(() => el.remove(), 180);
      }, Math.max(1200, timeout));
    } catch (_) {
      // fallback
      alert(message);
    }
  }

  window.CS_UI = { toast };
})();
