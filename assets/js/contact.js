$('.email').click(function () {
  social_media_notice('email', $(this).data('lang'), $(this).data('email'))
})

$('.facebook').click(function () {
  social_media_notice('facebook', $(this).data('lang'), $(this).data('facebook'));
})

$('.twitter').click(function (){
  social_media_notice('tweet', $(this).data('lang'), $(this).data('twitter'))
})

function social_media_notice(type, lang, handle){
  const uri = `/contact/?type=${type}&lang=${lang}&handle=${handle}`
  if (window.localStorage.getItem('social-media-notice') !== 'hidden') {
    let modal = new bootstrap.Modal($('#social-media-warn'));
    modal.toggle();
    $('#social-media-accept').attr('onclick', `window.localStorage.setItem('social-media-notice', 'hidden');window.open('${uri}', '_blank');`)
  } else {
    window.open(uri, '_blank');
  }
}
