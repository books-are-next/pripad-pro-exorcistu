/* eslint-disable no-restricted-globals */

/* global self, caches, fetch */

const CACHE = 'cache-7171bb4';

self.addEventListener('install', e => {
  e.waitUntil(precache()).then(() => self.skipWaiting());
});

self.addEventListener('activate', event => {
  self.clients
    .matchAll({
      includeUncontrolled: true,
    })
    .then(clientList => {
      const urls = clientList.map(client => client.url);
      console.log('[ServiceWorker] Matching clients:', urls.join(', '));
    });

  event.waitUntil(
    caches
      .keys()
      .then(cacheNames =>
        Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE) {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
            return null;
          })
        )
      )
      .then(() => {
        console.log('[ServiceWorker] Claiming clients for version', CACHE);
        return self.clients.claim();
      })
  );
});

function precache() {
  return caches.open(CACHE).then(cache => cache.addAll(["./","./favicon.png","./colophon.html","./index.html","./pripad_pro_exorcistu_002.html","./pripad_pro_exorcistu_004.html","./pripad_pro_exorcistu_006.html","./manifest.json","./pripad_pro_exorcistu_007.html","./pripad_pro_exorcistu_008.html","./pripad_pro_exorcistu_009.html","./pripad_pro_exorcistu_010.html","./pripad_pro_exorcistu_012.html","./pripad_pro_exorcistu_013.html","./pripad_pro_exorcistu_015.html","./pripad_pro_exorcistu_016.html","./pripad_pro_exorcistu_014.html","./pripad_pro_exorcistu_011.html","./fonts/Literata-var.woff2","./fonts/LiterataTT-TextItalic.woff2","./fonts/Literata-Italic-var.woff2","./fonts/LiterataTT-TextRegular.woff2","./fonts/LiterataTT-TextSemibold.woff2","./fonts/LiterataTT_LICENSE.txt","./fonts/SpaceGroteskVF.woff2","./fonts/SpaceGroteskVF_LICENSE.txt","./resources/image001.jpg","./resources/image002.jpg","./resources/upoutavka_eknihy.jpg","./resources/obalka_pripad_pro_exorcistu.jpg","./scripts/bundle.js","./template-images/circles.png","./style/style.min.css"]));
}

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.open(CACHE).then(cache => {
      return cache.match(e.request).then(matching => {
        if (matching) {
          console.log('[ServiceWorker] Serving file from cache.');
          console.log(e.request);
          return matching;
        }

        return fetch(e.request);
      });
    })
  );
});
