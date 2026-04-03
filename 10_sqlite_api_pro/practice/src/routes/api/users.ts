import express from "express";
import { getUsers, getUserById, createUser, updatePassword, deleteUser } from "../../db/dbUsers.ts";

const router = express.Router();

// Implement the following routes here:
//
// GET /api/users?limit=3&offset=0
//   - Read limit and offset from req.query (both have defaults)
//   - Call getUsers(limit, offset)
//   - Return { total, data }
//
// GET /api/users/:id
//   - Call getUserById(userId)
//   - Return user object if found, otherwise return 404
//
// POST /api/users
//   - Read username, email, password, group_id from req.body (default 3)
//   - Validate required fields; return 400 if missing
//   - Call createUser(...), return 201
//
// PATCH /api/users/:id
//   - Read password from req.body
//   - Call updatePassword(userId, password)
//   - Use result.changes to determine whether record exists; return 404 if not found
//
// DELETE /api/users/:id
//   - Call deleteUser(userId)
//   - Return 204 No Content on success, 404 if not found

export default router;
