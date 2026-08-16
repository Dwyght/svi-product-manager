import { Button } from "./Button.js";

export class Header {
  constructor({ username, onLogout }) {
    this.username = username;

    this.onLogout = onLogout;

    this.initializeElements();

    this.setAttributes();

    this.appendElements();

    this.addEvents();
  }

  initializeElements() {
    this.header = document.createElement("header");

    this.logo = document.createElement("h2");

    this.actions = document.createElement("div");

    this.usernameText = document.createElement("span");

    this.logoutButton = new Button({
      text: "Logout",

      className: "logout-button",
    });
  }

  setAttributes() {
    this.header.classList.add("header");

    this.logo.textContent = "Product Manager";

    this.actions.classList.add("header-actions");

    this.usernameText.textContent = `Hello, ${this.username}`;
  }

  appendElements() {
    this.actions.append(this.usernameText, this.logoutButton.getElement());

    this.header.append(this.logo, this.actions);
  }

  addEvents() {
    this.logoutButton.onClick(this.onLogout);
  }

  getElement() {
    return this.header;
  }
}
