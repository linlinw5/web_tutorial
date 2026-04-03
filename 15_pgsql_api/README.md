[← Back to Home](../readme.md)

# Chapter 15: Working with PostgreSQL from Node.js

This chapter has two phases:

- **Phase 1 (`codes/01_demo`)**: Pure TypeScript scripts demonstrating CRUD operations with the `pg` package, comparing `Client` (single connection) vs `Pool` (connection pool).
- **Phase 2 (`codes/02_express_api`)**: Integrating `pg` into Express to build a REST API equivalent in functionality to the SQLite API from Chapter 10, tested with `rest_client.http`.

## Directory Structure

```
15_pgsql_api/
  README.md
  rest_client.http              ← API test script (used in Phase 2)
  codes/
    01_demo/                    ← [Phase 1] pg basic operations demo
      tsconfig.json
      src/
        demo_db.ts              ← Client single connection: CRUD + $ placeholders
        demo_db_pool.ts         ← Pool connection pool: query demo + graceful shutdown
    02_express_api/             ← [Phase 2] Express + pg complete API
      package.json
      tsconfig.json
      src/
        app.ts                  ← Routes and business logic
        db/
          ConnectionManager.ts  ← Exports a global Pool instance
  practice/
    01_demo/                    ← Phase 1 exercise skeleton
      tsconfig.json
      src/
        demo_db.ts              ← Client mode TODO
        demo_db_pool.ts         ← Pool mode TODO
    02_express_api/             ← Phase 2 exercise skeleton
      package.json
      tsconfig.json
      src/
        app.ts                  ← 6 routes + graceful shutdown TODO
        db/
          ConnectionManager.ts  ← Pool export TODO
```

> **Note:** Before running, update the `dbConfig` in each file with your own PostgreSQL `host` / `password` / `database` settings.

---

## Phase 1: pg Basic Operations (`codes/01_demo`)

```bash
cd codes/01_demo
npm init -y
npm install pg @types/pg tsx
npx tsx src/demo_db.ts
npx tsx src/demo_db_pool.ts
```

### 15.1 Client vs Pool

`pg` is the official Node.js driver for PostgreSQL, offering two connection approaches:

| | `pg.Client` | `pg.Pool` |
|---|---|---|
| Connections | One connection at a time | Maintains multiple connections, borrowing and returning on demand |
| Use cases | Scripts, one-off tasks | Express services, high-concurrency apps |
| Lifecycle | Manual `connect()` → `end()` when done | Created at app start, `pool.end()` on shutdown |

**Client usage (`demo_db.ts`)**

```typescript
import pg from 'pg';

const db = new pg.Client({
    host: "localhost", port: 5432,
    user: "postgres", password: "your_password", database: "mydb"
});

async function pgDemo() {
    try {
        await db.connect();
        const users = await db.query("SELECT * FROM users WHERE password = $1", ["password123"]);
        console.log(users.rows);
    } finally {
        await db.end(); // must close manually when done
    }
}
pgDemo();
```

**Pool usage (`demo_db_pool.ts`)**

```typescript
import pg from 'pg';

const pool = new pg.Pool({
    host: "localhost", port: 5432,
    user: "postgres", password: "your_password", database: "mydb",
    max: 10,                    // maximum connections
    idleTimeoutMillis: 30000,   // idle connection timeout
    connectionTimeoutMillis: 2000
});

// Call pool.query() directly — no manual connect / end needed
const users = await pool.query("SELECT * FROM users");
console.log(users.rows);

// Close the pool when the app exits
process.on('SIGINT',  async () => { await pool.end(); });
process.on('SIGTERM', async () => { await pool.end(); });
```

### 15.2 Operational Differences from SQLite (sqlite package)

The biggest difference between the two packages is **method granularity**:

| Scenario | sqlite package | pg package |
|---|---|---|
| Query multiple rows | `db.all(sql)` | `pool.query(sql)` → `.rows` |
| Query a single row | `db.get(sql)` | `pool.query(sql)` → `.rows[0]` |
| Execute a write | `db.run(sql)` | `pool.query(sql)` → `.rows` (can include RETURNING) |
| Placeholder syntax | `?` | `$1, $2, $3, ...` |

