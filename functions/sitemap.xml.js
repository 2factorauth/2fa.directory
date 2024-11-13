const api_url = 'https://api.2fa.directory/frontend/v1/';
const base = 'https://2fa.directory';
let urls = [
  `${base}/privacy`,
  `${base}/companies`,
  `${base}/bots`,
  `${base}/api`];
const init = {
  cf: {
    cacheEverything: true,
    cacheTtl: 60 * 60 * 24 * 30,  // Cache request 1 month
  },
};
const headers = {
  'Content-Type': 'application/xml',
  'Cache-Control': 'public, max-age=2592000, immutable', // 1 month cache, no revalidation
};

export async function onRequestGet({request, waitUntil}) {
  const cacheKey = new Request(request.url, request);
  const cache = caches.default;
  let response = await cache.match(cacheKey);

  // If response is cached, return it
  if (response)
    return response;

  // If no response is found, continue
  const regions_fetch = await fetch(`${api_url}/regions.json`, init);
  const regions = await regions_fetch.json();

  // Fetch listed categories for each region
  for (const region of Object.keys(regions)) {
    const categories_fetch = await fetch(
      `${api_url}/${region}/categories.json`, init);
    const categories = Object.keys(await categories_fetch.json());
    categories.forEach(category => {
      urls.push(`${base}/${region}/#${category}`);
    });
  }

  // Create XML document
  let output = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];

  // Add each URL to the URL set
  urls.forEach((url) => {
    output.push('<url>');
    output.push(`<loc>${url}</loc>`);
    output.push('<changefreq>monthly</changefreq>');
    output.push('</url>');
  });

  // Close URL set
  output.push('</urlset>');

  response = new Response(output.join(''), {
    headers,
  });

  waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}
