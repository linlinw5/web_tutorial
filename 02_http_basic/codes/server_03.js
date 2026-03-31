// 演示：解析请求 URL，提取 pathname 和查询参数
// 运行：node server_03.js
// 访问：http://localhost:3000/?id=1&name=zhangsan，观察终端输出

import http from "http";
import url from "url";

const port = 3000;

const server = http.createServer((req, res) => {
    console.log("===================== req.url =========================");
    console.log(req.url);

    // 第二个参数为 true，表示将 query 字符串解析为对象
    const parsedUrl = url.parse(req.url, true);
    console.log("===================== parsedUrl =======================");
    console.log(parsedUrl);
    console.log("pathname:", parsedUrl.pathname);
    console.log("query:", parsedUrl.query);

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.write("<h1>Hello, World!</h1>");
    res.end();
});

server.listen(port, () => {
    console.log(`服务器运行在端口:${port}`);
});
