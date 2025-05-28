import {
  cpSync,
  readdirSync,
  readFileSync,
  writeFileSync,
  rmSync,
  mkdirSync,
  existsSync,
} from "fs";
import { join as joinPath } from "path";
import { marked } from "marked";
import hljs from "highlight.js";

const SOURCE_PATH = "src/";
const OUTPUT_PATH = "public/"; // This value is hard-coded rather than exposed in config because it is used by package.json scripts as well.

const FILES_DIR = "files";
const STATIC_DIR = "static";

// Setup syntax highlighting with marked
marked.setOptions({
  // @ts-ignore - The marked types don't include the highlight option but it's supported
  highlight: function(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
  langPrefix: 'hljs language-', // highlight.js css expects a top-level 'hljs' class
});

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
  const files = readdirSync(joinPath(SOURCE_PATH, FILES_DIR))
    .map(
      (filename) =>
        /** @type {[string, string]} */ ([
          filename,
          readFileSync(joinPath(SOURCE_PATH, FILES_DIR, filename)).toString(),
        ])
    )
    .map(
      ([filename, content]) =>
        `<div data-name="${filename}">
  ${marked.parse(content, { async: false })}
</div>`
    );

  // Add hidden source files for the easter egg
  const hiddenFiles = [
    { name: '.gitignore', path: '.gitignore' },
    { name: '.generate.js', path: 'generate.js' },
    { name: '.package.json', path: 'package.json' },
    { name: '.justfile', path: 'justfile' },
    { name: '.tsconfig.json', path: 'tsconfig.json' },
    { name: '.README.md', path: 'README.md' },
    { name: 'src/index.html', path: 'src/index.html' },
    { name: 'src/term.js', path: 'src/static/term.js' },
    { name: 'src/style.css', path: 'src/static/style.css' }
  ];

  const sourceFiles = hiddenFiles
    .filter(file => existsSync(file.path))
    .map(file => {
      const content = readFileSync(file.path).toString();
      const extension = file.name.split('.').pop() || "";

      // Process content based on file extension
      let processedContent;
      if (['js', 'css', 'html', 'json'].includes(extension)) {
        // Escape HTML characters to prevent rendering issues
        const escapedContent = content
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');

        // Apply syntax highlighting directly with highlight.js
        const highlightedCode = hljs.highlight(escapedContent, { language: extension }).value;
        processedContent = `<pre class="hljs"><code class="language-${extension}">${highlightedCode}</code></pre>`;
      } else if (extension === 'md') {
        // Parse markdown
        processedContent = marked.parse(content, { async: false });
      } else {
        // Default handling for other file types - escape HTML
        const escapedContent = content
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        processedContent = `<pre>${escapedContent}</pre>`;
      }

      return `<div data-name="${file.name}">
  ${processedContent}
</div>`;
    });

  const allFiles = [...files, ...sourceFiles].join("\n");
  const html = readFileSync(joinPath(SOURCE_PATH, "index.html")).toString();

  // Add highlight.js CSS to the HTML
  const highlightCSS = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/atom-one-dark.min.css">';
  const headEnd = '</head>';
  const composedWithHighlight = html.replace(headEnd, `${highlightCSS}\n  ${headEnd}`);

  const composed = composedWithHighlight.replace(`<!--files-->`, allFiles);
  writeFileSync(joinPath(OUTPUT_PATH, "index.html"), composed);
}

// Copy static files to root of output dir
{
  cpSync(joinPath(SOURCE_PATH, STATIC_DIR), OUTPUT_PATH, {
    recursive: true,
  });
}
