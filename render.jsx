import render from 'preact-render-to-string';
import Footer from './src/components/footer.js';
import Navbar from './src/components/navbar.js';

const renderStaticPlugin = () => {
  const renderedFooter = render(<Footer/>);
  const renderedNavbar = render(<Navbar/>);

  return {
    name: "renderStatic",
    transformIndexHtml(html) {
      return html
      .replace('<!-- footer -->', renderedFooter)
      .replace('<!-- navbar -->', renderedNavbar);
    }
  }
};

export default renderStaticPlugin;
