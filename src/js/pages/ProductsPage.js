import { Header } from "../components/Header.js";
import { Button } from "../components/Button.js";
import { ProductCard } from "../components/ProductCard.js";
import { ProductTable } from "../components/ProductTable.js";
import { ViewToggle } from "../components/ViewToggle.js";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal.js";
import { ProductFormModal } from "../components/ProductFormModal.js";
import { Pagination } from "../components/Pagination.js";

import { DummyJsonApi } from "../services/DummyJsonApi.js";

import { AuthService } from "../services/AuthService.js";

import { createClientId } from "../utils/helpers.js";

export class ProductsPage {
  constructor({ onLogout }) {
    this.onLogout = onLogout;
    this.products = [];
    this.totalProducts = 0;
    this.currentPage = 1;
    this.pageSize = 10;
    this.viewMode = "list";
    this.initializeElements();
    this.setAttributes();
    this.initializeComponents();
    this.appendElements();
    this.addEvents();
  }

  // =========================
  // STEP 1
  // CREATE ELEMENTS
  // =========================
  initializeElements() {
    this.container = document.createElement("div");
    this.main = document.createElement("main");
    this.pageHeader = document.createElement("div");
    this.pageActions = document.createElement("div");
    this.title = document.createElement("h1");
    this.message = document.createElement("p");
    this.productList = document.createElement("section");
  }

  // =========================
  // STEP 2
  // ATTRIBUTES
  // =========================
  setAttributes() {
    this.container.classList.add("products-page");
    this.main.classList.add("products-main");
    this.pageHeader.classList.add("page-header");
    this.pageActions.classList.add("page-actions");
    this.title.textContent = "Products";
    this.message.classList.add("page-message");
    this.productList.classList.add("product-view-container", "product-grid");
  }

  initializeComponents() {
    const user = AuthService.getCurrentUser();
    const username = user?.firstName || user?.username || "User";
    this.header = new Header({
      username,
      onLogout: this.onLogout,
    });
    this.addButton = new Button({
      text: "+ Add Product",
      className: "primary-button",
    });
    this.viewToggle = new ViewToggle({
      initialView: this.viewMode,
      onViewChange: (view) => {
        this.viewMode = view;
        this.renderProducts();
      },
    });
    this.productModal = new ProductFormModal({
      onSave: (product, editingProduct) => {
        return this.saveProduct(product, editingProduct);
      },
    });
    this.deleteConfirmModal = new DeleteConfirmModal();
    this.pagination = new Pagination({
      onPageChange: (page) => {
        this.currentPage = page;
        this.loadProducts();
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      },
    });
  }

  // =========================
  // STEP 3
  // DOM HIERARCHY
  // =========================
  appendElements() {
    this.pageActions.append(
      this.viewToggle.getElement(),
      this.addButton.getElement(),
    );
    this.pageHeader.append(this.title, this.pageActions);
    this.main.append(
      this.pageHeader,
      this.message,
      this.productList,
      this.pagination.getElement(),
    );
    this.container.append(this.header.getElement(), this.main);
  }

  addEvents() {
    this.addButton.onClick(() => {
      this.productModal.open();
    });
  }

  // =========================
  // READ
  // =========================
  async loadProducts() {
    this.showMessage("Loading products...");
    try {
      const skip = (this.currentPage - 1) * this.pageSize;
      const data = await DummyJsonApi.getProducts(this.pageSize, skip);
      this.products = data.products.map((product) => ({
        ...product,
        _clientId: `api-${product.id}`,
        _local: false,
      }));
      this.totalProducts = data.total;
      this.clearMessage();
      this.renderProducts();
    } catch (error) {
      this.showError(error.message);
    }
  }

