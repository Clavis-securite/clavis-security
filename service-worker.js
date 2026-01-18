/* service-worker.js */
const CACHE_NAME = "clavis-v14"; // <-- incrémente à chaque push important

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : null)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // ✅ Ignore non-GET
  if (req.method !== "GET") return;

  // ✅ IMPORTANT : ignore tout ce qui n’est pas http/https
  const url = new URL(req.url);
  if (url.protocol !== "http:" && url.protocol !== "https:") return;

  // ✅ Ignore les extensions / devtools / etc (sécurité)
  if (
    url.protocol.startsWith("chrome-extension") ||
    url.protocol.startsWith("moz-extension") ||
    url.protocol.startsWith("safari-extension")
  ) return;

  // ✅ Ignore les endpoints Netlify functions
  if (url.pathname.startsWith("/.netlify/")) return;

  const accept = req.headers.get("accept") || "";
  const isHTML = accept.includes("text/html");

  // ✅ HTML : network-first (sinon tu restes bloqué sur l’ancienne version)
  if (isHTML) {
    event.respondWith((async () => {
      try {
        return await fetch(req, { cache: "no-store" });
      } catch (e) {
        const cached = await caches.match(req);
        return cached || caches.match("/index.html");
      }
    })());
    return;
  }

  // ✅ CSS/JS/images : stale-while-revalidate (cache + update)
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
