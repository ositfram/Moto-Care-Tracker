const CACHE_NAME = 'motocare-v4';

// Static files (only essential)
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Install
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
  );
});

// Activate (clean old caches)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch strategy
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // 🚫 Skip Firebase / API calls (important)
  if (req.url.includes('firestore') || req.url.includes('googleapis')) {
    return;
  }

  event.respondWith(
    caches.match(req).then(cachedRes => {
      if (cachedRes) return cachedRes;

      return fetch(req)
        .then(networkRes => {
          // Only cache GET requests
          if (req.method === 'GET') {
            const cloned = networkRes.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(req, cloned);
            });
          }
          return networkRes;
        })
        .catch(() => {
          // Offline fallback
          return caches.match('/index.html');
        });
    })
  );
});
