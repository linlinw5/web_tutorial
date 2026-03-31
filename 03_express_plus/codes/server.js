import express from "express";
import { blogs, tags } from "./data.js";

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));

// 首页：显示所有博客卡片
app.get("/", (req, res) => {
    res.render("index", { title: "首页", blogs, tags });
});

// 博客详情页：用查询参数 ?id=1 接收博客 id
app.get("/blog", (req, res) => {
    const blogId = Number(req.query.id);
    // Number("abc") = NaN，Number("") = 0，两者都视为无效
    if (isNaN(blogId) || blogId <= 0) {
        return res.status(400).render("error", { title: "Bad Request", image_name: "400.png", tags });
    }

    const blogById = blogs.find(b => b.id === blogId);
    if (!blogById) {
        return res.status(404).render("error", { title: "Blog Not Found", image_name: "404.png", tags });
    }

    res.render("blog", { title: blogById.title, blogById, tags });
});

// 标签页：用路径参数 /tag/:id 接收标签 id，过滤对应博客
app.get("/tag/:id", (req, res) => {
    const tagId = Number(req.params.id);
    if (isNaN(tagId) || tagId <= 0) {
        return res.status(400).render("error", { title: "Bad Request", image_name: "400.png", tags });
    }

    const tag = tags.find(t => t.id === tagId);
    const blogsByTag = blogs.filter(b => b.tag_id === tagId);

    if (!tag || blogsByTag.length === 0) {
        return res.status(404).render("error", { title: "No Blogs Found", image_name: "404.png", tags });
    }

    res.render("tag", { title: tag.name, blogsByTag, tags });
});

// 兜底 404（必须放在所有路由之后）
app.use((req, res) => {
    res.status(404).render("error", { title: "Page Not Found", image_name: "404.png", tags });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
