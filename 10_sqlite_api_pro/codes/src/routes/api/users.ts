import express from "express";
import { getUsers, getUserById, createUser, updatePassword, deleteUser } from "../../db/dbUsers.ts";

const router = express.Router();

// GET /api/users?limit=3&offset=0
router.get("/", async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 3;
  const offset = parseInt(req.query.offset as string) || 0;
  try {
    const result = await getUsers(limit, offset);
    res.json(result);
  } catch {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// GET /api/users/:id
router.get("/:id", async (req, res) => {
  const userId = Number(req.params.id);
  try {
    const user = await getUserById(userId);
    user ? res.json(user) : res.status(404).json({ error: "User not found" });
  } catch {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// POST /api/users
router.post("/", async (req, res) => {
  const { username, email, password, group_id = 3 } = req.body;
  if (!username || !email || !password) {
    res.status(400).json({ error: "username, email, and password are required" });
    return;
  }
  try {
    const result = await createUser(username, email, password, group_id);
    res.status(201).json(result);
  } catch {
    res.status(500).json({ error: "Failed to create user" });
  }
});

// PATCH /api/users/:id
router.patch("/:id", async (req, res) => {
  const userId = Number(req.params.id);
  const { password } = req.body;
  if (!password) {
    res.status(400).json({ error: "password is required" });
    return;
  }
  try {
    const result = await updatePassword(userId, password);
    result.changes && result.changes > 0 ? res.json({ message: "Password updated" }) : res.status(404).json({ error: "User not found" });
  } catch {
    res.status(500).json({ error: "Failed to update password" });
  }
});

// DELETE /api/users/:id
router.delete("/:id", async (req, res) => {
  const userId = Number(req.params.id);
  try {
    const result = await deleteUser(userId);
    result.changes && result.changes > 0 ? res.status(204).send() : res.status(404).json({ error: "User not found" });
  } catch {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;
