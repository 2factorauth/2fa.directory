export default function Footer() {
  const year = new Date().getFullYear();

  return <footer role="contentinfo">
    <a class="back-to-top-link back-to-top-link-moved" href="#">
      <i class="bi bi-arrow-up-circle" aria-hidden="true"></i>
    </a>

    <nav class="footer-inner">
      <a class="nav-item" href="https://2factorauth-org.pages.dev" target="_blank">About</a>
      <a class="nav-item" href="/bots">Bots</a>
      <a class="nav-item" href="/privacy">Privacy</a>
      <a class="nav-item" href="/api">API</a>
      <a class="nav-item" href="/companies">Legal</a>
      <a class="nav-item" href="https://github.com/2factorauth/twofactorauth">Contributing</a>

      <div class="disclaimer">
        <p>The data on this website is crowdsourced and some data may be outdated.</p>
        <p>2fa.directory is maintained by the non-profit <a href="https://2factorauth-org.pages.dev" target="_blank">2factorauth</a> and hosted on <a href="https://github.com/2factorauth/twofactorauth">GitHub</a>.</p>
        <p>Copyright &copy; {year} 2factorauth.</p>
      </div>
    </nav>
  </footer>;
}

