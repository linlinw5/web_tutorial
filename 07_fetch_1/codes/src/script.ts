// Mock API 基础地址，与 00_mock_api 启动的端口一致
const baseUrl = "http://localhost:3000";

// 从 HTML 中获取需要操作的元素
const loadBtn = document.getElementById("loadBtn") as HTMLButtonElement;
const userList = document.getElementById("userList") as HTMLUListElement;
const message = document.getElementById("message") as HTMLDivElement;

// 定义用户数据结构（与后端商量好的接口契约）
interface User {
    id: number;
    name: string;
    email: string;
    image: string;
}


// ===== 7.2 GET 请求：获取用户列表 =====

async function getUserList() {
    try {
        const response: Response = await fetch(`${baseUrl}/api/users`);
        if (response.ok) {
            const users: User[] = await response.json();
            renderUserList(users);
        } else {
            throw new Error(`获取用户列表失败，状态码：${response.status}`);
        }
    } catch (err) {
        message.textContent = String(err);
    }
}

loadBtn.addEventListener("click", getUserList);


// ===== 渲染用户列表 =====

function renderUserList(users: User[]) {
    userList.innerHTML = users.map((user) => `
        <li>
            <p>ID: ${user.id} | 姓名: ${user.name} | 邮箱: ${user.email}</p>
            <img src="${baseUrl + user.image}" alt="Avatar" style="height: 80px;">
            <button class="deleteBtn" data-user-id="${user.id}">删除</button>
        </li>
    `).join("");

    document.querySelectorAll<HTMLButtonElement>(".deleteBtn").forEach((btn) => {
        btn.addEventListener("click", (event) => {
            const userId = (event.target as HTMLButtonElement).dataset.userId;
            deleteUser(Number(userId));
        });
    });
}


// ===== DELETE 请求：删除用户 =====

async function deleteUser(userId: number) {
    try {
        const response = await fetch(`${baseUrl}/api/users/${userId}`, {
            method: "DELETE"
        });
        if (response.ok) {
            message.textContent = `用户 ${userId} 已删除`;
            getUserList();
        } else {
            throw new Error(`删除失败，状态码：${response.status}`);
        }
    } catch (err) {
        message.textContent = String(err);
    }
}


// ===== 7.3 POST 请求：新增用户 =====

const usernameInput = document.getElementById("username") as HTMLInputElement;
const emailInput = document.getElementById("email") as HTMLInputElement;
const addJSON = document.getElementById("addJSON") as HTMLButtonElement;
const addWWW = document.getElementById("addWWW") as HTMLButtonElement;


// 方式一：JSON 格式（Content-Type: application/json）
async function addUserJSON(name: string, email: string) {
    try {
        const response = await fetch(`${baseUrl}/api/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email })
        });
        if (response.ok) {
            const result = await response.json();
            message.textContent = `新增成功：ID ${result.id}，姓名：${result.name}`;
            getUserList();
        } else {
            throw new Error(`新增失败，状态码：${response.status}`);
        }
    } catch (err) {
        message.textContent = String(err);
    }
}

addJSON.addEventListener("click", () => {
    addUserJSON(usernameInput.value, emailInput.value);
});


// 方式二：www-form 格式（Content-Type: application/x-www-form-urlencoded）
async function addUserWWW(name: string, email: string) {
    try {
        const body = new URLSearchParams();
        body.append("name", name);
        body.append("email", email);

        const response = await fetch(`${baseUrl}/api/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: body.toString()
        });
        if (response.ok) {
            const result = await response.json();
            message.textContent = `新增成功：ID ${result.id}，姓名：${result.name}`;
            getUserList();
        } else {
            throw new Error(`新增失败，状态码：${response.status}`);
        }
    } catch (err) {
        message.textContent = String(err);
    }
}

addWWW.addEventListener("click", () => {
    addUserWWW(usernameInput.value, emailInput.value);
});
