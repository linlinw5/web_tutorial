// Demo: page routes + API routes + 404 fallback
// Run: nodemon codes/app02.js (execute from the 03_express_basic/ directory)
// Visit: http://localhost:3000

import express from "express";

const app = express();
const port = 3000;

const users = [
  { id: 1, name: "Tom", role: "user" },
  { id: 2, name: "Jerry", role: "admin" },
];

// Middleware - request logging
app.use((req, res, next) => {
  console.log(`Received ${req.method} request: ${req.path}`);
  console.log(`Query params:`, req.query);
  next();
});

// 1. Home route
app.get("/", (req, res) => {
  res.send(`
        <h1>HTTP Demo - Home</h1>
        <ul>
            <li><a href="/test">Test method</a></li>
            <li><a href="/api/users">Get user list (JSON)</a></li>
            <li><a href="/api/user?id=1">Get user details (JSON)</a></li>
            <li><a href="/admin">Admin page (authorization required)</a></li>
            <li><a href="/notfound">404 test</a></li>
        </ul>
    `);
});

// 2. /test route - distinguish GET and POST
app.get("/test", (req, res) => {
  res.send('<h1>Received GET request</h1><p><a href="/">Back to home</a></p>');
});

app.post("/test", (req, res) => {
  res.send("<h1>You can send POST requests now, nice work!</h1>");
});

// 3. API route - get all users (JSON)
app.get("/api/users", (req, res) => {
  res.json({
    success: true,
    data: users,
  });
});

// 4. API route - query a single user by id
app.get("/api/user", (req, res) => {
  if (!req.query.id) {
    return res.status(400).json({
      success: false,
      message: "Missing user ID parameter",
    });
  }

  // Note: req.query.id is a string; use parseInt to convert it to a number before comparison
  let user;
  for (const u of users) {
    if (u.id === parseInt(req.query.id)) {
      user = u;
      break;
    }
  }

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.json({
    success: true,
    data: user,
  });
});

// 5. Admin page - requires Authorization header
app.get("/admin", (req, res) => {
  const auth = req.headers.authorization;
  if (auth !== "Bearer Cisco123") {
    return res.status(401).send(`
            <h1>401 Unauthorized</h1>
            <p>Please add this request header: Authorization: Bearer Cisco123</p>
        `);
  }
  res.send(`<h1>Admin Console</h1>`);
});

// 6. 404 fallback - must be placed after all routes
app.use((req, res) => {
  res.status(404).send(`
        <h1>404 - Page Not Found</h1>
        <p>The requested path "${req.path}" does not exist</p>
        <p><a href="/">Back to home</a></p>
    `);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
