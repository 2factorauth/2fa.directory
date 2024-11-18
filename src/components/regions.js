import {html} from 'htm/preact';
import {API_URL} from '../constants.js';
import {Component, render} from 'preact';

export default class Regions extends Component {
  constructor() {
    super();
    this.state = {
      currentRegion: '',
      open: false,
    };
    this.loadDropdown = this.loadDropdown.bind(this);
  }

  componentDidMount() {
    this.setCurrentRegion();
  }

  // Determine the current region based on URL
  setCurrentRegion() {
    const region = window.location.pathname.replace(/\//g, '');
    this.setState({
      currentRegion: region === 'int' || region === '' ?
        'fi-globe':
        `fi fi-${region}`,
    });
  }

  loadDropdown = () => {
    this.setState((prevState) => ({open: !prevState.open}));
  };

  render(_, {currentRegion, open}) {
    return html`
      <div>
        <a
          class="nav-link dropdown-toggle"
          id="regionDropdown"
          role="button"
          aria-expanded=${open}
          aria-haspopup="true"
          aria-label="Choose region"
          tabindex="0"
          onclick=${this.loadDropdown}
        >
          <span aria-hidden="true" class=${currentRegion}></span>
        </a>
        ${open === true && (html`
          <${Dropdown}/>`)}
      </div>
    `;
  }
}

class Dropdown extends Component {
  constructor() {
    super();
    this.state = {
      regions: {},
    };
  }

  componentDidMount() {
    this.fetchRegions();
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

  render(_, {regions}) {
    const regionKeys = Object.keys(regions).sort((a, b) => regions[a].name.localeCompare(regions[b].name));

    return html`
      <div aria-labelledby="regionDropdown"
           class="dropdown-menu dropdown-menu-end ${regionKeys.length ?
             'show':
             ''}">
        <a class="dropdown-item" href="/int/">
          <span class="fi fi-un"></span>
          <b>Global</b>
        </a>

        ${regionKeys?.map((region) => html`
          <a class="dropdown-item" href="/${region}/">
            <span class=${`fi fi-${region} ${regions[region].squareFlag ?
              'fis':
              ''}`}></span>
            ${regions[region].name}
          </a>
        `)}
      </div>`;
  }
}

render(html`<${Regions}/>`, document.getElementById('regions'));
