import { Input } from "../components/Input.js";
import { Button } from "../components/Button.js";

import { AuthService } from "../services/AuthService.js";

export class RegisterPage {
  constructor({ onRegistrationSuccess, onBackToLogin }) {
    this.onRegistrationSuccess = onRegistrationSuccess;
    this.onBackToLogin = onBackToLogin;
    this.initializeElements();
    this.setAttributes();
    this.appendElements();
    this.addEvents();
  }

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
      placeholder: "Choose a username",
      name: "username",
      icon: new URL("../../assets/icons/username.svg", import.meta.url).href,
      required: true,
    });
    this.passwordField = new Input({
      label: "Password",
      type: "password",
      placeholder: "Create a password",
      name: "password",
      icon: new URL("../../assets/icons/lock.svg", import.meta.url).href,
      required: true,
    });
    this.confirmPasswordField = new Input({
      label: "Confirm Password",
      type: "password",
      placeholder: "Confirm your password",
      name: "confirmPassword",
      icon: new URL("../../assets/icons/lock.svg", import.meta.url).href,
      required: true,
    });
    this.message = document.createElement("p");
    this.registerButton = new Button({
      text: "Register",
      type: "submit",
      className: "primary-button auth-submit-button",
    });
    this.backButton = new Button({
      text: "Back to Login",
      className: "text-button",
    });
  }

  setAttributes() {
    this.container.classList.add("auth-page");
    this.brandTitle.classList.add("auth-brand");
    this.brandTitle.textContent = "Product Manager";
    this.card.classList.add("auth-card");
    this.cardHeader.classList.add("auth-card-header");
    this.title.textContent = "Register";
    this.subtitle.textContent = "Create a new account.";
    this.form.classList.add("auth-form");
    this.message.classList.add("form-message");
    this.backButton.getElement().classList.add("auth-back-button");
    this.usernameField.getInputElement().autocomplete = "username";
    this.passwordField.getInputElement().autocomplete = "new-password";
    this.confirmPasswordField.getInputElement().autocomplete = "new-password";
  }

  appendElements() {
    this.form.append(
      this.usernameField.getElement(),
      this.passwordField.getElement(),
      this.confirmPasswordField.getElement(),
      this.message,
      this.registerButton.getElement(),
    );
    this.cardHeader.append(this.title, this.subtitle);
    this.card.append(this.cardHeader, this.form, this.backButton.getElement());
    this.container.append(this.brandTitle, this.card);
  }

  addEvents() {
    this.form.addEventListener("submit", (event) => {
      this.handleRegister(event);
    });
    this.backButton.onClick(() => {
      this.onBackToLogin();
    });
  }

  async handleRegister(event) {
    event.preventDefault();
    const password = this.passwordField.getValue();
    const confirmPassword = this.confirmPasswordField.getValue();
    if (password !== confirmPassword) {
      this.message.className = "form-message error";
      this.message.textContent = "Passwords do not match.";
      return;
    }

    const user = {
      username: this.usernameField.getValue().trim(),
      password,
    };
    this.registerButton.setDisabled(true);
    this.registerButton.setText("Registering...");
    this.message.textContent = "";
    try {
      await AuthService.register(user);
      this.message.className = "form-message success";
      this.message.textContent = "Registration successful!";
      setTimeout(() => {
        this.onRegistrationSuccess();
      }, 700);
    } catch (error) {
      this.message.className = "form-message error";
      this.message.textContent = error.message;
    } finally {
      this.registerButton.setDisabled(false);
      this.registerButton.setText("Register");
    }
  }

  render(target) {
    target.append(this.container);
  }
}
