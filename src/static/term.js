/** @param {{ onCommand: (input: string) => void}} */
const View = ({ onCommand }) => {
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
      this.append($span);
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

        if (ev.key === "Enter") {
          ev.preventDefault();
          onCommand($promptInput.innerText);
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

const files = (() => {
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
})();

const view = View({
  onCommand: (input) => {
    const argv = input.split(" ");
    const command = argv[0];

    switch (command) {
      case "":
        break;
      case "whoami":
        {
          view.appendSpan("madison");
        }
        break;
      case "ls":
        {
          const $list = document.createElement("ul");
          Object.keys(files).forEach((file) => {
            const $entry = document.createElement("li");
            $entry.innerText = file;
            $list.append($entry);
          });
          view.append($list);
        }
        break;
      case "cat":
        {
          if (argv.length === 1) {
            view.appendSpan("You're a kitty!");
            break;
          }
          const file = files[argv[1]];

          if (!file) {
            view.appendSpan(`File not found: ${argv[1]}`);
            break;
          }

          view.append(file);
        }
        break;
      default: {
        view.append(`Unknown command: ${command}`);
      }
    }
  },
});
view.prompt();
