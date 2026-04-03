import express from "express";
import { createUser, checkPassword } from "../db/users.ts";

const router = express.Router();

// TODO 1: POST /register
// - 从 req.body 解构 username, password, email, group_id
// - 字段缺失时返回 400
// - 调用 createUser()，成功返回 201 + { message, user }
// - 失败返回 500
router.post("/register", async (req, res) => {
    // ...
});

// TODO 2: POST /login
// - 从 req.body 解构 username, password
// - 字段缺失时返回 400
// - 调用 checkPassword()，成功后将返回的 user 写入 req.session.user
// - 成功返回 200 + { message, user }
// - 失败（用户不存在 / 密码错误）返回 401
router.post("/login", async (req, res) => {
    // ...
});

export default router;
