import express from "express";
import { getConnection, closeConnection } from "./db/ConnectionManager.ts";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to the SQLite API!");
});

// ===== Read: fetch user list (pagination) =====
// GET /api/users?page=1&limit=3
app.get("/api/users", async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 3;
  const offset = (page - 1) * limit;

  try {
    const db = await getConnection();
    const users = await db.all("SELECT * FROM users LIMIT ? OFFSET ?", [limit, offset]);
    const totalRow = await db.get("SELECT COUNT(*) as count FROM users");
    res.json({ total: totalRow.count, page, limit, data: users });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// ===== Read: fetch single user (JOIN query) =====
app.get("/api/users/:id", async (req, res) => {
  const userId = Number(req.params.id);
  try {
    const db = await getConnection();
    const user = await db.get(
      `SELECT u.id, u.username, u.email, g.name AS group_name
             FROM users AS u
             JOIN groups AS g ON u.group_id = g.id
             WHERE u.id = ?`,
      [userId],
    );
    user ? res.json(user) : res.status(404).json({ error: "User not found" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// ===== Create: add user =====
app.post("/api/users", async (req, res) => {
  const { username, email, password, group_id = 3 } = req.body;
  if (!username || !email || !password) {
    res.status(400).json({ error: "username, email, password are required" });
    return;
  }
  try {
    const db = await getConnection();
    const result = await db.run("INSERT INTO users (username, email, password, group_id) VALUES (?, ?, ?, ?)", [
      username,
      email,
      password,
      Number(group_id),
    ]);
    res.status(201).json({ id: result.lastID, username, email, group_id });
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

// ===== Update: change password (PATCH - partial update) =====
app.patch("/api/users/:id", async (req, res) => {
  const userId = Number(req.params.id);
  const { password } = req.body;
  if (!password) {
    res.status(400).json({ error: "password is required" });
    return;
  }
  try {
    const db = await getConnection();
    const result = await db.run("UPDATE users SET password = ? WHERE id = ?", [password, userId]);
    result.changes && result.changes > 0
      ? res.json({ success: true })
      : res.status(404).json({ error: "User not found" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update password" });
  }
});

// ===== Delete: remove user =====
app.delete("/api/users/:id", async (req, res) => {
  const userId = Number(req.params.id);
  try {
    const db = await getConnection();
    const result = await db.run("DELETE FROM users WHERE id = ?", [userId]);
    result.changes && result.changes > 0 ? res.status(204).send() : res.status(404).json({ error: "User not found" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// ===== Graceful shutdown: close database connection =====
// SIGINT: triggered when user presses Ctrl+C
// SIGTERM: triggered by kill command or when deployment platform stops the container
async function gracefulShutdown(signal: string) {
  console.log(`Received ${signal}, closing database connection...`);
  await closeConnection();
  process.exit(0);
}

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
