import express from "express";
import { pool } from "./db/ConnectionManager.ts";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Implement the following routes here:
//
// GET  /                  - Welcome message
//
// GET  /api/users         - Paginated query for user list
//                           Support ?page=1&limit=3 query parameters
//                           offset = (page - 1) * limit
//                           Query COUNT(*) at the same time to get the total count
//                           Return { total, data }
//
// GET  /api/users/:id     - Query a single user
//                           JOIN groups table, return group_name field
//                           Return 404 if not found
//
// POST /api/users         - Add a new user
//                           Required fields: username, email, password
//                           group_id defaults to 3 (Guest)
//                           Use RETURNING * to directly return the new record
//                           Return 201
//
// PATCH /api/users/:id    - Change password
//                           body: { password }
//                           Use result.rows.length to determine if the record is found
//                           Use RETURNING * to get the update result
//
// DELETE /api/users/:id   - Delete user
//                           Use RETURNING * to determine if the record exists
//                           Success returns 204 No Content, not found returns 404
//
// Fallback route - all unmatched paths return 404

// Graceful shutdown: listen for SIGINT / SIGTERM, call pool.end() then process.exit(0)

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
