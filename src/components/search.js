import { html } from "htm/preact";
import { render } from "preact";
import { useEffect, useState } from "preact/hooks";
import algoliasearch from "algoliasearch";
import Table from "./table";
import useTranslation from '../hooks/useTranslation.js';

const t = useTranslation();

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
    document.getElementById("categories-title").style.display = "block";
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
        .filter(([, entry]) =>
          region !== "int"
            ? !entry.regions || entry.regions.includes(region)
            : true,
        );

      if (entries.length !== 0) {
        const table = html`<${Table}
          Title="Search Results"
          search=${entries}
        />`;

        document.getElementById("categories").style.display = "none";
        document.getElementById("categories-title").style.display = "none";

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
  const [query, setQuery] = useState("");
  let timeout = null;

  useEffect(async () => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("q")) {
      const query = searchParams.get("q");
      setQuery(query);
      sendSearch(query);
    }
  }, []);

  /**
   * Search and update query parameter without reloading the page
   *
   * @param {string} query - The query
   */
  const search = (query) => {
    sendSearch(query);

    if (query) {
      // Source: https://stackoverflow.com/a/70591485
      const url = new URL(window.location.href);
      url.searchParams.set("q", query);
      window.history.pushState(null, "", url.toString());
    } else window.history.pushState(null, "", window.location.pathname);
  };

  return html`
    <input
      type="search"
      aria-label="Search the directory"
      placeholder=${t('search-placeholder')}
      autocomplete="off"
      spellcheck="false"
      aria-keyshortcuts="s"
      onInput=${(event) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => search(event.target.value), 1000);
      }}
      value=${query}
    />

    <a href="https://algolia.com/" title="Search by Algolia"></a>
  `;
}

render(html`<${Search} />`, document.getElementById("search"));
