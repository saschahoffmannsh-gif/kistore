/* KISTORE Service Worker: einfacher Offline-Cache (App-Shell), network-first */
const CACHE = "aw-1793652872";
const SHELL = ["./", "app.css?v=1793652872", "app.js?v=1793652872", "demo.js?v=1793652872", "art.js?v=1793652872", "config.js?v=1793652872", "payments.js?v=1793652872", "vendor/fonts/InterVariable.woff2", "icons/logo.svg", "vendor/supabase.js", "manifest.webmanifest", "icons/icon-192.png", "icons/apple-touch-icon.png", "icons/favicon-32.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {})); self.skipWaiting(); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return; // Supabase-Aufrufe und externe Apps nie cachen
  const req = e.request.mode === "navigate" ? fetch(e.request.url, { cache: "no-cache", credentials: "same-origin" }) : fetch(e.request);
  e.respondWith(req.then((r) => { if (r.ok) { const cp = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, cp)); } return r; })
    .catch(() => caches.match(e.request).then((r) => r || caches.match(new URL("./", self.registration.scope).href))));
});
