// Demo：check req.headers and req.method on terminal
// Run：node server_02.js
// Access：http://localhost:3000, then check the terminal for the output of req.headers and req.method

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
  console.log(`Server is running on:${port}`);
});
