// Connect and authenticate with your Algolia app
const client = algoliasearch('9TTZ08M03E', 'faa905e846fea4f08548776bc7273855')

// Create a new index and add a record
const index = client.initIndex('2fa.directory')

// Wait for user to stop typing before searching
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
  if (query === undefined || query === "" || (query.length < 3  && !query.match('^[x|X]$')) || query.match('http(s)?:\/\/.*') || query.match('^2fa(:)?$')) {
    $('.category-btn').parent().show();
    $('.table').removeClass('show');
    $('.categories').removeClass('search-results');
    $('.entry:not(.hit)').show();
    $('.entries.hit').removeClass('hit');
  } else {
    $('.entry.hit').removeClass('hit');
    // Hide category buttons
    $('.category-btn').parent().hide();

    // Change CSS Grid layout
    $('.categories').addClass('search-results');

    // Set search options array
    let options = {
      hitsPerPage: 500, attributesToRetrieve: ['objectID']
    }

    if(query.match('^[x|X]$')) query = '"X"'

    // Fetch filters from search query.
    let filter = []
    let _query = []
    query.split(' ').map(item => {
      // Add word to filter<str> & remove word from _query<str[]>
      if (item.match(/\w:\w/g)) {
        filter.push(item);
      } else {
        _query.push(item)
      }
    });

    // Convert back _query<str[]> to query<str>
    query = _query.join(' ');

    // Add fetched filters to search options array
    if (filter) options['facetFilters'] = filter;

    // Execute search
    index.search(query, options)
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
