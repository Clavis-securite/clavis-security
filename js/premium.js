// /js/premium.js
// Bouton "Passer à Premium" (utilisé surtout en app téléphone).
// Ne casse jamais le site : si la function Netlify n'est pas dispo, on redirige vers /offers.html.

(function () {
  async function startCheckout() {
    try {
      if (typeof getSession === 'function') {
        const session = await getSession();
        if (!session) {
          window.location.href = '/login.html?next=/dashboard.html';
          return;
        }
      }
    } catch (_) {
      // si session check échoue, on tente quand même
    }

    const btn = document.getElementById('appPremiumBtn');
    const old = btn ? btn.textContent : '';
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Ouverture...';
    }

    try {
      const res = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'annual' })
      });

      if (!res.ok) throw new Error('checkout_failed');
      const data = await res.json();
      if (data && data.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error('no_url');
    } catch (e) {
      console.log('checkout fallback:', e && (e.message || e));
      window.location.href = '/offers.html';
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = old || 'Passer à Premium';
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('appPremiumBtn');
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      startCheckout();
    });
  });
})();
