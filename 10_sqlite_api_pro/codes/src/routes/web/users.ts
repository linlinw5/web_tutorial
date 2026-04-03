import express from "express";
import { getUsers } from "../../db/dbUsers.ts";

const router = express.Router();

// GET /users?limit=3&offset=0  - SSR: server-side rendered user list
router.get("/", async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = parseInt(req.query.offset as string) || 0;
  try {
    const users = await getUsers(limit, offset);
    const totalPages = Math.ceil(users.total / limit);
    const currentPage = Math.floor(offset / limit) + 1;
    res.render("usersPage", {
      title: "User List",
      content: users,
      pagination: { totalPages, currentPage, limit },
    });
  } catch {
    res.status(500).render("error", { title: "Error", message: "Failed to fetch users" });
  }
});

// GET /users/js  - CSR: return shell page only, data is fetched by client-side JS
router.get("/js", (req, res) => {
  res.render("index", { title: "User List with JS Fetch" });
});

export default router;
