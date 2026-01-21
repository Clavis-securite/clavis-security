// /js/login.js
// Connexion (Supabase) — simple, robuste, compatible "pretty URLs".

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  if (!form) return;

  // Prefill email from URL (?email=...)
  try {
    const params = new URLSearchParams(window.location.search);
    const email = params.get('email');
    if (email) {
      const input = form.querySelector('input[name="email"]');
      if (input) input.value = email;
    }
  } catch (_) {}

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = (form.querySelector('input[name="email"]')?.value || '').trim();
    const password = form.querySelector('input[name="password"]')?.value || '';

    if (!email || !password) {
      alert('Merci de renseigner ton email et ton mot de passe.');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    const old = btn ? btn.textContent : '';
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Connexion...';
    }

    try {
      // signIn() est défini dans /js/supabase.js
      if (typeof signIn !== 'function') {
        console.error('signIn() introuvable. Vérifie que /js/supabase.js est bien chargé AVANT /js/login.js');
        alert("Une erreur est survenue. Réessaie.");
        return;
      }

      await signIn(email, password);

      // Optional return path (?next=/offers.html)
      let next = null;
      try {
        const params = new URLSearchParams(window.location.search);
        next = params.get('next');
      } catch (_) {}

      // Safety: allow only same-origin relative paths
      if (next && typeof next === 'string' && next.startsWith('/') && !next.startsWith('//')) {
        window.location.href = next;
      } else {
        window.location.href = '/dashboard.html';
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Oups… email ou mot de passe incorrect.');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = old;
      }
    }
  });
});
