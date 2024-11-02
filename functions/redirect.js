export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const base = `${url.protocol}//${url.hostname}/`;
  const redirectStatus = 302;

  try {
    const country = request.cf?.country?.toLowerCase() || "int";
    let uri = `${base}${country}/`;

    const res = await fetch(uri, {
      cf: {
        cacheTtlByStatus: {
          "200": 60 * 60 * 24 * 7, // Cache request 1 week
          "404": 60 * 60 * 24, // Cache request 1 day
        },
      },
    });

    // Redirect to /int/ if that page works
    if (res.status !== 200) {
      const int = await fetch(`${base}int/`);
      uri = int.status === 200 ? `${base}/int/` : `${base}/503/`;
    }

    const params = url.searchParams.toString();
    if (params) uri += `?${params}`;

    return Response.redirect(uri, redirectStatus);
  } catch (e) {
    console.error(e);
    return Response.redirect(`${base}/502/`, redirectStatus);
  }
}
