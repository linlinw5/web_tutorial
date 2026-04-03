import express from 'express';
import { getAllTags, getTagsByBlogId } from '../../db/tags.ts';
import { getBlogById } from '../../db/blogs.ts';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const tags = await getAllTags();
        res.render('index', { title: 'Easy Blog - Home', script_name: 'index.js', tags, user: req.user });
    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/tags', async (req, res) => {
    const tag = Number(req.query.tag);
    try {
        const tags = await getAllTags();
        let tagName = tags.find(t => t.id === tag)?.name || 'Unknown';
        res.render('index', { title: `Easy Blog - ${tagName}`, script_name: 'tag.js', tags, user: req.user });
    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);
    try {
        const tags = await getAllTags();
        const blog = await getBlogById(id);
        const blogTags = await getTagsByBlogId(id);
        res.render('blog', { title: `Easy Blog - ${blog.title}`, tags, blog, blogTags, user: req.user });
    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).send('Internal Server Error');
    }
});

export default router;