const $templatePrompt = /** @type {HTMLTemplateElement} */ (
  document.querySelector("#template-prompt")
);
const $terminal = /** @type {HTMLElement} */ (
  document.querySelector("#terminal")
);

class Terminal {
  constructor() {
    this.$term = document.getElementById("terminal");
    this.$prompt = document.querySelector(".prompt");
    console.log(this.$prompt);
  }

  prompt() {
    const $prompt = $templatePrompt.content.cloneNode();
  }
}

const term = new Terminal();
