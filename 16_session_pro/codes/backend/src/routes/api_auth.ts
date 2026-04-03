import express from "express";
import { createUser, checkPassword } from "../db/users.ts";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password, email, group_id } = req.body;
  if (!username || !password || !email || !group_id) {
    res.status(400).json({ error: "All fields are required" });
  }
  try {
    const newUser = await createUser(username, password, email, group_id);
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: "Username and password are required" });
  }
  try {
    const user = await checkPassword(username, password);
    // store user information in session
    req.session.user = user;
    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("Error checking password:", error);
    res.status(401).json({ error: "Invalid username or password" });
  }
});

export default router;
