import { pool } from "./ConnectionManager.ts";

export async function getAllTags() {
    try {
        const tags = await pool.query("SELECT * FROM tags");
        return tags.rows;
    } catch (error) {
        console.error("Error fetching tags:", error);
        throw error;
    }
}

export async function getTagsByBlogId(blogId: number) {
    try {
        const query = `
        SELECT t.id, t.name
        FROM tags t
        JOIN blog_tags bt ON t.id = bt.tag_id
        WHERE bt.blog_id = $1`;
        const tags = await pool.query(query, [blogId]);
        return tags.rows;
    } catch (error) {
        console.error("Error fetching tags by blog ID:", error);
        throw new Error("Failed to fetch tags");
    }
}