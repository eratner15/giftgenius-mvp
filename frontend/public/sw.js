// Service Worker for GiftGenius PWA
const CACHE_NAME = 'giftgenius-v1.2';
const STATIC_CACHE_NAME = 'giftgenius-static-v1.2';
const API_CACHE_NAME = 'giftgenius-api-v1.2';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/static/js/main.31aa3cba.js',
  '/static/css/main.45a7795f.css',
  '/manifest.json'
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/health',
  '/api/categories',
  '/api/gifts'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker installing...');

  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then(cache => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(API_CACHE_NAME).then(cache => {
        console.log('Pre-caching API endpoints');
        return cache.addAll(API_ENDPOINTS);
      })
    ])
  );

  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE_NAME &&
              cacheName !== API_CACHE_NAME &&
              cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  // Take control of all pages immediately
  self.clients.claim();
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Handle different types of requests
  if (url.pathname.startsWith('/api/')) {
    // API requests - Network First with Cache Fallback
    event.respondWith(handleAPIRequest(event.request));
  } else if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2)$/)) {
    // Static assets - Cache First
    event.respondWith(handleStaticAsset(event.request));
  } else {
    // HTML requests - Network First with Cache Fallback
    event.respondWith(handleHTMLRequest(event.request));
  }
});

// Handle API requests with intelligent caching
async function handleAPIRequest(request) {
  const url = new URL(request.url);
  const cacheName = API_CACHE_NAME;

  try {
    // Always try network first for API calls
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);

      // Don't cache POST requests or analytics
      if (request.method === 'GET' && !url.pathname.includes('analytics')) {
        // Cache with TTL headers
        const responseToCache = networkResponse.clone();
        const headers = new Headers(responseToCache.headers);
        headers.set('sw-cached-at', Date.now().toString());

        const cachedResponse = new Response(responseToCache.body, {
          status: responseToCache.status,
          statusText: responseToCache.statusText,
          headers: headers
        });

        cache.put(request, cachedResponse);
      }
    }

    return networkResponse;
  } catch (error) {
    console.log('Network failed for API request, trying cache:', error);

    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Check if cache is still fresh (5 minutes for API calls)
      const cachedAt = cachedResponse.headers.get('sw-cached-at');
      const cacheAge = Date.now() - parseInt(cachedAt || 0);
      const maxAge = 5 * 60 * 1000; // 5 minutes

      if (cacheAge < maxAge) {
        console.log('Serving fresh cached API response');
        return cachedResponse;
      }
    }

    // Return offline fallback for critical endpoints
    if (url.pathname === '/api/health') {
      return new Response(JSON.stringify({
        status: 'offline',
        message: 'You are currently offline'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    throw error;
  }
}

// Handle static assets with cache-first strategy
async function handleStaticAsset(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    // Serve from cache and update in background
    updateCacheInBackground(request);
    return cachedResponse;
  }

  // Not in cache, fetch from network
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('Failed to fetch static asset:', error);

    // Return offline fallback for images
    if (request.destination === 'image') {
      return new Response(
        '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f3f4f6"/><text x="100" y="100" text-anchor="middle" dy=".3em" font-family="Arial" font-size="20" fill="#9ca3af">🎁</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }

    throw error;
  }
}

// Handle HTML requests
async function handleHTMLRequest(request) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('Network failed for HTML request, trying cache:', error);

    // Fallback to cached version
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Fallback to cached index.html for SPA routing
    const indexResponse = await caches.match('/');
    if (indexResponse) {
      return indexResponse;
    }

    // Ultimate fallback - offline page
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>GiftGenius - Offline</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0; padding: 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh; display: flex; align-items: center; justify-content: center; color: white;
          }
          .container { max-width: 400px; }
          h1 { font-size: 3rem; margin-bottom: 1rem; }
          p { font-size: 1.2rem; line-height: 1.6; margin-bottom: 2rem; }
          button {
            padding: 12px 24px; background: rgba(255,255,255,0.2); border: 2px solid white;
            border-radius: 8px; color: white; font-size: 1rem; cursor: pointer;
          }
          button:hover { background: rgba(255,255,255,0.3); }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🎁</h1>
          <h2>You're Offline</h2>
          <p>Don't worry! GiftGenius works offline too. Check your connection and try again.</p>
          <button onclick="window.location.reload()">Try Again</button>
        </div>
      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Update cache in background
async function updateCacheInBackground(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
  } catch (error) {
    console.log('Background cache update failed:', error);
  }
}

// Handle background sync for offline actions
self.addEventListener('sync', event => {
  console.log('Background sync triggered:', event.tag);

  if (event.tag === 'gift-analytics') {
    event.waitUntil(syncAnalytics());
  }
});

// Sync analytics data when back online
async function syncAnalytics() {
  try {
    // Get pending analytics from IndexedDB
    const pendingEvents = await getPendingAnalytics();

    for (const event of pendingEvents) {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event)
        });

        // Remove from pending queue
        await removePendingAnalytics(event.id);
      } catch (error) {
        console.log('Failed to sync analytics event:', error);
      }
    }
  } catch (error) {
    console.log('Background sync failed:', error);
  }
}

// IndexedDB helpers for offline analytics
async function getPendingAnalytics() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('GiftGeniusDB', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['analytics'], 'readonly');
      const store = transaction.objectStore('analytics');
      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('analytics')) {
        db.createObjectStore('analytics', { keyPath: 'id' });
      }
    };
  });
}

async function removePendingAnalytics(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('GiftGeniusDB', 1);

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['analytics'], 'readwrite');
      const store = transaction.objectStore('analytics');
      const deleteRequest = store.delete(id);

      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
  });
}

// Handle push notifications (future feature)
self.addEventListener('push', event => {
  console.log('Push notification received:', event);

  if (event.data) {
    const data = event.data.json();

    const options = {
      body: data.body || 'New gift recommendations available!',
      icon: '/icon-192x192.png',
      badge: '/icon-96x96.png',
      vibrate: [200, 100, 200],
      data: data.url || '/',
      actions: [
        {
          action: 'view',
          title: 'View Gifts',
          icon: '/icon-96x96.png'
        },
        {
          action: 'close',
          title: 'Close'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'GiftGenius', options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('Notification clicked:', event);

  event.notification.close();

  if (event.action === 'view' || !event.action) {
    const url = event.notification.data || '/';

    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientList => {
        // If app is already open, focus it
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.focus();
            return client.navigate(url);
          }
        }

        // Otherwise open new window
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
    );
  }
});

console.log('GiftGenius Service Worker loaded successfully!');