import { getAllBlogs, getBlogById, getBlogsByTagId, deleteBlogById } from "./dbBlog.ts";
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
test_getTagsByBlogId(1);