import { getConnection } from "./ConnectionManager.ts";

export async function getUsers(limit: number, offset: number) {
  const db = await getConnection();
  const users = await db.all("SELECT * FROM users LIMIT ? OFFSET ?", [limit, offset]);
  const totalRow = await db.get("SELECT COUNT(*) as count FROM users");
  return { total: totalRow.count, data: users };
}

export async function getUserById(userId: number) {
  const db = await getConnection();
  const user = await db.get(
    `SELECT u.id, u.username, u.email, u.password, g.name AS group_name
         FROM users AS u
         JOIN groups AS g ON u.group_id = g.id
         WHERE u.id = ?`,
    [userId],
  );
  return user;
}

export async function createUser(username: string, email: string, password: string, group_id: number) {
  const db = await getConnection();
  const result = await db.run("INSERT INTO users (username, email, password, group_id) VALUES (?, ?, ?, ?)", [
    username,
    email,
    password,
    group_id,
  ]);
  return result;
}

export async function updatePassword(userId: number, newPassword: string) {
  const db = await getConnection();
  const result = await db.run("UPDATE users SET password = ? WHERE id = ?", [newPassword, userId]);
  return result;
}

export async function deleteUser(userId: number) {
  const db = await getConnection();
  const result = await db.run("DELETE FROM users WHERE id = ?", [userId]);
  return result;
}
