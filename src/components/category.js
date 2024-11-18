import {html} from 'htm/preact';
import {Component, render} from 'preact';
import {API_URL} from '../constants.js';
import Table from './table.jsx';
import useTranslation from '../hooks/useTranslation';

class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      selectedCategory: null,
      columns: 6,
      error: false,
    };

    // Bind methods
    this.handleHashChange = this.handleHashChange.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.setSelectedCategory = this.setSelectedCategory.bind(this);

    const region = window.location.pathname.slice(1);
    fetch(`${API_URL}/${region || 'int/'}categories.json`).
      then((res) => res.json()).
      then((data) => {
        this.setState({categories: Object.entries(data) || []});
      }).catch((err) => this.setState({error: err}));
  }

  componentWillMount() {
    // Set initial hash and columns
    this.handleHashChange();
    this.handleResize();

    // Add event listeners
    window.addEventListener('hashchange', this.handleHashChange);
    window.addEventListener('resize', this.handleResize);
  }

 /* componentDidMount() {
    i18n.get('categories').then((res) => document.getElementById('categories-title').innerText = res)
  }*/

  componentWillUnmount() {
    window.removeEventListener('hashchange', this.handleHashChange);
    window.removeEventListener('resize', this.handleResize);
  }

  handleHashChange() {
    this.setState({selectedCategory: window.location.hash.slice(1) || null});
  }

  handleResize() {
    this.setState({columns: window.innerWidth < 993 ? 1:6});
  }

  setSelectedCategory = (category) => {
    if (this.state.selectedCategory === category)
      this.setState({selectedCategory: ''});
    else
      this.setState({selectedCategory: category});
    history.pushState(
      '',
      document.title,
      window.location.pathname + window.location.search,
    );
  };

  render(props, state) {
    const {categories, selectedCategory, columns} = state;
    if (this.state.error)
      return html`<p>Failed to load categories</p>`;
    else
      return html`${categories.map(([key, category], index) => (html`
          <${Button}
            name=${key}
            category=${category}
            setSelectedCategory=${this.setSelectedCategory}
            activeCategory=${selectedCategory}
          />

          <!-- Render the table after the button div but outside of it -->
          ${selectedCategory === key && (html`
              <${Table}
                Category=${key}
                Title=${category.title}
                grid=${`${Math.floor(index / columns) + 2} / 1 / ${Math.floor(
                  index / columns) + 3} / ${
                  columns + 1
                }`}
              />`
          )}
        `
      ))}`;
  }
}

class Button extends Component {
  handleClick = () => {
    const {name, setSelectedCategory} = this.props;
    setSelectedCategory(name);
  };



  render(props) {
    const {name, category, activeCategory} = props;
    const isActive = activeCategory === name;
    const t = useTranslation();

    return html`
      <button
        class=${`category-btn ${isActive ? 'active':''}`}
        onClick=${this.handleClick}
        aria-controls=${name}
        id=${name}>
          <span
            aria-hidden="true"
            class="category-icon material-symbols-outlined"
            dangerouslySetInnerHTML=${{__html: category.icon}}
          ></span>
        <div>${t(name)}</div>
      </button>
    `;
  }
}

render(html`<${Categories}/>`, document.getElementById('categories'));
