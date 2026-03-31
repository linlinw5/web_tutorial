// 演示：最简 Express 服务器 + 中间件基础
// 运行：nodemon codes/app01.js（从 03_express_basic/ 目录下执行）
// 访问：http://localhost:3000

import express from 'express';

const app = express();
const port = 3000;

// ── 中间件：对所有请求生效 ──────────────────────────────────
// app.use() 不区分 HTTP 方法，常用于全局功能：日志、认证、请求体解析等
app.use((req, res, next) => {
    console.log(`收到 ${req.method} 请求: ${req.path}`);
    console.log(`查询参数:`, req.query);
    next();  // 必须调用 next()，否则请求在此中止，客户端会一直等待
});

// ── 路由：只处理 GET / ─────────────────────────────────────
// app.get() 只匹配 GET 方法 + 精确路径
app.get('/', (req, res) => {
    res.send('<h1>欢迎使用Express服务器！</h1>');
    // 路由已处理完毕，无需调用 next()
});

app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});


// ─────────────────────────────────────────────────────────
// app.use()  —— 中间件，不区分 HTTP 方法，路径为前缀匹配
//   常见用途：请求日志、请求体解析、认证、静态文件、错误处理
//
// app.get()  —— 路由，只处理 GET 请求，路径精确匹配
// app.post() —— 路由，只处理 POST 请求
// app.put() / app.delete() 同理
// ─────────────────────────────────────────────────────────
