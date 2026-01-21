// js/login.js
// Auth: login (Supabase) — pro UX, respects ?next=
// Depends on supabase.js and optional core/ui.js.

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  if (!form) return;

  const toast = (msg, type="info") => (window.CS_UI && CS_UI.toast) ? CS_UI.toast(msg, type) : alert(msg);

  // Prefill email from URL (?email=...)
  try {
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");
    if (email) {
      const input = form.querySelector('input[name="email"]');
      if (input) input.value = email;
    }
  } catch (_) {}

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = (form.querySelector('input[name="email"]')?.value || "").trim();
    const password = form.querySelector('input[name="password"]')?.value || "";

    if (!email || !password) {
      toast("Renseigne ton email et ton mot de passe.", "error");
      return;
    }

    // UI: disable button
    const btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.dataset.prevText = btn.textContent; btn.textContent = "Connexion…"; }

    try {
      if (typeof signIn !== "function") throw new Error("supabase_missing");
      const { error } = await signIn(email, password);
      if (error) throw error;

      toast("Connecté ✅", "success");

      const params = new URLSearchParams(window.location.search);
      const next = params.get("next");
      const safeNext = (next && next.startsWith("/")) ? next : "/dashboard.html";

      window.location.href = safeNext;
    } catch (err) {
      console.error(err);
      const msg = (err && err.message) ? err.message : "Connexion impossible.";
      toast(msg.includes("Invalid") ? "Email ou mot de passe incorrect." : "Connexion impossible. Réessaie.", "error");
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = btn.dataset.prevText || "Se connecter"; }
    }
  });
});
