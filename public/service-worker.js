const DYNAMIC_CACHE = "dynamic-cache-v1";

// Array of regular expressions for URLs to match for dynamic caching
const URLS_TO_CACHE = [
  /^https:\/\/fonts\.googleapis\.com/,
  /^https:\/\/fonts\.gstatic\.com/,
  /^https:\/\/2fa\.directory\/assets\/.*/,             // Match specific assets on 2fa.directory
  /^https:\/\/api\.2fa\.directory\/frontend\/v1\/regions\.json$/, // Match specific JSON files
  /^https:\/\/api\.2fa\.directory\/frontend\/v1\/[a-z]{2}\/categories\.json$/, // Match only specific JSON paths by region
  /^https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/.*/, // Match CDN assets from Cloudflare
];

// Function to check if the URL matches any in the array using regular expressions
function shouldCache(url) {
  return URLS_TO_CACHE.some((regex) => regex.test(url));
}

// Install event: skipWaiting allows for more aggressive unloading
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

// Activate event: Clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => cacheName !== DYNAMIC_CACHE).
          map((cacheName) => caches.delete(cacheName)),
      );
    }),
  );
  self.clients.claim();
});

// Fetch event: Serve cached assets if available; otherwise, fetch from network and cache the response
self.addEventListener("fetch", (event) => {
  const requestUrl = event.request.url;

  // Check if the request URL should be cached dynamically
  if (shouldCache(requestUrl)) {
    // Network-first strategy for URLs in the matching array
    event.respondWith(
      fetch(event.request).then((response) => {
        // Clone and store the response in the dynamic cache
        return caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      }).catch(() => caches.match(event.request)), // Fallback to cache on network failure
    );
  } else {
    // Cache-first strategy for other requests (but do not cache if not matching)
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;

        // Fetch from network without caching the result
        return fetch(event.request);
      }),
    );
  }
});
