import render from "preact-render-to-string";
import Footer from "./src/components/footer.jsx";

const renderStaticPlugin = () => {
  const renderedFooter = render(<Footer />);

  return {
    name: "renderStatic",
    transformIndexHtml(html) {
      return html.replace("<!--footer-->", renderedFooter);
    }
  }
};

export default renderStaticPlugin;
