import express from "express";
import { getAllGroups } from "../db/groups.ts";
import { isAuthenticated, isAdmin } from "../utils/authCheck.ts";

const router = express.Router();

// TODO 1: GET /
// - 渲染 index.ejs，传入 title 和 user（来自 req.session.user）
router.get("/", (req, res) => {
    // ...
});

// TODO 2: GET /register
// - 查询所有 groups（用于表单下拉框）
// - 渲染 register.ejs，传入 title / groups / script_name: "register.js" / user
router.get("/register", async (req, res) => {
    // ...
});

// TODO 3: GET /login
// - 如果已登录（req.session.user 存在），重定向到 /auth/profile
// - 否则渲染 login.ejs，传入 title / user / script_name: "login.js"
router.get("/login", (req, res) => {
    // ...
});

// TODO 4: GET /profile（受 isAuthenticated 保护）
// - 渲染 profile.ejs，传入 title / user / sessionID
router.get("/profile", isAuthenticated, (req, res) => {
    // ...
});

// TODO 5: GET /logout
// - 调用 req.session.destroy() 销毁 session
// - 调用 res.clearCookie("easyblog.sid") 清除 Cookie
// - 重定向到 /auth
router.get("/logout", (req, res) => {
    // ...
});

// TODO 6: GET /admin（受 isAdmin 保护）
// - 渲染 admin.ejs，传入 title / user
router.get("/admin", isAdmin, (req, res) => {
    // ...
});

export default router;
