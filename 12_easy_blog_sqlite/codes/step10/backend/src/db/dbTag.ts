import { getConnection } from "./ConnectionManager.ts";
import type { Tag } from "../types";

// 不带缓存的原始 getAllTags 函数，不要export了，不直接使用
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


// getAllTags()经常需要被调用，因为header.ejs的导航条需要用，
// 当任何页面被访问时，都需要向数据库查询，为减轻数据库压力，设置缓存机制，5分钟之内的请求，直接返回缓存数据
// 实际上，本案例并未设计tags的增删改功能，tags永远就这么多，所以缓存时间设多久都无所谓

let tagsCache: Tag[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5分钟缓存时间

// 带缓存的 getAllTags 函数
export async function getAllTags(): Promise<Tag[]> {
    const now = Date.now();
    // 检查缓存是否有效
    if (tagsCache && (now - cacheTimestamp < CACHE_TTL)) {
        return tagsCache;
    }
    // 缓存过期或不存在，重新获取数据
    tagsCache = await origin_getAllTags();
    cacheTimestamp = now;
    return tagsCache;
}

// 清除缓存的函数（将来在修改 tags 时调用）
export function clearTagsCache() {
    tagsCache = null;
    cacheTimestamp = 0;
}