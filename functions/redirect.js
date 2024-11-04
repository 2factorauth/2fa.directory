export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const base = `${url.protocol}//${url.hostname}/`;
  const redirectStatus = 301;
  const api = 'https://api.2fa.directory/frontend/v1/';

  try {
    const country = request.cf?.country?.toLowerCase();
    const res = await fetch(`${api}${country}/categories.json`, {
      method: 'HEAD',
      cache: 'force-cache',
      cf: {
        cacheTtlByStatus: {
          "200": 60 * 60 * 24 * 14, // Cache request 2 weeks
          "404": 60 * 60 * 24 * 7,  // Cache request 1 week
        },
      }
    });

    let uri = res.status !== 200 ? `${base}${country}/` : `${base}/int/`

    const params = url.searchParams.toString();
    if (params) uri += `?${params}`;

    return Response.redirect(uri, redirectStatus);
  } catch (e) {
    console.error(e);
    return Response.redirect(`${base}/502/`, redirectStatus);
  }
}
