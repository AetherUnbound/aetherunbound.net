import {
  cpSync,
  readdirSync,
  readFileSync,
  writeFileSync,
  rmSync,
  mkdirSync,
} from "fs";
import { join as joinPath } from "path";
import { marked } from "marked";

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
    )
    .join("\n");
  const html = readFileSync(joinPath(SOURCE_PATH, "index.html")).toString();
  const composed = html.replace(`<!--files-->`, files);
  writeFileSync(joinPath(OUTPUT_PATH, "index.html"), composed);
}

// Copy static files to root of output dir
{
  cpSync(joinPath(SOURCE_PATH, STATIC_DIR), OUTPUT_PATH, {
    recursive: true,
  });
}
