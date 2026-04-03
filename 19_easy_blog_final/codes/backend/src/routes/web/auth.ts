import express from "express";
import { getAllGroups } from "../../db/groups.ts";
import { isAuthenticated, isAdmin } from "../../utils/authCheck.ts";
import { getAllTags } from "../../db/tags.ts";
import { getUserById } from "../../db/users.ts";
import passport from "passport";

const router = express.Router();

router.get("/register", async (req, res) => {
    try {
        const groups = await getAllGroups();
        const tags = await getAllTags();
        res.render("register", {
            title: "Register User",
            groups,
            script_name: "register.js",
            user: req.user,
            tags
        });
    } catch (error) {
        console.error("Error fetching groups:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/login", async (req, res) => {
    if (req.isAuthenticated()) { // 用 req.isAuthenticated() 而不是 req.user，是 Passport 的标准判断方式
        res.redirect("/auth/profile");
    } else {
        const tags = await getAllTags();
        res.render("login", { title: "Login", tags, script_name: "login.js" }); 
    }
});

// Google OAuth 路由
// 发起 Google OAuth 认证
router.get('/google',
    passport.authenticate('google', { 
        scope: ['profile', 'email'], // 请求用户的基本信息和邮箱
        prompt: 'select_account'  // 或者用 'consent' 强制重新授权
    })
);
// 处理 Google OAuth 回调（认证结束后的回调，成功咋办，失败咋办）
router.get('/google/callback',
    passport.authenticate('google', { 
        successRedirect: '/auth/profile',         // 登录成功重定向到profile页
        failureRedirect: '/auth/login',         // 登录失败重定向到登录页面
    })
);


router.get("/profile", isAuthenticated, async (req, res) => {
    try {
        const tags = await getAllTags();
        res.render("admin", { title: "My Profile", tags, user: req.user, content_ejs: "content_profile" });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/profile/:id", isAuthenticated, async (req, res) => {
    try {
        const tags = await getAllTags();
        const userId = Number(req.params.id);
        const userInfo = await getUserById(userId);
        res.render("admin", { title: "User Information", tags, user: req.user, content_ejs: "content_user", userInfo });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/logout", (req, res) => {
    // Passport 推荐的退出顺序：
    // 1. req.logout() —— 清除 Passport 在内存中的认证状态（req.user 置为 undefined）
    // 2. req.session.destroy() —— 从 Session Store 中删除 Session 记录
    // 3. res.clearCookie() —— 通知浏览器删除 Cookie
    req.logout((err) => {
        if (err) {
            return res.status(500).send("Could not log out.");
        }
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send("Could not log out.");
            }
            res.clearCookie("easyblog.sid");
            res.redirect("/auth/login");
        });
    });
});

export default router;