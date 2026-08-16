import { Button } from "./Button.js";

export class DeleteConfirmModal {
  constructor() {
    this.resolveConfirmation = null;
    this.previouslyFocusedElement = null;
    this.initializeElements();
    this.setAttributes();
    this.appendElements();
    this.addEvents();
  }

  initializeElements() {
    this.overlay = document.createElement("div");
    this.modal = document.createElement("section");
    this.content = document.createElement("div");
    this.copy = document.createElement("div");
    this.title = document.createElement("h2");
    this.message = document.createElement("p");
    this.actions = document.createElement("div");
    this.cancelButton = new Button({
      text: "Cancel",
      className: "secondary-button",
    });
    this.deleteButton = new Button({
      text: "Delete",
      className: "danger-button",
    });
  }

  setAttributes() {
    this.overlay.classList.add("modal-overlay");
    this.modal.classList.add("modal", "delete-confirm-modal");
    this.content.classList.add("delete-confirm-content");
    this.copy.classList.add("delete-confirm-copy");
    this.actions.classList.add("modal-actions");
    this.modal.setAttribute("role", "alertdialog");
    this.modal.setAttribute("aria-modal", "true");
    this.modal.setAttribute("aria-labelledby", "delete-confirm-title");
    this.modal.setAttribute("aria-describedby", "delete-confirm-message");
    this.title.id = "delete-confirm-title";
    this.title.textContent = "Delete product?";
    this.message.id = "delete-confirm-message";
  }

  appendElements() {
    this.copy.append(this.title, this.message);
    this.content.append(this.copy);
    this.actions.append(
      this.cancelButton.getElement(),
      this.deleteButton.getElement(),
    );
    this.modal.append(this.content, this.actions);
    this.overlay.append(this.modal);
  }

  addEvents() {
    this.cancelButton.onClick(() => this.close(false));
    this.deleteButton.onClick(() => this.close(true));
    this.overlay.addEventListener("click", (event) => {
      if (event.target === this.overlay) {
        this.close(false);
      }
    });
    this.handleKeydown = (event) => {
      if (event.key === "Escape") {
        this.close(false);
      }
    };
  }

  confirm(product) {
    this.previouslyFocusedElement = document.activeElement;
    this.message.textContent = `Are you sure you want to delete “${product.title}”? This action cannot be undone.`;
    document.body.append(this.overlay);
    document.addEventListener("keydown", this.handleKeydown);
    this.deleteButton.getElement().focus();
    return new Promise((resolve) => {
      this.resolveConfirmation = resolve;
    });
  }

  close(confirmed) {
    if (!this.resolveConfirmation) {
      return;
    }

    const resolve = this.resolveConfirmation;
    this.resolveConfirmation = null;
    this.overlay.remove();
    document.removeEventListener("keydown", this.handleKeydown);
    if (this.previouslyFocusedElement?.isConnected) {
      this.previouslyFocusedElement.focus();
    }

    resolve(confirmed);
  }
}
