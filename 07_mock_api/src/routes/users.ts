import express from "express";
import { users } from "../data/users.ts";
import { User } from "../types/user.ts";

const router = express.Router();

router.get("/", (req, res) => {
  res.json(users);
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const user: User | undefined = users.find((u) => u.id === id);
  user ? res.json(user) : res.status(404).json({ error: "User not found" });
});

router.post("/", (req, res) => {
  console.log("Request Content-Type:", req.headers["content-type"]);
  console.log("Request body:", req.body);

  const { name, email } = req.body;
  const newUser: User = {
    id: Date.now(),
    name,
    email,
    image: "/images/default.png", // Default image
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const index: number = users.findIndex((u) => u.id === id);
  if (index >= 0) {
    users.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

router.put("/:id", (req, res) => {
  const id: number = Number(req.params.id);
  const { name, email } = req.body;
  const user: User | undefined = users.find((u) => u.id === id);
  if (user) {
    user.name = name;
    user.email = email;
    res.json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

export default router;
