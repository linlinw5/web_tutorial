// Mock API base URL, consistent with the port used by 00_mock_api
const baseUrl = "http://localhost:3000";

// Get elements to operate on from HTML
const loadBtn = document.getElementById("loadBtn") as HTMLButtonElement;
const userList = document.getElementById("userList") as HTMLUListElement;
const message = document.getElementById("message") as HTMLDivElement;

// Define user data structure (agreed API contract with backend)
interface User {
  id: number;
  name: string;
  email: string;
  image: string;
}

// ===== 7.2 GET request: fetch user list =====

async function getUserList() {
  try {
    const response: Response = await fetch(`${baseUrl}/api/users`);
    if (response.ok) {
      const users: User[] = await response.json();
      renderUserList(users);
    } else {
      throw new Error(`Failed to fetch user list, status code: ${response.status}`);
    }
  } catch (err) {
    message.textContent = String(err);
  }
}

loadBtn.addEventListener("click", getUserList);

// ===== Render user list =====

function renderUserList(users: User[]) {
  userList.innerHTML = users
    .map(
      (user) => `
        <li>
            <p>ID: ${user.id} | Name: ${user.name} | Email: ${user.email}</p>
            <img src="${baseUrl + user.image}" alt="Avatar" style="height: 80px;">
            <button class="deleteBtn" data-user-id="${user.id}">Delete</button>
        </li>
    `,
    )
    .join("");

  document.querySelectorAll<HTMLButtonElement>(".deleteBtn").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const userId = (event.target as HTMLButtonElement).dataset.userId;
      deleteUser(Number(userId));
    });
  });
}

// ===== DELETE request: remove user =====

async function deleteUser(userId: number) {
  try {
    const response = await fetch(`${baseUrl}/api/users/${userId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      message.textContent = `User ${userId} has been deleted`;
      getUserList();
    } else {
      throw new Error(`Delete failed, status code: ${response.status}`);
    }
  } catch (err) {
    message.textContent = String(err);
  }
}

// ===== 7.3 POST request: add user =====

const usernameInput = document.getElementById("username") as HTMLInputElement;
const emailInput = document.getElementById("email") as HTMLInputElement;
const addJSON = document.getElementById("addJSON") as HTMLButtonElement;
const addWWW = document.getElementById("addWWW") as HTMLButtonElement;

// Method 1: JSON format (Content-Type: application/json)
async function addUserJSON(name: string, email: string) {
  try {
    const response = await fetch(`${baseUrl}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email }),
    });
    if (response.ok) {
      const result = await response.json();
      message.textContent = `Added successfully: ID ${result.id}, Name: ${result.name}`;
      getUserList();
    } else {
      throw new Error(`Add failed, status code: ${response.status}`);
    }
  } catch (err) {
    message.textContent = String(err);
  }
}

addJSON.addEventListener("click", () => {
  addUserJSON(usernameInput.value, emailInput.value);
});

// Method 2: www-form format (Content-Type: application/x-www-form-urlencoded)
async function addUserWWW(name: string, email: string) {
  try {
    const body = new URLSearchParams();
    body.append("name", name);
    body.append("email", email);

    const response = await fetch(`${baseUrl}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });
    if (response.ok) {
      const result = await response.json();
      message.textContent = `Added successfully: ID ${result.id}, Name: ${result.name}`;
      getUserList();
    } else {
      throw new Error(`Add failed, status code: ${response.status}`);
    }
  } catch (err) {
    message.textContent = String(err);
  }
}

addWWW.addEventListener("click", () => {
  addUserWWW(usernameInput.value, emailInput.value);
});
