import express from "express";

const router = express.Router();

// GET /api/blogs - Placeholder endpoint for later chapters
router.get("/", (req, res) => {
  res.json({ message: "Blogs endpoint is under construction." });
});

export default router;
