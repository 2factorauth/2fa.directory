import { html } from "htm/preact";
import render from "preact-render-to-string";
import Footer from "../src/components/footer.js";
import Navbar from "../src/components/navbar.js";

const prerenderPlugin = () => {
  const renderedNavbar = render(html`<${Navbar} />`);
  const renderedFooter = render(html`<${Footer} />`);

  return {
    name: "prerender",
    transformIndexHtml(html) {
      return html
        .replace("<!-- navbar -->", renderedNavbar)
        .replace("<!-- footer -->", renderedFooter);
    },
  };
};

export default prerenderPlugin;
