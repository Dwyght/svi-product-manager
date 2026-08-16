import { Input } from "./Input.js";
import { Button } from "./Button.js";

import {
  DEFAULT_PRODUCT_IMAGE,
  getProductImage,
  fileToDataUrl,
} from "../utils/helpers.js";

export class ProductFormModal {
  constructor({ onSave }) {
    this.onSave = onSave;

    this.editingProduct = null;

    this.uploadedImage = null;

    this.initializeElements();

    this.setAttributes();

    this.appendElements();

    this.addEvents();
  }

  initializeElements() {
    this.overlay = document.createElement("div");

    this.modal = document.createElement("div");

    this.header = document.createElement("div");

    this.modalTitle = document.createElement("h2");

    this.closeButton = new Button({
      text: "×",
      className: "modal-close",
    });

    this.form = document.createElement("form");

    this.titleField = new Input({
      label: "Title",

      placeholder: "Product title",

      required: true,
    });

    this.descriptionLabel = document.createElement("label");

    this.descriptionInput = document.createElement("textarea");

    this.priceField = new Input({
      label: "Price",

      type: "number",

      placeholder: "Price",

      required: true,

      min: "0",

      step: "0.01",
    });

    this.brandField = new Input({
      label: "Brand",

      placeholder: "Brand",

      required: true,
    });

    this.imageUrlField = new Input({
      label: "Image URL",

      type: "url",

      placeholder: "Optional image URL",
    });

    this.uploadLabel = document.createElement("label");

    this.fileInput = document.createElement("input");

    this.preview = document.createElement("img");

    this.message = document.createElement("p");

    this.actions = document.createElement("div");

    this.cancelButton = new Button({
      text: "Cancel",

      className: "secondary-button",
    });

    this.saveButton = new Button({
      text: "Save",

      type: "submit",

      className: "primary-button",
    });
  }

  setAttributes() {
    this.overlay.classList.add("modal-overlay");

    this.modal.classList.add("modal");

    this.header.classList.add("modal-header");

    this.descriptionLabel.textContent = "Description";

    this.descriptionInput.placeholder = "Description";

    this.descriptionInput.required = true;

    this.uploadLabel.textContent = "Upload Image (Bonus)";

    this.fileInput.type = "file";

    this.fileInput.accept = "image/*";

    this.preview.classList.add("image-preview");

    this.preview.src = DEFAULT_PRODUCT_IMAGE;

    this.message.classList.add("form-message");

    this.actions.classList.add("modal-actions");
  }

  appendElements() {
    this.header.append(this.modalTitle, this.closeButton.getElement());

    this.actions.append(
      this.cancelButton.getElement(),
      this.saveButton.getElement(),
    );

    this.form.append(
      this.titleField.getElement(),

      this.descriptionLabel,
      this.descriptionInput,

      this.priceField.getElement(),

      this.brandField.getElement(),

      this.imageUrlField.getElement(),

      this.uploadLabel,
      this.fileInput,

      this.preview,

      this.message,

      this.actions,
    );

    this.modal.append(this.header, this.form);

    this.overlay.append(this.modal);
  }

  addEvents() {
    this.closeButton.onClick(() => {
      this.close();
    });

    this.cancelButton.onClick(() => {
      this.close();
    });

    this.overlay.addEventListener("click", (event) => {
      if (event.target === this.overlay) {
        this.close();
      }
    });

    this.fileInput.addEventListener("change", async () => {
      const file = this.fileInput.files[0];

      if (!file) {
        this.uploadedImage = null;

        return;
      }

      try {
        this.uploadedImage = await fileToDataUrl(file);

        this.preview.src = this.uploadedImage;
      } catch (error) {
        this.showError(error.message);
      }
    });

    this.imageUrlField.getInputElement().addEventListener("input", () => {
      const url = this.imageUrlField.getValue().trim();

      if (url) {
        this.preview.src = url;
      }
    });

    this.form.addEventListener("submit", (event) => {
      this.handleSubmit(event);
    });
  }

  open(product = null) {
    this.editingProduct = product;

    this.uploadedImage = null;

    this.fileInput.value = "";

    this.message.textContent = "";

    if (product) {
      this.modalTitle.textContent = "Edit Product";

      this.titleField.setValue(product.title);

      this.descriptionInput.value = product.description || "";

      this.priceField.setValue(product.price);

      this.brandField.setValue(product.brand || "");

      this.imageUrlField.setValue(product.thumbnail || "");

      this.preview.src = getProductImage(product);
    } else {
      this.modalTitle.textContent = "Add Product";

      this.form.reset();

      this.uploadedImage = null;

      this.preview.src = DEFAULT_PRODUCT_IMAGE;
    }

    document.body.append(this.overlay);
  }

  close() {
    this.overlay.remove();
  }

  async handleSubmit(event) {
    event.preventDefault();

    this.message.textContent = "";

    this.saveButton.setDisabled(true);

    this.saveButton.setText("Saving...");

    try {
      let image = this.uploadedImage;

      if (!image) {
        image = this.imageUrlField.getValue().trim();
      }

      if (!image && this.editingProduct) {
        image = getProductImage(this.editingProduct);
      }

      if (!image) {
        image = DEFAULT_PRODUCT_IMAGE;
      }

      const product = {
        title: this.titleField.getValue().trim(),

        description: this.descriptionInput.value.trim(),

        price: Number(this.priceField.getValue()),

        brand: this.brandField.getValue().trim(),

        thumbnail: image,

        images: [image],
      };

      await this.onSave(product, this.editingProduct);

      this.close();
    } catch (error) {
      this.showError(error.message);
    } finally {
      this.saveButton.setDisabled(false);

      this.saveButton.setText("Save");
    }
  }

  showError(message) {
    this.message.className = "form-message error";

    this.message.textContent = message;
  }
}
