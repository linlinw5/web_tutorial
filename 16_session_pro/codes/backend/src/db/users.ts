import { ConnectionManager } from "./ConnectionManager.ts";
import bcrypt from "bcrypt";

const saltRounds = 12; // 正式的，应该从环境变量中读取

export async function createUser(username: string, password: string, email: string, group_id: number) {
  try {
    const db = await ConnectionManager.getConnection();
    // 检查用户是否已经存在
    const existingUser = await db.get("SELECT id FROM users WHERE username = ?", [username]);
    if (existingUser) {
      throw new Error("Username already exists");
    }
    // 插入新用户到数据库
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = `
            INSERT INTO users (username, password, email, group_id)
            VALUES (?, ?, ?, ?);
        `;
    const result = await db.run(query, [username, hashedPassword, email, group_id]);
    const insertedUser = await db.get("SELECT id, username, email, group_id FROM users WHERE id = ?", [result.lastID]);

    return insertedUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
}

export async function checkPassword(username: string, password: string) {
  try {
    const db = await ConnectionManager.getConnection();
    // 查询用户信息
    const query = `
            SELECT u.id, u.username, u.password, u.email, u.group_id, g.name as groupname
            FROM users u
            JOIN groups g ON u.group_id = g.id
            WHERE u.username = ?`;
    const user = await db.get(query, [username]);
    if (!user) {
      throw new Error("User not found");
    }
    // 验证密码
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid password");
    }
    // 返回用户信息（不包括密码）
    const { password: _, ...userInfo } = user;
    // user 对象中提取 password 属性
    // 将 password 重命名为 _（下划线）
    // _ 是一个约定俗成的变量名，表示这个变量不会被使用
    // 使用剩余操作符（rest operator）...
    // 将除了 password 之外的所有其他属性收集到 userInfo 对象中

    // console.log("User info:", userInfo);
    return userInfo;
  } catch (error) {
    console.error("Error checking password:", error);
    throw new Error("Failed to check password");
  }
}
