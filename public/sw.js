// Copied service worker from repository root for Vite public assets
/*
 * Eternum Trading Journal - Service Worker (public copy)
 * Keep in sync with root sw.js
 */

const CACHE_NAME = 'eternum-v1.0.0';
const STATIC_CACHE = 'eternum-static-v1.0.0';
const DYNAMIC_CACHE = 'eternum-dynamic-v1.0.0';

const STATIC_URLS = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_URLS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(caches.match(event.request).then(res => res || fetch(event.request)));
});
