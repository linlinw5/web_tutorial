import { pool } from "./ConnectionManager.ts";
import bcrypt from "bcrypt";

const saltRounds = Number(process.env.SALT_ROUNDS);

export async function createUser(username: string, password: string, email: string, group_id: number, google_id?: string, avatar?: string, provider: 'local' | 'google' = 'local') {
    try {
        // 检查用户是否已经存在
        const existingUserByUsername = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        const existingUserByEmail = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (existingUserByUsername.rows.length > 0 || existingUserByEmail.rows.length > 0) {
            // 如果用户名或邮箱已存在，抛出错误
            throw new Error("Username or email already exists");
        }
        // 插入新用户到数据库
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const query = `
            INSERT INTO users (username, password, email, group_id, google_id, avatar, provider)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, username, email, group_id, google_id, avatar, provider;
        `;
        const result = await pool.query(query, [username, hashedPassword, email, group_id, google_id || null, avatar || null, provider]);
        
        return result.rows[0];
    } catch (error) {
        // "Username or email already exists" 是预期内的业务错误，直接原样抛出
        // 让调用方（路由层）根据错误信息决定返回 409 还是 500
        if ((error as Error).message === "Username or email already exists") {
            throw error;
        }
        console.error("Error creating user:", error);
        throw new Error("Failed to create user");
    }
}

export async function checkPassword(username: string, password: string) {
    try {
        // 查询用户信息（包含所属分组名称）
        const query = `
            SELECT u.*, g.name as groupname
            FROM users u
            JOIN groups g ON u.group_id = g.id
            WHERE u.username = $1`;
        const checkUser = await pool.query(query, [username]);
        if (checkUser.rows.length === 0) {
            return {success: false, message: "User not found"};
        }
        const user = checkUser.rows[0];
        // 验证密码
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return {success: false, message: "Invalid password"};
        }
        // 返回用户信息（不包括密码）
        const { password: _, ...userInfo } = user;
        return {success: true, user: userInfo };
    } catch (error) {
        console.error("Error checking password:", error);
        throw new Error("Failed to check password");
    }
}

export async function getUserById(userId: number) {
    try {
        const query = `
            SELECT u.*, g.name as groupname
            FROM users u
            JOIN groups g ON u.group_id = g.id
            WHERE u.id = $1
        `;
        const result = await pool.query(query, [userId]);
        return result.rows[0];
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        throw new Error("Failed to fetch user by ID");
    }
}

export async function getUserByUsername(username: string) {
    try {
        const query = `
            SELECT u.*, g.name as groupname
            FROM users u
            JOIN groups g ON u.group_id = g.id
            WHERE u.username = $1
        `;
        const result = await pool.query(query, [username]);
        return result.rows[0];
    } catch (error) {
        console.error("Error fetching user by username:", error);
        throw new Error("Failed to fetch user by username");
    }
}

export async function getUserByEmail(email: string) {
    try {
        const query = `
            SELECT u.*, g.name as groupname
            FROM users u
            JOIN groups g ON u.group_id = g.id
            WHERE u.email = $1
        `;
        const result = await pool.query(query, [email]);
        return result.rows[0];
    } catch (error) {
        console.error("Error fetching user by email:", error);
        throw new Error("Failed to fetch user by email");
    }
}

export async function getUserByGoogleId(googleId: string) {
    try {
        const query = `
            SELECT u.*, g.name as groupname
            FROM users u
            JOIN groups g ON u.group_id = g.id
            WHERE u.google_id = $1
        `;
        const result = await pool.query(query, [googleId]);
        return result.rows[0];
    } catch (error) {
        console.error("Error fetching user by Google ID:", error);
        throw new Error("Failed to fetch user by Google ID");
    }
}

export async function getAllUsers(limit: number = 10, offset: number = 0) {
    try {
        const query = `
            SELECT u.*, g.name as groupname
            FROM users u
            JOIN groups g ON u.group_id = g.id
            ORDER BY u.created_at DESC
            LIMIT $1 OFFSET $2
        `;
        const result = await pool.query(query, [limit, offset]);
        const totalUsers = await pool.query("SELECT COUNT(*) as count FROM users");

        return { total: totalUsers.rows[0].count, data: result.rows };
    } catch (error) {
        console.error("Error fetching all users:", error);
        throw new Error("Failed to fetch all users");
    }
}

// Partial<T> - 所有属性变为可选
// Partial<T> 让你可以创建一个类型，其中原始类型的所有属性都变成可选的。这在更新操作中非常有用，因为你通常只需要更新部分字段，而不是所有字段。
export async function updateUser(
    userId: number,
    updates: Partial<{ username: string; email: string; password: string; group_id: number; google_id: string; avatar: string }>
) {
    try {
        const fields = [];
        const values: any[] = [];
        let index = 1;

        if (updates.username) {
            fields.push(`username = $${index++}`);
            values.push(updates.username);
        }
        if (updates.email) {
            fields.push(`email = $${index++}`);
            values.push(updates.email);
        }
        if (updates.password) {
            const hashedPassword = await bcrypt.hash(updates.password, saltRounds);
            fields.push(`password = $${index++}`);
            values.push(hashedPassword);
        }
        if (updates.group_id) {
            fields.push(`group_id = $${index++}`);
            values.push(updates.group_id);
        }
        if (updates.google_id) {
            fields.push(`google_id = $${index++}`);
            values.push(updates.google_id);
        }
        if (updates.avatar) {
            fields.push(`avatar = $${index++}`);
            values.push(updates.avatar);
        }
        if (fields.length === 0) {
            throw new Error("No fields to update");
        }

        const query = `
            UPDATE users
            SET ${fields.join(", ")}
            WHERE id = $${index}
            RETURNING id, username, email, group_id, google_id, avatar;
        `;
        values.push(userId);
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error("Error updating user:", error);
        throw new Error("Failed to update user");
    }
}

export async function deleteUser(userId: number) {
    try {
        const query = `
            DELETE FROM users
            WHERE id = $1
            RETURNING id;
        `;
        const result = await pool.query(query, [userId]);
        return result.rows[0];
    } catch (error) {
        console.error("Error deleting user:", error);
        throw new Error("Failed to delete user");
    }
}