import { getConnection } from "./ConnectionManager.ts";
import type { Blog, BlogsResponse, CUDResponse } from "../types";


export async function getAllBlogs(offset: number, limit: number): Promise<BlogsResponse> {
    try {
        const db = await getConnection();
        const query = `
            SELECT b.id, b.title, b.content, b.img, b.published, b.user_id, b.created_at, u.username
            FROM blogs as b
            JOIN users u on u.id = b.user_id
            ORDER BY b.created_at DESC
            LIMIT ? OFFSET ?
        `;
        const blogs = await db.all(query, [limit, offset]);
        const totalBlogs = await db.get("SELECT COUNT(*) as count FROM blogs");
        return { total: totalBlogs.count, data: blogs };
    } catch (error) {
        console.error("Error fetching blogs:", error);
        throw new Error("Failed to fetch blogs");
    }
}

export async function getBlogById(id: number): Promise<Blog | undefined> {
    try {
        const db = await getConnection();
        const query = `
            SELECT b.id, b.title, b.content, b.img, b.published, b.user_id, b.created_at, u.username
            FROM blogs as b
            JOIN users u on u.id = b.user_id
            WHERE b.id = ?
        `;
        const blog = await db.get(query, [id]);
        return blog;
    } catch (error) {
        console.error("Error fetching blog by ID:", error);
        throw new Error("Failed to fetch blog");
    }
}

export async function getBlogsByTagId(tagId: number, offset: number, limit: number): Promise<BlogsResponse> {
    try {
        const db = await getConnection();
        const query = `
            SELECT b.id, b.title, b.content, b.img, b.user_id, b.published, b.created_at, u.username
            FROM blogs b
            JOIN users u ON b.user_id = u.id
            JOIN blog_tags bt ON b.id = bt.blog_id
            WHERE bt.tag_id = ?
            ORDER BY b.created_at DESC
            LIMIT ? OFFSET ?
        `;
        const blogs = await db.all(query, [tagId, limit, offset]);
        const totalBlogs = await db.get("SELECT COUNT(*) as count FROM blogs b JOIN blog_tags bt ON b.id = bt.blog_id WHERE bt.tag_id = ?", [tagId]);
        return { total: totalBlogs.count, data: blogs };
    } catch (error) {
        console.error("Error fetching blogs by tag:", error);
        throw new Error("Failed to fetch blogs by tag");
    }
}

export async function deleteBlogById(id: number): Promise<CUDResponse> {
    try {
        const db = await getConnection();
        const result = await db.run("DELETE FROM blogs WHERE id = ?", [id]);
        if (result.changes && result.changes > 0) {
            return { success: true, message: "Blog deleted successfully" };
        } else {
            return { success: false, error: "Blog not found" };
        }
    } catch (error) {
        console.error("Error deleting blog:", error);
        throw new Error("Failed to delete blog");
    }
}
