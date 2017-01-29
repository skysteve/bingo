(function () {
'use strict';

/**
 * Created by steve on 28/09/2016.
 */

function fetchAndCache(event, caches, CACHE_NAME) {
  const fetchRequest = event.request.clone();

  return fetch(fetchRequest).then((response) => {
    // Check if we received a valid response
    if (!response || response.status !== 200) {
      return response;
    }

    // if not a GET request or is to any external entity other than our server's url - don't cache
    if (fetchRequest.method !== 'GET') {
      return response;
    }

    const responseToCache = response.clone();

    caches.open(CACHE_NAME)
      .then(cache => cache.put(event.request, responseToCache))
      .catch(err => console.error(err));

    return response;
  });
}

const CACHE_NAME = 'bingo-v1';
const arrInstallCache = [
  './',
  '../customElements.js',
  'index.js'
];

self.addEventListener('activate', () => {
  console.log('SW activated');
});

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(arrInstallCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.waitUntil(
    caches.match(event.request)
      .then((cacheResult) => {
        return cacheResult || fetchAndCache(event, caches, CACHE_NAME);
      })
  );
});

}());
//# sourceMappingURL=serviceWorker.js.map
