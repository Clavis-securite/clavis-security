/* service-worker.js */
const CACHE_NAME = "clavis-v11"; // <-- incrémente à chaque mise à jour

self.addEventListener("install", (event) => {
  self.skipWaiting(); // prend la main tout de suite
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    // supprime les anciens caches
    const keys = await caches.keys();
    await Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : null)));
    await self.clients.claim(); // contrôle toutes les pages ouvertes
  })());
});

self.addEventListener("fetch", (event) => {
  // ✅ IMPORTANT: ne jamais cacher les HTML → toujours réseau d’abord
  const req = event.request;
  const url = new URL(req.url);

  // Ignore les requêtes non-GET
  if (req.method !== "GET") return;

  // Ignore les fonctions Netlify / API / Supabase
  if (url.pathname.startsWith("/.netlify/")) return;

  const isHTML = req.headers.get("accept")?.includes("text/html");

  if (isHTML) {
    // HTML: network-first (sinon t'as exactement ton bug)
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        return fresh;
      } catch (e) {
        // fallback offline éventuel
        const cached = await caches.match(req);
        return cached || caches.match("/index.html");
      }
    })());
    return;
  }

  // CSS/JS/images: cache-first + update en arrière-plan
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(req);
    const fetchPromise = fetch(req).then((res) => {
      if (res && res.status === 200) cache.put(req, res.clone());
      return res;
    }).catch(() => cached);

    return cached || fetchPromise;
  })());
});
