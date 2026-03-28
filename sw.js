const CACHE_NAME = 'seed2sunlight-v1';
const ASSETS = [
  '/Seed2Sunlight/',
  '/Seed2Sunlight/index.html',
  '/Seed2Sunlight/favicon.svg',
  '/Seed2Sunlight/manifest.json'
];

// Install — cache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate — clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — serve from cache, fall back to network
self.addEventListener('fetch', event => {
  // Don't cache API calls
  if (event.request.url.includes('workers.dev') ||
      event.request.url.includes('anthropic.com') ||
      event.request.url.includes('stripe.com')) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
