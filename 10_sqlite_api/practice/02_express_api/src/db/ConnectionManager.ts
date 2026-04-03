import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

// ===== Approach 1: function-style singleton (recommended) =====
// Use a module-level variable to store the connection; create on first call and reuse afterward

let db: Database | null = null;

export async function getConnection(): Promise<Database> {
  if (!db) {
    db = await open({
      filename: "./data/db.sqlite",
      driver: sqlite3.Database,
    });
  }
  return db;
}

export async function closeConnection(): Promise<void> {
  if (db) {
    await db.close();
    db = null;
  }
}

// ===== Approach 2: class static methods =====
// Same effect as approach 1; uses static properties to store the connection

export class ConnectionManager {
  private static db: Database | null = null;

  public static async getConnection(): Promise<Database> {
    if (!this.db) {
      this.db = await open({
        filename: "./data/db.sqlite",
        driver: sqlite3.Database,
      });
    }
    return this.db;
  }

  public static async closeConnection(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }
}
