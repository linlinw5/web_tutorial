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

// 在这里注册路由：
//
// 1. 首页 GET /
//    返回两个链接：
//    - /users?limit=3&offset=0  → SSR 版用户列表
//    - /users/js                → CSR 版用户列表
//
// 2. 挂载 API 路由
//    app.use("/api/users", apiUsers);
//    app.use("/api/blogs", apiBlogs);
//
// 3. 挂载 Web 路由
//    app.use("/users", webUsers);
//
// 4. 兜底 404 路由

gracefulShutdown();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
