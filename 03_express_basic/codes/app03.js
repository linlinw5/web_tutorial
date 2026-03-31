// 演示：EJS 模板引擎 + 静态文件托管
// 运行：nodemon codes/app03.js（从 03_express_basic/ 目录下执行）
// 访问：http://localhost:3000

import express from "express";
import { blogs } from "./data.js";

const app = express();
const port = 3000;

// 模板引擎配置（路径相对于运行目录，即 03_express_basic/）
app.set("view engine", "ejs");
app.set("views", "./views");

// 静态文件托管：public/ 目录下的文件可通过 /css/... /images/... 访问
app.use(express.static("public"));

// 1. 首页 - 渲染博客列表
app.get("/", (req, res) => {
    res.render("home.ejs", { title: "博客首页", blogs });
});

// 2. 博客详情页
app.get("/blog", (req, res) => {
    const blogId = parseInt(req.query.id);
    if (isNaN(blogId)) {
        return res.status(400).render("error.ejs", {
            title: "错误 - 无效的博客ID",
            message: "请提供有效的博客ID",
        });
    }

    let result;
    for (let item of blogs) {
        if (item.id === blogId) {
            result = item;
            break;
        }
    }

    if (result) {
        res.render("blog.ejs", { blog: result });
    } else {
        res.status(404).render("error.ejs", {
            title: "404 - 页面未找到",
            message: `ID 为 ${blogId} 的博客未找到`,
        });
    }
});

// 3. 404 兜底
app.use((req, res) => {
    res.status(404).render("error.ejs", {
        title: "404 - 页面未找到",
        message: `${req.path} 未找到`,
    });
});

app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});
