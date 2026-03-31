import express from "express";
import { closeConnection } from "./db/ConnectionManager.ts";
import { blogs as apiBlogsRoute } from "./routes/api/index.ts";
import {blogs as webBlogsRoute, admin as webAdminRoute} from "./routes/web/index.ts";

const app = express();
const PORT = 3000;

app.use(express.static("public")); // 指定静态文件的目录
app.set("view engine", "ejs"); // 指定模板引擎
app.set("views", "views"); // 指定视图文件夹 - 存放ejs模板的地方

app.use(express.json()); // 解析JSON请求体
app.use(express.urlencoded({ extended: true })); // 解析URL编码的请求体

app.get("/", (req, res) => { 
    res.redirect("/web/blogs");    // 重定向到WEB首页
});

// 配置API路由
app.use("/api/blogs", apiBlogsRoute);

// 配置WEB路由
app.use("/web/blogs", webBlogsRoute);
app.use("/web/admin", webAdminRoute);

// 处理未找到的路由
app.use((req, res) => {
    res.status(404).render("error", {
        title: "Page Not Found",
        image_name: "404.jpg",
    });
});

// 当接收到 SIGINT 或 SIGTERM 信号时，优雅地关闭数据库连接
process.on("SIGINT", async () => {
    console.log("Received SIGINT. Shutting down gracefully...");
    await closeConnection();
    process.exit(0);
});

process.on("SIGTERM", async () => {
    console.log("Received SIGTERM. Shutting down gracefully...");
    await closeConnection();
    process.exit(0);
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
