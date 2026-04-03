// Client-side script: fetches data from /api/users and renders it to the page
// Note: this is plain JavaScript, runs directly in the browser without compilation

const root = document.getElementById("root");

function renderUsers(users) {
  const table = document.createElement("table");
  table.innerHTML = `
        <thead>
            <tr><th>ID</th><th>Username</th><th>Email</th></tr>
        </thead>
    `;
  const tbody = document.createElement("tbody");
  users.forEach((user) => {
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
  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  const ul = document.createElement("ul");
  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement("li");
    const buttonOffset = (i - 1) * limit;
    // Click the button to call fetchUsers again, update DOM only, no page navigation
    li.innerHTML = `<button onclick="fetchUsers(${limit}, ${buttonOffset})" ${i === currentPage ? "disabled" : ""}>Page ${i}</button>`;
    ul.appendChild(li);
  }
  root.appendChild(ul);
}

async function fetchUsers(limit = 3, offset = 0) {
  root.innerHTML = ""; // Clear previously rendered content
  try {
    const response = await fetch(`/api/users?limit=${limit}&offset=${offset}`);
    const data = await response.json();
    renderUsers(data.data);
    renderPagination(limit, offset, data.total);
  } catch (error) {
    root.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

// Fetch the first page immediately when the page loads
fetchUsers(10, 0);
