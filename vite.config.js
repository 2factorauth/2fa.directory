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
  },
  plugins: [
    preact({
      prerender: {
        enabled: true,
      },
    }),
    compileMarkdown(),
  ],
});
