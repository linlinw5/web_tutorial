import express from "express";
import { getConnection, closeConnection } from "./db/ConnectionManager.ts";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Implement the following routes here:
//
// GET  /                  - Welcome message
//
// GET  /api/users         - Query user list with pagination
//                           Support query params ?page=1&limit=3
//                           Return { total, page, limit, data }
//
// GET  /api/users/:id     - Query single user (JOIN groups table, return group_name)
//                           Return 404 if not found
//
// POST /api/users         - Add user
//                           Required fields: username, email, password
//                           group_id defaults to 3 (Guest)
//                           Return 201 + new record info
//
// PATCH /api/users/:id    - Update password
//                           body: { password }
//                           Use result.changes to determine whether a record was found
//
// DELETE /api/users/:id   - Delete user
//                           Return 204 No Content on success
//                           Return 404 if not found
//
// Fallback route          - 404

// Graceful shutdown: listen for SIGINT / SIGTERM, then close DB connection before exit

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
