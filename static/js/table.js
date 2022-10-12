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
    const {row, column} = getGridElementsPosition(button.index('.category-btn'));
    console.log(row,column)
    $(`.table[data-table='${category}']`).attr('style', `grid-area: ${row + 2} / 1 / ${ row + 3} / 7`);
    table.collapse('show');
}
function getGridElementsPosition(index){
    const colCount = $('.categories').css('grid-template-columns').split(' ').length;
    return { row: Math.floor(index / colCount), column: index % colCount } ;
}