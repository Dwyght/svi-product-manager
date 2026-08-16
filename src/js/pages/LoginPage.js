import { Input } from "../components/Input.js";
import { Button } from "../components/Button.js";

import { AuthService } from "../services/AuthService.js";

export class LoginPage {
  constructor({ onLoginSuccess, onRegister }) {
    this.onLoginSuccess = onLoginSuccess;

    this.onRegister = onRegister;

    this.initializeElements();

    this.setAttributes();

    this.appendElements();

    this.addEvents();
  }

  // =========================
  // STEP 1
  // CREATE ELEMENTS
  // =========================

  initializeElements() {
    this.container = document.createElement("main");

    this.brandTitle = document.createElement("h1");

    this.card = document.createElement("section");

    this.cardHeader = document.createElement("div");

    this.title = document.createElement("h1");

    this.subtitle = document.createElement("p");

    this.form = document.createElement("form");

    this.usernameField = new Input({
      label: "Username",

      type: "text",

      placeholder: "johndoe",

      name: "username",

      icon: new URL("../../assets/icons/username.svg", import.meta.url).href,

      required: true,
    });

    this.passwordField = new Input({
      label: "Password",

      type: "password",

      placeholder: "Enter your password",

      name: "password",

      icon: new URL("../../assets/icons/lock.svg", import.meta.url).href,

      required: true,
    });

    this.message = document.createElement("p");

    this.loginButton = new Button({
      text: "Login",

      type: "submit",

      className: "primary-button auth-submit-button",

      icon: new URL("../../assets/icons/login.svg", import.meta.url).href,
    });

    this.registerPrompt = document.createElement("div");

    this.registerText = document.createElement("p");

    this.registerButton = new Button({
      text: "Register",

      className: "text-button",
    });
  }

  // =========================
  // STEP 2
  // ATTRIBUTES
  // =========================

  setAttributes() {
    this.container.classList.add("auth-page");

    this.brandTitle.classList.add("auth-brand");

    this.brandTitle.textContent = "Product Manager";

    this.card.classList.add("auth-card");

    this.cardHeader.classList.add("auth-card-header");

    this.title.textContent = "Login";

    this.subtitle.textContent = "Login to manage your products.";

    this.form.classList.add("auth-form");

    this.message.classList.add("form-message");

    this.registerPrompt.classList.add("auth-switch");

    this.registerText.textContent = "Don't have an account yet?";

    this.usernameField.getInputElement().autocomplete = "username";

    this.passwordField.getInputElement().autocomplete = "current-password";
  }

  // =========================
  // STEP 3
  // BUILD HIERARCHY
  // =========================

  appendElements() {
    this.form.append(
      this.usernameField.getElement(),
      this.passwordField.getElement(),
      this.message,
      this.loginButton.getElement(),
    );

    this.cardHeader.append(this.title, this.subtitle);

    this.registerPrompt.append(
      this.registerText,
      this.registerButton.getElement(),
    );

    this.card.append(this.cardHeader, this.form, this.registerPrompt);

    this.container.append(this.brandTitle, this.card);
  }

  addEvents() {
    this.form.addEventListener("submit", (event) => {
      this.handleLogin(event);
    });

    this.registerButton.onClick(() => {
      this.onRegister();
    });
  }

  async handleLogin(event) {
    event.preventDefault();

    const username = this.usernameField.getValue().trim();

    const password = this.passwordField.getValue();

    this.message.textContent = "";

    this.loginButton.setDisabled(true);

    this.loginButton.setText("Logging in...");

    try {
      await AuthService.login(username, password);

      this.onLoginSuccess();
    } catch (error) {
      this.message.className = "form-message error";

      this.message.textContent = error.message;
    } finally {
      this.loginButton.setDisabled(false);

      this.loginButton.setText("Login");
    }
  }

  render(target) {
    target.append(this.container);
  }
}
