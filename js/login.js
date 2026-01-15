// js/login.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailInput = form.querySelector('input[name="email"]');
    const passwordInput = form.querySelector('input[name="password"]');

    if (!emailInput || !passwordInput) {
      alert("Formulaire incomplet.");
      return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      alert("Merci de renseigner ton email et ton mot de passe.");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (error) {
        alert("Email ou mot de passe incorrect.");
        return;
      }

      window.location.href = "/dashboard.html";
    } catch (err) {
      console.error(err);
      alert("Une erreur est survenue. Réessaie.");
    }
  });
});
