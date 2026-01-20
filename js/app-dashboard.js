
// /js/app-dashboard.js
// "App phone" UX only: tap item -> details view, no overlays, minimal add flow.
// Does nothing on web or desktop.

(function () {
  const root = document.documentElement;
  if (!root.classList.contains('app-phone')) return;

  function $(id) { return document.getElementById(id); }

  const addForm = $('addForm');
  const itemsCard = $('itemsList') ? $('itemsList').closest('.card') : null;
  const detailCard = $('appDetailCard');

  // Ensure premium CTA is visible in app-phone only
  const premiumWrap = document.querySelector('.app-premium-cta');
  if (premiumWrap) premiumWrap.setAttribute('aria-hidden', 'false');

  // Hide "site" extras already via app.css

  // Make add form minimal (Nom + Identifiant + Mot de passe)
  function simplifyAddForm() {
    if (!addForm) return;
    // Required fields
    const title = addForm.querySelector('input[name="title"], input#title');
    const user = addForm.querySelector('input[name="username"], input#username');
    const pass = addForm.querySelector('input[name="password"], input#password');

    // If fields exist, set placeholders
    if (title) { title.placeholder = 'Nom (ex : Gmail)'; title.required = true; }
    if (user) { user.placeholder = 'Identifiant'; user.required = true; }
    if (pass) { pass.placeholder = 'Mot de passe'; pass.required = true; }

    // Hide optional fields in app mode
    const optionalSelectors = [
      'input[name="url"]', 'input#url',
      'textarea[name="notes"]', 'textarea#notes',
    ];
    optionalSelectors.forEach((sel) => {
      const el = addForm.querySelector(sel);
      if (el) {
        const field = el.closest('.field') || el.parentElement;
        if (field) field.style.display = 'none';
      }
    });
  }

  function showListView() {
    if (addForm) addForm.closest('.card').style.display = '';
    if (itemsCard) itemsCard.style.display = '';
    if (detailCard) detailCard.style.display = 'none';
    // Keep the add form visible (simple) – user asked only + opens add; we’ll keep add card but we’ll scroll to it.
  }

  function showDetailView() {
    if (itemsCard) itemsCard.style.display = 'none';
    // Hide add card in detail view
    const addCard = addForm ? addForm.closest('.card') : null;
    if (addCard) addCard.style.display = 'none';
    if (detailCard) detailCard.style.display = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function setDetailLoading(titleText) {
    if ($('appDetailTitle')) $('appDetailTitle').textContent = titleText || '';
    if ($('appDetailUser')) $('appDetailUser').value = '';
    if ($('appDetailPass')) $('appDetailPass').value = '';
  }

  // Decrypt helpers rely on globals from dashboard inline script: opened, vaultKey, CryptoV1, getIVs, startAutoLockTimer, message
  let currentItem = null;

  async function openDetailsForItem(item) {
    currentItem = item;
    showDetailView();
    setDetailLoading(item?.title || '');

    if (!(window.opened && window.vaultKey)) {
      // Ask user to unlock vault using existing modal flow
      if (typeof window.openUnlockModal === 'function') window.openUnlockModal();
      // Back to list (so user can try again)
      showListView();
      return;
    }

    try {
      const { uiv, piv } = window.getIVs(item);
      const username = await window.CryptoV1.decryptText(item.username_encrypted, uiv, window.vaultKey);
      const pwd = await window.CryptoV1.decryptText(item.password_encrypted, piv, window.vaultKey);

      if ($('appDetailTitle')) $('appDetailTitle').textContent = item.title || '';
      if ($('appDetailUser')) $('appDetailUser').value = username || '';
      if ($('appDetailPass')) $('appDetailPass').value = pwd || '';

      if (typeof window.startAutoLockTimer === 'function') window.startAutoLockTimer();
    } catch (e) {
      if (typeof window.message === 'function') window.message('Oups… impossible d’afficher cet élément.');
      showListView();
    }
  }

  function wireDetailButtons() {
    const back = $('appBackBtn');
    const copyUser = $('appCopyUserBtn');
    const copyPass = $('appCopyPassBtn');
    const togglePass = $('appTogglePassBtn');
    const del = $('appDeleteBtn');

    if (back) back.addEventListener('click', () => {
      // Restore list
      const addCard = addForm ? addForm.closest('.card') : null;
      if (addCard) addCard.style.display = '';
      if (itemsCard) itemsCard.style.display = '';
      if (detailCard) detailCard.style.display = 'none';
    });

    if (togglePass) togglePass.addEventListener('click', () => {
      const input = $('appDetailPass');
      if (!input) return;
      const isPwd = input.type === 'password';
      input.type = isPwd ? 'text' : 'password';
      togglePass.textContent = isPwd ? 'Masquer' : 'Afficher';
    });

    async function copyValue(val, okMsg) {
      try {
        await navigator.clipboard.writeText(String(val || ''));
        if (typeof window.message === 'function') window.message(okMsg);
        if (typeof window.startAutoLockTimer === 'function') window.startAutoLockTimer();
      } catch (_) {
        if (typeof window.message === 'function') window.message('Impossible de copier.');
      }
    }

    if (copyUser) copyUser.addEventListener('click', () => copyValue($('appDetailUser')?.value, 'Identifiant copié.'));
    if (copyPass) copyPass.addEventListener('click', () => copyValue($('appDetailPass')?.value, 'Mot de passe copié.'));

    if (del) del.addEventListener('click', () => {
      if (!currentItem) return;
      // Reuse existing delete button logic if available
      // The dashboard inline script uses a delete handler per row; we provide a minimal equivalent:
      if (!confirm('Supprimer cet élément ?')) return;
      try {
        // call existing deletion flow if exists
        if (typeof window.deleteItemById === 'function') {
          window.deleteItemById(currentItem.id);
          return;
        }
      } catch (_) {}
      // Fallback: trigger click on the corresponding row delete if present
      const list = $('itemsList');
      if (list) {
        const node = list.querySelector(`[data-item-id="${currentItem.id}"] [data-action="delete"]`);
        if (node) node.click();
      }
      // Go back
      const addCard = addForm ? addForm.closest('.card') : null;
      if (addCard) addCard.style.display = '';
      if (itemsCard) itemsCard.style.display = '';
      if (detailCard) detailCard.style.display = 'none';
    });
  }

  function makeRowsTapOpenDetails() {
    const list = $('itemsList');
    if (!list) return;

    // Hide action buttons in rows (app wants tap -> details)
    const style = document.createElement('style');
    style.textContent = `
      .app-phone #itemsList [data-action] { display: none !important; }
      .app-phone #itemsList { gap: 8px !important; }
    `;
    document.head.appendChild(style);

    // Add delegation: row click opens detail
    list.addEventListener('click', async (e) => {
      const row = e.target.closest('[data-item-id]');
      if (!row) return;
      const id = row.getAttribute('data-item-id');
      const item = (window.items || []).find((it) => String(it.id) === String(id));
      if (!item) return;
      await openDetailsForItem(item);
    });
  }

  function tagRowsWithIds() {
    // Patch renderItems to tag rows with data-item-id for delegation
    // We don't rewrite renderItems; we intercept after it runs.
    const list = $('itemsList');
    if (!list) return;
    Array.from(list.children).forEach((child) => {
      // try to infer title from strong; match item by title+status as last resort
      if (!child.getAttribute('data-item-id')) {
        const title = child.querySelector('strong')?.textContent?.trim();
        const item = (window.items || []).find((it) => (it.title || '') === title);
        if (item) child.setAttribute('data-item-id', item.id);
      }
    });
  }

  function wirePlusToScroll() {
    const btnAdd = $('btnAdd');
    if (!btnAdd || !addForm) return;
    btnAdd.addEventListener('click', () => {
      // ensure add card visible, detail hidden
      const addCard = addForm.closest('.card');
      if (addCard) addCard.style.display = '';
      if (itemsCard) itemsCard.style.display = '';
      if (detailCard) detailCard.style.display = 'none';
      addCard?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const title = addForm.querySelector('input[name="title"], input#title');
      title?.focus();
    });
  }

  // When vault is locked, hide main content behind modal (no "superposition" feel)
  function patchVaultModal() {
    const modal = $('unlockModal');
    const main = $('mainContent');
    if (!modal || !main) return;

    // IMPORTANT:
    // In dashboard.html the unlock modal sits INSIDE <main id="mainContent">.
    // If we hide the whole <main>, we also hide the modal -> user sees a "black screen".
    // We only hide the main *content container* while keeping the modal visible.
    const mainContainer = main.querySelector(':scope > .container');

    // Observe display changes
    const obs = new MutationObserver(() => {
      const open = modal.style.display !== 'none';
      if (open) {
        document.body.classList.add('vault-locked');
        if (mainContainer) mainContainer.style.display = 'none';
        // Keep the modal above everything
        modal.style.zIndex = '99999';
      } else {
        document.body.classList.remove('vault-locked');
        if (mainContainer) mainContainer.style.display = '';
      }
    });
    obs.observe(modal, { attributes: true, attributeFilter: ['style'] });
  }

  // Hook into renderItems to tag rows every time
  function patchRenderItems() {
    if (typeof window.renderItems !== 'function') return;
    const original = window.renderItems;
    window.renderItems = function () {
      original();
      // tag rows and enable tap
      tagRowsWithIds();
    };
  }

  document.addEventListener('DOMContentLoaded', () => {
    simplifyAddForm();
    wireDetailButtons();
    patchRenderItems();
    makeRowsTapOpenDetails();
    wirePlusToScroll();
    patchVaultModal();

    // Ensure initial tagging if items already rendered
    setTimeout(tagRowsWithIds, 500);
  });
})();
