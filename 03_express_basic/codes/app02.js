// 演示：页面路由 + API 路由 + 404 兜底
// 运行：nodemon codes/app02.js（从 03_express_basic/ 目录下执行）
// 访问：http://localhost:3000

import express from "express";

const app = express();
const port = 3000;

const users = [
    { id: 1, name: "张三", role: "user" },
    { id: 2, name: "李四", role: "admin" },
];

// 中间件 - 请求日志
app.use((req, res, next) => {
    console.log(`收到 ${req.method} 请求: ${req.path}`);
    console.log(`查询参数:`, req.query);
    next();
});

// 1. 首页路由
app.get("/", (req, res) => {
    res.send(`
        <h1>HTTP 案例演示 - 首页</h1>
        <ul>
            <li><a href="/test">测试 method</a></li>
            <li><a href="/api/users">获取用户列表 (JSON)</a></li>
            <li><a href="/api/user?id=1">获取用户详情 (JSON)</a></li>
            <li><a href="/admin">管理页面 (需要授权)</a></li>
            <li><a href="/notfound">404 测试</a></li>
        </ul>
    `);
});

// 2. /test 路由 - 区分 GET 和 POST
app.get("/test", (req, res) => {
    res.send('<h1>收到 GET 请求</h1><p><a href="/">返回首页</a></p>');
});

app.post("/test", (req, res) => {
    res.send("<h1>你会发 POST 了，恭喜！</h1>");
});

// 3. API 路由 - 获取所有用户（JSON）
app.get("/api/users", (req, res) => {
    res.json({
        success: true,
        data: users,
    });
});

// 4. API 路由 - 按 id 查询单个用户
app.get("/api/user", (req, res) => {
    if (!req.query.id) {
        return res.status(400).json({
            success: false,
            message: "缺少用户ID参数",
        });
    }

    // 注意：req.query.id 是字符串，需用 parseInt 转为数字再比较
    let user;
    for (const u of users) {
        if (u.id === parseInt(req.query.id)) {
            user = u;
            break;
        }
    }

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "用户不存在",
        });
    }

    res.json({
        success: true,
        data: user,
    });
});

// 5. 管理页面 - 需要 Authorization 请求头
app.get("/admin", (req, res) => {
    const auth = req.headers.authorization;
    if (auth !== "Bearer Cisco123") {
        return res.status(401).send(`
            <h1>401 未授权</h1>
            <p>请在请求头中添加：Authorization: Bearer Cisco123</p>
        `);
    }
    res.send(`<h1>管理控制台</h1>`);
});

// 6. 404 兜底 - 必须放在所有路由之后
app.use((req, res) => {
    res.status(404).send(`
        <h1>404 - 页面未找到</h1>
        <p>请求的路径 "${req.path}" 不存在</p>
        <p><a href="/">返回首页</a></p>
    `);
});

app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});
