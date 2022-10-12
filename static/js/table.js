$(document).ready(() => {
    // Show category of query
    const query = window.location.hash;
    if (query && query.indexOf('#') > -1) showCategory(query.substring(1));
});

$(window).on('hashchange', async () => {
    const query = window.location.hash;
    if (query && query.indexOf('#') > -1) await showCategory(query.substring(1));
});

$('.category-btn').click(function () {
    const href = $(this).attr('href');
    if (window.location.hash === href) {
        history.pushState("", document.title, window.location.pathname + window.location.search);
        $('.table').collapse('hide');
    } else {
        window.location.hash = href;
    }
});

function showCategory(category) {
    $(`.table:not([data-table='${category}'])`).collapse('hide');
    $(`.table[data-table='${category}']`).collapse('show');
}
