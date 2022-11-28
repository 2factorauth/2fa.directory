export async function onRequest({env, request}) {
  const base = env.base || 'https://2fa.pages.dev/'
  const country = request.cf?.country.toLowerCase() || "int";
  let uri = `${base}${country}`
  const res = await fetch(uri, {
    cf: {
      cacheTtl: 86400, cacheEverything: true
    }
  })
  if (res.status !== 200) uri = `${base}/int`

  return Response.redirect(uri, 302);
}
