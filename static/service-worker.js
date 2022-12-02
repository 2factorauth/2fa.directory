const offline_page = '/offline/';
const cachedPaths = ['script', 'css'];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    console.debug('[Service Worker] Install');
    const cache = await caches.open('pwa-assets');
    await cache.add(new Request(offline_page, {cache: 'reload'}));
  })());

  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // Enable navigation preload if it's supported.
    // See https://developers.google.com/web/updates/2017/02/navigation-preload
    if ('navigationPreload' in self.registration) await self.registration.navigationPreload.enable();
  })());

  // Tell the active service worker to take control of the page immediately.
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith((async () => {
    try {
      if (cachedPaths.includes(e.request.destination) || e.request.mode === 'navigate') {
        const r = await caches.match(e.request);
        console.debug(`[Service Worker] Fetching resource: ${e.request.url}`);
        if (r) {
          console.debug(`Cache hit`);
          return r
        }

        const response = await fetch(e.request);
        const cache = await caches.open('pwa-assets');
        console.debug(`[Service Worker] Caching new resource: ${e.request.url}`);
        cache.put(e.request, response.clone());
        return response;
      } else return await fetch(e.request);
    } catch (error) {
      console.error(`ERROR: ${error}`);
      console.error(`req: ${e.request.url}`);
      if (e.request.mode === 'navigate') {
        const cache = await caches.open('pwa-assets');
        return await cache.match('/offline/');
      }
    }
  })());
});
