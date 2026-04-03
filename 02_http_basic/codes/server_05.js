// Demo: Complete routing + query parsing + simple auth
// Run: node server_05.js
// Access: http://localhost:3000, start testing from the homepage links

import { createServer } from "http";
import { parse as urlParser } from "url";

const PORT = 3000;

const users = [
  { id: 1, name: "Alice", age: 25 },
  { id: 2, name: "Bob", age: 30 },
  { id: 3, name: "Charlie", age: 35 },
];

const server = createServer((req, res) => {
  const headers = req.headers;
  const method = req.method;
  const parsedUrl = urlParser(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  // GET /  Home
  if (pathname === "/") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.write("<h1>Hello, homepage!</h1>");
    res.write("<ul>");
    res.write("<li><a href='/test'>Test Page</a></li>");
    res.write("<li><a href='/users'>Users List</a></li>");
    res.write("<li><a href='/user?id=1'>User 1</a></li>");
    res.write("<li><a href='/user?id=2'>User 2</a></li>");
    res.write("<li><a href='/user?id=3'>User 3</a></li>");
    res.write("<li><a href='/admin'>Admin Page (Need authentication)</a></li>");
    res.write("</ul>");
    res.end();
    return;
  }

  // /test  Distinguish between GET and POST, return 405 for other methods
  if (pathname === "/test") {
    if (method === "GET") {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.write("<h1>GET request recieved</h1>");
    } else if (method === "POST") {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.write("<h1>POST request recieved</h1>");
    } else {
      res.statusCode = 405;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.write("<h1>405 Method Not Allowed</h1>");
    }
    res.end();
    return;
  }

  // GET /users returns an HTML list of all users
  if (pathname === "/users") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.write("<h1>Users List</h1><ul>");
    for (const user of users) {
      res.write(`<li>ID: ${user.id}, Name: ${user.name}, Age: ${user.age}</li>`);
    }
    res.write("</ul>");
    res.end();
    return;
  }

  // /user?id=1  Query user by id, return HTML
  if (pathname === "/user") {
    const userId = Number(query.id);
    if (!userId) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "text/html");
      res.write("<h1>400 Bad Request: id query param is required</h1>");
      res.end();
      return;
    }
    const user = users.find((u) => u.id === userId);
    if (user) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      res.write(`<h1>User Details</h1><p>Name: ${user.name}</p><p>Age: ${user.age}</p>`);
    } else {
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/html");
      res.write("<h1>404 User Not Found</h1>");
    }
    res.end();
    return;
  }

  // GET /api/users  Returns JSON of all users
  if (pathname === "/api/users") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify(users));
    res.end();
    return;
  }

  // /api/user?id=1  Query user by id, return JSON
  if (pathname === "/api/user") {
    const userId = Number(query.id);
    if (!userId) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.write(JSON.stringify({ error: "Bad Request: id query param is required" }));
      res.end();
      return;
    }
    const user = users.find((u) => u.id === userId);
    if (user) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.write(JSON.stringify(user));
    } else {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.write(JSON.stringify({ error: "User Not Found" }));
    }
    res.end();
    return;
  }

  // /admin requires authentication information to access
  if (pathname === "/admin") {
    const authorized = query.password === "Cisco123" || headers.authorization === "Bearer Cisco123";

    if (authorized) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      res.write("<h1>Welcome to the Admin Page</h1>");
    } else {
      res.statusCode = 403;
      res.setHeader("Content-Type", "text/html");
      res.write("<h1>403 Forbidden</h1>");
    }
    res.end();
    return;
  }

  // Other → 404
  res.statusCode = 404;
  res.setHeader("Content-Type", "text/html");
  res.write(`<h1>404 Not Found: ${pathname}</h1>`);
  res.end();
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
});
