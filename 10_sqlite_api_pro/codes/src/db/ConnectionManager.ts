import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

let db: Database | null = null;

export async function getConnection(): Promise<Database> {
  if (!db) {
    db = await open({
      filename: "./data/db.sqlite",
      driver: sqlite3.Database,
    });
  }
  console.log("Database connection established");
  return db;
}

export async function closeConnection(): Promise<void> {
  if (db) {
    await db.close();
    db = null;
  }
}
