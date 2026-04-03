// Demo: The impact of different Content-Type response headers on browser rendering
// Run: node server_04.js
// Switch the comments of the three Content-Type below, restart the server and access http://localhost:3000 to observe the differences

import http from "http";

const port = 3000;

const users = [
  { id: 1, name: "Alice", age: 25 },
  { id: 2, name: "Bob", age: 30 },
  { id: 3, name: "Charlie", age: 35 },
];

const server = http.createServer((req, res) => {
  res.statusCode = 200;

  // switch the comments of the three Content-Type below, restart the server and access http://localhost:3000 to observe the differences
  // res.setHeader("Content-Type", "text/plain");      // Plain Text: show the raw text without formatting
  // res.setHeader("Content-Type", "text/html");       // HTML: render the text as HTML, but without formatting
  res.setHeader("Content-Type", "application/json"); // JSON: render the text as JSON, and the browser will format it for better readability

  res.write(JSON.stringify(users));
  res.end();
});

server.listen(port, () => {
  console.log(`Server is running on:${port}`);
});
