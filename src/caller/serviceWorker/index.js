import { fetchAndCache } from './helpers';

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
