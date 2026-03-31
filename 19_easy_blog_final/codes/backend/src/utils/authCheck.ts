import express from "express";
import { User } from "../models/User.ts";
import { getAllTags } from '../db/tags.ts';

export const isAuthenticated = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // 检查用户是否已登录
    if (req.isAuthenticated()) {
        // 如果已登录，继续处理请求
        return next();
    }
    // 如果未登录，重定向到登录页面
    res.redirect("/auth/login");
}

export const isAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // 检查用户是否已登录且是管理员
    if (req.isAuthenticated() && (req.user as User).group_id === 1) {
        // 如果是管理员，继续处理请求
        return next();
    }
    // 如果不是管理员，返回403 Forbidden错误
    const tags = await getAllTags();
    res.status(403).render("error", { title: "Access Denied", image_name: "403.jpg", tags });
}
