/** @param {{ onInput: (input: string) => void}} onInput */
const view = ({ onInput }) => {
  const $templatePrompt = /** @type {HTMLTemplateElement} */ (
    document.querySelector("#template-prompt")
  );
  const $terminal = /** @type {HTMLElement} */ (
    document.querySelector("#terminal")
  );
  let $currentPrompt = /** @type {HTMLSpanElement | null} */ (null);

  document.addEventListener("click", (ev) => {
    if (ev.target === document.querySelector("html")) $currentPrompt?.focus();
  });

  return {
    /** @param {HTMLElement} $el */
    append: function ($el) {
      $terminal.append($el);
    },
    /** @param {string} content */
    appendSpan: function (content) {
      const $span = document.createElement("span");
      $span.innerText = content;
      this.view.append($span);
    },
    prompt: function () {
      const $prompt = /** @type {HTMLElement} */ (
        $templatePrompt.content.cloneNode(true)
      );
      const $promptInput = /** @type {HTMLSpanElement} */ (
        $prompt.querySelector(".prompt-input")
      );
      $promptInput.addEventListener("keydown", (ev) => {
        if (ev.ctrlKey && ev.key === "c") {
          $promptInput.removeAttribute("contenteditable");
          this.prompt();
          return;
        }

        if (ev.ctrlKey && ev.key === "d") {
          window.close();
          return;
        }

        if (ev.key === "Enter") {
          ev.preventDefault();
          onInput($promptInput.innerText);
          $promptInput.removeAttribute("contenteditable");
          this.prompt();
          return;
        }
      });

      $terminal.append($prompt);
      $currentPrompt = $promptInput;
      $promptInput.focus();
    },
  };
};

const files = () => {
  const $templateFiles = /** @type {HTMLTemplateElement} */ (
    document.querySelector("#template-files")
  );
  const fileMap = /** @type {HTMLElement[]} */ (
    Array.from($templateFiles.content.childNodes).filter(
      (n) => !(n instanceof Text)
    )
  ).reduce((prev, $el) => {
    return {
      ...prev,
      [$el.dataset["name"] || ""]: $el,
    };
  }, {});
  return fileMap;
};

class Terminal {
  constructor() {
    this.view = view({
      onInput: (input) => {
        const argv = input.split(" ");
        const command = argv[0];

        switch (command) {
          case "":
            break;
          case "whoami":
            {
              this.view.appendSpan("madison");
            }
            break;
          case "ls":
            {
              const fileMap = files();
              const $list = document.createElement("ul");
              Object.keys(fileMap).forEach((file) => {
                const $entry = document.createElement("li");
                $entry.innerText = file;
                $list.append($entry);
              });
              this.view.append($list);
            }
            break;
          case "cat":
            {
              if (argv.length === 1) {
                this.view.appendSpan("You're a kitty!");
                break;
              }
              const fileMap = files();
              const file = fileMap[argv[1]];

              if (!file) {
                this.view.appendSpan(`File not found: ${argv[1]}`);
                break;
              }

              this.view.append(file);
            }
            break;
          default: {
            this.view.append(`Unknown command: ${command}`);
          }
        }
      },
    });
    this.files = files();
    this.view.prompt();
  }
}

const term = new Terminal();
