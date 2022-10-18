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
    if (query !== undefined || query !== "") {
        index.search(query, {
            attributesToRetrieve: ['objectID']
        })
            .then(({hits}) => {
                hits.forEach((hit) => {
                    const entry_name = hit['objectID'];
                    const entry = $(`.entry[data-domain^='${entry_name}']`);
                    entry.addClass('hit');
                    const entry_parent = $(`.table > .entry[data-domain^='${entry_name}']`).parent();
                    entry_parent.collapse('show');
                })
                $('.category-btn').parent().hide();
                $('.table').filter(function() { return !($(this).children().is('.hit')); }).collapse('hide');
                $('.categories').addClass('search-results');
                $('.entry.hit').show();
                $('.entry:not(.hit)').hide();
            })
    }else{
        //TODO: Reset page?
        $('.table').removeClass('search-results');
        $('.entry').show();
    }
}

