// js/crypto.js
// Crypto v2 — PBKDF2 + AES-GCM (WebCrypto)
// - Sel (salt) par user (stocké dans profiles.vault_salt)
// - IV par champ (stocké dans vault_items.username_iv, password_iv, etc.)
// - Zéro-knowledge : la DB ne voit jamais les secrets en clair

const CryptoV1 = (() => {
  const enc = new TextEncoder();
  const dec = new TextDecoder();

  function b64encode(bytes) {
    let bin = "";
    bytes.forEach(b => bin += String.fromCharCode(b));
    return btoa(bin);
  }

  function b64decode(b64) {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }

  function randomBytes(len) {
    const b = new Uint8Array(len);
    crypto.getRandomValues(b);
    return b;
  }

  // 16 bytes (salt KDF)
  function newSaltB64() {
    return b64encode(randomBytes(16));
  }

  // 12 bytes (IV AES-GCM recommandé)
  function newIvB64() {
    return b64encode(randomBytes(12));
  }

  async function deriveKeyFromPassword(password, saltB64, iterations = 600_000) {
    const salt = b64decode(saltB64);

    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      "PBKDF2",
      false,
      ["deriveKey"]
    );

    return crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  async function encryptText(plainText, key, ivB64) {
    const iv = b64decode(ivB64);

    const cipherBuf = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      enc.encode(plainText)
    );

    return b64encode(new Uint8Array(cipherBuf));
  }

  async function decryptText(ciphertextB64, ivB64, key) {
    const ct = b64decode(ciphertextB64);
    const iv = b64decode(ivB64);

    const plainBuf = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      ct
    );

    return dec.decode(plainBuf);
  }

  return {
    newSaltB64,
    newIvB64,
    deriveKeyFromPassword,
    encryptText,
    decryptText
  };
})();
