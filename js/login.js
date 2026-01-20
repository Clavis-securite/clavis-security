// /js/login.js
// Connexion (Supabase) — robuste, sans régression.

(function () {
  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(() => {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = (form.querySelector('input[name="email"]')?.value || '').trim();
      const password = form.querySelector('input[name="password"]')?.value || '';

      const t = (k, vars) => { try { return window.clavisT ? window.clavisT(k, vars) : k; } catch (_) { return k; } };

      if (!email || !password) {
        alert(t('msg_fill_email_password'));
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      const old = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = t('btn_login'); }

      try {
        if (typeof signIn !== 'function') {
          console.error('signIn() introuvable. Vérifie que /js/supabase.js est bien chargé.');
          alert(t('msg_generic_error'));
          return;
        }

        await signIn(email, password);

        // Support ?next=/offers.html etc (relative only)
        const params = new URLSearchParams(window.location.search);
        const next = params.get('next');
        if (next && typeof next === 'string' && next.startsWith('/') && !next.startsWith('//')) {
          window.location.href = next;
        } else {
          window.location.href = '/dashboard.html';
        }
      } catch (err) {
        console.error('Login error:', err);
        alert('Oups… email ou mot de passe incorrect.');
      } finally {
        if (btn) { btn.disabled = false; btn.textContent = old || t('btn_login'); }
      }
    });
  });
})();
