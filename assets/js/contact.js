$('.contact-btn.email').click(function () {
  social_media_notice('email', $(this).data('lang'), $(this).data('email'))
})

$('.contact-btn.form').click(function () {
  window.open($(this).data('form'), '_blank')
})

$('.contact-btn.facebook').click(function () {
  social_media_notice('facebook', $(this).data('lang'), $(this).data('facebook'));
})

$('.contact-btn.twitter').click(function (){
  social_media_notice('tweet', $(this).data('lang'), $(this).data('twitter'))
})

$('#social-media-accept').click(function (){
  window.localStorage.setItem('social-media-notice', 'hidden');
  window.open($(this).data('url'), '_blank');
})

function social_media_notice(type, lang, handle){
  const uri = `/contact/?type=${type}&lang=${lang}&handle=${handle}`
  if (window.localStorage.getItem('social-media-notice') !== 'hidden') {
    let modal = new bootstrap.Modal($('#social-media-warn'));
    $('#social-media-accept').data('url', uri);
    modal.toggle();
  } else {
    window.open(uri, '_blank');
  }
}
