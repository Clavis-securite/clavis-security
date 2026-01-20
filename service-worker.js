/* service-worker.js — Clavis-security
   IMPORTANT : incrémente CACHE_VERSION à chaque changement
*/

const CACHE_VERSION = "v14"; // ⬅️ incrémente à chaque changement du SW
const STATIC_CACHE = `clavis-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `clavis-runtime-${CACHE_VERSION}`;

// Pages + assets essentiels (si un fichier n’existe pas, on ne casse pas l’installation)
const PRECACHE_URLS = [
  "/",
  "/app.html",
  "/index.html",
  "/offers.html",
  "/faq.html",
  "/contact.html",
  "/login.html",
  "/register.html",
  "/dashboard.html",
  "/thankyou.html",
  "/404.html",

  "/css/styles.css",
  "/css/app.css",

  "/js/pwa.js",
  "/js/app-mode.js",
  "/js/app-shell.js",
  "/js/dashboard-app.js",
  "/js/i18n.js",
  "/js/app.js",

  "/manifest.webmanifest",
  "/assets/icons/icon-192.png",
  "/assets/icons/icon-512.png",
];

// -------- INSTALL --------
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);

      // On évite de planter si une ressource manque
      await Promise.allSettled(
        PRECACHE_URLS.map((url) => {
          const req = new Request(url, { cache: "reload" });
          return cache.add(req);
        })
      );

      self.skipWaiting();
    })()
  );
});

// -------- ACTIVATE --------
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Supprime tous les anciens caches
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => ![STATIC_CACHE, RUNTIME_CACHE].includes(k))
          .map((k) => caches.delete(k))
      );

      // Prend le contrôle tout de suite
      await self.clients.claim();
    })()
  );
});

// Permet au site de forcer l'activation d'une nouvelle version (sans pop-up)
self.addEventListener("message", (event) => {
  if (event?.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// -------- FETCH --------
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // On ignore tout ce qui n’est pas http/https (corrige chrome-extension://)
  if (!req.url.startsWith("http")) return;

  // Évite une erreur classique : "only-if-cached" + cross-origin
  // (peut arriver via certains navigateurs / extensions)
  if (req.cache === "only-if-cached" && req.mode !== "same-origin") return;

  // On ne cache que les GET
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  // 1) NAVIGATION (HTML) : Network-first => évite "ancienne page" dans l'app
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        const cache = await caches.open(RUNTIME_CACHE);

        // Normalisation : "/" et "/index.html" doivent toujours servir la même version
        const normalizedKey =
          url.pathname === "/" ? new Request("/index.html") : req;

        try {
          const fresh = await fetch(req);

          // On met en cache la réponse fraîche
          cache.put(normalizedKey, fresh.clone());

          return fresh;
        } catch (e) {
          // Offline / erreur réseau => on sert le cache
          const cached = await cache.match(normalizedKey);
          if (cached) return cached;

          const cachedIndex = await caches.match("/index.html");
          if (cachedIndex) return cachedIndex;

          const fallback404 = await caches.match("/404.html");
          return fallback404 || new Response("Hors connexion", { status: 503 });
        }
      })()
    );
    return;
  }

  // 2) ASSETS (CSS/JS/IMG) : Cache-first + update en arrière plan
  // On ne gère que les fichiers du même domaine
  if (!sameOrigin) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(RUNTIME_CACHE);
      const cached = await cache.match(req);

      if (cached) {
        // Mise à jour en arrière plan (sans bloquer l’affichage)
        event.waitUntil(
          (async () => {
            try {
              const fresh = await fetch(req);
              cache.put(req, fresh.clone());
            } catch (_) {}
          })()
        );
        return cached;
      }

      // Pas en cache -> fetch -> cache
      try {
        const fresh = await fetch(req);
        cache.put(req, fresh.clone());
        return fresh;
      } catch (e) {
        // Si image/CSS indisponible offline, on laisse tomber sans casser
        return new Response("", { status: 204 });
      }
    })()
  );
});
