// Connect and authenticate with your Algolia app
const client = algoliasearch('9TTZ08M03E', 'faa905e846fea4f08548776bc7273855')

// Create a new index and add a record
const index = client.initIndex('2fa.directory')
let timeout = null;

$('.search').on('input', function () {
    if (timeout) {
        clearTimeout(timeout);
    }
    timeout = setTimeout(function () {
        sendSearch($('.search').val()); //this is your existing function
    }, 1000);

})

function sendSearch(query) {
    $('.entry.hit').removeClass('hit');
    if (query === undefined || query === "") {
        $('.category-btn').parent().show();
        $('.table').removeClass('show');
        $('.categories').removeClass('search-results');
    } else {
        // Hide category buttons
        $('.category-btn').parent().hide();

        // Change CSS Grid layout
        $('.categories').addClass('search-results');

        index.search(query, {
            hitsPerPage: 500, attributesToRetrieve: ['objectID']
        })
            .then(({hits}) => {
                hits.forEach((hit) => {
                    const entry_name = hit['objectID'];
                    const entry = $(`.entry[data-domain^='${entry_name}']`);
                    entry.addClass('hit');
                    const entry_parent = $(`.table > .entry[data-domain^='${entry_name}']`).parent();
                    entry_parent.addClass('show');
                })

                $('.table').filter(function () {
                    return !($(this).children().is('.hit'));
                }).collapse('hide');
                // Hide all non-matching entries
                $('.entry:not(.hit)').hide();
                $('.entry.hit').show();
            })
    }
}

