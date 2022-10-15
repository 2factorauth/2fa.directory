let resizeObserver = new ResizeObserver(() => {
    if ($('body').height() < $(window).height()) {
        $('footer').css({position: 'absolute'});
    } else {
        $('footer').css({position: 'static'});
    }
});
resizeObserver.observe($('body')[0]);