// Service worker so the app opens even without internet.
// It always tries the network first (so nobody gets stuck on an old version)
// and keeps a copy; with no network, it uses the copy.
const CACHE = 'expense-tracker-v1';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(async () => {
        const saved = await caches.match(request);
        // opening the app offline: any page falls back to the index
        return saved || (request.mode === 'navigate' ? caches.match(self.registration.scope) : Response.error());
      }),
  );
});
