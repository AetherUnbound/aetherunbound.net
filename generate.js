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
      writeFileSync(
        joinPath(OUTPUT_PATH, "blog", `${slug}.html`),
        withFiles.replace(`<!--post-content-->`, postHtml),
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
