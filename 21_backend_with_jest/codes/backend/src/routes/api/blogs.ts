import express from "express";
import { getAllBlogs, getBlogById, getBlogsByTagId, createBlog, deleteBlogById, updateBlogById } from "../../db/blogs.ts";

const router = express.Router();

// 查所有blog
router.get("/", async (req, res) => {
    const { offset = 0, limit = 6 } = req.query;
    try {
        const result = await getAllBlogs(Number(offset), Number(limit));
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch blogs" });
    }
});

// 根据tag查blog
router.get("/tag/:tag", async (req, res) => {
    const tag = req.params.tag;
    const { offset = 0, limit = 6 } = req.query;
    try {
        const result = await getBlogsByTagId(Number(tag), Number(offset), Number(limit));
        res.json(result);
    } catch (error) {
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
            res.status(404).json({ error: "Blog not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch blog" });
    }
});

// 删
router.delete("/:id", async (req, res) => {
    const blogId = Number(req.params.id);
    try {
        const result = await deleteBlogById(blogId);
        if (result.success) {
            res.status(204).send(); // 204 No Content
        } else {
            res.status(404).json({ error: "Blog not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to delete blog" });
    }
});


// 增
router.post("/", async (req, res) => {
    let { title, content, img, published = 1, user_id, tags = [] } = req.body;
    if (!title || !content || !user_id || !img) {
        res.status(400).json({ error: "Title, content, user_id and img are required" });
        return;
    }
    try {
        const result = await createBlog(title, content, img, user_id, Boolean(published), tags);
        if (!result.success) {
            res.status(500).json({ error: "Failed to create blog" });
            return;
        }
        res.status(201).json({ success: true, message: result.message });
    } catch (error) {
        res.status(500).json({ error: "Failed to create blog" });
    }
});


// 改
router.patch("/:id", async (req, res) => {
    const blogId = Number(req.params.id);
    let { title, content, img, published, user_id, tags = [] } = req.body;
    if (!title || !content || !user_id || !img) {
        res.status(400).json({ error: "Title, content, user_id and img are required" });
        return;
    }
    try {
        const result = await updateBlogById(blogId, title, content, img, user_id, Boolean(published), tags);
        if (!result.success) {
            res.status(404).json({ error: result.error });
            return;
        }
        res.json({ success: true, message: "Blog updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to update blog" });
    }
});

export default router;
