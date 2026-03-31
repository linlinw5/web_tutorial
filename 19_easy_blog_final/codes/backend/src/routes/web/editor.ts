import express from 'express';
import { getAllTags, getTagsByBlogId } from '../../db/tags.ts';
import { getBlogById } from '../../db/blogs.ts';
import { User } from "../../models/User.ts";
const router = express.Router();

router.get('/blogs', async (req, res) => {
    const tags = await getAllTags();
    res.render('admin', { title: 'Manage Blogs - editor', tags, user: req.user, script_name: 'editor_admin_blogs.js' });
});

router.get('/blogs/add', async (req, res) => {
    try {
        const tags = await getAllTags();
        res.render('admin', { title: 'Add Blog', tags, user: req.user, script_name: 'add_blog.js', content_ejs: 'content_add_blog' });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/blogs/edit/:id', async (req, res) => {
    const blogId = Number(req.params.id);
    const userId = (req.user as User).id;
    try {
        const tags = await getAllTags();
        const blog = await getBlogById(blogId);

        if (!blog) {
            return res.status(404).render('error', { image_name: '404.jpg', tags, user: req.user }); // return 必须加，否则下一行 blog.user_id 会抛异常
        }
        // 检查用户是否有权限编辑这个blog
        if (blog.user_id !== userId && (req.user as User).group_id !== 1) {
            return res.status(403).render('error', { title:'没有权限编辑此blog',image_name: '403.jpg', user: req.user, tags });
        }
        const blogTags = await getTagsByBlogId(blogId);
        blog.tags = blogTags.map(tag => tag.id); 
  
        res.render('admin', { title: 'Edit Blog', tags, user: req.user, script_name: 'edit_blog.js', blog, content_ejs: 'content_edit_blog' });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});

export default router;