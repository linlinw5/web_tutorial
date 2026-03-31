import express from "express";
import { getUsers } from "../../db/dbUsers.ts";

const router = express.Router();

// 在这里实现以下路由：
//
// GET /users?limit=3&offset=0  — SSR
//   - 从 req.query 读取 limit 和 offset
//   - 调用 getUsers(limit, offset) 获取数据
//   - 计算分页信息：
//       totalPages  = Math.ceil(users.total / limit)
//       currentPage = Math.floor(offset / limit) + 1
//   - 调用 res.render("usersPage", { title, content, pagination })
//     其中 pagination = { totalPages, currentPage, limit }
//
// GET /users/js  — CSR
//   - 不查数据库
//   - 直接 res.render("index", { title: "User List with JS Fetch" })
//   - 数据由浏览器端的 /public/js/index.js 自行获取

export default router;
