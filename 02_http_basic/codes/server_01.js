// 演示：最基础的 HTTP 服务器
// 运行：node server_01.js
// 访问：http://localhost:3000

import http from "http";

const port = 3000;

const server = http.createServer((req, res) => {
    // req 是 IncomingMessage（请求对象）
    // res 是 ServerResponse（响应对象）
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.write("<h1>Hello, World!</h1>");
    res.end();
});

server.listen(port, () => {
    console.log(`服务器运行在端口:${port}`);
});
