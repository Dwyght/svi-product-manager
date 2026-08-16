import { Button } from "./Button.js";

import {
  getProductImage,
  formatPrice,
  DEFAULT_PRODUCT_IMAGE,
} from "../utils/helpers.js";

export class ProductTable {
  constructor(products, { onEdit, onDelete }) {
    this.products = products;
    this.onEdit = onEdit;
    this.onDelete = onDelete;
    this.initializeElements();
    this.setAttributes();
    this.buildHeader();
    this.buildRows();
    this.appendElements();
  }

  initializeElements() {
    this.wrapper = document.createElement("div");
    this.table = document.createElement("table");
    this.tableHead = document.createElement("thead");
    this.headerRow = document.createElement("tr");
    this.tableBody = document.createElement("tbody");
  }

  setAttributes() {
    this.wrapper.classList.add("product-table-wrapper");
    this.table.classList.add("product-table");
  }

  buildHeader() {
    const headings = [
      "Image",
      "Title",
      "Description",
      "Price",
      "Brand",
      "Actions",
    ];
    headings.forEach((heading) => {
      const th = document.createElement("th");
      th.textContent = heading;
      th.scope = "col";
      this.headerRow.append(th);
    });
    this.tableHead.append(this.headerRow);
  }

  buildRows() {
    this.products.forEach((product) => {
      const row = document.createElement("tr");
      const imageCell = document.createElement("td");
      const titleCell = document.createElement("td");
      const descriptionCell = document.createElement("td");
      const priceCell = document.createElement("td");
      const brandCell = document.createElement("td");
      const actionsCell = document.createElement("td");
      const image = document.createElement("img");
      image.classList.add("product-table-image");
      image.src = getProductImage(product);
      image.alt = product.title;
      image.addEventListener("error", () => {
        image.src = DEFAULT_PRODUCT_IMAGE;
      });
      titleCell.textContent = product.title;
      titleCell.classList.add("product-table-title");
      descriptionCell.textContent = product.description;
      descriptionCell.classList.add("product-table-description");
      priceCell.textContent = formatPrice(product.price);
      priceCell.classList.add("product-table-price");
      brandCell.textContent = product.brand || "N/A";
      const actions = this.createActions(product);
      imageCell.append(image);
      actionsCell.append(actions);
      row.append(
        imageCell,
        titleCell,
        descriptionCell,
        priceCell,
        brandCell,
        actionsCell,
      );
      this.tableBody.append(row);
    });
  }

  createActions(product) {
    const actions = document.createElement("div");
    actions.classList.add("table-actions");
    const editButton = new Button({
      text: "",
      className: "edit-button table-action-button",
    });
    const deleteButton = new Button({
      text: "",
      className: "delete-button table-action-button",
    });
    const editIcon = document.createElement("img");
    const deleteIcon = document.createElement("img");
    editIcon.src = new URL("../../assets/icons/edit.svg", import.meta.url).href;
    editIcon.alt = "";
    editIcon.classList.add("action-icon");
    deleteIcon.src = new URL(
      "../../assets/icons/trash.svg",
      import.meta.url,
    ).href;
    deleteIcon.alt = "";
    deleteIcon.classList.add("action-icon");
    editButton.getElement().setAttribute("aria-label", `Edit ${product.title}`);
    deleteButton
      .getElement()
      .setAttribute("aria-label", `Delete ${product.title}`);
    editButton.getElement().title = "Edit product";
    deleteButton.getElement().title = "Delete product";
    editButton.getElement().append(editIcon);
    deleteButton.getElement().append(deleteIcon);
    editButton.onClick(() => {
      this.onEdit(product);
    });
    deleteButton.onClick(() => {
      this.onDelete(product);
    });
    actions.append(editButton.getElement(), deleteButton.getElement());
    return actions;
  }

  appendElements() {
    this.table.append(this.tableHead, this.tableBody);
    this.wrapper.append(this.table);
  }

  getElement() {
    return this.wrapper;
  }
}
