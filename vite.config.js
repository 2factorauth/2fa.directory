import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import { createHtmlPlugin } from 'vite-plugin-html'
import preact from "@preact/preset-vite";
import compileMarkdown from "./markdown";
import renderStatic from "./render";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        // companies: resolve(__dirname, "companies.html"),
      },
    },
    cssCodeSplit: true, // This is the default behavior

  },
  plugins: [preact(), compileMarkdown(), renderStatic(),  createHtmlPlugin({minify: true})],
});
