[← Back to Home](../readme.md)

# Chapter 10 (Advanced): Modular Express + SQLite + SSR / CSR

This chapter takes one step further from the previous chapter, with two goals:

1. **Code organization**: Manage routes, database operations, and utility functions in separate directories, demonstrating a scalable project structure.
2. **SSR vs CSR**: Use the same data to implement both server-side rendering (EJS) and client-side rendering (JS Fetch), and compare how the two approaches work.

## Directory Structure

```
10_sqlite_api_pro/
  README.md
  rest_client.http              ← API test script
  codes/                        ← Complete reference code
    package.json
    tsconfig.json
    data/
      init.sql                  ← schema creation + initial data
    src/
      app.ts                    ← Entry point: register middleware and routes
      db/
        ConnectionManager.ts    ← Database connection (singleton)
        dbUsers.ts              ← Data access layer
      routes/
        api/
          index.ts              ← barrel export
          users.ts              ← /api/users CRUD
          blogs.ts              ← /api/blogs (placeholder)
        web/
          index.ts              ← barrel export
          users.ts              ← /users SSR + /users/js CSR
      utils/
        shutdownConnection.ts   ← graceful shutdown
    views/
      usersPage.ejs             ← SSR template
      index.ejs                 ← CSR shell page
      error.ejs                 ← Error page
    public/
      css/style.css
      js/index.js               ← Browser-side script (vanilla JS)
  practice/                     ← Student exercise directory (same structure)
```

**How to Start:**

```bash
cd codes
npm install
npm run dev
# Visit http://localhost:3000
```

---

## 10+.1 Code Organization

The previous chapter put all routes inside `app.ts`. This chapter introduces a layered structure:

```
src/
  app.ts          ← responsible only for: creating the app, registering middleware, mounting routes
  db/             ← responsible only for: database connections and SQL queries
  routes/api/     ← responsible only for: REST API endpoint definitions
  routes/web/     ← responsible only for: page routes (EJS rendering)
  utils/          ← general-purpose utilities (not tied to business logic)
```

As a result, `app.ts` becomes very clean:

```typescript
import { users as apiUsers, blogs as apiBlogs } from "./routes/api/index.ts";
import { users as webUsers } from "./routes/web/index.ts";

app.use("/api/users", apiUsers);
app.use("/api/blogs", apiBlogs);
app.use("/users", webUsers);
```

Each directory has an `index.ts` as a **barrel export** — callers only need to import from `index.ts` without needing to know the internal file structure:

```typescript
// routes/api/index.ts
import users from "./users.ts";
import blogs from "./blogs.ts";
export { users, blogs };
```

---

## 10+.2 Data Access Layer (db/)

### 10+.2.1 ConnectionManager

Same as the previous chapter: a module-level variable caches the connection, and `getConnection()` / `closeConnection()` functions are exposed externally.

### 10+.2.2 dbUsers.ts — Separating SQL from Routes

In the previous chapter, SQL was written directly inside route handler functions. This chapter introduces a dedicated `dbUsers.ts` that consolidates all database operations on the `users` table into one place:

```typescript
// dbUsers.ts — only performs database operations; does not touch req / res
export async function getUsers(limit: number, offset: number) {
    const db = await getConnection();
    const users = await db.all("SELECT * FROM users LIMIT ? OFFSET ?", [limit, offset]);
    const totalUsers = await db.get("SELECT COUNT(*) as count FROM users");
    return { total: totalUsers.count, data: users };
}

export async function createUser(username: string, email: string, password: string, group_id: number) {
    const db = await getConnection();
    const result = await db.run(
        "INSERT INTO users (username, email, password, group_id) VALUES (?, ?, ?, ?)",
        [username, email, password, group_id]
    );
    return result;
}
```

Route files only need to import these functions and no longer interact with SQL directly:

```typescript
// routes/api/users.ts
import { getUsers, getUserById } from "../../db/dbUsers.ts";

router.get("/", async (req, res) => {
    const limit = parseInt(req.query.limit as string) || 3;
    const offset = parseInt(req.query.offset as string) || 0;
    const result = await getUsers(limit, offset);
    res.json(result);
});
```

**Benefit:** The same `getUsers()` function can be reused by both API routes and web routes, eliminating duplicated SQL code.

> **`limit` + `offset` vs `page` + `limit`**
>
> The previous chapter used `?page=2&limit=3`; this chapter switches to `?limit=3&offset=3`.
> The two are equivalent (`offset = (page - 1) * limit`). `offset` is more low-level and maps directly to SQL's `OFFSET`; `page` is more user-friendly for the frontend. The choice depends on team convention.

---

## 10+.3 Route Layer (routes/)

