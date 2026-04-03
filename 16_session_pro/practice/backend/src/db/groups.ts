import { ConnectionManager } from "./ConnectionManager.ts";

export async function getAllGroups() {
  try {
    const db = await ConnectionManager.getConnection();
    const result = await db.all("SELECT * FROM groups");
    return result;
  } catch (error) {
    console.error("Error fetching groups:", error);
    throw new Error("Failed to fetch groups");
  }
}
