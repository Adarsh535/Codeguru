// CodeGurru PWA Service Worker (sw.js)
const CACHE_NAME = 'codegurru-pwa-v1';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/images/codeguru-guru-logo.png',
  '/logo-icon.png',
  '/logo.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch(() => {});
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    ).then(() => self.clients.claim())
  );
});

// Network-first fetch handler for maximum dynamic accuracy + offline fallback
self.addEventListener('fetch', (event) => {
  // Only handle GET requests, ignore API calls and SSE streams
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Bypass API routes, SSE streams, and admin dashboard
  if (
    url.pathname.startsWith('/api') ||
    url.pathname.includes('/stream') ||
    url.pathname.startsWith('/admin')
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Cache successful basic responses
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          networkResponse.type === 'basic' &&
          (url.pathname.match(/\.(png|jpg|jpeg|svg|webp|ico|css|js|woff2)$/i) || url.pathname === '/')
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache).catch(() => {});
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/');
          }
          return null;
        });
      })
  );
});

