import MarkdownIt from "markdown-it";
import frontmatter from "front-matter";
import { markdownItTable } from "markdown-it-table";
import { readdir, readFile, mkdir, writeFile } from "fs/promises";
import { existsSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const markdownDirectory = "content";
const template = (await readFile("markdown.html")).toString();

const md = MarkdownIt().use(markdownItTable);

let files = [],
  outputFiles = [];

// Source: https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md#renderer
const defaultRender =
  md.renderer.rules.link_open ||
  ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));

md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  // Add a new `target` attribute, or replace the value of the existing one.
  tokens[idx].attrSet("target", "_blank");

  // Pass the token to the default renderer.
  return defaultRender(tokens, idx, options, env, self);
};

/**
 * Converts a Markdown file to an HTML file
 *
 * @param {string} path - The path to the Markdown file
 */
const compileMarkdownFile = async (path) => {
  const contents = (await readFile(path)).toString();

  const { attributes } = frontmatter(contents);
  const rendered = md.render(contents.slice(contents.indexOf("---", 5) + 3));

  const filename = attributes.url || path.split("/").pop().split(".")[0];

  await writeFile(
    `./${filename}.html`,
    template
      .replaceAll("{title}", attributes.title)
      .replace("{content}", rendered),
  );
  outputFiles.push(`${filename}.html`);
};

/**
 * Convert all Markdown files in a directory to an HTML file
 *
 * @param {string} directory - The path to the directory, relative to the current working directory
 */
const compileAllMarkdownFiles = async (directory) => {
  files = (await readdir(directory))
    .filter((file) => file.endsWith(".md"))
    .map((file) => `${directory}/${file}`);

  await Promise.allSettled(files.map(compileMarkdownFile));
};

// await compileMarkdownFile("content/companies.md");
// await compileAllMarkdownFiles(markdownDirectory);

// Vite Plugins

/**
 * Compile all Markdown files in a directory to HTML
 *
 * @param {Object} [options] - The plugin options
 * @param {string} [options.directory] - A relative path to the Markdown folder
 */
const compileMarkdownPlugin = (options = { directory: "content" }) => ({
  name: "compileMarkdown",
  async config(config, { command }) {
    if (command === "build") {
      config.build = config.build || {};
      config.build.rollupOptions = config.build.rollupOptions || {};
      config.build.rollupOptions.input = config.build.rollupOptions.input || {};

      const input = config.build.rollupOptions.input;

      await compileAllMarkdownFiles(options.directory);

      outputFiles.forEach((file) => {
        const resolvedPath = resolve(process.cwd(), file);
        input[file.replace(".html", "")] = resolvedPath;
      });
    }
  },
});

export default compileMarkdownPlugin;
