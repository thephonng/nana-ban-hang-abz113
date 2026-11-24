/* Nà Ná Na: ưu tiên bản mới từ mạng, mất mạng thì dùng bản đã lưu. Đổi số VERSION để ép làm mới. */
var VERSION = 'nana-pos-v1';
var CORE = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(function (r) {
    if (r && (r.ok || r.type === 'opaque')) { var cp = r.clone(); caches.open(VERSION).then(function (c) { c.put(e.request, cp); }); }
    return r;
  }).catch(function () { return caches.match(e.request).then(function (m) { return m || (e.request.mode === 'navigate' ? caches.match('index.html') : Response.error()); }); }));
});
