const api_uri = 'https://2fa.directory/api/v3/all.json'
const cache = caches.default;


async function fetchAPI() {
    const request = new Request(api_uri, {headers: {'content-type': 'application/json;charset=UTF-8',}})
    let response = await cache.match(request);
    if (!response) {
        response = await fetch(request);
        response = new Response(response.body, response)
        response.headers.append('Cache-Control', 's-maxage=86400');
        await cache.put(request, await response.clone());
    }
    return JSON.parse(await response.text())
}

export async function onRequestPost({ request }) {
    let output = [];
    const {searchParams} = new URL(request.url)
    const keys = Array.from(searchParams.keys());
    const entries = await fetchAPI();
    for (const [_name, entry] of entries) {
        let matching = true
        for (const key of keys) {
            if (!matching) break
            if (entry[key] === undefined || entry[key].includes(searchParams.get(key)) === false) matching = false
        }
        if (matching) output.push(entry);
    }

    return new Response(JSON.stringify(output), {headers: {'content-type': 'application/json'}});
}
