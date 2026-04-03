const baseUrl = "http://localhost:3000";

// ===== Shared elements (available on all three pages) =====

const message = document.querySelector("#message") as HTMLDivElement;

// Implement the following features here:
//
// Shared functions:
//   renderMessage(text, type) - Show operation feedback and auto-hide after 3 seconds
//   goHome()                  - Navigate back to index.html
//
// Data structure:
//   interface User { id, name, email, image }
//
// index.html related:
//   getUsers()                - GET request to fetch user list
//   renderUserGrid(users)     - Render user list as card grid with edit/delete buttons
//   deleteUser(userId)        - DELETE request to remove user, then refresh list
//   editUser(userId)          - Navigate to edit-user.html?id=userId
//
// add-user.html related:
//   addUser(name, email)      - POST request to add user, then go back home after 2 seconds
//
// edit-user.html related:
//   getUserById(id)           - GET request to fetch a single user and fill the form
//   updateUser(name, email, id) - PUT request to update user, then go back home after 2 seconds
