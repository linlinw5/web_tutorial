const baseUrl = "http://localhost:3000";

// ===== Shared elements (available on all three pages) =====

const message = document.querySelector("#message") as HTMLDivElement;

function renderMessage(text: string, type: string) {
  message.textContent = text;
  message.classList.add("show", type);
  setTimeout(() => {
    message.classList.remove("show", type);
  }, 3000);
}

function goHome() {
  window.location.href = "./index.html";
}

// ===== Data types =====

interface User {
  id: number;
  name: string;
  email: string;
  image: string;
}

// ===== index.html related code =====

const loadBtn = document.querySelector("#loadBtn") as HTMLButtonElement;
const userGrid = document.querySelector("#userGrid") as HTMLDivElement;
const addUserBtn = document.querySelector("#addUserBtn") as HTMLButtonElement;

function renderUserGrid(users: User[]) {
  userGrid.innerHTML = users
    .map(
      (user) => `
        <div class="user-card">
            <div style="text-align: center;">
                <img class="user-avatar" src="${baseUrl + user.image}" alt="Avatar">
            </div>
            <div class="user-info">
                <h3>${user.name}</h3>
                <p>Email: ${user.email}</p>
                <p>User ID: ${user.id}</p>
            </div>
            <div class="user-actions">
                <button class="btn btn-edit" onclick="editUser(${user.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteUser(${user.id})">Delete</button>
            </div>
        </div>
    `,
    )
    .join("");
}

async function getUsers() {
  try {
    const response = await fetch(`${baseUrl}/api/users`);
    if (response.ok) {
      const users: User[] = await response.json();
      renderUserGrid(users);
      renderMessage("User list loaded successfully", "success");
    } else {
      throw new Error(`Fetch failed, status code: ${response.status}`);
    }
  } catch (err) {
    renderMessage(`Failed to load user list: ${err}`, "error");
  }
}

async function deleteUser(userId: number) {
  try {
    const response = await fetch(`${baseUrl}/api/users/${userId}`, { method: "DELETE" });
    if (response.ok) {
      renderMessage(`User ${userId} has been deleted`, "success");
      getUsers();
    } else {
      throw new Error(`Delete failed, status code: ${response.status}`);
    }
  } catch (err) {
    renderMessage(`Delete failed: ${err}`, "error");
  }
}

function editUser(userId: number) {
  window.location.href = `./edit-user.html?id=${userId}`;
}

// Auto-fetch user list when index.html loads; refresh button fetches again
loadBtn && getUsers();
loadBtn && loadBtn.addEventListener("click", getUsers);
addUserBtn &&
  addUserBtn.addEventListener("click", () => {
    window.location.href = "./add-user.html";
  });

// ===== add-user.html related code =====

const usernameInput = document.getElementById("username") as HTMLInputElement;
const emailInput = document.getElementById("email") as HTMLInputElement;
const submitAdd = document.getElementById("submitAdd") as HTMLButtonElement;

async function addUser(name: string, email: string) {
  try {
    const response = await fetch(`${baseUrl}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    if (response.ok) {
      renderMessage("User added successfully", "success");
      setTimeout(() => {
        window.location.href = "./index.html";
      }, 2000);
    } else {
      throw new Error(`Add failed, status code: ${response.status}`);
    }
  } catch (err) {
    renderMessage(`Failed to add user: ${err}`, "error");
  }
}

submitAdd &&
  submitAdd.addEventListener("click", () => {
    addUser(usernameInput.value, emailInput.value);
  });

// ===== edit-user.html related code =====

const userIdInput = document.getElementById("userId") as HTMLInputElement;
const submitUpdate = document.getElementById("submitUpdate") as HTMLButtonElement;

// Read user ID from URL (e.g. edit-user.html?id=3)
const urlParams = new URLSearchParams(window.location.search);
const currentUserId = urlParams.get("id");

async function getUserById(id: number) {
  try {
    const response = await fetch(`${baseUrl}/api/users/${id}`);
    if (response.ok) {
      const user: User = await response.json();
      userIdInput.value = user.id.toString();
      usernameInput.value = user.name;
      emailInput.value = user.email;
    } else {
      throw new Error(`Fetch failed, status code: ${response.status}`);
    }
  } catch (err) {
    // Disable the form when fetch fails to avoid submitting empty data
    usernameInput.disabled = true;
    emailInput.disabled = true;
    submitUpdate.disabled = true;
    renderMessage(`Failed to fetch user info: ${err}`, "error");
    setTimeout(() => {
      window.location.href = "./index.html";
    }, 2000);
  }
}

async function updateUser(name: string, email: string, id: number) {
  try {
    const response = await fetch(`${baseUrl}/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    if (response.ok) {
      renderMessage("User updated successfully", "success");
      setTimeout(() => {
        window.location.href = "./index.html";
      }, 2000);
    } else {
      throw new Error(`Update failed, status code: ${response.status}`);
    }
  } catch (err) {
    renderMessage(`Failed to update user: ${err}`, "error");
  }
}

// Auto-fetch user info and fill the form when edit-user.html loads
submitUpdate && getUserById(Number(currentUserId));
submitUpdate &&
  submitUpdate.addEventListener("click", () => {
    updateUser(usernameInput.value, emailInput.value, Number(currentUserId));
  });
