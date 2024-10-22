import { render, h } from 'preact';
import htm from 'htm';
import { signal } from '@preact/signals';

const html = htm.bind(h);
// Create signals for storing state
const dataSignal = signal(''); // Signal to store the formatted data string
const isLoading = signal(true); // Signal for loading state
const isError = signal(false); // Signal for error state
const errorMessage = signal(''); // Signal to store error messages

// Fetch data and process it when the component mounts
const fetchData = async () => {
  try {
  const response = await fetch('https://api.2fa.directory/v3/all.json');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }


  // Set the formatted data in the signal
  dataSignal.value = await response.json();
  isLoading.value = false; // Set loading to false when data is fetched
  } catch (err) {
  isError.value = true; // Set error signal to true
  errorMessage.value = err.message; // Set error message
  isLoading.value = false; // Stop loading on error
  }
};

// Immediately trigger the data fetch when the script runs
fetchData();

// Main App component using Signals
const App = () => {
  // Render the app with different states based on the signals
  return html`
  <div>
    <h1>2FA Directory Services</h1>

    <!-- Handle loading state -->
    ${isLoading.value && html`<div>Loading...</div>`}

    <!-- Handle error state -->
    ${isError.value && html`<div>An error occurred: ${errorMessage.value}</div>`}

    <!-- Render the data when available -->
    <ul>
      ${dataSignal.value.map(([serviceName, serviceDetails]) => {
      const domain = serviceDetails.domain;
      const keywords = serviceDetails.keywords.join(', ');
      const tfa = serviceDetails['tfa']?.join(' ') || 'None';

      return html`
        <li key=${serviceName}>
        <h2>${serviceName}</h2>
        <p><strong>Domain:</strong> ${domain}</p>
        <p><strong>Categories:</strong> ${keywords}</p>
        <p><strong>2FA:</strong> ${tfa}</p>
        </li>
      `;
      })}
    </ul>
  </div>
  `;
};

render(html`<${App} />`, document.getElementById('app'));
