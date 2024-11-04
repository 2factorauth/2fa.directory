import { html } from "htm/preact";
import render from "preact-render-to-string";
import Footer from "../src/components/footer.js";
import Navbar from "../src/components/navbar.js";
import Head from '../src/components/head.js';

const prerenderPlugin = () => {
  const renderedHead = render(html`<${Head} />`);
  const renderedNavbar = render(html`<${Navbar} />`);
  const renderedFooter = render(html`<${Footer} />`);

  return {
    name: "prerender",
    transformIndexHtml(html) {
      return html
        .replace("<!-- head -->", renderedHead)
        .replace("<!-- navbar -->", renderedNavbar)
        .replace("<!-- footer -->", renderedFooter);
    },
  };
};

export default prerenderPlugin;
