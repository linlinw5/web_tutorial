import express from "express";
import { gracefulShutdown } from "./utils/shutdownConnection.ts";
import { users as apiUsers, blogs as apiBlogs } from "./routes/api/index.ts";
import { users as webUsers } from "./routes/web/index.ts";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));

// Register the following routes here:
//
// 1. Home GET /
//    Return two links:
//    - /users?limit=3&offset=0  -> SSR user list
//    - /users/js                -> CSR user list
//
// 2. Mount API routes
//    app.use("/api/users", apiUsers);
//    app.use("/api/blogs", apiBlogs);
//
// 3. Mount Web routes
//    app.use("/users", webUsers);
//
// 4. 404 fallback route

gracefulShutdown();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
