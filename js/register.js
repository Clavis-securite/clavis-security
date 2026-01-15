(() => {
  const form = document.getElementById("register-form");
  if (!form) return;

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const email = (form.querySelector("input[name=\\"email\\"]")?.value || "").trim();
    const password = form.querySelector("input[name=\\"password\\"]")?.value || "";
    const btn = form.querySelector("button[type=\\"submit\\"]");
    const old = btn ? btn.textContent : "";
    if (btn) { btn.disabled = true; btn.textContent = "Création..."; }
    try {
      await signUp(email, password);
      const url = new URL("thankyou.html", window.location.origin);
      url.searchParams.set("registered", "1");
      url.searchParams.set("email", email);
      window.location.href = url.pathname + url.search;
    } catch (e) {
      alert("Oups... impossible de créer le compte. Vérifie ton email et réessaie.");
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = old; }
    }
  });
})();
