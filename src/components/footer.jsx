import {render} from 'preact';

import "/assets/css/footer.scss";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      © 2factorauth {year}
    </footer>
  );
}

render(<Footer/>, document.getElementById('footer'));
