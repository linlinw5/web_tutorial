import express from "express";
import { getAllBlogs, getBlogById, deleteBlogById, getBlogsByTag, createBlog, updateBlog, getBlogsByUserId } from "../../db/blogs.ts";
import { isAuthenticated } from "../../utils/authCheck.ts";
import { User } from "../../models/User.ts";
const router = express.Router();

// 原则，这里是具体的路由，要对查询结果做判断，如果查询到的blog数量为0，则返回404错误；
// 如果查询本身出错，则返回500错误

// 查
router.get("/", async (req, res) => {
    const offset = Number(req.query.offset as string) || 0; // 默认从第1条数据开始
    const limit = Number(req.query.limit as string) || 6; // 默认每页6条数据
    try {
        const result = await getAllBlogs(offset, limit);
        res.json(result);
    } catch (error) {
        console.error("Error fetching blogs:", error);
        res.status(500).json({ error: "Failed to fetch blogs" });
    }
});

router.get("/byUser", isAuthenticated, async (req, res) => {
    const userId = (req.user as User).id; // 从用户信息中获取user_id
    const { offset = 0, limit = 10 } = req.query;
    try {
        const result = await getBlogsByUserId(userId, Number(offset), Number(limit));
        res.json(result);
    } catch (error) {
        console.error("Error fetching blogs by user:", error);
        res.status(500).json({ error: "Failed to fetch blogs by user" });
    }
});

// 根据tag查blog
router.get("/tag/:tag", async (req, res) => {
    const tagId = Number(req.params.tag);
    const { offset = 0, limit = 10 } = req.query;
    try {
        const result = await getBlogsByTag(tagId, Number(offset), Number(limit));
        if (result.total > 0) {
            res.json(result);
        } else {
            res.status(404).json({ message: "No blogs found for this tag" });
        }
    } catch (error) {
        console.error("Error fetching blogs by tag:", error);
        res.status(500).json({ error: "Failed to fetch blogs by tag" });
    }
});

// 查单个blog
router.get("/:id", async (req, res) => {
    const blogId = Number(req.params.id);
    try {
        const result = await getBlogById(blogId);
        if (result) {
            res.json(result);
        } else {
            res.status(404).json({ message: "Blog not found" });
        }
    } catch (error) {
        console.error("Error fetching blog:", error);
        res.status(500).json({ error: "Failed to fetch blog" });
    }
});

// 删
router.delete("/:id", isAuthenticated, async (req, res) => {
    const blogId = Number(req.params.id);
    const userId = (req.user as User).id;
    try {
        // 添加权限检查，确保只有博客的作者或管理员可以删除
        const blog = await getBlogById(blogId);
        if (!blog) {
            res.status(404).json({ message: "Blog not found" });
        } else if (blog.user_id === userId || (req.user as User).group_id === 1) {
            await deleteBlogById(blogId);
            res.status(204).send();
        } else {
            res.status(403).json({ message: "You do not have permission to delete this blog" });
        }
    } catch (error) {
        console.error("Error deleting blog:", error);
        res.status(500).json({ error: "Failed to delete blog" });
    }
});


// 增
router.post("/", isAuthenticated, async (req, res) => {
    let { title, content, img, published = 1, tags } = req.body;
    let user_id = (req.user as User).id; // 从用户信息中获取user_id
    if (!title || !content || !img) {
        res.status(400).json({ message: "Title, content and img are required" });
        return; // 校验失败后必须 return，否则后续代码仍会执行
    }
    try {
        const result = await createBlog(title, content, img, published, user_id, tags); // createBlog 是 async，必须 await
        res.status(201).json({ success: true, id: result, title, published, user_id, img });
    } catch (error) {
        console.error("Error creating blog:", error);
        res.status(500).json({ error: "Failed to create blog" });
    }
});


// 改
router.patch("/:id", isAuthenticated, async (req, res) => {
    const blogId = Number(req.params.id);
    let { title, content, img, published, tags } = req.body;
    let user_id = (req.user as User).id; // 从用户信息中获取user_id
    if (!title || !content || !img) {
        res.status(400).json({ error: "Title, content and img are required" });
        return; // 校验失败后必须 return
    }
    try {
        // 检查用户是否为作者或者管理员
        const blog = await getBlogById(blogId);
        if (!blog) {
            res.status(404).json({ success: false, message: "Blog not found" });
            return; // blog 不存在时必须 return，否则下一行 blog.user_id 会抛异常
        }
        if (blog.user_id !== user_id && (req.user as User).group_id !== 1) {
            res.status(403).json({ success: false, message: "You do not have permission to edit this blog" });
            return; // 权限校验失败后必须 return
        }
        await updateBlog(blogId, title, content, img, published, blog.user_id, tags);
        res.json({ success: true, message: "Blog updated successfully" });

    } catch (error) {
        console.error("Error updating blog:", error);
        res.status(500).json({ error: "Failed to update blog" });
    }
});

export default router;
