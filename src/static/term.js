/**
 ░▄▀▄▀▀▀▀▄▀▄░░░░░░░░░
 ░█░░░░░░░░▀▄░░░░░░▄░
 █░░▀░░▀░░░░░▀▄▄░░█░█
 █░▄░█▀░▄░░░░░░░▀▀░░█
 █░░▀▀▀▀░░░░░░░░░░░░█
 █░░░░░░░░░░░░░░░░░░█
 █░░░░░░░░░░░░░░░░░░█
 ░█░░▄▄░░▄▄▄▄░░▄▄░░█░
 ░█░▄▀█░▄▀░░█░▄▀█░▄▀░
 ░░▀░░░▀░░░░░▀░░░▀░░░

 BARK! BARK! BARK!
 I'm so dog-cited to see you here!
*/

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

  // Add document click listener to focus terminal input unless selecting text
  document.addEventListener("click", (event) => {
    if ($currentPrompt) {
      // Check if user is selecting text (has a selection)
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) {
        // User is selecting text, don't interfere with the selection
        return;
      }

      // Otherwise, focus the current prompt
      $currentPrompt.focus();
    }
  });

  return {
    preventScroll: true,
    /** @param {HTMLElement} $el */
    append: function ($el) {
      $terminal.append($el);
    },
    /**
     * Appends a span with the given content to the terminal.
     * @param {string} content
     * @returns {HTMLSpanElement}
     */
    appendSpan: function (content) {
      const $span = document.createElement("span");
      $span.innerText = content;
      this.append($span);
      return $span;
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

        // Add CTRL+D handler to trigger exit command
        if (ev.ctrlKey && ev.key === "d") {
          ev.preventDefault(); // Prevent the browser's default behavior
          lockPrompt();
          onCommand("exit"); // Execute the exit command
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

      case "lsb_release":
      case "uname":
        {
          view.appendSpan("pup!_OS");
        }
        break;

      case "whoami":
        {
          let options = [
            "Perhaps a better question is, who are you?",
            "I'm just a dog on the internet.",
            "A sense of self is not something this site can help you find.",
            "I did not say this...I am not here.",
            "Interesting question...try running `cat about.md` to find out!",
          ];
          view.appendSpan(
            options[Math.floor(Math.random() * options.length)] || "",
          );
        }
        break;

      case "exit":
        {
          const goodbyeMessages = [
            "Logging arf!",
            "Session terminated...but I'll miss you 🥺",
            "Goodbye, friend! 🐾",
          ];
          const message =
            goodbyeMessages[
              Math.floor(Math.random() * goodbyeMessages.length)
            ] || "Goodbye!";

          // Create styled goodbye message
          const $goodbye = view.appendSpan(message);
          $goodbye.style.fontWeight = "bold";
          view.append(document.createElement("br"));
          view.append(document.createElement("br"));
          // A-la 3 body problem ^x^
          const $logoff = view.appendSpan("We invite you to log on again.");
          $logoff.style.color = "#8BC34A";
          $logoff.style.fontStyle = "italic";

          // Prevent new prompt from appearing by replacing the prompt function
          view.prompt = () => {};
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
