import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

// 在这里完成以下配置：
//
// 1. CORS 配置（仅允许 http://localhost:5500 访问）
// 2. 中间件：express.json()、express.urlencoded()、express.static("public")
//
// 数据层：
//   interface User { id, name, email, image }
//   let users: User[] = [...] // 内存模拟数据库，初始三条数据
//
// 路由（完整 CRUD）：
//   GET    /               - 欢迎信息
//   GET    /api/users      - 获取所有用户
//   GET    /api/users/:id  - 获取单个用户（找不到返回 404）
//   POST   /api/users      - 新增用户（id 用 Date.now() 生成）
//   PUT    /api/users/:id  - 修改用户（找不到返回 404）
//   DELETE /api/users/:id  - 删除用户（找不到返回 404）
//   兜底路由              - 返回 404

app.listen(PORT, () => {
    console.log(`API server running at http://localhost:${PORT}`);
});
