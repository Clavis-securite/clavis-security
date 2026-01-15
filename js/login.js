(() => {
  const form = document.getElementById("login-form");
  if (!form) return;
  try {
    const p = new URLSearchParams(window.location.search);
    const e = p.get("email");
    if (e) {
      const input = form.querySelector("input[name=\\"email\\"]");
      if (input) input.value = e;
    }
  } catch (err) {}
  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const email = (form.querySelector("input[name=\\"email\\"]")?.value || "").trim();
    const password = form.querySelector("input[name=\\"password\\"]")?.value || "";
    const btn = form.querySelector("button[type=\\"submit\\"]");
    const old = btn ? btn.textContent : "";
    if (btn) { btn.disabled = true; btn.textContent = "Connexion..."; }
    try {
      await signIn(email, password);
      window.location.href = "dashboard.html";
    } catch (e) {
      alert("Oups... email ou mot de passe incorrect. Réessaie.");
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = old; }
    }
  });
})();
