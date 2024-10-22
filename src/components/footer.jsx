import {render} from 'preact';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      © 2factorauth {year}
    </footer>
  );
}

render(<Footer/>, document.getElementById('footer'));
