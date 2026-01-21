// js/pages/dashboard.page.js
// Main dashboard logic extracted from inline scripts (refonte pro).
// Depends on: supabase.js, crypto.js, core/ui.js

document.addEventListener("DOMContentLoaded", () => {
  const toast = (msg, type="info") => (window.CS_UI && CS_UI.toast) ? CS_UI.toast(msg, type) : console.log(msg);

  // app bottom bar only in app mode
  try {
    if (document.documentElement.classList.contains("app-mode")) {
      const bb = document.querySelector(".app-bottom");
      if (bb) bb.style.display = "block";
      const btnAdd = document.getElementById("btnAdd");
      if (btnAdd) btnAdd.style.display = "none";
    }
  } catch (_) {}


  // ==========================
  // État
  // ==========================
  let session = null;
  let profile = null;
  let items = [];

  let opened = false;
  let vaultKey = null;
  let vaultSaltB64 = null;

  let autoLockTimer = null;
  const AUTO_LOCK_MS = 10 * 60 * 1000; // 10 minutes

  // ==========================
  // Utilitaires
  // ==========================
  function message(txt){ alert(txt); }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, s => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    }[s]));
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      message("✅ Copié !");
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      message("✅ Copié !");
    }
  }

  function isPremium() {
    return profile && (profile.plan === "annual" || profile.plan === "lifetime");
  }

  function startAutoLockTimer() {
    if (autoLockTimer) clearTimeout(autoLockTimer);
    autoLockTimer = setTimeout(() => closeCoffre(true), AUTO_LOCK_MS);
  }

  function updatePdfButton() {
    const btn = document.getElementById("exportPdfBtn");
    if (!btn) return;
    btn.disabled = !(opened && vaultKey && isPremium());
  }

  function setCoffreUI() {
    const pill = document.getElementById('vaultState');
    const openBtn = document.getElementById('unlockBtn');
    const closeBtn = document.getElementById('lockBtn');
    const note = document.getElementById('vaultNote');

    if (opened) {
      pill.textContent = "OUVERT";
      pill.classList.remove("lock");
      pill.classList.add("ok");
      openBtn.disabled = true;
      closeBtn.disabled = false;
      note.textContent = "Votre coffre est ouvert. Pensez à le fermer quand vous avez fini (fermeture auto).";
    } else {
      pill.textContent = "FERMÉ";
      pill.classList.add("lock");
      pill.classList.remove("ok");
      openBtn.disabled = false;
      closeBtn.disabled = true;
      note.textContent = "Votre coffre est fermé. Ouvrez-le pour afficher ou copier vos informations.";
    }

    updatePdfButton();
  }

  // ==========================
  // Supabase
  // ==========================
  async function loadProfile() {
    const { data, error } = await supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (error) throw error;
    profile = data;

    let offerText = "Gratuit (jusqu’à 15 éléments)";
    if (profile.plan === "annual") offerText = "Premium (abonnement)";
    if (profile.plan === "lifetime") offerText = "Premium (à vie)";

    document.getElementById("planLine").textContent = `Offre : ${offerText}`;

    if (profile.plan === "free") {
      document.getElementById("limitNote").textContent = "Vous êtes en offre gratuite : 15 éléments maximum.";
    } else {
      document.getElementById("limitNote").textContent = "Offre Premium : éléments illimités + copie PDF.";
    }
  }

  async function ensureVaultSalt() {
    if (profile.vault_salt) {
      vaultSaltB64 = profile.vault_salt;
      return vaultSaltB64;
    }

    const newSalt = CryptoV1.newSaltB64();
    const { error } = await supabaseClient
      .from("profiles")
      .update({ vault_salt: newSalt })
      .eq("id", session.user.id);

    if (error) throw error;

    profile.vault_salt = newSalt;
    vaultSaltB64 = newSalt;
    return newSalt;
  }

  async function loadItems() {
    const { data, error } = await supabaseClient
      .from("vault_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    items = data || [];
    document.getElementById("itemsInfo").textContent = `${items.length} élément(s) enregistré(s).`;
    renderItems();
  }

  // ==========================
  // Fenêtre "ouvrir"
  // ==========================
  function openUnlockModal() {
    document.getElementById("unlockError").style.display = "none";
    document.getElementById("unlockError").textContent = "";
    document.getElementById("unlockPassword").value = "";
    document.getElementById("unlockModal").style.display = "block";
    setTimeout(() => document.getElementById("unlockPassword").focus(), 50);
  }

  function closeUnlockModal() {
    document.getElementById("unlockModal").style.display = "none";
  }

  async function openCoffreWithPassword(pwd) {
    await ensureVaultSalt();
    vaultKey = await CryptoV1.deriveKeyFromPassword(pwd, vaultSaltB64);
    opened = true;
    setCoffreUI();
    renderItems();
    startAutoLockTimer();
  }

  function closeCoffre(isAuto = false) {
    opened = false;
    vaultKey = null;
    if (autoLockTimer) clearTimeout(autoLockTimer);
    autoLockTimer = null;
    setCoffreUI();
    renderItems();
    message(isAuto ? "🔒 Coffre fermé automatiquement." : "🔒 Coffre fermé.");
  }

  // ==========================
  // Liste
  // ==========================
  function renderItems() {
    const q = (document.getElementById("search").value || "").toLowerCase();
    const list = document.getElementById("itemsList");
    list.innerHTML = "";

    const filtered = items.filter(it => (it.title || "").toLowerCase().includes(q));

    if (filtered.length === 0) {
      list.innerHTML = `<div style="color:var(--muted);">Aucun résultat.</div>`;
      return;
    }

    filtered.forEach(it => {
      const row = document.createElement("div");
      row.style.borderRadius = "16px";
      row.style.padding = "10px 12px";
      row.style.background = "rgba(255,255,255,.05)";
      row.style.border = "1px solid rgba(255,255,255,.12)";
      row.style.display = "flex";
      row.style.justifyContent = "space-between";
      row.style.alignItems = "center";
      row.style.gap = "12px";

      row.innerHTML = `
        <div>
          <strong>${escapeHtml(it.title)}</strong><br />
          <span style="color: rgba(255,255,255,.65); font-size: 13px;">
            ${opened ? "Coffre ouvert" : "Coffre verrouillé"}
          </span>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap; justify-content:flex-end;">
          <button class="btn small" data-action="view">Voir</button>
          <button class="btn small" data-action="copy-user">Copier identifiant</button>
          <button class="btn small" data-action="copy-pass">Copier mot de passe</button>
          <button class="btn small" data-action="delete">Supprimer</button>
        </div>
      `;

      function getIVs(item){
        // ✅ compat : si tu as 1 seul IV, on prend crypto_iv
        return {
          uiv: item.username_iv || item.crypto_iv,
          piv: item.password_iv || item.crypto_iv,
          urliv: item.url_iv || item.crypto_iv,
          niv: item.notes_iv || item.crypto_iv
        };
      }

      row.querySelector('[data-action="view"]').addEventListener('click', async () => {
        if (!opened || !vaultKey) return message("Ouvrez votre coffre pour afficher.");

        try {
          const { uiv, piv, urliv, niv } = getIVs(it);
          const username = await CryptoV1.decryptText(it.username_encrypted, uiv, vaultKey);
          const pwd = await CryptoV1.decryptText(it.password_encrypted, piv, vaultKey);
          const url = it.url_encrypted ? await CryptoV1.decryptText(it.url_encrypted, urliv, vaultKey) : "";
          const notes = it.notes_encrypted ? await CryptoV1.decryptText(it.notes_encrypted, niv, vaultKey) : "";

          startAutoLockTimer();
          message(
            `${it.title}\n\nIdentifiant : ${username}\nMot de passe : ${pwd}` +
            (url ? `\nSite : ${url}` : "") +
            (notes ? `\nRemarques : ${notes}` : "")
          );
        } catch {
          message("Oups… impossible d’afficher. Vérifiez que le coffre est bien ouvert.");
        }
      });

      row.querySelector('[data-action="copy-user"]').addEventListener('click', async () => {
        if (!opened || !vaultKey) return message("Ouvrez votre coffre pour copier.");

        try {
          const { uiv } = getIVs(it);
          const username = await CryptoV1.decryptText(it.username_encrypted, uiv, vaultKey);
          await copyToClipboard(username);
          startAutoLockTimer();
        } catch {
          message("Oups… impossible de copier.");
        }
      });

      row.querySelector('[data-action="copy-pass"]').addEventListener('click', async () => {
        if (!opened || !vaultKey) return message("Ouvrez votre coffre pour copier.");

        try {
          const { piv } = getIVs(it);
          const pwd = await CryptoV1.decryptText(it.password_encrypted, piv, vaultKey);
          await copyToClipboard(pwd);
          startAutoLockTimer();
        } catch {
          message("Oups… impossible de copier.");
        }
      });

      row.querySelector('[data-action="delete"]').addEventListener('click', async () => {
        if (!confirm(`Supprimer "${it.title}" ?`)) return;

        const { error } = await supabaseClient.from("vault_items").delete().eq("id", it.id);
        if (error) return message("Oups… impossible de supprimer.");

        items = items.filter(x => x.id !== it.id);
        document.getElementById("itemsInfo").textContent = `${items.length} élément(s) enregistré(s).`;
        renderItems();
      });

      list.appendChild(row);
    });
  }

  // ==========================
  // Ajouter (✅ corrigé pour table actuelle)
  // ==========================
  async function addItem(e) {
    e.preventDefault();

    if (!opened || !vaultKey) return message("Ouvrez votre coffre avant d’enregistrer.");

    if (profile.plan === "free" && items.length >= 15) {
      document.getElementById("limitNote").textContent =
        "Limite atteinte (15). Passez en Premium dans la page Offres.";
      return message("Vous avez atteint la limite de l’offre gratuite.");
    }

    const title = document.getElementById("title").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("secretPassword").value;
    const url = document.getElementById("url").value.trim();
    const notes = document.getElementById("notes").value.trim();

    try {
      await ensureVaultSalt();

      // ✅ 1 seul IV pour tous les champs (compat “ancienne table”)
      const iv = CryptoV1.newIvB64();

      const usernameEnc = await CryptoV1.encryptText(username, vaultKey, iv);
      const passwordEnc = await CryptoV1.encryptText(password, vaultKey, iv);
      const urlEnc = url ? await CryptoV1.encryptText(url, vaultKey, iv) : null;
      const notesEnc = notes ? await CryptoV1.encryptText(notes, vaultKey, iv) : null;

      const payload = {
        user_id: session.user.id,
        title,

        username_encrypted: usernameEnc,
        password_encrypted: passwordEnc,
        url_encrypted: urlEnc,
        notes_encrypted: notesEnc,

        crypto_iv: iv,
        crypto_salt: vaultSaltB64
      };

      const { data, error } = await supabaseClient
        .from("vault_items")
        .insert(payload)
        .select("*")
        .single();

      if (error) throw error;

      document.getElementById("addForm").reset();
      items.unshift(data);
      document.getElementById("itemsInfo").textContent = `${items.length} élément(s) enregistré(s).`;
      renderItems();
      startAutoLockTimer();

      message("✅ Enregistré.");
    } catch {
      message("Oups… impossible d’enregistrer. Réessayez.");
    }
  }

  // ==========================
  // PDF (Premium)
  // ==========================
  async function exportAllToPdf() {
    if (!isPremium()) return message("Cette option est réservée aux abonnés Premium.");
    if (!opened || !vaultKey) return message("Ouvrez votre coffre pour faire une copie PDF.");

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "mm", format: "a4" });

    const left = 14;
    let y = 18;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Clavis-security — Copie PDF", left, y);

    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Compte : ${session.user.email}`, left, y);
    y += 6;

    const offer = (profile.plan === "lifetime") ? "Premium à vie" : "Premium (abonnement)";
    doc.text(`Offre : ${offer}`, left, y);
    y += 6;

    const now = new Date();
    doc.text(`Date : ${now.toLocaleString("fr-FR")}`, left, y);
    y += 10;

    doc.setFontSize(9);
    doc.text("Mes informations :", left, y);
    y += 6;

    doc.line(left, y, 196, y);
    y += 6;

    for (let i = 0; i < items.length; i++) {
      const it = items[i];

      const uiv = it.username_iv || it.crypto_iv;
      const piv = it.password_iv || it.crypto_iv;
      const urliv = it.url_iv || it.crypto_iv;
      const niv = it.notes_iv || it.crypto_iv;

      let username = "";
      let pwd = "";
      let url = "";
      let notes = "";

      try {
        username = await CryptoV1.decryptText(it.username_encrypted, uiv, vaultKey);
        pwd = await CryptoV1.decryptText(it.password_encrypted, piv, vaultKey);
        url = it.url_encrypted ? await CryptoV1.decryptText(it.url_encrypted, urliv, vaultKey) : "";
        notes = it.notes_encrypted ? await CryptoV1.decryptText(it.notes_encrypted, niv, vaultKey) : "";
      } catch {
        username = "(illisible)";
        pwd = "(illisible)";
      }

      const block = [
        `• ${it.title}`,
        `  Identifiant : ${username}`,
        `  Mot de passe : ${pwd}`,
        url ? `  Site : ${url}` : null,
        notes ? `  Remarques : ${notes}` : null
      ].filter(Boolean);

      const needed = block.length * 5 + 6;
      if (y + needed > 285) {
        doc.addPage();
        y = 18;
      }

      doc.setFont("helvetica", "bold");
      doc.text(block[0], left, y);
      y += 5;

      doc.setFont("helvetica", "normal");
      for (let j = 1; j < block.length; j++) {
        const lines = doc.splitTextToSize(block[j], 180);
        for (const line of lines) {
          if (y > 285) {
            doc.addPage();
            y = 18;
          }
          doc.text(line, left, y);
          y += 5;
        }
      }

      y += 4;
      doc.line(left, y, 196, y);
      y += 6;
    }

    const safeDate = now.toISOString().slice(0, 10);
    doc.save(`clavis-copie-${safeDate}.pdf`);
    startAutoLockTimer();
  }

  // ==========================
  // Init
  // ==========================
  async function init() {
    session = await requireAuth();

    const badge = document.getElementById("userBadge");
    if (badge) badge.textContent = "👤 " + (session.user.email || "Utilisateur");

    document.getElementById("logoutBtn").addEventListener("click", async () => {
      await signOut();
      window.location.href = "login.html";
    });
    const logoutMobile = document.getElementById("logoutBtnMobile");
    if (logoutMobile) logoutMobile.addEventListener("click", async () => {
      await signOut();
      window.location.href = "login.html";
    });

    await loadProfile();
    await loadItems();

    document.getElementById("search").addEventListener("input", renderItems);

    document.getElementById("unlockBtn").addEventListener("click", openUnlockModal);
    document.getElementById("lockBtn").addEventListener("click", () => closeCoffre(false));
    document.getElementById("exportPdfBtn").addEventListener("click", exportAllToPdf);

    document.getElementById("unlockCancel").addEventListener("click", closeUnlockModal);
    document.getElementById("unlockForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const pwd = document.getElementById("unlockPassword").value;

      try {
        await openCoffreWithPassword(pwd);
        closeUnlockModal();
        message("✅ Coffre ouvert.");
      } catch {
        const el = document.getElementById("unlockError");
        el.style.display = "block";
        el.textContent = "Mot de passe incorrect. Réessayez.";
      }
    });

    document.getElementById("addForm").addEventListener("submit", addItem);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden && opened) closeCoffre(true);
    });

    setCoffreUI();
  }

  init().catch(() => {
    alert("Oups… impossible d’ouvrir cette page. Reconnectez-vous.");
    window.location.href = "login.html";
  });

});
