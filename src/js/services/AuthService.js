import {
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
  findUser,
  addUser,
} from "../utils/storage.js";

export class AuthService {
  static register(user) {
    const existingUser = findUser(user.username);
    if (existingUser) {
      throw new Error("Username already exists.");
    }

    addUser(user);
    return user;
  }

  static login(username, password) {
    const user = findUser(username);
    if (!user) {
      throw new Error("Username does not exist.");
    }

    if (user.password !== password) {
      throw new Error("Incorrect password.");
    }

    /*
     * Don't store the password
     * as part of the current
     * logged-in user.
     */

    const currentUser = {
      username: user.username,
    };
    setCurrentUser(currentUser);
    return currentUser;
  }

  static logout() {
    clearCurrentUser();
  }

  static getCurrentUser() {
    return getCurrentUser();
  }
}
