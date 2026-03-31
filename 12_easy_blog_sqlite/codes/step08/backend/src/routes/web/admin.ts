import express from 'express';

const router = express.Router();

// 管理员路由
router.get("/", (req, res) => {
    res.json({message: "admin route home, to be implemented..."});
});

export default router;