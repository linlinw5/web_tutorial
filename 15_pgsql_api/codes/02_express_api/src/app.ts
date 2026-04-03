import express from "express";
import { pool } from "./db/ConnectionManager.ts";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to the PGSQL API!");
});

// Query
app.get("/api/users", async (req, res) => {
  // Paginated query, assume 3 records per page, current page is 1
  // In actual applications, page number and records per page can be passed through query parameters
  // For example: /api/users?page=1&limit=3
  const page = Number(req.query.page as string) || 1; // Default page is 1
  const limit = parseInt(req.query.limit as string) || 3; // Default 3 records per page, can also use parseInt instead of Number
  const offset = (page - 1) * limit; // Calculate offset

  try {
    const users = await pool.query("SELECT * FROM users limit $1 OFFSET $2", [limit, offset]);
    // Get total user count
    const totalUsers = await pool.query("SELECT COUNT(*) as count FROM users");
    console.log(totalUsers);
    res.json({ total: totalUsers.rows[0].count, data: users.rows });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Query a single user
app.get("/api/users/:id", async (req, res) => {
  const userId = Number(req.params.id);
  try {
    const query = `
            SELECT u.id, u.username, u.email, u.password, g.name as group_name
            FROM users as u
            JOIN groups as g ON u.group_id = g.id
            WHERE u.id = $1
        `;
    const user = await pool.query(query, [userId]);
    if (user.rows.length > 0) {
      res.json(user.rows[0]); // Return the first queried user
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Create/Add
app.post("/api/users", async (req, res) => {
  let { username, email, password, group_id = 3 } = req.body;
  if (!username || !email || !password) {
    res.status(400).json({ error: "Name, email, and password are required" });
  }
  try {
    const result = await pool.query("INSERT INTO users (username, email, password, group_id) VALUES ($1, $2, $3, $4) RETURNING *", [
      username,
      email,
      password,
      Number(group_id),
    ]);
    res.status(201).json(result.rows[0]); // Return the newly created user
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Delete
app.delete("/api/users/:id", async (req, res) => {
  const userId = Number(req.params.id);
  try {
    const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [userId]);
    console.log(result);
    if (result.rows.length > 0) {
      res.status(204).send(); // 204 No Content
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// Update - change password
app.patch("/api/users/:id", async (req, res) => {
  const userId = Number(req.params.id);
  const { password } = req.body;
  if (!password) {
    res.status(400).json({ error: "Password is required" });
  }
  try {
    const result = await pool.query("UPDATE users SET password = $1 WHERE id = $2 RETURNING *", [password, userId]);
    if (result.rows.length > 0) {
      res.json({ success: true, message: "Password updated successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user password:", error);
    res.status(500).json({ error: "Failed to update user password" });
  }
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// When receiving SIGINT or SIGTERM signal, gracefully close the database connection
process.on("SIGINT", async () => {
  console.log("Received SIGINT, closing database connection...");
  await pool.end();
  console.log("Database connection closed. Exiting process.");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Received SIGTERM, closing database connection...");
  await pool.end();
  console.log("Database connection closed. Exiting process.");
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
