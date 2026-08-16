export class DummyJsonApi {
  static BASE_URL = "https://dummyjson.com";
  static async request(endpoint, options = {}) {
    const response = await fetch(`${this.BASE_URL}${endpoint}`, options);
    if (!response.ok) {
      throw new Error("Request failed.");
    }

    return await response.json();
  }

  static async getProducts(limit = 10, skip = 0) {
    return await this.request(`/products?limit=${limit}&skip=${skip}`);
  }

  static async addProduct(product) {
    return await this.request("/products/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });
  }

  static async updateProduct(id, product) {
    return await this.request(`/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });
  }

  static async deleteProduct(id) {
    return await this.request(`/products/${id}`, {
      method: "DELETE",
    });
  }
}
