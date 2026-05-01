const CACHE_NAME = 'order-app-v2';
const ASSETS = [
  'index.html',
  'manifest.json'
];
const CDN_ASSETS = [
  'https://cdn.bootcdn.net/ajax/libs/remixicon/3.5.0/remixicon.min.css',
  'https://cdn.tailwindcss.com',
  'https://cdn.bootcdn.net/ajax/libs/Chart.js/4.4.1/chart.umd.min.js',
  'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/vue/3.2.31/vue.global.prod.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.all([
        cache.addAll(ASSETS),
        ...CDN_ASSETS.map(url => cache.add(url).catch(() => {}))
      ])
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      if (event.request.method === 'GET' && response.status === 200) {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
      }
      return response;
    }).catch(() => cached))
  );
});
