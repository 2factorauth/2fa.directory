import {html} from 'htm/preact';
import {API_URL} from '../constants.js';
import {Component, render} from 'preact';

export default class Regions extends Component {
  constructor() {
    super();
    this.state = {
      regions: {},
      currentRegion: '',
    };
  }

  componentDidMount() {
    this.fetchRegions();
    this.setCurrentRegion();
  }

  // Fetch regions and set them to state
  async fetchRegions() {
    try {
      const res = await fetch(`${API_URL}/regions.json`,
        {cache: 'force-cache'});
      const data = await res.json();
      this.setState({regions: data || {}});
    } catch (error) {
      console.error('Error fetching regions:', error);
    }
  }

  // Determine the current region based on URL
  setCurrentRegion() {
    const region = window.location.pathname.replace(/\//g, '');
    this.setState({
      currentRegion: region === 'int' || region === '' ?
        'bi bi-globe':
        `fi fi-${region}`,
    });
  }

  render(_, {regions, currentRegion}) {
    return html`
      <div>
        <a
          class="nav-link dropdown-toggle"
          id="regionDropdown"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          aria-haspopup="true"
          aria-label="Choose region"
          tabindex="0">
          <span aria-hidden="true" class=${currentRegion}></span>
        </a>

        <div aria-labelledby="regionDropdown"
             class="dropdown-menu dropdown-menu-end">
          <a class="dropdown-item" href="/int/">
            <span class="fi fi-un"></span>
            <b>Global</b>
          </a>

          ${Object.keys(regions)?.
            sort((a, b) => regions[a].name.localeCompare(regions[b].name)).
            map((region) => html`
              <a class="dropdown-item" href="/${region}/">
                <span class=${`fi fi-${region} ${regions[region].squareFlag ?
                  'fis':
                  ''}`}></span>
                ${regions[region].name}
              </a>
            `)}
        </div>
      </div>
    `;
  }
}

render(html`<${Regions}/>`, document.getElementById('regions'));
