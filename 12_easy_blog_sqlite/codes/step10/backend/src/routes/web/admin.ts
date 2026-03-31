import express from 'express';
import { getAllTags, getTagsByBlogId } from '../../db/dbTag.ts';
import { getBlogById } from '../../db/dbBlog.ts';
import type { Tag, Blog, BlogWithTags  } from '../../types';

const router = express.Router();

// 管理员路由
router.get('/', async (req, res) => {
    try {
        const tags: Tag[] = await getAllTags();
        res.render('home.ejs', { title: 'Admin Dashboard',tags, script_name: 'admin_home.js' });
    } catch (error) {
        res.status(500).render('error', { title: 'Error', image_name: '500.png' });
    }
});

router.get('/add', async (req, res) => {
    try {
        const tags: Tag[] = await getAllTags();
        res.render('addBlog.ejs', { title: 'Add Blog', tags, script_name: 'admin_add_blog.js' });
    } catch (error) {
        res.status(500).render('error', { title: 'Error', image_name: '500.png' });
    }
});

router.get('/edit/:id', async (req, res) => {
    const blogId = Number(req.params.id);
    try {
        const tags: Tag[] = await getAllTags();
        const blog: Blog | undefined = await getBlogById(blogId);
        
        if (!blog) {
            res.status(404).render('error', { title: 'Error', image_name: '404.jpg' });
            return;
        }
        const blogTags: Tag[] = await getTagsByBlogId(blogId);
        // 添加 tags 属性到 blog 对象
        const blogWithTags: BlogWithTags = { ...blog, tags: blogTags.map(tag => tag.id) };
        res.render('editBlog.ejs', { title: 'Edit Blog', tags, script_name: 'admin_edit_blog.js', blog: blogWithTags });

    } catch (error) {
        res.status(500).render('error', { title: 'Error', image_name: '500.png' });
    }
});


export default router;