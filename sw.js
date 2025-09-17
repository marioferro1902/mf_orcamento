const CACHE_NAME = 'mf-orcamento-cache-v3'; // Aumentamos a versão para forçar a atualização
const urlsToCache = [
  '/',
  '/index.html',
  '/gerenciar_categorias.html',
  '/style.css',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Evento de Instalação: Salva os arquivos no cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento de Ativação: Limpa caches antigos
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // Deleta o cache v2, v1, etc.
          }
        })
      );
    })
  );
});

// Evento de Fetch: Estratégia "Network-First"
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // Se a busca na rede funcionou, guardamos a nova versão no cache
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          // E retornamos a resposta da rede para o usuário
          return networkResponse;
        });
      })
      .catch(() => {
        // Se a busca na rede falhar (estamos offline), busca no cache
        return caches.match(event.request);
      })
  );
});