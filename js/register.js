// /js/register.js
// Inscription (Supabase) — robuste, sans rechargement parasite.

(function () {
  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(() => {
    const form = document.getElementById('register-form');
    if (!form) return;

    const t = (k, vars) => { try { return window.clavisT ? window.clavisT(k, vars) : k; } catch (_) { return k; } };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = (form.querySelector('input[name="email"]')?.value || '').trim();
      const password = form.querySelector('input[name="password"]')?.value || '';

      if (!email || !password) {
        alert(t('msg_fill_email_password'));
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      const old = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = t('btn_register'); }

      try {
        if (typeof signUp !== 'function') {
          console.error('signUp() introuvable. Vérifie que /js/supabase.js est bien chargé.');
          alert(t('msg_generic_error'));
          return;
        }

        await signUp(email, password);

        const url = new URL('/thankyou.html', window.location.origin);
        url.searchParams.set('registered', '1');
        window.location.href = url.toString();
      } catch (err) {
        console.error('Register error:', err);
        alert('Oups… impossible de créer le compte. Vérifie ton email et réessaie.');
      } finally {
        if (btn) { btn.disabled = false; btn.textContent = old || t('btn_register'); }
      }
    });
  });
})();
