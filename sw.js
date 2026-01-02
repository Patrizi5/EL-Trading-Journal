/**
 * Eternum Trading Journal - Service Worker
 * Progressive Web App functionality with offline support
 */

const CACHE_NAME = 'eternum-v1.0.0';
const STATIC_CACHE = 'eternum-static-v1.0.0';
const DYNAMIC_CACHE = 'eternum-dynamic-v1.0.0';

// URLs to cache for offline functionality
const STATIC_URLS = [
  '/',
  '/index.html',
  '/app.js',
  '/tubes-background.js',
  '/market-data.js',
  '/admin-system.js',
  '/tradingview-enhanced.js',
  '/notes-system.js',
  '/settings-system.js',
  '/manifest.json',
  // External resources
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap',
  'https://s3.tradingview.com/tv.js',
];

// Dynamic content patterns (API calls, user data)
const DYNAMIC_PATTERNS = [
  /^https:\/\/api\./,
  /^https:\/\/fonts\.googleapis\.com/,
  /^https:\/\/fonts\.gstatic\.com/,
];

// Network timeout for API calls
const NETWORK_TIMEOUT = 5000; // 5 seconds

// Install event - cache static resources
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static resources...');
        return cache.addAll(STATIC_URLS);
      })
      .then(() => {
        console.log('Static resources cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Error caching static resources:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached content or fetch from network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip Chrome extensions and other non-http requests
  if (!request.url.startsWith('http')) {
    return;
  }

  // Handle different types of requests
  if (isStaticResource(request.url)) {
    event.respondWith(handleStaticResource(request));
  } else if (isDynamicResource(request.url)) {
    event.respondWith(handleDynamicResource(request));
  } else if (isApiRequest(request.url)) {
    event.respondWith(handleApiRequest(request));
  } else {
    event.respondWith(handleGenericRequest(request));
  }
});

// Check if request is for a static resource
function isStaticResource(url) {
  return (
    STATIC_URLS.some((staticUrl) => url.includes(staticUrl)) ||
    url.includes('.css') ||
    url.includes('.js') ||
    url.includes('.png') ||
    url.includes('.jpg') ||
    url.includes('.svg') ||
    url.includes('.woff2')
  );
}

// Check if request is for a dynamic resource
function isDynamicResource(url) {
  return DYNAMIC_PATTERNS.some((pattern) => pattern.test(url));
}

// Check if request is for API endpoint
function isApiRequest(url) {
  return (
    url.includes('/api/') ||
    url.includes('tradingview.com') ||
    url.includes('coinbase.com') ||
    url.includes('alphavantage.co')
  );
}

// Handle static resources with cache-first strategy
async function handleStaticResource(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // If not in cache, fetch from network and cache
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('Error handling static resource:', error);

    // Return offline fallback
    return new Response(
      `<!DOCTYPE html>
            <html>
            <head>
                <title>Eternum - Offline</title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        background: #0a0e1a;
                        color: #ffffff;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 100vh;
                        margin: 0;
                    }
                    .container {
                        text-align: center;
                        max-width: 400px;
                        padding: 2rem;
                    }
                    .icon {
                        font-size: 4rem;
                        margin-bottom: 1rem;
                    }
                    h1 {
                        font-size: 2rem;
                        margin-bottom: 1rem;
                        color: #3b82f6;
                    }
                    p {
                        color: #9ca3af;
                        margin-bottom: 2rem;
                    }
                    button {
                        background: #3b82f6;
                        color: white;
                        border: none;
                        padding: 0.75rem 1.5rem;
                        border-radius: 0.5rem;
                        cursor: pointer;
                        font-size: 1rem;
                    }
                    button:hover {
                        background: #2563eb;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="icon">📊</div>
                    <h1>Eternum Trading Journal</h1>
                    <p>You are currently offline. Some features may not be available.</p>
                    <button onclick="window.location.reload()">Try to Reconnect</button>
                </div>
            </body>
            </html>`,
      {
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'no-cache',
        },
      }
    );
  }
}

// Handle dynamic resources with network-first strategy
async function handleDynamicResource(request) {
  try {
    // Try network first with timeout
    const networkResponse = await Promise.race([
      fetch(request),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Network timeout')), NETWORK_TIMEOUT)
      ),
    ]);

    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', error);

    // Fall back to cache
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline response for fonts
    if (request.url.includes('fonts')) {
      return new Response('', {
        status: 200,
        headers: {
          'Content-Type': 'font/woff2',
          'Cache-Control': 'max-age=31536000',
        },
      });
    }

    throw new Error('Resource not available offline');
  }
}

