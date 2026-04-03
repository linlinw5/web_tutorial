import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

export class ConnectionManager {
  private static db: Database | null = null;

  private static async initializeSchema(db: Database): Promise<void> {
    await db.exec("PRAGMA foreign_keys = ON;");

    await db.exec(`
      CREATE TABLE IF NOT EXISTS groups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      );

      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        group_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (group_id) REFERENCES groups(id)
      );
    `);

    const groupCount = await db.get<{ count: number }>("SELECT COUNT(*) as count FROM groups");
    if (!groupCount || groupCount.count === 0) {
      await db.run("INSERT INTO groups (name) VALUES (?), (?), (?)", ["admin", "editor", "user"]);
    }
  }

  public static async getConnection(): Promise<Database> {
    if (!this.db) {
      this.db = await open({
        filename: "./data/db.sqlite",
        driver: sqlite3.Database,
      });

      await this.initializeSchema(this.db);
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
