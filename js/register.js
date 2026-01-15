// /js/register.js
// Inscription (Supabase) — redirige vers thankyou (vérif email).

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('register-form');
  if (!form) return;

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
      btn.textContent = 'Création...';
    }

    try {
      // signUp() est défini dans /js/supabase.js
      if (typeof signUp !== 'function') {
        console.error('signUp() introuvable. Vérifie que /js/supabase.js est bien chargé AVANT /js/register.js');
        alert("Une erreur est survenue. Réessaie.");
        return;
      }

      await signUp(email, password);

      const url = new URL('/thankyou.html', window.location.origin);
      url.searchParams.set('registered', '1');
      url.searchParams.set('email', email);
      window.location.href = url.pathname + url.search;
    } catch (err) {
      console.error('Register error:', err);
      alert("Oups… impossible de créer le compte. Vérifie ton email et réessaie.");
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = old;
      }
    }
  });
});
