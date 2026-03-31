// 客户端脚本：负责从 /api/users 获取数据并渲染到页面
// 注意：这是原生 JavaScript，直接在浏览器运行，无需编译

const root = document.getElementById("root");

function renderUsers(users) {
    const table = document.createElement("table");
    table.innerHTML = `
        <thead>
            <tr><th>ID</th><th>Username</th><th>Email</th></tr>
        </thead>
    `;
    const tbody = document.createElement("tbody");
    users.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
        `;
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    root.appendChild(table);
}

function renderPagination(limit, offset, total) {
    const totalPages  = Math.ceil(total / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    const ul = document.createElement("ul");
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement("li");
        const buttonOffset = (i - 1) * limit;
        // 点击按钮重新调用 fetchUsers，只更新 DOM，不跳转页面
        li.innerHTML = `<button onclick="fetchUsers(${limit}, ${buttonOffset})" ${i === currentPage ? "disabled" : ""}>Page ${i}</button>`;
        ul.appendChild(li);
    }
    root.appendChild(ul);
}

async function fetchUsers(limit = 3, offset = 0) {
    root.innerHTML = ""; // 清空上一次渲染的内容
    try {
        const response = await fetch(`/api/users?limit=${limit}&offset=${offset}`);
        const data = await response.json();
        renderUsers(data.data);
        renderPagination(limit, offset, data.total);
    } catch (error) {
        root.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

// 页面加载时立即获取第一页
fetchUsers(10, 0);
