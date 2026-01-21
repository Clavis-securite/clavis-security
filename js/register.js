// js/register.js
// Auth: register (Supabase) — pro UX, respects ?next=
// Depends on supabase.js and optional core/ui.js.

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("register-form");
  if (!form) return;

  const toast = (msg, type="info") => (window.CS_UI && CS_UI.toast) ? CS_UI.toast(msg, type) : alert(msg);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = (form.querySelector('input[name="email"]')?.value || "").trim();
    const password = form.querySelector('input[name="password"]')?.value || "";

    if (!email || !password) {
      toast("Renseigne un email et un mot de passe.", "error");
      return;
    }
    if (password.length < 8) {
      toast("Choisis un mot de passe d’au moins 8 caractères.", "error");
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.dataset.prevText = btn.textContent; btn.textContent = "Création…"; }

    try {
      if (typeof signUp !== "function") throw new Error("supabase_missing");
      const { error } = await signUp(email, password);
      if (error) throw error;

      toast("Compte créé ✅ Vérifie tes emails si demandé.", "success");

      const params = new URLSearchParams(window.location.search);
      const next = params.get("next");
      const safeNext = (next && next.startsWith("/")) ? next : "/dashboard.html";
      window.location.href = safeNext;
    } catch (err) {
      console.error(err);
      const msg = (err && err.message) ? err.message : "Inscription impossible.";
      toast(msg, "error");
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = btn.dataset.prevText || "Créer mon compte"; }
    }
  });
});
