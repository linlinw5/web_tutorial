import { getConnection } from "./ConnectionManager.ts";
import type { Tag } from "../types";

export async function getAllTags(): Promise<Tag[]> {
    try {
        const db = await getConnection();
        const tags = await db.all("SELECT id, name FROM tags");
        // console.log(tags);
        return tags;
    } catch (error) {
        console.error("Error fetching tags:", error);
        throw error;
    }
}

export async function getTagsByBlogId(blogId: number): Promise<Tag[]> {
    try {
        const db = await getConnection();
        const query = `
        SELECT t.id, t.name
        FROM tags t
        JOIN blog_tags bt ON t.id = bt.tag_id
        WHERE bt.blog_id = ?`;
        const tags = await db.all(query, [blogId]);
        return tags;
    } catch (error) {
        console.error("Error fetching tags by blog ID:", error);
        throw new Error("Failed to fetch tags");
    }
}