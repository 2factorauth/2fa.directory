import {Component, render} from 'preact';
import {useEffect, useState} from 'preact/hooks';
import Table from './table.jsx';

// API URL for fetching categories
const API_URL = 'https://raw.githubusercontent.com/2factorauth/2fa.directory/refs/heads/master/data/categories.json';

function Categories() {
  const [categories, setCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null); // Track the selected category

  // Fetch categories from the API
  useEffect(() => {
    fetch(API_URL).
      then(res => res.json()).
      then(data => setCategories(data || {})).
      catch(err => console.error('Error fetching categories:', err));  // Add error handling
  }, []);



  // Render a list of category buttons
  return (
    <>
      {Object.entries(categories).map(([key, category]) => (
        <>
          <div>
            <Button key={key} name={key} category={category} setSelectedCategory={setSelectedCategory} />
          </div>
          {/* Render the table after the button div but outside of it */}
          {selectedCategory === key && <Table Category={key} Title={category.title} />}
        </>
      ))}
    </>
  );
}

function Button({name, category, setSelectedCategory}) {

  const handleCategoryClick = () => {
    setSelectedCategory(name); // Update the selected category
  };

  return (
    <div>
      <button class="category-btn"
              onClick={handleCategoryClick}
              href={`#${name}`}
              aria-controls={name}>
        <span
          aria-hidden="true"
          className="category-icon"
          dangerouslySetInnerHTML={{__html: category.icon}}
        />
        {category.title}
      </button>
    </div>
  );
}

render(<Categories/>, document.getElementById('categories'));
