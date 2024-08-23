import { readFileSync, readdirSync, writeFileSync } from "fs";
import { join as joinPath } from "path";
import { marked } from "marked";
import { default as config } from "./config.json" with { type: "json"}

const {PAGES_PATH, TEMPLATE_PATH } = config;
const OUTPUT_PATH = "public/"; // This value is hard-coded rather than exposed in config because it is used by package.json scripts as well.

const pages = readdirSync(PAGES_PATH);
const templates = readdirSync(TEMPLATE_PATH);

/**
 * Given a file path, generate the static output for the contents of that file.
 * @type {(path: string) => string}
 */
function render(path) {
  if (path.endsWith(".js") || path.endsWith(".css")) {
    // Serve as-is
    return readFileSync(path).toString();
  } else if (path.endsWith(".md")) {
    const md = readFileSync(path).toString();
    return marked.parse(md, { async: false });
  } else if (path.endsWith(".html")) {
    const html = readFileSync(path).toString();
    return templates.reduce((acc, template) => {
      if (!acc.includes(`<!--${template}-->`)) {
        return acc;
      }

      return acc.replaceAll(
        `<!--${template}-->`,
        render(joinPath(TEMPLATE_PATH, template))
      );
    }, html);
  } else {
    throw new Error(`Cannot handle extension: ${path}`);
  }
}

pages.forEach((page) => {
  const rendered = render(joinPath(PAGES_PATH, page));
  writeFileSync(joinPath(OUTPUT_PATH, page), rendered);
});
