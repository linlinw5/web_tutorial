import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

let db: Database | null = null;

export async function getConnection(): Promise<Database> {
  try {
    if (!db) {
      db = await open({
        filename: './data/dev.sqlite',
        driver: sqlite3.Database,
      });
    }
    return db;
  } catch (error) {
    console.error('Failed to open database connection:', error);
    throw error;
  }
}

export async function closeConnection(): Promise<void> {
  try {
    if (db) {
      await db.close();
      db = null;
    }
  } catch (error) {
    console.error('Failed to close database connection:', error);
  }
}