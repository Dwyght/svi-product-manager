export class Button {
  constructor({ text, type = "button", className = "", icon = "" }) {
    this.text = text;
    this.type = type;
    this.className = className;
    this.icon = icon;
    this.initializeElements();
    this.setAttributes();
  }

  initializeElements() {
    this.button = document.createElement("button");
    if (this.icon) {
      this.iconElement = document.createElement("img");
      this.textElement = document.createElement("span");
    }
  }

  setAttributes() {
    this.button.type = this.type;
    if (this.icon) {
      this.iconElement.src = this.icon;
      this.iconElement.alt = "";
      this.iconElement.classList.add("button-icon");
      this.textElement.textContent = this.text;
      this.button.append(this.iconElement, this.textElement);
    } else {
      this.button.textContent = this.text;
    }

    if (this.className) {
      const classes = this.className.split(" ");
      this.button.classList.add(...classes);
    }
  }

  onClick(callback) {
    this.button.addEventListener("click", callback);
  }

  setText(text) {
    if (this.textElement) {
      this.textElement.textContent = text;
    } else {
      this.button.textContent = text;
    }
  }

  setDisabled(disabled) {
    this.button.disabled = disabled;
  }

  getElement() {
    return this.button;
  }
}
