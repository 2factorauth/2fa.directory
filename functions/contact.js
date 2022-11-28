async function i18n(type, lang) {
  // Fetch locale data from 2factorauth/frontend
  const response = await fetch('https://raw.githubusercontent.com/2factorauth/frontend/master/data/languages.json');
  const languages = await response.json();
  // Default language is English
  if (!(lang in languages)) lang = 'en';
  const locale = languages[lang][type]
  // Fetch random string of available from locale
  return locale[Math.floor(Math.random() * locale.length)]
}

export async function onRequestGet(context) {
  const {searchParams} = new URL(context.request.url)
  const type = searchParams.get('type')
  const handle = searchParams.get('handle')
  const lang = searchParams.get('lang')
  switch (type) {
    case 'tweet':
      return await twitter(handle, lang)
    case 'email':
      return await email(handle, lang)
    case 'facebook':
      return facebook(handle)
  }
}

async function email(handle, lang) {
  const text = await i18n('email_subject', lang)
  const uri = `mailto:${handle}?subject=${text}`
  // Response.redirect can't be used due to CF being dumb.
  // https://community.cloudflare.com/t/348100
  return new Response(null, {status: 302, headers: {'Location': uri}})
}

async function twitter(handle, lang) {
  const text = (await i18n('tweets', lang)).replace('TWITTERHANDLE', handle)
  const uri = `https://twitter.com/intent/tweet?text=${text}&hashtags=SupportTwoFactorAuth&related=2faorg`
  return Response.redirect(uri, 302);
}

function facebook(handle) {
  return Response.redirect(`https://facebook.com/${handle}`, 302)
}
