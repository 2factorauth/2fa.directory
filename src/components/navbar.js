import {html} from 'htm/preact';

export default function Navbar() {
  return html`<nav id="nav" class="navbar navbar-expand-lg" role="navigation">
    <div class="container">
      <a class="nav-link" id="branding" href="/">
        <ul class="icon">
          <li>2FA Directory</li>
        </ul>
      </a>

      <div id="regions"/>
    </div>
  </nav>`;
}
