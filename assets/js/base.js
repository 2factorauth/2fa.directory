let resizeObserver = new ResizeObserver(() => {
    if ($('body').height() < $(window).height()) {
        $('footer').css({position: 'absolute'});
    } else {
        $('footer').css({position: 'static'});
    }
});
resizeObserver.observe($('body')[0]);
$(document).ready(() => {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/service-worker.js');
})