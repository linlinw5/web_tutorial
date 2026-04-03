[← Back to Home](../readme.md)

# Chapter 10: Working with SQLite in JavaScript

This chapter is divided into two stages:

- **Stage 1 (`codes/01_demo_db`)**: Uses a plain Node.js script to demonstrate CRUD operations with the `sqlite` package — no HTTP server involved. Just run a single `.ts` file and observe the results.
- **Stage 2 (`codes/02_express_api`)**: Integrates database operations into Express to build a complete API that can be tested with REST Client.

## Directory Structure

```
10_sqlite_api/
  README.md
  rest_client.http              ← API test script (used in Stage 2)
  codes/
    01_demo_db/                 ← [Stage 1] Pure script demo of sqlite operations
      package.json
      tsconfig.json
      src/
        demo_db.ts
      data/
        db.sqlite
    02_express_api/             ← [Stage 2] Complete Express + sqlite API
      package.json
      tsconfig.json
      src/
        app.ts
        db/
          ConnectionManager.ts
      data/
        db.sqlite               ← database file
        init.sql                ← schema creation + initial data SQL
  practice/
    01_demo_db/                 ← same structure, for student practice
    02_express_api/
```

**Stage 1 Workflow:**

```bash
cd codes/01_demo_db
npm install
npm run build
npm start           # node ./dist/demo_db.js
```

**Stage 2 Workflow:**

```bash
cd codes/02_express_api
npm install
npm run dev
# After starting, test endpoints using rest_client.http
```

---

## 10.1 Why Use the `sqlite` Package

There are three popular choices for working with SQLite in Node.js:

| Package | Style | Description |
|---|---|---|
| `sqlite3` | Callback-based | Low-level driver, directly binds to the SQLite C library; stable but has a raw API |
| `sqlite` | Promise / async-await | Wraps `sqlite3` with a modern API; consistent in style with `pg` (PostgreSQL) |
| `better-sqlite3` | **Synchronous** | Best performance, but its synchronous API is incompatible with `pg`'s Promise style |

This course uses `sqlite`: its API style is very similar to the `pg` package used in later chapters, so the operational patterns learned here transfer smoothly to PostgreSQL.

```bash
npm install sqlite sqlite3
```

---

## 10.2 Stage 1: Node.js Script with sqlite

> Corresponding project: `codes/01_demo_db`. Full code in `src/demo_db.ts`.

### 10.2.1 Connecting to the Database

```typescript
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

const db: Database = await open({
    filename: "./data/db.sqlite", // relative to process.cwd() (the directory where the command is run)
    driver: sqlite3.Database,
});
```

> The `filename` path is relative to the **directory where the `node` command is run** (`process.cwd()`), not the source file's location. When you run `node ./dist/demo_db.js` from the project root, `./data/db.sqlite` points to the `data/` folder under the project root.

### 10.2.2 Five Core Methods

| Method | Purpose | Return Value |
|---|---|---|
| `db.exec(sql)` | Execute DDL (create table, create index); can contain multiple statements | `void` (throws on error) |
| `db.run(sql, params?)` | Execute a single INSERT / UPDATE / DELETE statement | `{ lastID, changes }` |
| `db.all(sql, params?)` | Query multiple rows | Array of row objects |
| `db.get(sql, params?)` | Query a single row (returns only the first match) | Row object or `undefined` |
| `db.prepare(sql)` | Precompile a statement (for batch inserts) | `Statement` object |

**exec — Creating Tables**

