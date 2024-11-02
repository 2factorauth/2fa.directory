import { html } from "htm/preact";
import { render } from "preact";
import algoliasearch from "algoliasearch";
import Table from "./table";

const client = algoliasearch(
  import.meta.env.VITE_ALGOLIA_APP_ID,
  import.meta.env.VITE_ALGOLIA_API_KEY,
);
const index = client.initIndex(import.meta.env.VITE_ALGOLIA_INDEX_NAME);

const region = window.location.pathname.replace(/\//g, "");

const searchOptions = {
  hitsPerPage: 500,
  attributesToRetrieve: [
    "name",
    "category",
    "2fa",
    "regions",
    "contact",
    "documentation",
    "recovery",
    "notes",
    "img",
    "custom-software",
    "custom-hardware",
  ],
};

function hitToAPI(hit) {
  const attributes = { domain: hit.objectID, categories: hit.category };

  if (hit["2fa"]) attributes.methods = hit["2fa"];
  if (hit["custom-software"])
    attributes["custom-software"] = hit["custom-software"];
  if (hit["custom-hardware"])
    attributes["custom-hardware"] = hit["custom-hardware"];
  if (hit.documentation) attributes.documentation = hit.documentation;
  if (hit.recovery) attributes.recovery = hit.recovery;
  if (hit.notes) attributes.notes = hit.notes;
  if (hit.img) attributes.img = hit.img;
  if (hit.contact) attributes.contact = hit.contact;
  if (hit.regions) attributes.regions = hit.regions;

  return [hit.name, attributes];
}

/**
 * Send a search query to Algolia
 *
 * @param {string} query - The query
 */
function sendSearch(query) {
  if (
    query === undefined ||
    query === "" ||
    (query.length < 2 && !query.match("^[x|X]$")) ||
    query.match("http(s)?://.*") ||
    query.match("^2fa(:)?$")
  ) {
    document.getElementById("categories").style.display = "grid";
    render(null, document.getElementById("search-categories"));
  } else {
    if (query.match("^[x|X]$")) query = '"X"';

    let filter = [];
    let _query = [];
    query.split(" ").map((item) => {
      // Add word to filter<str> & remove word from _query<str[]>
      if (item.match(/\w:\w/g)) {
        filter.push(item);
      } else {
        _query.push(item);
      }
    });

    // Convert back _query<str[]> to query<str>
    query = _query.join(" ");

    // Add fetched filters to search options array
    const options = searchOptions;
    if (filter) options["facetFilters"] = filter;

    // Execute search
    index.search(query, options).then(({ hits }) => {
      const entries = hits
        .map((hit) => hitToAPI(hit))
        .filter(([, entry]) => !entry.regions || entry.regions.includes(region))
        .sort(([a], [b]) => a.localeCompare(b));

      if (entries.length !== 0) {
        const table = html`<${Table}
          Category="search"
          Title="Search Results"
          search=${entries}
        />`;

        document.getElementById("categories").style.display = "none";
        render(null, document.getElementById("search-categories"));
        render(table, document.getElementById("search-categories"));
      } else {
        render(
          html`<p>No results found.</p>`,
          document.getElementById("search-categories"),
        );
      }
    });
  }
}

function Search() {
  let timeout = null;

  return html`
    <div id="outerSearchBox">
      <input
        type="search"
        class="search"
        aria-label="Search the directory"
        placeholder="Search websites by name, URL or method (e.g. 2fa:sms)"
        autocomplete="off"
        spellcheck="false"
        aria-keyshortcuts="s"
        onInput=${(event) => {
          if (timeout) clearTimeout(timeout);
          timeout = setTimeout(() => sendSearch(event.target.value), 1000);
        }}
      />

      <a href="https://algolia.com/" title="Search by Algolia"></a>
    </div>
  `;
}

render(html`<${Search} />`, document.getElementById("search"));
