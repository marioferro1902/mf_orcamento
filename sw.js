const CACHE_NAME = 'mf-orcamento-cache-v3';
// MUDANÇA: Adicionados os caminhos relativos com "./"
const urlsToCache = [
  './',
  './index.html',
  './gerenciar_categorias.html',
  './contas.html', // Adicionei a página de contas que estava faltando no cache
  './style.css',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// O resto do arquivo permanece o mesmo...

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});