import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import compileMarkdown from "./markdown";

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
  css: {
    // Options for preprocessing SCSS
    preprocessorOptions: {
      scss: {
        additionalData: `@import "assets/css/root.scss";`,
      },
    },
  },
  plugins: [
    preact({
      prerender: {
        enabled: false,
      },
    }),
    compileMarkdown(),
  ],
});
