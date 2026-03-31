// 演示：在终端观察 req.headers 和 req.method
// 运行：node server_02.js
// 访问：http://localhost:3000，观察终端输出

import http from "http";

const port = 3000;

const server = http.createServer((req, res) => {
    console.log("===================== req.headers =====================");
    console.log(req.headers);
    console.log("===================== req.method ======================");
    console.log(req.method);

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.write("<h1>Hello, World!</h1>");
    res.end();
});

server.listen(port, () => {
    console.log(`服务器运行在端口:${port}`);
});
