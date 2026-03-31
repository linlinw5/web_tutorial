import { ConnectionManager } from "./ConnectionManager.ts";
import type { Tag } from "../types/tag.ts";
import { options } from "../config.ts";

// 获取当前环境的数据库实例
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
const CACHE_TTL = 5 * 60 * 1000; // 5分钟缓存时间

// 带缓存的 getAllTags 函数
export async function getAllTagsCached(): Promise<Tag[]> {
  const now = Date.now();
  // 检查缓存是否有效
  if (tagsCache && now - cacheTimestamp < CACHE_TTL) {
    return tagsCache;
  }
  // 缓存过期或不存在，重新获取数据
  tagsCache = await getAllTags();
  cacheTimestamp = now;
  return tagsCache;
}

// 清除缓存的函数（将来在修改 tags 时调用）
export function clearTagsCache() {
  tagsCache = null;
  cacheTimestamp = 0;
}
