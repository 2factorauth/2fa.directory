import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { API_URL } from '../constants.js';
import Table from './table.jsx';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // Track the selected category

  // Fetch categories from the API
  useEffect(() => {
    if(!categories.length) {
      const region = window.location.pathname.slice(1);
      fetch(`${API_URL}/${region || 'int/'}categories.json`).
        then(res => res.json()).
        then(data => setCategories(Object.entries(data) || [])).
        catch(err => console.error('Error fetching categories:', err));  // Add error handling
    }
  }, []);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) setSelectedCategory(hash);
  }, []);

  // Render a list of category buttons
  return (
    categories.map(([key, category], index) => (
      <>
        <Button key={key} name={key} category={category} setSelectedCategory={setSelectedCategory} activeCategory={selectedCategory} />

        {/* Render the table after the button div but outside of it */}
        {selectedCategory === key && <Table Category={key} Title={category.title} Order={index} />}
      </>
    ))
  );
}

function Button({ name, category, setSelectedCategory, activeCategory }) {
  const handleCategoryClick = () => {
    setSelectedCategory(prevSelected => (prevSelected === name ? null : name));
    history.pushState("", document.title, window.location.pathname + window.location.search);
  };

  return (
    <div>
      <button class={`category-btn${activeCategory === name ? ' active' : ''}`}
        onClick={handleCategoryClick}
        href={`#${name}`}
        aria-controls={name}
        id={name}>
        <span
          aria-hidden="true"
          className="category-icon"
          dangerouslySetInnerHTML={{ __html: category.icon }}
        />
        <div>{category.title}</div>
      </button>
    </div>
  );
}

render(<Categories />, document.getElementById('categories'));
