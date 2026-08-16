export class Input {
  constructor({
    label = "",
    type = "text",
    placeholder = "",
    required = false,
    name = "",
    icon = "",
    min = null,
    step = null,
  }) {
    this.labelText = label;
    this.type = type;
    this.placeholder = placeholder;
    this.required = required;
    this.name = name;
    this.icon = icon;
    this.min = min;
    this.step = step;
    this.initializeElements();
    this.setAttributes();
    this.appendElements();
  }

  initializeElements() {
    this.container = document.createElement("div");
    this.label = document.createElement("label");
    this.input = document.createElement("input");

    if (this.icon) {
      this.inputControl = document.createElement("div");
      this.iconElement = document.createElement("img");
    }
  }

  setAttributes() {
    this.container.classList.add("form-field");
    this.label.textContent = this.labelText;
    this.input.type = this.type;
    this.input.placeholder = this.placeholder;
    this.input.required = this.required;

    if (this.icon) {
      this.inputControl.classList.add("input-control");
      this.iconElement.src = this.icon;
      this.iconElement.alt = "";
      this.iconElement.classList.add("input-icon");
    }

    if (this.name) {
      this.input.name = this.name;
    }

    if (this.min !== null) {
      this.input.min = this.min;
    }

    if (this.step !== null) {
      this.input.step = this.step;
    }
  }

  appendElements() {
    if (this.labelText) {
      this.container.append(this.label);
    }

    if (this.icon) {
      this.inputControl.append(this.iconElement, this.input);
      this.container.append(this.inputControl);
    } else {
      this.container.append(this.input);
    }
  }

  getValue() {
    return this.input.value;
  }

  setValue(value) {
    this.input.value = value ?? "";
  }

  clear() {
    this.input.value = "";
  }

  getInputElement() {
    return this.input;
  }

  getElement() {
    return this.container;
  }
}
