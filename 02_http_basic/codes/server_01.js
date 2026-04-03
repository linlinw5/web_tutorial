// Demo: Create a simple HTTP server using Node.js
// Run：node server_01.js
// Access：http://localhost:3000

import http from "http";

const port = 3000;

const server = http.createServer((req, res) => {
  // req is IncomingMessage（request object）
  // res is ServerResponse（response object）
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.write("<h1>Hello, World!</h1>");
  res.end();
});

server.listen(port, () => {
  console.log(`Server is running on:${port}`);
});
