self.addEventListener('fetch', async event => {
  event.respondWith(caches.open('dynamic-cache').then(async cache => {
    return await fetch(event.request).then(async response => {
      await cache.delete(event.request);
      await cache.put(event.request, response.clone());
      return response;
    }).catch(() => {
      return cache.match(event.request);
    });
  }));
});
