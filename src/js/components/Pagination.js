import { Button } from "./Button.js";

export class Pagination {
  constructor({ onPageChange }) {
    this.onPageChange = onPageChange;

    this.currentPage = 1;

    this.totalPages = 1;

    this.initializeElements();

    this.setAttributes();

    this.appendElements();

    this.addEvents();
  }

  initializeElements() {
    this.container = document.createElement("div");

    this.previousButton = new Button({
      text: "Previous",
    });

    this.pageText = document.createElement("span");

    this.nextButton = new Button({
      text: "Next",
    });
  }

  setAttributes() {
    this.container.classList.add("pagination");
  }

  appendElements() {
    this.container.append(
      this.previousButton.getElement(),
      this.pageText,
      this.nextButton.getElement(),
    );
  }

  addEvents() {
    this.previousButton.onClick(() => {
      if (this.currentPage > 1) {
        this.onPageChange(this.currentPage - 1);
      }
    });

    this.nextButton.onClick(() => {
      if (this.currentPage < this.totalPages) {
        this.onPageChange(this.currentPage + 1);
      }
    });
  }

  update(currentPage, totalPages) {
    this.currentPage = currentPage;

    this.totalPages = totalPages;

    this.pageText.textContent = `Page ${currentPage} of ${totalPages}`;

    this.previousButton.setDisabled(currentPage <= 1);

    this.nextButton.setDisabled(currentPage >= totalPages);
  }

  getElement() {
    return this.container;
  }
}
