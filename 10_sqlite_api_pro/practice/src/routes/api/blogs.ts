import express from "express";

const router = express.Router();

// GET /api/blogs — 占位接口，留待后续章节实现
router.get("/", (req, res) => {
    res.json({ message: "Blogs endpoint is under construction." });
});

export default router;
