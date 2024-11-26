/** @param {number} t */
const sleep = (t) => new Promise((r) => setTimeout(r, t));

/** @param {{ onCommand: (input: string) => void}} options */
const View = ({ onCommand }) => {
  const $templatePrompt = /** @type {HTMLTemplateElement} */ (
    document.querySelector("#template-prompt")
  );
  const $terminal = /** @type {HTMLElement} */ (
    document.querySelector("#terminal")
  );
  let $currentPrompt = /** @type {HTMLSpanElement | null} */ (null);

  return {
    preventScroll: true,
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

      const clickListener = () => {
        $currentPrompt?.focus();
      };
      $promptInput.parentElement?.addEventListener("click", clickListener);

      // Removes interactivity from this prompt. Should be called once this prompt is no longer the active one.
      const lockPrompt = () => {
        $promptInput.removeAttribute("contenteditable");
        $promptInput.parentElement?.removeEventListener("click", clickListener);
      };

      $promptInput.addEventListener("keydown", (ev) => {
        if (ev.ctrlKey && ev.key === "c") {
          lockPrompt();
          this.prompt();
          return;
        }

        if (ev.key === "Enter") {
          ev.preventDefault();
          onCommand($promptInput.innerText);
          lockPrompt();
          this.prompt();
          return;
        }
      });

      $terminal.append($prompt);
      $currentPrompt = $promptInput;
      $promptInput.focus({
        preventScroll: this.preventScroll,
      });
    },
    /** @param {string} input */
    animate: async function (input) {
      if (!$currentPrompt) {
        return;
      }
      await sleep(1000);
      $currentPrompt.blur();
      let str = "";
      for (const char of [...input]) {
        str += char;
        $currentPrompt.innerText = str;
        await sleep(75);
      }
      $currentPrompt.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter" }),
      );
    },
  };
};

/** @type {Record<string, HTMLElement>} */
const files = (() => {
  const $templateFiles = /** @type {HTMLTemplateElement} */ (
    document.querySelector("#template-files")
  );
  const fileMap = /** @type {HTMLElement[]} */ (
    Array.from($templateFiles.content.childNodes).filter(
      (n) => !(n instanceof Text),
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
          const file = files[argv[1] || ""];

          if (!file) {
            view.appendSpan(`File not found: ${argv[1]}`);
            break;
          }

          view.append(file);
        }
        break;

      case "dog":
        {
          let bork = document.createElement("marquee");
          bork.innerText = "BARK ".repeat(100);
          bork.setAttribute("scrollamount", "25");
          bork.setAttribute("class", "rainbow-text");
          view.append(bork);
        }
        break;

      default: {
        view.appendSpan(`Command not found: ${command}`);
      }
    }
  },
});

// if __name__ == "__main__":
view.prompt();

// Skip the animation if the URL params include "skip"
if (!window.location.search.includes("skip")) {
  await view.animate("cat about.md");
  await view.animate("cat projects.md");
  await view.animate("cat pursuits.md");
  await sleep(100);
}

// Allow scrolling after the initial animations
view.preventScroll = false;
