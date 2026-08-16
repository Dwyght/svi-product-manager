import { Button } from "./Button.js";

export class ViewToggle {
  constructor({ initialView = "card", onViewChange }) {
    this.currentView = initialView;

    this.onViewChange = onViewChange;

    this.initializeElements();

    this.setAttributes();

    this.appendElements();

    this.addEvents();

    this.updateActiveButton();
  }

  initializeElements() {
    this.container = document.createElement("div");

    this.cardButton = new Button({
      text: "Cards",
      className: "view-toggle-button",
    });

    this.listButton = new Button({
      text: "List",
      className: "view-toggle-button",
    });
  }

  setAttributes() {
    this.container.classList.add("view-toggle");

    this.container.setAttribute("aria-label", "Product view options");

    this.cardButton
      .getElement()
      .setAttribute("aria-label", "Show products as cards");

    this.listButton
      .getElement()
      .setAttribute("aria-label", "Show products as a list");
  }

  appendElements() {
    this.container.append(
      this.cardButton.getElement(),
      this.listButton.getElement(),
    );
  }

  addEvents() {
    this.cardButton.onClick(() => {
      this.changeView("card");
    });

    this.listButton.onClick(() => {
      this.changeView("list");
    });
  }

  changeView(view) {
    if (this.currentView === view) {
      return;
    }

    this.currentView = view;

    this.updateActiveButton();

    this.onViewChange(view);
  }

  updateActiveButton() {
    const cardButtonElement = this.cardButton.getElement();

    const listButtonElement = this.listButton.getElement();

    cardButtonElement.classList.toggle("active", this.currentView === "card");

    listButtonElement.classList.toggle("active", this.currentView === "list");

    cardButtonElement.setAttribute(
      "aria-pressed",
      String(this.currentView === "card"),
    );

    listButtonElement.setAttribute(
      "aria-pressed",
      String(this.currentView === "list"),
    );
  }

  getElement() {
    return this.container;
  }
}
