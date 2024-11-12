import {render} from 'preact';
import {html} from 'htm/preact';
import {useEffect} from 'preact/hooks';

function Dialog() {
  useEffect(() => {
    document.getElementById("social-media-accept").addEventListener("click", () => {
      window.localStorage.setItem('social-media-notice', 'hidden');
      window.open(
          document.getElementById('social-media-accept').getAttribute('data-url'), "_blank"
      );
    });
  }, []);

  return html`
    <h3>Attention!</h3>
    <p>Posting to social media could potentially give other people clues to what
      accounts you have.</p>
    <form method="dialog">
      <button class="btn btn-outline-success">Go back</button>
      <button class="btn btn-outline-danger" id="social-media-accept">
        I accept the risk
      </button>
    </form>
  `;
}

render(html`<${Dialog}/>`, document.getElementById('social-media-warn'));
