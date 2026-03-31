import express from 'express';
import { getAllTags } from '../../db/tags.ts';
import { getAllUsers } from '../../db/users.ts';
const router = express.Router();

// 管理员路由
router.get('/blogs', async (req, res) => {
    const tags = await getAllTags();
    res.render('admin', { title: 'Manage Blogs - Administrator', tags, user: req.user, script_name: 'admin_blogs.js' });
});

router.get('/users', async (req, res) => {
    const limit = Number(req.query.limit) || 5; // 默认每页10条数据
    const offset = Number(req.query.offset) || 0; // 默认从第0条数据开始
    try {
        const tags = await getAllTags();
        const users = await getAllUsers(limit, offset);
        // 组织分页信息
        const total = users.total
        let totalPages = Math.ceil(total / limit); // 计算总页数
        let currentPage = Math.floor(offset / limit) + 1; // 计算当前页码
        let startPage = Math.max(currentPage - 2, 1);
        let endPage = Math.min(startPage + 4, totalPages); // 最多显示5页
        const pagination = {
            limit,
            offset,
            currentPage,
            startPage,
            endPage
        };
        res.render('admin', { title: 'Manage Users - Administrator', tags, user: req.user, data: users.data, pagination, script_name: 'admin_users.js', content_ejs: 'content_users' });
    } catch (error) {
        console.error("Error fetching tags:", error);
        res.status(500).send("Internal Server Error");
    }
});

export default router;