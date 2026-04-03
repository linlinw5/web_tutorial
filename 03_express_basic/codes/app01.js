// Demo: Minimal Express server + middleware basics
// Run: nodemon codes/app01.js (execute from the 03_express_basic/ directory)
// Visit: http://localhost:3000

import express from "express";

const app = express();
const port = 3000;

// ── Middleware: applies to all requests ───────────────────────
// app.use() does not distinguish HTTP methods; commonly used for global features such as logging, auth, and body parsing
app.use((req, res, next) => {
  console.log(`Recieved ${req.method} request: ${req.path}`);
  console.log(`Query params:`, req.query);
  next(); // next() must be called, otherwise the request stops here and the client keeps waiting
});

// ── Route: handles only GET / ─────────────────────────────────
// app.get() matches only the GET method + exact path
app.get("/", (req, res) => {
  res.send("<h1>Welcome to Express Server</h1>");
  // The route has finished handling the request; no need to call next()
});

app.listen(port, () => {
  console.log(`Server is running on: http://localhost:${port}`);
});

// ─────────────────────────────────────────────────────────
// app.use()  —— Middleware, does not distinguish HTTP methods, and matches by path prefix
//   Common uses: request logging, body parsing, authentication, static files, error handling
//
// app.get()  —— Route, handles only GET requests, exact path matching
// app.post() —— Route, handles only POST requests
// app.put() / app.delete() work the same way
// ─────────────────────────────────────────────────────────
