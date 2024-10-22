import {Component, render} from 'preact';

export class Navbar extends Component {

  render() {
    const Title = '2FA Directory'
    return (
      <nav className="navbar navbar-expand-lg" role="navigation">
        <div className="container">
          <a className="nav-link" id="branding" href="">
            <ul className="icon">
              <li>{ Title }</li>
            </ul>
          </a>
          {/*{{if eq.Layout "tables"}}
          <a className="nav-link dropdown-toggle" id="regionDropdown"
             role="button" data-bs-toggle="dropdown" aria-expanded="false"
             aria-haspopup="true" aria-label="Choose region" tabIndex="0">
            {{if .Params.Region.id}}
            <span
              className="fi fi-{{- .Params.Region.id -}}{{ if .Params.Region.square_flag }} fis{{ end }}"
              aria-hidden="true"></span>
            {{ - else -}}
            <span className="bi bi-globe" aria-hidden="true"></span>
            {{end}}
          </a>
          {{ - partial "regions" .Site.Data.regions -}}
          {{end}}*/}
        </div>
      </nav>

    )
  }
}

render(<Navbar />, document.getElementById('nav'));
