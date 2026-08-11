// Minimal service worker — prevents stale caches at /gifts/ sub-path
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
