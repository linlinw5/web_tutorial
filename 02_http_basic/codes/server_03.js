// Demo: Parse the request URL to extract pathname and query parameters
// Run: node server_03.js
// Access: http://localhost:3000/?id=1&name=zhangsan, then check the terminal for the output

import http from "http";
import url from "url";

const port = 3000;

const server = http.createServer((req, res) => {
  console.log("===================== req.url =========================");
  console.log(req.url);

  // The second parameter is true, which means to parse the query string into an object
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
  console.log(`Server is running on:${port}`);
});
