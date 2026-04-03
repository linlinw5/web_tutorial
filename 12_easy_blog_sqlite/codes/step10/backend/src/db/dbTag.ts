import { getConnection } from "./ConnectionManager.ts";
import type { Tag } from "../types";

// Original getAllTags function without caching; do not export it because it is not used directly
async function origin_getAllTags(): Promise<Tag[]> {
    try {
        const db = await getConnection();
        const tags = await db.all("SELECT id, name FROM tags");
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
            WHERE bt.blog_id = ?
        `;
        const tags = await db.all(query, [blogId]);
        return tags;
    } catch (error) {
        console.error("Error fetching tags by blog ID:", error);
        throw new Error("Failed to fetch tags");
    }
}


// getAllTags() is called frequently because the navigation bar in header.ejs needs it
// Every page visit would otherwise query the database. To reduce database pressure, use a cache mechanism and return cached data for requests within five minutes
// In this example, tags do not have create, update, or delete features. The set of tags is fixed, so the cache duration is not important

let tagsCache: Tag[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // Cache TTL: 5 minutes

// Cached getAllTags function
export async function getAllTags(): Promise<Tag[]> {
    const now = Date.now();
    // Check whether the cache is still valid
    if (tagsCache && (now - cacheTimestamp < CACHE_TTL)) {
        return tagsCache;
    }
    // If the cache has expired or does not exist, fetch the data again
    tagsCache = await origin_getAllTags();
    cacheTimestamp = now;
    return tagsCache;
}

// Function to clear the cache (to be called when tags are changed in the future)
export function clearTagsCache() {
    tagsCache = null;
    cacheTimestamp = 0;
}