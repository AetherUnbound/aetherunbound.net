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
          onInput($promptInput.innerText);
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

class Terminal {
  constructor() {
    this.view = view({
      onInput: (input) => {
        const argv = input.split(" ");
        const command = argv[0];

        switch (command) {
          case "whoami":
            {
              const $span = document.createElement("span");
              $span.innerText = "madison";
              this.view.append($span);
            }
            break;
          default: {
            const $span = document.createElement("span");
            $span.innerText = `Unknown command: ${command}`;
            this.view.append($span);
          }
        }
      },
    });
    this.view.prompt();
  }
}

const term = new Terminal();
