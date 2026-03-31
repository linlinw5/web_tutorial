import { getAllBlogs, getBlogById, getBlogsByTagId, deleteBlogById, createBlog, updateBlogById } from "./dbBlog.ts";
import { getAllTags, getTagsByBlogId } from "./dbTag.ts";

async function test_getAllBlogs(limit: number, offset: number) {
    const result = await getAllBlogs(offset, limit);
    console.log(result);
}

async function test_getBlogById(id: number) {
    const result = await getBlogById(id);
    console.log(result);
}

async function test_getBlogsByTagId(tagId: number, limit: number, offset: number) {
    const result = await getBlogsByTagId(tagId, offset, limit);
    console.log(result);
}

async function test_deleteBlogById(id: number) {
    const result = await deleteBlogById(id);
    console.log(result);
}

async function test_getAllTags() {
    const result = await getAllTags();
    console.log(result);
}

async function test_getTagsByBlogId(blogId: number) {
    const result = await getTagsByBlogId(blogId);
    console.log(result);
}

// test_getAllBlogs(5, 0);
// test_getBlogById(1);
// test_getBlogsByTagId(1, 5, 0);
// test_deleteBlogById(59);
// test_getAllTags();
// test_getTagsByBlogId(1);

async function test_createBlog() {
    const newBlog = {
        title: "Test Blog",
        content: "This is a test blog content.",
        img: "/images/a4.avif",
        user_id: 1,
        published: true,
        tags: [1, 2]
    };

    const result = await createBlog(
        newBlog.title,
        newBlog.content,
        newBlog.img,
        newBlog.user_id,
        newBlog.published,
        newBlog.tags
    );
    console.log(result);
}
// test_createBlog();

async function test_updateBlogById() {
    const blogId = 60; // 要更新的博客ID
    const updatedBlog = {
        title: "Updated Test Blog",
        content: "This is the updated content.",
        img: "/images/a1.avif",
        user_id: 1,
        published: false,
        tags: [2, 3]
    };
    const result = await updateBlogById(
        blogId,
        updatedBlog.title,
        updatedBlog.content,
        updatedBlog.img,
        updatedBlog.user_id,
        updatedBlog.published,
        updatedBlog.tags
    );
    console.log(result);
}
test_updateBlogById();