import { pool } from "./ConnectionManager.ts";

// 原则：查表只返回结果，不对结果做进一步判断，例如是否找到对应ID的数据;
// 如果查表结果为undefined或null，则返回undefined或null
// 如果查询本身出错，则抛出错误，交给上层处理

export async function getBlogById(id: number) {
    try {
        const query = `
        SELECT b.id, b.title, b.content, b.img, b.published, b.user_id, b.created_at, u.username, u.id as user_id
        FROM blogs as b
        JOIN users u on u.id = b.user_id
        WHERE b.id = $1`;
        const blog = await pool.query(query, [id]);
        return blog.rows[0];
    } catch (error) {
        console.error("Error fetching blog by ID:", error);
        throw new Error("Failed to fetch blog");
    }
}

export async function getAllBlogs(offset: number = 0, limit: number = 6) {
    try {
        const query = `
            SELECT b.id, b.title, b.content, b.img, b.user_id, b.published, b.created_at, u.username, u.id as user_id
            FROM blogs b
            JOIN users u ON b.user_id = u.id
            ORDER BY b.created_at DESC
            LIMIT $1 OFFSET $2
        `;
        const blogs = await pool.query(query, [limit, offset]);
        const totalBlogs = await pool.query("SELECT COUNT(*) as count FROM blogs");
        return { total: totalBlogs.rows[0].count, data: blogs.rows };
    } catch (error) {
        console.error("Error fetching blogs:", error);
        throw new Error("Failed to fetch blogs");
    }
}

export async function deleteBlogById(id: number) {
    try {
        const result = await pool.query("DELETE FROM blogs WHERE id = $1 RETURNING *", [id]);
        return result.rows[0];
    } catch (error) {
        console.error("Error deleting blog:", error);
        throw new Error("Failed to delete blog");
    }
}

export async function getBlogsByTag(tagId: number, offset: number = 0, limit: number = 10) {
    try {
        const query = `
            SELECT b.id, b.title, b.img, b.user_id, b.published, b.created_at, u.username
            FROM blogs b
            JOIN users u ON b.user_id = u.id
            JOIN blog_tags bt ON b.id = bt.blog_id
            WHERE bt.tag_id = $1
            ORDER BY b.created_at DESC
            LIMIT $2 OFFSET $3
        `;
        const blogs = await pool.query(query, [Number(tagId), Number(limit), Number(offset)]);
        const totalBlogs = await pool.query("SELECT COUNT(*) as count FROM blogs b JOIN blog_tags bt ON b.id = bt.blog_id WHERE bt.tag_id = $1", [Number(tagId)]);
        return { total: totalBlogs.rows[0].count, data: blogs.rows };
    } catch (error) {
        console.error("Error fetching blogs by tag:", error);
        throw new Error("Failed to fetch blogs by tag");
    }
}

export async function createBlog(title: string, content: string, img: string, published: number, user_id: number, tags?: number[]) {
    try {
        const result = await pool.query(
            "INSERT INTO blogs (title, content, img, published, user_id ) VALUES ($1, $2, $3, $4, $5) RETURNING id",
            [title, content, img, published, user_id]
        );
        if (tags && Array.isArray(tags)) {
            const insertPromises = tags.map(tagId => 
                pool.query(
                    "INSERT INTO blog_tags (blog_id, tag_id) VALUES ($1, $2)",
                    [result.rows[0].id, tagId]
                )
            );
            await Promise.all(insertPromises);
        }
        return result.rows[0].id;
    } catch (error) {
        console.error("Error creating blog:", error);
        throw new Error("Failed to create blog");
    }
}

export async function updateBlog(id: number, title: string, content: string, img: string, published: number, user_id: number, tags?: number[]) {
    try {
        const result = await pool.query(
            "UPDATE blogs SET title = $1, content = $2, img = $3, published = $4, user_id = $5 WHERE id = $6 RETURNING id",
            [title, content, img, published, user_id, id]
        );
        if (tags && Array.isArray(tags)) {
            // 首先删除旧的tags
            await pool.query("DELETE FROM blog_tags WHERE blog_id = $1", [id]);
            // 然后插入新的tags
            const insertPromises = tags.map(tagId => 
                pool.query(
                    "INSERT INTO blog_tags (blog_id, tag_id) VALUES ($1, $2)",
                    [id, tagId]
                )
            );
            await Promise.all(insertPromises);
        }
        return result.rows[0];
    } catch (error) {
        console.error("Error updating blog:", error);
        throw new Error("Failed to update blog");
    }
}

export async function getBlogsByUserId(userId: number, offset: number = 0, limit: number = 10) {
    try {
        const query = `
            SELECT b.id, b.title, b.img, b.user_id, b.published, b.created_at, u.username
            FROM blogs b
            JOIN users u ON b.user_id = u.id
            WHERE b.user_id = $1
            ORDER BY b.created_at DESC
            LIMIT $2 OFFSET $3
        `;
        const blogs = await pool.query(query, [userId, limit, offset]);
        const totalBlogs = await pool.query("SELECT COUNT(*) as count FROM blogs WHERE user_id = $1", [userId]);
        return { total: totalBlogs.rows[0].count, data: blogs.rows };
    } catch (error) {
        console.error("Error fetching blogs by user ID:", error);
        throw new Error("Failed to fetch blogs by user ID");
    }
}
