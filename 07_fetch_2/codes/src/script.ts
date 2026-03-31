const baseUrl = "http://localhost:3000";

// ===== 公共元素（三个页面都有）=====

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


// ===== 数据类型 =====

interface User {
    id: number;
    name: string;
    email: string;
    image: string;
}


// ===== index.html 相关代码 =====

const loadBtn = document.querySelector("#loadBtn") as HTMLButtonElement;
const userGrid = document.querySelector("#userGrid") as HTMLDivElement;
const addUserBtn = document.querySelector("#addUserBtn") as HTMLButtonElement;

function renderUserGrid(users: User[]) {
    userGrid.innerHTML = users.map((user) => `
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
                <button class="btn btn-edit" onclick="editUser(${user.id})">编辑</button>
                <button class="btn btn-danger" onclick="deleteUser(${user.id})">删除</button>
            </div>
        </div>
    `).join("");
}

async function getUsers() {
    try {
        const response = await fetch(`${baseUrl}/api/users`);
        if (response.ok) {
            const users: User[] = await response.json();
            renderUserGrid(users);
            renderMessage("用户列表加载成功", "success");
        } else {
            throw new Error(`获取失败，状态码：${response.status}`);
        }
    } catch (err) {
        renderMessage(`用户列表加载失败：${err}`, "error");
    }
}

async function deleteUser(userId: number) {
    try {
        const response = await fetch(`${baseUrl}/api/users/${userId}`, { method: "DELETE" });
        if (response.ok) {
            renderMessage(`用户 ${userId} 已删除`, "success");
            getUsers();
        } else {
            throw new Error(`删除失败，状态码：${response.status}`);
        }
    } catch (err) {
        renderMessage(`删除失败：${err}`, "error");
    }
}

function editUser(userId: number) {
    window.location.href = `./edit-user.html?id=${userId}`;
}

// index.html 页面加载时自动拉取用户列表，刷新按钮重新拉取
loadBtn && getUsers();
loadBtn && loadBtn.addEventListener("click", getUsers);
addUserBtn && addUserBtn.addEventListener("click", () => {
    window.location.href = "./add-user.html";
});


// ===== add-user.html 相关代码 =====

const usernameInput = document.getElementById("username") as HTMLInputElement;
const emailInput = document.getElementById("email") as HTMLInputElement;
const submitAdd = document.getElementById("submitAdd") as HTMLButtonElement;

async function addUser(name: string, email: string) {
    try {
        const response = await fetch(`${baseUrl}/api/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email })
        });
        if (response.ok) {
            renderMessage("用户添加成功", "success");
            setTimeout(() => {
                window.location.href = "./index.html";
            }, 2000);
        } else {
            throw new Error(`新增失败，状态码：${response.status}`);
        }
    } catch (err) {
        renderMessage(`添加用户失败：${err}`, "error");
    }
}

submitAdd && submitAdd.addEventListener("click", () => {
    addUser(usernameInput.value, emailInput.value);
});


// ===== edit-user.html 相关代码 =====

const userIdInput = document.getElementById("userId") as HTMLInputElement;
const submitUpdate = document.getElementById("submitUpdate") as HTMLButtonElement;

// 从 URL 中读取用户 ID（如 edit-user.html?id=3）
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
            throw new Error(`获取失败，状态码：${response.status}`);
        }
    } catch (err) {
        // 获取失败时禁用表单，避免用户提交空数据
        usernameInput.disabled = true;
        emailInput.disabled = true;
        submitUpdate.disabled = true;
        renderMessage(`获取用户信息失败：${err}`, "error");
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
            body: JSON.stringify({ name, email })
        });
        if (response.ok) {
            renderMessage("用户修改成功", "success");
            setTimeout(() => {
                window.location.href = "./index.html";
            }, 2000);
        } else {
            throw new Error(`更新失败，状态码：${response.status}`);
        }
    } catch (err) {
        renderMessage(`更新用户失败：${err}`, "error");
    }
}

// edit-user.html 页面加载时自动获取用户信息并填充表单
submitUpdate && getUserById(Number(currentUserId));
submitUpdate && submitUpdate.addEventListener("click", () => {
    updateUser(usernameInput.value, emailInput.value, Number(currentUserId));
});
