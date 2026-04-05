const CACHE_NAME = 'motocare-v5';

const STATIC_ASSETS = [
  '/Moto-Care-Tracker/',
  '/Moto-Care-Tracker/index.html',
  '/Moto-Care-Tracker/manifest.json'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const req = e.request;

  if (req.url.includes('firestore') || req.url.includes('googleapis')) {
    return;
  }

  e.respondWith(
    caches.match(req).then(res => {
      return res || fetch(req).catch(() => caches.match('/Moto-Care-Tracker/index.html'));
    })
  );
});
