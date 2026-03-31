import express from "express";
import apiUsersRoutes from "./api/api-users.ts";
import apiBlogsRoutes from "./api/api-blogs.ts";
import apiAuthRoutes from "./api/api-auth.ts";

import pageRoutes from "./web/pages.ts";
import adminRoutes from "./web/admin.ts";
import editorRoutes from "./web/editor.ts";
import authRoutes from "./web/auth.ts";

import { getAllTags } from '../db/tags.ts';
import { isAuthenticated, isAdmin } from '../utils/authCheck.ts';

const router = express.Router();

router.get("/", (req, res) => res.redirect("/pages"));

// API 路由：返回 JSON 数据，供前端 fetch 调用
router.use("/api/users", isAdmin, apiUsersRoutes);  // 用户管理 API，仅管理员可访问
router.use("/api/blogs", apiBlogsRoutes);            // 博客 CRUD API
router.use("/api/auth", apiAuthRoutes);              // 注册/登录 API

// Web 路由：返回 HTML 页面（EJS 渲染）
router.use("/pages", pageRoutes);    // 公开页面（首页、博客详情、标签页）
router.use("/admin", isAdmin, adminRoutes);          // 管理员后台，仅管理员可访问
router.use("/editor", isAuthenticated, editorRoutes); // 编辑器，登录用户可访问
router.use("/auth", authRoutes);                     // 认证相关（登录、注册、Google OAuth）

// 404 处理：所有未匹配的路由
router.use(async (req, res) => {
    const tags = await getAllTags();
    res.status(404).render("error", { image_name: "404.jpg", tags, title: "Page Not Found" });
});

export default router;