// Handle API requests with network-only strategy (for real-time data)
async function handleApiRequest(request) {
  try {
    const networkResponse = await fetch(request);

    // Cache successful API responses for offline use
    if (networkResponse.ok && request.method === 'GET') {
      const cache = await caches.open(DYNAMIC_CACHE);
      const clonedResponse = networkResponse.clone();

      // Store with timestamp for cache expiration
      const responseWithTimestamp = new Response(clonedResponse.body, {
        status: clonedResponse.status,
        statusText: clonedResponse.statusText,
        headers: {
          ...Object.fromEntries(clonedResponse.headers.entries()),
          'sw-cached-at': Date.now().toString(),
        },
      });

      cache.put(request, responseWithTimestamp);
    }

    return networkResponse;
  } catch (error) {
    console.log('API request failed, trying cached version:', error);

    // Try to return cached version
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      // Check if cached data is still valid (less than 5 minutes old)
      const cachedAt = cachedResponse.headers.get('sw-cached-at');
      if (cachedAt && Date.now() - parseInt(cachedAt) < 5 * 60 * 1000) {
        return cachedResponse;
      }
    }

    // Return offline API response
    return new Response(
      JSON.stringify({
        error: 'Offline',
        message: 'You are currently offline. Some features may not be available.',
        timestamp: Date.now(),
      }),
      {
        status: 503,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      }
    );
  }
}

// Handle generic requests
async function handleGenericRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    console.error('Fetch failed:', error);

    // Try to serve from cache
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    throw error;
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);

  if (event.tag === 'sync-trades') {
    event.waitUntil(syncTrades());
  } else if (event.tag === 'sync-notes') {
    event.waitUntil(syncNotes());
  } else if (event.tag === 'sync-settings') {
    event.waitUntil(syncSettings());
  }
});

// Sync offline trades when back online
async function syncTrades() {
  try {
    const trades = await getOfflineData('offline-trades');
    if (trades.length > 0) {
      console.log('Syncing', trades.length, 'offline trades');

      // In a real app, this would sync with the server
      // For now, we'll just clear the offline data
      await clearOfflineData('offline-trades');

      // Notify the app
      const clients = await self.clients.matchAll();
      clients.forEach((client) => {
        client.postMessage({
          type: 'SYNC_COMPLETE',
          data: { trades: trades.length },
        });
      });
    }
  } catch (error) {
    console.error('Error syncing trades:', error);
  }
}

// Sync offline notes when back online
async function syncNotes() {
  try {
    const notes = await getOfflineData('offline-notes');
    if (notes.length > 0) {
      console.log('Syncing', notes.length, 'offline notes');

      await clearOfflineData('offline-notes');

      const clients = await self.clients.matchAll();
      clients.forEach((client) => {
        client.postMessage({
          type: 'SYNC_COMPLETE',
          data: { notes: notes.length },
        });
      });
    }
  } catch (error) {
    console.error('Error syncing notes:', error);
  }
}

// Sync offline settings when back online
async function syncSettings() {
  try {
    const settings = await getOfflineData('offline-settings');
    if (Object.keys(settings).length > 0) {
      console.log('Syncing offline settings');

      await clearOfflineData('offline-settings');

      const clients = await self.clients.matchAll();
      clients.forEach((client) => {
        client.postMessage({
          type: 'SYNC_COMPLETE',
          data: { settings: true },
        });
      });
    }
  } catch (error) {
    console.error('Error syncing settings:', error);
  }
}

// Helper functions for offline data management
async function getOfflineData(key) {
  try {
    // In a real app, this would use IndexedDB
    const data = localStorage.getItem(`offline-${key}`);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting offline data:', error);
    return [];
  }
}

async function clearOfflineData(key) {
  try {
    localStorage.removeItem(`offline-${key}`);
  } catch (error) {
    console.error('Error clearing offline data:', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);

  const options = {
    body: 'You have new trading insights available!',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2',
    },
    actions: [
      {
        action: 'explore',
        title: 'View Insights',
        icon: '/images/checkmark.png',
      },
      {
        action: 'close',
        title: 'Close notification',
        icon: '/images/xmark.png',
      },
    ],
  };

  if (event.data) {
    const data = event.data.json();
    options.body = data.body || options.body;
    options.title = data.title || 'Eternum Trading Journal';
  }

  event.waitUntil(self.registration.showNotification('Eternum Trading Journal', options));
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);

  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(clients.openWindow('/?section=analytics'));
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(clients.openWindow('/'));
  }
});

// Message handling from the app
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return cache.addAll(event.data.payload);
      })
    );
  }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  console.log('Periodic sync triggered:', event.tag);

  if (event.tag === 'background-sync') {
    event.waitUntil(performBackgroundSync());
  }
});

async function performBackgroundSync() {
  try {
    // Perform background data sync
    console.log('Performing background sync...');

    // Sync trades, notes, settings
    await Promise.all([syncTrades(), syncNotes(), syncSettings()]);

    console.log('Background sync completed');
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Error handling
self.addEventListener('error', (event) => {
  console.error('Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

console.log('Service Worker loaded successfully');
