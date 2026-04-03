import { ConnectionManager } from "./ConnectionManager.ts";
import type { Tag } from "../types/tag.ts";
import { options } from "../config.ts";

// Get the database instance for the current environment
const dbManager = ConnectionManager.getInstance(options.env);

async function getAllTags(): Promise<Tag[]> {
  try {
    const db = await dbManager.getConnection();
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
    const db = await dbManager.getConnection();
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

let tagsCache: Tag[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5-minute cache duration

// getAllTags function with cache
export async function getAllTagsCached(): Promise<Tag[]> {
  const now = Date.now();
  // Check whether cache is valid
  if (tagsCache && now - cacheTimestamp < CACHE_TTL) {
    return tagsCache;
  }
  // Cache expired or missing, fetch data again
  tagsCache = await getAllTags();
  cacheTimestamp = now;
  return tagsCache;
}

// Function to clear cache (call when tags are modified)
export function clearTagsCache() {
  tagsCache = null;
  cacheTimestamp = 0;
}
