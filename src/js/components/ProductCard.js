import { Button } from "./Button.js";

import {
  getProductImage,
  formatPrice,
  DEFAULT_PRODUCT_IMAGE,
} from "../utils/helpers.js";

export class ProductCard {
  constructor(product, { onEdit, onDelete }) {
    this.product = product;

    this.onEdit = onEdit;

    this.onDelete = onDelete;

    this.initializeElements();

    this.setAttributes();

    this.appendElements();

    this.addEvents();
  }

  initializeElements() {
    this.card = document.createElement("article");

    this.image = document.createElement("img");

    this.content = document.createElement("div");

    this.title = document.createElement("h3");

    this.description = document.createElement("p");

    this.price = document.createElement("p");

    this.brand = document.createElement("p");

    this.actions = document.createElement("div");

    this.editButton = new Button({
      text: "",

      className: "edit-button",
    });

    this.deleteButton = new Button({
      text: "",

      className: "delete-button",
    });

    this.editIcon = document.createElement("img");

    this.deleteIcon = document.createElement("img");
  }

  setAttributes() {
    this.card.classList.add("product-card");

    this.image.classList.add("product-image");

    this.image.src = getProductImage(this.product);

    this.image.alt = this.product.title;

    this.content.classList.add("product-content");

    this.title.textContent = this.product.title;

    this.description.textContent = this.product.description;

    this.description.classList.add("product-description");

    this.price.textContent = formatPrice(this.product.price);

    this.price.classList.add("product-price");

    this.brand.textContent = `Brand: ${this.product.brand || "N/A"}`;

    this.actions.classList.add("product-actions");

    this.editIcon.src = new URL(
      "../../assets/icons/edit.svg",
      import.meta.url,
    ).href;

    this.editIcon.alt = "";

    this.editIcon.classList.add("action-icon");

    this.deleteIcon.src = new URL(
      "../../assets/icons/trash.svg",
      import.meta.url,
    ).href;

    this.deleteIcon.alt = "";

    this.deleteIcon.classList.add("action-icon");

    const editButtonElement = this.editButton.getElement();

    editButtonElement.setAttribute("aria-label", `Edit ${this.product.title}`);

    editButtonElement.title = "Edit product";

    const deleteButtonElement = this.deleteButton.getElement();

    deleteButtonElement.setAttribute(
      "aria-label",
      `Delete ${this.product.title}`,
    );

    deleteButtonElement.title = "Delete product";

    this.image.addEventListener("error", () => {
      this.image.src = DEFAULT_PRODUCT_IMAGE;
    });
  }

  appendElements() {
    this.editButton.getElement().append(this.editIcon);

    this.deleteButton.getElement().append(this.deleteIcon);

    this.actions.append(
      this.editButton.getElement(),
      this.deleteButton.getElement(),
    );

    this.content.append(
      this.title,
      this.description,
      this.price,
      this.brand,
      this.actions,
    );

    this.card.append(this.image, this.content);
  }

  addEvents() {
    this.editButton.onClick(() => {
      this.onEdit(this.product);
    });

    this.deleteButton.onClick(() => {
      this.onDelete(this.product);
    });
  }

  getElement() {
    return this.card;
  }
}
