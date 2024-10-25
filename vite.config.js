import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
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
      },
    },
    cssCodeSplit: true, // This is the default behavior
  },
  css: {
    preprocessorOptions: {
      scss: {
        // We can't move to the recommended `sass-embedded` package because the
        // build just runs infinitely during the Cloudflare build
        silenceDeprecations: ["legacy-js-api"],
      },
    },
  },
  plugins: [
    preact(),
    compileMarkdown(),
    renderStatic(),
    createHtmlPlugin({ minify: true }),
  ],
});
