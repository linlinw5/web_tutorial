import express from "express";
import { getUsers } from "../../db/dbUsers.ts";

const router = express.Router();

// GET /users?limit=3&offset=0  — SSR：服务器渲染用户列表
router.get("/", async (req, res) => {
    const limit  = parseInt(req.query.limit  as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    try {
        const users = await getUsers(limit, offset);
        const totalPages  = Math.ceil(users.total / limit);
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

// GET /users/js  — CSR：只返回空壳页面，数据由客户端 JS 自行获取
router.get("/js", (req, res) => {
    res.render("index", { title: "User List with JS Fetch" });
});

export default router;
