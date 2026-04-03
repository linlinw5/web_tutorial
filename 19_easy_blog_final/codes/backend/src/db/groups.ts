import { pool } from "./ConnectionManager.ts";

export async function getAllGroups() {
    try {
        const result = await pool.query("SELECT * FROM groups");
        return result.rows;
    } catch (error) {
        console.error("Error fetching groups:", error);
        throw new Error("Failed to fetch groups");
    }
}