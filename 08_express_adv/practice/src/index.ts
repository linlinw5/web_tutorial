import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

// Complete the following setup here:
//
// 1. CORS configuration (allow only http://localhost:5500)
// 2. Middleware: express.json(), express.urlencoded(), express.static("public")
//
// Data layer:
//   interface User { id, name, email, image }
//   let users: User[] = [...] // In-memory mock database with three initial records
//
// Routes (full CRUD):
//   GET    /               - Welcome message
//   GET    /api/users      - Get all users
//   GET    /api/users/:id  - Get single user (return 404 if not found)
//   POST   /api/users      - Add user (generate id with Date.now())
//   PUT    /api/users/:id  - Update user (return 404 if not found)
//   DELETE /api/users/:id  - Delete user (return 404 if not found)
//   Fallback route         - Return 404

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
