import express from 'express';

const router = express.Router();

// Admin route
router.get("/", (req, res) => {
    res.json({message: "admin route home, to be implemented..."});
});

export default router;