// Bump CACHE_NAME whenever cached files must be refetched by returning visitors.
const CACHE_NAME = "st-dominic-v6";
// sw.js sits at the site root, so its own directory is the base path
// ("/" on saintdominic.org, "/st-dom-yt-website/" on the GitHub Pages URL).
const BASE = new URL("./", self.location).pathname;

// App shell files to precache on install
const PRECACHE_URLS = [
  BASE,
  BASE + "manifest.json",
  BASE + "offline.html",
  BASE + "icons/icon-192.png",
  BASE + "icons/icon-512.png",
];

// File extensions that should use cache-first strategy
const CACHE_FIRST_EXT = /\.(js|css|png|jpg|jpeg|webp|avif|svg|gif|ico|woff2?|ttf|eot)$/i;

// ─── Install: precache the app shell ─────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// ─── Activate: clean old caches ──────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ─── Fetch: strategy depends on request type ─────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== "GET") return;

  // Skip chrome-extension and non-http(s) requests
  if (!request.url.startsWith("http")) return;

  const url = new URL(request.url);

  // Google Sheets API calls — network only, never cache
  if (request.url.includes("docs.google.com/spreadsheets")) {
    event.respondWith(
      fetch(request).catch(() => new Response("{}", { status: 503 }))
    );
    return;
  }

  if (url.origin !== self.location.origin) return;

  // ── Navigation requests: network-first ──
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() =>
          caches
            .match(request)
            .then(
              (cached) => cached || caches.match(BASE + "offline.html")
            )
        )
    );
    return;
  }

  // ── Static assets (images, fonts, CSS, JS): cache-first ──
  if (CACHE_FIRST_EXT.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // ── Everything else: network-first with cache fallback ──
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
