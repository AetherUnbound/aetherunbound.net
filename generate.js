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

      // HTML escape function
      const escapeHTML = (str) => {
        return str
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
      };

      // Process content based on file extension
      let processedContent;
      if (['js', 'css', 'html', 'json'].includes(extension)) {
        // Just use a pre tag with code and proper classes - highlighting will be done by client-side highlight.js
        processedContent = `<pre><code class="language-${extension}">${escapeHTML(content)}</code></pre>`;
      } else if (extension === 'md') {
        // Parse markdown
        processedContent = marked.parse(content, { async: false });
      } else {
        // Default handling for other file types
        processedContent = `<pre>${escapeHTML(content)}</pre>`;
      }

      return `<div data-name="${file.name}">
  ${processedContent}
</div>`;
    });

  const allFiles = [...files, ...sourceFiles].join("\n");
  const html = readFileSync(joinPath(SOURCE_PATH, "index.html")).toString();

  // Add highlight.js CSS and JS to the HTML
  const highlightCSS = `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/atom-one-dark.min.css">
  <style>
    /* Adjust highlight.js background to match site's black background */
    .hljs, pre code.hljs {
      background-color: #111 !important;
      padding: 1em;
      border-radius: 4px;
    }
  </style>`;
  const highlightJS = `
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js"></script>
  <script>
    // Initialize highlight.js when the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', (event) => {
      // Initial highlighting
      document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
      });
      
      // Set up a MutationObserver to highlight code that appears later (via terminal commands)
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === 1) { // Element node
                const codeBlocks = node.querySelectorAll('pre code');
                if (codeBlocks.length > 0) {
                  codeBlocks.forEach((block) => {
                    hljs.highlightElement(block);
                  });
                }
              }
            });
          }
        });
      });
      
      // Start observing the terminal for new code blocks
      observer.observe(document.getElementById('terminal'), { 
        childList: true, 
        subtree: true 
      });
    });
  </script>`;

  const headEnd = '</head>';
  const bodyEnd = '</body>';

  // Add CSS to head and JS right before body closing tag
  let composedHtml = html.replace(headEnd, `${highlightCSS}\n  ${headEnd}`);
  composedHtml = composedHtml.replace(bodyEnd, `${highlightJS}\n  ${bodyEnd}`);

  const composed = composedHtml.replace(`<!--files-->`, allFiles);
  writeFileSync(joinPath(OUTPUT_PATH, "index.html"), composed);
}

// Copy static files to root of output dir
{
  cpSync(joinPath(SOURCE_PATH, STATIC_DIR), OUTPUT_PATH, {
    recursive: true,
  });
}
