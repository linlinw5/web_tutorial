import express from "express";
import { pool } from "./db/ConnectionManager.ts";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 在这里实现以下路由：
//
// GET  /                  - 欢迎信息
//
// GET  /api/users         - 分页查询用户列表
//                           支持 ?page=1&limit=3 查询参数
//                           offset = (page - 1) * limit
//                           同时查询 COUNT(*) 获取总数
//                           返回 { total, data }
//
// GET  /api/users/:id     - 查询单个用户
//                           JOIN groups 表，返回 group_name 字段
//                           找不到返回 404
//
// POST /api/users         - 新增用户
//                           必填字段：username, email, password
//                           group_id 默认为 3（Guest）
//                           使用 RETURNING * 直接返回新记录
//                           返回 201
//
// PATCH /api/users/:id    - 修改密码
//                           body: { password }
//                           用 result.rows.length 判断是否找到记录
//                           使用 RETURNING * 获取更新结果
//
// DELETE /api/users/:id   - 删除用户
//                           使用 RETURNING * 判断记录是否存在
//                           成功返回 204 No Content，找不到返回 404
//
// 兜底路由               - 所有未匹配路径返回 404

// 优雅退出：监听 SIGINT / SIGTERM，调用 pool.end() 后再 process.exit(0)

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
