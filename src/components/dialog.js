import {render} from 'preact';
import {html} from 'htm/preact';
import {useEffect} from 'preact/hooks';
import useTranslation from '../hooks/useTranslation.js';

function Dialog() {
  const t = useTranslation();

  useEffect(() => {
    document.getElementById("social-media-accept").addEventListener("click", () => {
      window.localStorage.setItem('social-media-notice', 'hidden');
      window.open(
          document.getElementById('social-media-accept').getAttribute('data-url'), "_blank"
      );
    });
    document.getElementById('categories-title').innerText = t('categories');
  }, []);

  return html`
    <h3>${t('attention')}</h3>
    <p>${t('social-media-warning')}</p>
    <form method="dialog">
      <button class="btn btn-outline-success">${t('go-back')}</button>
      <button class="btn btn-outline-danger" id="social-media-accept">
        ${t('accept-risk')}
      </button>
    </form>
  `;
}

render(html`<${Dialog}/>`, document.getElementById('social-media-warn'));
