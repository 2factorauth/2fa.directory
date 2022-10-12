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
    const table = $(`.table[data-table='${category}']`);
    const button = $(`.category-btn[href^="#${category}"]`)
    const index = button.index('.category-btn');
    const length = $('.categories').css('grid-template-columns').split(' ').length;
    const row = Math.floor(index / length);
    const column = index % length;
    $(`.table[data-table='${category}']`).attr('style', `grid-area: ${row + 2} / 1 / ${row + 3} / ${length + 1}`);
    table.collapse('show');
}
