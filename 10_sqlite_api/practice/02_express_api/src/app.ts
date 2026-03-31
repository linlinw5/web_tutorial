import express from "express";
import { getConnection, closeConnection } from "./db/ConnectionManager.ts";

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
//                           返回 { total, page, limit, data }
//
// GET  /api/users/:id     - 查询单个用户（JOIN groups 表，返回 group_name）
//                           找不到返回 404
//
// POST /api/users         - 新增用户
//                           必填字段：username, email, password
//                           group_id 默认为 3（Guest）
//                           返回 201 + 新记录信息
//
// PATCH /api/users/:id    - 修改密码
//                           body: { password }
//                           用 result.changes 判断是否找到记录
//
// DELETE /api/users/:id   - 删除用户
//                           成功返回 204 No Content
//                           找不到返回 404
//
// 兜底路由               - 404

// 优雅退出：监听 SIGINT / SIGTERM，关闭数据库连接后再退出

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
