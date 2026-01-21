// js/premium.js
// Stripe checkout helper (Annual / Lifetime) with safe fallbacks.
// Requires supabase.js (getSession) and optional ui.js (CS_UI.toast).

(function () {
  function toast(msg, type="info"){ (window.CS_UI && CS_UI.toast) ? CS_UI.toast(msg,type) : console.log(msg); }

  async function startCheckout(plan="annual") {
    // Auth required for checkout (to attach metadata + enable premium flags)
    let session = null;
    try {
      if (typeof getSession === "function") session = await getSession();
    } catch (_) {}

    if (!session) {
      const next = encodeURIComponent(`/offers.html`);
      window.location.href = `/login.html?next=${next}`;
      return;
    }

    const payload = {
      plan,
      user_id: session.user.id,
      user_email: session.user.email,
      site_url: window.location.origin
    };

    try {
      const res = await fetch("/.netlify/functions/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const txt = await res.text().catch(()=>"");
        throw new Error(`checkout_failed_${res.status}_${txt}`);
      }

      const data = await res.json();
      if (data && data.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error("no_url");
    } catch (e) {
      console.error(e);
      toast("Impossible d’ouvrir le paiement. Réessaie dans quelques secondes.", "error");
      // fallback: keep user on offers
    }
  }

  // Expose globally
  window.CS_Checkout = { startCheckout };

  // Auto-bind buttons
  document.addEventListener("click", (ev) => {
    const btn = ev.target && ev.target.closest ? ev.target.closest("[data-checkout-plan]") : null;
    if (!btn) return;
    ev.preventDefault();
    const plan = btn.getAttribute("data-checkout-plan") || "annual";
    startCheckout(plan);
  });
})();
