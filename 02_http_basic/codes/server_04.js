// 演示：不同的 Content-Type 响应头对浏览器渲染的影响
// 运行：node server_04.js
// 切换下方三种 Content-Type 注释，重启服务后访问 http://localhost:3000 观察区别

import http from "http";

const port = 3000;

const users = [
    { id: 1, name: "Alice", age: 25 },
    { id: 2, name: "Bob", age: 30 },
    { id: 3, name: "Charlie", age: 35 },
];

const server = http.createServer((req, res) => {
    res.statusCode = 200;

    // 切换以下三行注释，对比浏览器的展示差异：
    // res.setHeader("Content-Type", "text/plain");      // 纯文本：原样显示字符串
    // res.setHeader("Content-Type", "text/html");       // HTML：解析并渲染标签
    res.setHeader("Content-Type", "application/json");   // JSON：浏览器格式化显示

    res.write(JSON.stringify(users));
    res.end();
});

server.listen(port, () => {
    console.log(`服务器运行在端口:${port}`);
});
