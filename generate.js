import {
  cpSync,
  readdirSync,
  readFileSync,
  writeFileSync,
  rmSync,
  mkdirSync,
  statSync,
} from "fs";
import { join as joinPath } from "path";
import { marked } from "marked";
import markedFootnote from "marked-footnote";
import { gfmHeadingId } from "marked-gfm-heading-id";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";

// Configure marked with syntax highlighting
marked.use(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    }
  })
);

// Configure marked with heading IDs (no prefix)
marked.use(gfmHeadingId());

// Configure marked with footnotes
marked.use(markedFootnote());

// Custom renderer to add target="_blank" only to external links
const renderer = {
  link({ href, title, text }) {
    const hrefStr = String(href || '');
    // Only add target="_blank" for external links (not starting with # or /)
    const isExternal = !hrefStr.startsWith('#') && !hrefStr.startsWith('/');
    const titleAttr = title ? ` title="${title}"` : '';
    const targetAttr = isExternal ? ' target="_blank"' : '';
    return `<a href="${hrefStr}"${titleAttr}${targetAttr}>${text}</a>`;
  }
};

marked.use({ renderer });

const SOURCE_PATH = "src/";
const OUTPUT_PATH = "public/"; // This value is hard-coded rather than exposed in config because it is used by package.json scripts as well.

const FILES_DIR = "files";
const STATIC_DIR = "static";

// Clear existing public directory
{
  try {
    rmSync(OUTPUT_PATH, { recursive: true });
  } catch (e) {}

  mkdirSync(OUTPUT_PATH);
}

// Compose HTML
{
  // Turn files into embeddable markup to be exposed as virtual "files" in the terminal.
  const fileEntries = readdirSync(joinPath(SOURCE_PATH, FILES_DIR), {
    recursive: true,
  })
    .filter(
      (file) =>
        !statSync(
          joinPath(SOURCE_PATH, FILES_DIR, file.toString()),
        ).isDirectory(),
    )
    .map(
      (filepath) =>
        /** @type {[string, string]} */ ([
          filepath.toString(),
          readFileSync(
            joinPath(SOURCE_PATH, FILES_DIR, filepath.toString()),
          ).toString(),
        ]),
    );

  const filesHtml = fileEntries
    .map(
      ([filename, content]) =>
        `<div data-name="${filename}">
  ${marked.parse(content, { async: false })}
</div>`,
    )
    .join("\n");

  const template = readFileSync(joinPath(SOURCE_PATH, "index.html")).toString();
  const withFiles = template.replace(`<!--files-->`, filesHtml);

  // Main index — no pre-rendered post content
  writeFileSync(
    joinPath(OUTPUT_PATH, "index.html"),
    withFiles.replace(`<!--post-content-->`, ""),
  );

  // Generate a static HTML page for each blog post
  const blogEntries = fileEntries.filter(([filename]) =>
    filename.startsWith("blog/"),
  );
  if (blogEntries.length > 0) {
    mkdirSync(joinPath(OUTPUT_PATH, "blog"), { recursive: true });
    for (const [filename, content] of blogEntries) {
      const slug = filename.replace(/^blog\//, "").replace(/\.md$/, "");
      const postHtml = marked.parse(content, { async: false });
      const promptHtml = `
<div class="entry">
  <span class="prompt">
    <a class="prompt-link" href="mailto:madison+website@aetherunbound.net">
      <span class="prompt-username">madison</span><span class="prompt-hostname">@aetherunbound.net</span></a>:<span class="prompt-path">~</span>$ <span class="prompt-input">cat ${filename}</span>
  </span>
</div>`;
      writeFileSync(
        joinPath(OUTPUT_PATH, "blog", `${slug}.html`),
        withFiles.replace(`<!--post-content-->`, promptHtml + "\n" + postHtml),
      );
    }
  }
}

// Copy static files to root of output dir
{
  cpSync(joinPath(SOURCE_PATH, STATIC_DIR), OUTPUT_PATH, {
    recursive: true,
  });
}
