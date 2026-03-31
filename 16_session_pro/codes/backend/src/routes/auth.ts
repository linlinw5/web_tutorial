import express from "express";
import { getAllGroups } from "../db/groups.ts";
import { isAuthenticated, isAdmin } from "../utils/authCheck.ts";

const router = express.Router();

router.get("/", (req, res) => {
    res.render("index", {
        title: "Home",
        user: req.session.user
    }); 
});

router.get("/register", async (req, res) => {
    try {
        const groups = await getAllGroups();       
        res.render("register", {
            title: "Register User",
            groups,
            script_name: "register.js",
            user: req.session.user,
        });
    } catch (error) {
        console.error("Error fetching groups:", error);
        res.status(500).send("Internal Server Error");
    }
});


router.get("/login", (req, res) => {
    // 如果用户已经登录，重定向到个人资料页面
    if (req.session.user) {
        res.redirect("/auth/profile");
    } else {
        // 否则，渲染登录页面
        res.render("login", {
            title: "Login",
            user: req.session.user,
            script_name: "login.js"
        });
    }
});

router.get("/profile", isAuthenticated, (req, res) => {
    // 如果用户未登录，重定向到登录页面
    // if (!req.session.user) {
    //     return res.redirect("/auth/login");
    // }
    
    // 渲染个人资料页面
    res.render("profile", {
        title: "Profile",
        user: req.session.user,
        sessionID: req.sessionID
    });
});

router.get("/logout", (req, res) => {
    // 清除 session
    req.session.destroy((err) => {
        if (err) {
            res.status(500).send("Could not log out.");
        } else {
            res.clearCookie("easyblog.sid");
            res.redirect("/auth");
        }
    });
});

router.get("/admin", isAdmin, (req, res) => {
    // 检查用户是否登录
    // if (req.session.user && req.session.user.group_id === 1) {
    //     res.render("admin", {
    //         title: "Admin Dashboard",
    //         user: req.session.user,
    //     });
    // } else {
    //     res.status(403).render("error", {
    //         title: "Access Denied",
    //         image_name: "403.jpg",
    //         user: req.session.user,
    //     });
    // }

    res.render("admin", {
        title: "Admin Dashboard",
        user: req.session.user,
    });
});


export default router;