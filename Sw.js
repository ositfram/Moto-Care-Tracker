const CACHE_NAME = 'moto-care-v1';
const assets = ['index.html', 'manifest.json'];

// ফাইলগুলো ক্যাশ করা যাতে অফলাইনেও চলে
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(assets)));
});

// ব্যাকগ্রাউন্ডে জিপিএস বা ডাটা প্রসেস করার অনুমতি
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});
