// js/premium.js
// Stripe checkout helper (Annual / Lifetime) + binding for offers + in-app CTA.
// Requires supabase.js (getSession) and optional ui.js (CS_UI.toast).

(function () {
  function toast(msg, type = "info") {
    try {
      if (window.CS_UI && typeof window.CS_UI.toast === "function") {
        window.CS_UI.toast(msg, type);
      } else {
        console.log(`[${type}]`, msg);
      }
    } catch (_) {
      console.log(msg);
    }
  }

  function safeInternalPath(path, fallback="/offers.html") {
    if (!path || typeof path !== "string") return fallback;
    // Only allow internal paths to avoid open redirects
    if (path.startsWith("/")) return path;
    return fallback;
  }

  async function ensureSessionOrRedirect(nextPath="/offers.html") {
    let session = null;
    try {
      if (typeof getSession === "function") session = await getSession();
    } catch (_) {}

    if (!session) {
      const next = encodeURIComponent(safeInternalPath(nextPath, "/offers.html"));
      window.location.href = `/login.html?next=${next}`;
      return null;
    }
    return session;
  }

  async function startCheckout(plan = "annual", opts = {}) {
    const nextPath = opts.nextPath || window.location.pathname || "/offers.html";
    const session = await ensureSessionOrRedirect(nextPath);
    if (!session) return;

    const user_id = session.user.id;
    const user_email = session.user.email;
    const site_url = window.location.origin;

    const payload = { plan, user_id, user_email, site_url };

    toast("Ouverture du paiement sécurisé…", "info");

    const res = await fetch("/.netlify/functions/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      console.error("Checkout error:", res.status, txt);
      toast("Impossible d’ouvrir Stripe. Vérifie ta configuration (prix / clés).", "error");
      return;
    }

    const data = await res.json().catch(() => ({}));
    if (data && data.url) {
      window.location.href = data.url;
    } else {
      toast("Réponse Stripe invalide. Réessaie.", "error");
    }
  }

  // Expose globally for other scripts
  window.CS_Checkout = { startCheckout };

  // Auto-bind buttons on any page
  document.addEventListener("click", (ev) => {
    const btn = ev.target && ev.target.closest ? ev.target.closest("[data-checkout-plan]") : null;
    if (!btn) return;

    ev.preventDefault();
    const plan = btn.getAttribute("data-checkout-plan") || "annual";
    startCheckout(plan, { nextPath: window.location.pathname });
  });

  // In-app CTA button (dashboard/app)
  document.addEventListener("click", (ev) => {
    const t = ev.target;
    if (!t) return;
    const appBtn = (t.id === "appPremiumBtn") ? t : (t.closest ? t.closest("#appPremiumBtn") : null);
    if (!appBtn) return;

    ev.preventDefault();
    // Default plan from app CTA: annual
    startCheckout("annual", { nextPath: window.location.pathname });
  });
})();
