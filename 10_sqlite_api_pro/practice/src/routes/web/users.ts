import express from "express";
import { getUsers } from "../../db/dbUsers.ts";

const router = express.Router();

// Implement the following routes here:
//
// GET /users?limit=3&offset=0  - SSR
//   - Read limit and offset from req.query
//   - Call getUsers(limit, offset) to fetch data
//   - Calculate pagination:
//       totalPages  = Math.ceil(users.total / limit)
//       currentPage = Math.floor(offset / limit) + 1
//   - Call res.render("usersPage", { title, content, pagination })
//     where pagination = { totalPages, currentPage, limit }
//
// GET /users/js  - CSR
//   - Do not query database
//   - Directly call res.render("index", { title: "User List with JS Fetch" })
//   - Data is fetched by /public/js/index.js in the browser

export default router;
