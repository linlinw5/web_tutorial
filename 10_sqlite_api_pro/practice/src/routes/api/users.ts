import express from "express";
import {
    getUsers,
    getUserById,
    createUser,
    updatePassword,
    deleteUser,
} from "../../db/dbUsers.ts";

const router = express.Router();

// 在这里实现以下路由：
//
// GET /api/users?limit=3&offset=0
//   - 从 req.query 读取 limit 和 offset（均有默认值）
//   - 调用 getUsers(limit, offset)
//   - 返回 { total, data }
//
// GET /api/users/:id
//   - 调用 getUserById(userId)
//   - 找到返回用户对象，找不到返回 404
//
// POST /api/users
//   - 从 req.body 读取 username, email, password, group_id（默认 3）
//   - 校验必填字段，缺失返回 400
//   - 调用 createUser(...)，返回 201
//
// PATCH /api/users/:id
//   - 从 req.body 读取 password
//   - 调用 updatePassword(userId, password)
//   - 用 result.changes 判断是否找到记录，找不到返回 404
//
// DELETE /api/users/:id
//   - 调用 deleteUser(userId)
//   - 成功返回 204 No Content，找不到返回 404

export default router;