### 10+.3.1 API Routes (routes/api/users.ts)

Standard CRUD, same logic as the previous chapter — the SQL portions are just moved to `dbUsers.ts`:

| Method | Path | Description |
|---|---|---|
| GET | `/api/users` | Paginated list, `?limit=3&offset=0` |
| GET | `/api/users/:id` | Single user (with GROUP JOIN) |
| POST | `/api/users` | Create; requires username / email / password |
| PATCH | `/api/users/:id` | Update password |
| DELETE | `/api/users/:id` | Delete; returns 204 on success |

### 10+.3.2 Web Routes (routes/web/users.ts)

```typescript
const router = Express.Router();

// SSR: server queries data and passes it to EJS for rendering
router.get("/", async (req, res) => {
    const limit  = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const users = await getUsers(limit, offset);
    const totalPages  = Math.ceil(users.total / limit);
    const currentPage = Math.floor(offset / limit) + 1;
    res.render("usersPage", {
        title: "User List",
        content: users,
        pagination: { totalPages, currentPage, limit }
    });
});

// CSR: only renders the shell page; no data is passed
router.get("/js", (req, res) => {
    res.render("index", { title: "User List with JS Fetch" });
});
```

---

## 10+.4 SSR vs CSR Comparison

### 10+.4.1 SSR: `/users` (Server-Side Rendering)

```
Browser requests /users
    → Express calls getUsers()
    → Passes data to EJS: res.render("usersPage", { content, pagination })
    → EJS uses a loop to fill data into HTML
    → Server returns complete HTML
Browser displays directly — no additional requests needed
```

In EJS templates, `<% ... %>` runs logic and `<%= ... %>` outputs data:

```ejs
<% content.data.forEach(user => { %>
    <tr>
        <td><%= user.id %></td>
        <td><%= user.username %></td>
        <td><%= user.email %></td>
    </tr>
<% }) %>

<!-- Pagination links: each page is an <a> tag; clicking triggers a new GET request -->
<% for(let i = 1; i <= pagination.totalPages; i++) { %>
    <a href="/users?limit=<%= pagination.limit %>&offset=<%= pagination.limit * (i - 1) %>">
        Page <%= i %>
    </a>
<% } %>
```

Pagination is implemented via `<a>` link navigation — each click triggers a full page reload.

![SSR result](assets/userlist_ssr.png)

### 10+.4.2 CSR: `/users/js` (Client-Side Rendering)

```
Browser requests /users/js
    → Express returns a shell HTML (just a <div id="root"> and <script src="/js/index.js">)
Browser receives HTML and executes index.js
    → JS calls fetch("/api/users?limit=10&offset=0")
    → After receiving JSON data, uses DOM API to dynamically create a <table>
    → Clicking a pagination button: calls fetch() again, updates DOM (no page reload)
```

The EJS template is just a container — no user data at all:

```ejs
<body>
    <div id="root">root</div>
    <script src="/js/index.js"></script>
</body>
```

The client-side JS (`public/js/index.js`) is responsible for all rendering:

```javascript
async function fetchUsers(limit = 3, offset = 0) {
    const response = await fetch(`/api/users?limit=${limit}&offset=${offset}`);
    const data = await response.json();
    renderUsers(data.data);
    renderPagination(limit, offset, data.total);
}

function renderPagination(limit, offset, total) {
    const currentPage = Math.floor(offset / limit) + 1;
    const totalPages  = Math.ceil(total / limit);
    for (let i = 1; i <= totalPages; i++) {
        const buttonOffset = (i - 1) * limit;
        // Clicking the button calls fetchUsers again — only updates the DOM, no page navigation
        li.innerHTML = `<button onclick="fetchUsers(${limit}, ${buttonOffset})">Page ${i}</button>`;
    }
}
```

> **Note:** `public/js/index.js` is vanilla JavaScript, not TypeScript — it runs directly in the browser with no compilation step. To write browser scripts in TypeScript, a separate browser-side `tsconfig.json` would be needed (see Chapters 5 and 6).

![CSR result](assets/userlist_csr.png)

### 10+.4.3 SSR vs CSR Comparison

| | SSR (`/users`) | CSR (`/users/js`) |
|---|---|---|
| Where data comes from | Server queries and embeds it in HTML | Browser fetches it from the API |
| Initial page load | Displays complete content immediately | Shows empty shell first; JS fills content after executing |
| Pagination | Click `<a>` link; full page reload | Click button; only updates DOM, no reload |
| SEO | Search engine friendly (HTML has content) | Not friendly (HTML is empty shell) |
| Implementation complexity | Logic on the server; templates are simple | Logic in client-side JS; server is simple |
