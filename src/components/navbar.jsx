import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { API_URL } from '../constants.js';


function Navbar() {
  const [regions, setRegions] = useState({});

  const region = window.location.pathname.replace(/\//g, "");

  useEffect(() => {
    fetch(`${API_URL}/regions.json`, { cache: 'force-cache' }).
      then(res => res.json()).
      then(data => setRegions(data)).
      catch(err => console.error('Error fetching regions:', err));  // Add error handling
  }, []);

  return (
    <div className="container">
      <a className="nav-link" id="branding" href="https://2factorauth-org.pages.dev/">
        <ul className="icon">
          <li>2FA Directory</li>
        </ul>
      </a>

      {Object.keys(regions).includes(region) && <>
        <a class="nav-link dropdown-toggle" id="regionDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" aria-haspopup="true" aria-label="Choose region" tabindex={0}>
          <span aria-hidden={true} className={window.location.pathname == "/int/" ? "bi bi-globe" : `fi fi-${region}`}></span>
        </a>

        <div aria-labelledby="regionDropdown" className="dropdown-menu dropdwon-menu-end">
          <a class="dropdown-item" href="/int/">
            <span class="fi fi-un"></span>
            <b>Global</b>
          </a>

          {Object.keys(regions).sort((a, b) => regions[a].name.localeCompare(regions[b].name)).map((region) =>
            <a class="dropdown-item" href={`/${region}/`}>
              <span class={`fi fi-${region} ${regions[region].squareFlag && "fis"}`}></span>
              {regions[region].name}
            </a>
          )}
        </div>
      </>
      }
    </div>
  )
}

render(<Navbar />, document.getElementById('nav'));
