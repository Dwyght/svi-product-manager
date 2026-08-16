const USERS_KEY = "activity3_users";
const CURRENT_USER_KEY = "activity3_current_user";

// ============================
// REGISTERED USERS
// ============================

export function getUsers() {
  const users = localStorage.getItem(USERS_KEY);

  if (!users) {
    return [];
  }

  return JSON.parse(users);
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function addUser(user) {
  const users = getUsers();

  users.push(user);

  saveUsers(users);
}

export function findUser(username) {
  const users = getUsers();

  return users.find(
    (user) => user.username.toLowerCase() === username.toLowerCase(),
  );
}

// ============================
// LOGGED-IN USER
// ============================

export function setCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function getCurrentUser() {
  const user = localStorage.getItem(CURRENT_USER_KEY);

  if (!user) {
    return null;
  }

  return JSON.parse(user);
}

export function clearCurrentUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}
