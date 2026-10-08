// Service worker pro app abrir mesmo sem internet.
// Sempre tenta a rede primeiro (assim ninguém fica preso numa versão velha)
// e guarda uma cópia; sem rede, usa a cópia.
const CACHE = 'controle-de-gastos-v1';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys()
      .then((nomes) => Promise.all(nomes.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (evento) => {
  const { request } = evento;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  evento.respondWith(
    fetch(request)
      .then((resposta) => {
        if (resposta.ok) {
          const copia = resposta.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copia));
        }
        return resposta;
      })
      .catch(async () => {
        const salvo = await caches.match(request);
        // abrir o app offline: qualquer página cai no index
        return salvo || (request.mode === 'navigate' ? caches.match(self.registration.scope) : Response.error());
      }),
  );
});