  renderProducts() {
    this.productList.replaceChildren();
    const totalPages = Math.max(
      1,
      Math.ceil(this.totalProducts / this.pageSize),
    );
    if (this.currentPage > totalPages) {
      this.currentPage = totalPages;
    }

    const productsToShow = this.products;
    this.productList.classList.toggle("product-grid", this.viewMode === "card");
    this.productList.classList.toggle(
      "product-list-view",
      this.viewMode === "list",
    );
    if (productsToShow.length === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.textContent = "No products found.";
      this.productList.append(emptyMessage);
    } else if (this.viewMode === "list") {
      const table = new ProductTable(productsToShow, {
        onEdit: (product) => {
          this.productModal.open(product);
        },
        onDelete: (product) => {
          this.removeProduct(product);
        },
      });
      this.productList.append(table.getElement());
    } else {
      productsToShow.forEach((product) => {
        const card = new ProductCard(product, {
          onEdit: (product) => {
            this.productModal.open(product);
          },
          onDelete: (product) => {
            this.removeProduct(product);
          },
        });
        this.productList.append(card.getElement());
      });
    }

    this.pagination.update(this.currentPage, totalPages);
  }

  // =========================
  // CREATE / UPDATE
  // =========================
  async saveProduct(product, editingProduct) {
    if (editingProduct) {
      await this.updateProduct(editingProduct, product);
    } else {
      await this.addProduct(product);
    }
  }

  // =========================
  // CREATE
  // =========================
  async addProduct(product) {
    const response = await DummyJsonApi.addProduct(product);
    const newProduct = {
      ...product,
      ...response,
      _clientId: createClientId(),
      _local: true,
    };

    /*
     * Activity requirement:
     *
     * New item should appear
     * at the START of the list.
     */

    this.currentPage = 1;
    await this.loadProducts();
    this.products.unshift(newProduct);
    this.products = this.products.slice(0, this.pageSize);
    this.totalProducts += 1;
    this.renderProducts();
    this.showSuccess("Product added successfully.");
  }

  // =========================
  // UPDATE
  // =========================
  async updateProduct(oldProduct, newData) {
    let updatedProduct;

    /*
     * Products originally retrieved
     * from DummyJSON can be updated
     * through PUT.
     */

    if (!oldProduct._local) {
      const response = await DummyJsonApi.updateProduct(oldProduct.id, newData);
      updatedProduct = {
        ...oldProduct,
        ...response,
        ...newData,
      };
    } else {
      /*
       * Products created using
       * DummyJSON's POST are not
       * permanently stored.
       *
       * So locally added products
       * are edited locally.
       */

      updatedProduct = {
        ...oldProduct,
        ...newData,
      };
    }

    const index = this.products.findIndex(
      (product) => product._clientId === oldProduct._clientId,
    );
    if (index !== -1) {
      this.products[index] = updatedProduct;
    }

    this.renderProducts();
    this.showSuccess("Product updated successfully.");
  }

  // =========================
  // DELETE
  // =========================
  async removeProduct(product) {
    const confirmed = await this.deleteConfirmModal.confirm(product);
    if (!confirmed) {
      return;
    }

    try {
      /*
       * Only products retrieved
       * from DummyJSON actually
       * exist on its server.
       */

      if (!product._local) {
        await DummyJsonApi.deleteProduct(product.id);
      }

      this.products = this.products.filter(
        (item) => item._clientId !== product._clientId,
      );
      this.totalProducts = Math.max(0, this.totalProducts - 1);
      this.renderProducts();
      this.showSuccess("Product deleted successfully.");
    } catch (error) {
      this.showError(error.message);
    }
  }

  // =========================
  // MESSAGES
  // =========================
  showMessage(message) {
    this.message.className = "page-message";
    this.message.textContent = message;
  }

  showSuccess(message) {
    this.message.className = "page-message success";
    this.message.textContent = message;
  }

  showError(message) {
    this.message.className = "page-message error";
    this.message.textContent = message;
  }

  clearMessage() {
    this.message.className = "page-message";
    this.message.textContent = "";
  }

  render(target) {
    target.append(this.container);
    this.loadProducts();
  }
}
