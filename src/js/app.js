import { LoginPage } from "./pages/LoginPage.js";
import { RegisterPage } from "./pages/RegisterPage.js";
import { ProductsPage } from "./pages/ProductsPage.js";

import { AuthService } from "./services/AuthService.js";
const app = document.getElementById("app");
function showPage(page) {
  app.replaceChildren();
  page.render(app);
}

function showLogin() {
  const loginPage = new LoginPage({
    onLoginSuccess: () => {
      showProducts();
    },
    onRegister: () => {
      showRegister();
    },
  });
  showPage(loginPage);
}

function showRegister() {
  const registerPage = new RegisterPage({
    onRegistrationSuccess: () => {
      showLogin();
    },
    onBackToLogin: () => {
      showLogin();
    },
  });
  showPage(registerPage);
}

function showProducts() {
  const productsPage = new ProductsPage({
    onLogout: () => {
      AuthService.logout();
      showLogin();
    },
  });
  showPage(productsPage);
}

function start() {
  const currentUser = AuthService.getCurrentUser();
  if (currentUser) {
    showProducts();
  } else {
    showLogin();
  }
}

start();