```typescript
// exec can contain multiple statements; each must end with a semicolon
await db.exec(`
    CREATE TABLE IF NOT EXISTS groups (
        id   INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT    NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS users (
        id         INTEGER  PRIMARY KEY AUTOINCREMENT,
        group_id   INTEGER,
        username   TEXT     NOT NULL UNIQUE,
        email      TEXT     NOT NULL UNIQUE,
        password   TEXT     NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE SET NULL
    );
`);
```

**run — INSERT / UPDATE / DELETE**

```typescript
// Direct value (suitable for fixed data)
const r1 = await db.run(`INSERT INTO groups (name) VALUES ('Admin'), ('Editor'), ('Guest')`);
console.log(r1); // { lastID: 3, changes: 3 }

// ? placeholder (recommended: prevents SQL injection)
const r2 = await db.run(
    "INSERT INTO users (username, email, password, group_id) VALUES (?, ?, ?, ?)",
    ["alice", "alice@example.com", "password123", 1]
);
console.log(r2); // { lastID: 1, changes: 1 }
```

`lastID` is the auto-incremented id of the last inserted record; `changes` is the number of rows affected by the operation.

**prepare — Batch Inserts**

```typescript
// Precompile once, execute multiple times — better performance than calling run in a loop
const stmt = await db.prepare(
    "INSERT INTO users (username, email, password, group_id) VALUES (?, ?, ?, ?)"
);
await stmt.run("bob",  "bob@example.com",  "pass123", 2);
await stmt.run("jack", "jack@example.com", "pass456", 3);
await stmt.finalize(); // must release resources
```

**all / get — Querying**

```typescript
// all: returns all matching rows
const users = await db.all("SELECT * FROM users WHERE group_id = ?", [2]);

// get: returns only the first matching row (regardless of how many exist)
const user = await db.get("SELECT * FROM users WHERE username = ?", ["alice"]);

// LIKE fuzzy search; % matches any sequence of characters
const user2 = await db.get("SELECT * FROM users WHERE email LIKE ?", ["%@abc.com"]);
```

### 10.2.3 The ? Placeholder and SQL Injection Prevention

Directly interpolating user input into SQL strings creates a SQL injection risk:

```typescript
// ❌ Dangerous: input of "' OR '1'='1" bypasses password verification
const user = await db.get(`SELECT * FROM users WHERE username = '${username}'`);

// ✅ Safe: ? is handled and escaped by the database driver, not interpreted as SQL syntax
const user = await db.get("SELECT * FROM users WHERE username = ?", [username]);
```

Always use `?` placeholders anywhere external input is involved (user submissions, request parameters).

---

## 10.3 Stage 2: Building a REST API with SQLite

> Corresponding project: `codes/02_express_api`. Test endpoints using `rest_client.http` in the root directory.

### 10.3.1 ConnectionManager: Singleton Connection

Re-opening the database connection on every request adds unnecessary overhead. In real projects, the same connection object should be reused.

```typescript
let db: Database | null = null;

export async function getConnection(): Promise<Database> {
    if (!db) {
        // Establish the connection on the first call
        db = await open({
            filename: "./data/db.sqlite",
            driver: sqlite3.Database,
        });
    }
    return db; // subsequent calls return the existing connection
}

export async function closeConnection(): Promise<void> {
    if (db) {
        await db.close();
        db = null;
    }
}
```

The same result can also be achieved using a class with static properties (see `src/db/ConnectionManager.ts`). Both approaches are equivalent — choose either one.

### 10.3.2 Using the Database in Express Routes

Call `getConnection()` in each route handler to get the connection, then execute queries:

```typescript
app.get("/api/users/:id", async (req, res) => {
    const userId = Number(req.params.id);
    try {
        const db = await getConnection();
        const user = await db.get(
            `SELECT u.id, u.username, u.email, g.name AS group_name
             FROM users AS u
             JOIN groups AS g ON u.group_id = g.id
             WHERE u.id = ?`,
            [userId]
        );
        user ? res.json(user) : res.status(404).json({ error: "User not found" });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user" });
    }
});
```

### 10.3.3 Paginated Queries

```typescript
// GET /api/users?page=2&limit=3
const page   = Number(req.query.page)  || 1;
const limit  = Number(req.query.limit) || 3;
const offset = (page - 1) * limit;       // page 2: skip the first 3 rows

const users    = await db.all("SELECT * FROM users LIMIT ? OFFSET ?", [limit, offset]);
const totalRow = await db.get("SELECT COUNT(*) as count FROM users");

res.json({ total: totalRow.count, page, limit, data: users });
```

`LIMIT` controls the number of rows per page; `OFFSET` controls how many rows to skip. The `total` (total record count) is returned alongside the data so the frontend can calculate the total number of pages.

### 10.3.4 Graceful Shutdown

When the process receives a termination signal, it should close the database connection before exiting to avoid data corruption:

```typescript
async function gracefulShutdown(signal: string) {
    console.log(`Received ${signal}, closing database connection...`);
    await closeConnection();
    process.exit(0);
}

process.on("SIGINT",  () => gracefulShutdown("SIGINT"));   // Ctrl+C
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));  // kill command / deployment platform stop
```

| Signal | How It Is Triggered |
|---|---|
| `SIGINT` | User presses Ctrl+C in the terminal |
| `SIGTERM` | `kill <pid>` command, or Docker / PM2 stopping the container |
