/* service-worker.js — Clavis-security (stable PWA)
   - HTML: network-first (évite les vieilles pages)
   - Assets: cache-first (rapide)
   - Ignore non-http(s) requests (fix chrome-extension issue)
*/

const CACHE_VERSION = "v14"; // <-- INCREMENTE A CHAQUE GROS CHANGEMENT
const CACHE_NAME = `clavis-cache-${CACHE_VERSION}`;

// Optionnel : pré-cache minimal (tu peux laisser vide si tu veux)
const CORE_ASSETS = [
  "/", // nécessaire
  "/index.html",
  "/offers.html",
  "/faq.html",
  "/contact.html",
  "/login.html",
  "/register.html",
  "/dashboard.html",
  "/thankyou.html",
  "/css/styles.css",
  "/js/pwa.js",
  "/js/supabase.js",
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
];

// --- INSTALL: precache + activate asap
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // On precache en "best effort" (si un fichier manque, ça n'empêche pas l'installation)
      await Promise.all(
        CORE_ASSETS.map(async (url) => {
          try {
            const req = new Request(url, { cache: "reload" });
            const res = await fetch(req);
            if (res && res.ok) await cache.put(req, res);
          } catch (_) {
            // ignore
          }
        })
      );
    })()
  );
});

// --- ACTIVATE: delete old caches + take control
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)));
      await self.clients.claim();
    })()
  );
});

// Helpers
function isHttpRequest(request) {
  try {
    const url = new URL(request.url);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isNavigationRequest(request) {
  return request.mode === "navigate" || (request.headers.get("accept") || "").includes("text/html");
}

function isAssetRequest(request) {
  const url = new URL(request.url);
  return (
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "image" ||
    request.destination === "font" ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".jpeg") ||
    url.pathname.endsWith(".webp") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".woff") ||
    url.pathname.endsWith(".woff2")
  );
}

// --- FETCH
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // IMPORTANT: ignore chrome-extension://, blob:, data:, etc.
  if (!isHttpRequest(req)) return;

  // 1) Pages (HTML): Network-first (évite l'ancienne version)
  if (isNavigationRequest(req)) {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(CACHE_NAME);
          cache.put(req, fresh.clone());
          return fresh;
        } catch (err) {
          const cached = await caches.match(req);
          if (cached) return cached;

          // fallback: page d'accueil si offline
          const fallback = await caches.match("/index.html");
          return fallback || new Response("Hors connexion.", { status: 200, headers: { "Content-Type": "text/plain" } });
        }
      })()
    );
    return;
  }

  // 2) Fichiers statiques: Cache-first (rapide)
  if (isAssetRequest(req)) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(req);
        if (cached) return cached;

        try {
          const fresh = await fetch(req);
          const cache = await caches.open(CACHE_NAME);
          cache.put(req, fresh.clone());
          return fresh;
        } catch (err) {
          // Pas de fallback asset : renvoie l'erreur
          throw err;
        }
      })()
    );
    return;
  }

  // 3) API / autres requêtes: Network-first léger (ne casse pas Supabase/Stripe)
  event.respondWith(
    (async () => {
      try {
        return await fetch(req);
      } catch (err) {
        const cached = await caches.match(req);
        return cached || new Response("", { status: 503 });
      }
    })()
  );
});
