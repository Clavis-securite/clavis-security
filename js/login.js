// /js/login.js
// Connexion (Supabase) — simple, robuste, compatible "pretty URLs".

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  if (!form) return;

  // In APP mode, "Compte" tab points here. If already connected, show a simple account screen.
  (async () => {
    try {
      const isAppPhone = document.documentElement.classList.contains('app-phone');
      if (!isAppPhone || typeof getSession !== 'function') return;
      const session = await getSession();
      if (!session) return;

      // Hide login form and replace with account actions
      form.style.display = 'none';

      const card = form.closest('section') || form.parentElement;
      if (!card) return;

      const wrap = document.createElement('div');
      wrap.className = 'cs-card';
      wrap.style.marginTop = '12px';
      wrap.innerHTML = `
        <h2 style="margin:0 0 6px;" data-i18n="account_heading">Votre compte</h2>
        <p class="cs-muted" style="margin:0 0 14px;" data-i18n="account_text">Gérez votre langue et déconnectez-vous en un geste.</p>
        <div style="display:grid; gap:10px;">
          <button class="cs-btn cs-primary cs-btn-full" type="button" id="goVaultBtn" data-i18n="btn_back_vault">Retour au coffre</button>
          <button class="cs-btn cs-ghost cs-btn-full" type="button" id="logoutBtnApp" data-i18n="btn_logout">Déconnexion</button>
        </div>
      `;
      card.appendChild(wrap);

      document.getElementById('goVaultBtn')?.addEventListener('click', () => {
        window.location.href = '/dashboard.html';
      });

      document.getElementById('logoutBtnApp')?.addEventListener('click', async () => {
        try {
          await signOut();
        } catch (e) {
          console.error(e);
        }
        window.location.href = '/login.html';
      });
    } catch (e) {
      console.warn(e);
    }
  })();

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