`pg` has only one `query()` method; results are accessed via `.rows`, with no `get` / `all` / `run` distinction.

**Placeholder comparison**

```typescript
// SQLite
db.run("INSERT INTO users (username, email) VALUES (?, ?)", [username, email]);

// PostgreSQL ($1 $2 numbered in order, prevents SQL injection)
pool.query("INSERT INTO users (username, email) VALUES ($1, $2)", [username, email]);
```

**Using RETURNING to get write operation results**

```typescript
// Get the complete record including id right after insert — no second SELECT needed
const result = await pool.query(
    "INSERT INTO users (username, email, password, group_id) VALUES ($1, $2, $3, $4) RETURNING *",
    [username, email, password, group_id]
);
const newUser = result.rows[0]; // { id: 11, username: '...', ... }
```

---

## Phase 2: Express + pg REST API (`codes/02_express_api`)

```bash
cd codes/02_express_api
npm install
npm run dev
# Start and then test endpoints with rest_client.http
```

### 15.3 ConnectionManager: Exporting a Global Pool

```typescript
// src/db/ConnectionManager.ts
import pg from 'pg';

export const pool = new pg.Pool({
    host: "localhost", port: 5432,
    user: "postgres", password: "your_password", database: "mydb",
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
```

The entire application shares one `pool` instance. All routes simply `import { pool } from "./db/ConnectionManager.ts"` — no need to create a new connection per request.

### 15.4 Route Design

| Method | Path | Description |
|---|---|---|
| GET | `/api/users` | Query user list (supports `?page=&limit=` pagination) |
| GET | `/api/users/:id` | Query a single user (JOIN groups, returns group_name) |
| POST | `/api/users` | Create a user (RETURNING * returns complete record) |
| PATCH | `/api/users/:id` | Update password |
| DELETE | `/api/users/:id` | Delete a user (204 No Content) |

**Paginated query**

```typescript
app.get("/api/users", async (req, res) => {
    const page   = Number(req.query.page)  || 1;
    const limit  = Number(req.query.limit) || 3;
    const offset = (page - 1) * limit;

    const users = await pool.query(
        "SELECT * FROM users LIMIT $1 OFFSET $2", [limit, offset]
    );
    const total = await pool.query("SELECT COUNT(*) as count FROM users");
    res.json({ total: total.rows[0].count, data: users.rows });
});
```

**JOIN query (single user)**

```typescript
app.get("/api/users/:id", async (req, res) => {
    const query = `
        SELECT u.id, u.username, u.email, g.name as group_name
        FROM users u
        JOIN groups g ON u.group_id = g.id
        WHERE u.id = $1
    `;
    const user = await pool.query(query, [Number(req.params.id)]);
    if (user.rows.length > 0) {
        res.json(user.rows[0]);
    } else {
        res.status(404).json({ error: "User not found" });
    }
});
```

**Graceful shutdown**

```typescript
process.on("SIGINT",  async () => { await pool.end(); process.exit(0); });
process.on("SIGTERM", async () => { await pool.end(); process.exit(0); });
```

On receiving a termination signal, close the connection pool and release all database connections before exiting the process.

### 15.5 API Testing with rest_client.http

Open `rest_client.http` in the root directory using the VS Code REST Client extension. Each request block can be executed individually by clicking "Send Request".

Test coverage includes:
- Paginated queries (page / limit parameters)
- JOIN queries (returning group_name)
- Create user (with required field validation, expect 400)
- Update password (with non-existent user, expect 404)
- Delete user (expect 204)
- Access a non-existent route (expect 404)

---

## Exercise

The `practice/` directory provides skeleton code organized by phase. Each file contains only imports and TODO comments — fill in the implementations yourself.

**Phase 1 (`practice/01_demo`)**

```bash
cd practice/01_demo
npm init -y
npm install pg @types/pg tsx
npx tsx src/demo_db.ts       # Practice Client single connection
npx tsx src/demo_db_pool.ts  # Practice Pool connection pool
```

**Phase 2 (`practice/02_express_api`)**

```bash
cd practice/02_express_api
npm install
npm run dev
# Verify each endpoint using rest_client.http in the root directory
```

Reference implementations are in the corresponding `codes/` subdirectories.
