import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

// The database file path is relative to the working directory at runtime (process.cwd()), not the source file location
// When running `node ./dist/demo_db.js` from the project root, cwd is the project root
console.log("Current working directory:", process.cwd());

async function sqliteDemo(): Promise<void> {
  let db: Database | null = null;

  try {
    // ===== 10.2 Connect to database =====
    db = await open({
      filename: "./data/db.sqlite",
      driver: sqlite3.Database,
    });
    console.log("Database connected successfully");

    // ===== 10.3 exec - Execute DDL to create tables =====
    // exec can run multiple SQL statements at once, usually for schema operations like creating tables/indexes
    // It does not return query results; it throws only on errors; each statement must end with a semicolon
    await db.exec(`
            CREATE TABLE IF NOT EXISTS groups (
                id   INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT    NOT NULL UNIQUE
            );

            CREATE TABLE IF NOT EXISTS users (
                id         INTEGER  PRIMARY KEY AUTOINCREMENT,
                group_id   INTEGER,
                username   TEXT     NOT NULL UNIQUE,
                email      TEXT     NOT NULL UNIQUE,
                password   TEXT     NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE SET NULL
            );
        `);
    console.log("Tables created successfully");

    // ===== Create: run =====
    // run executes one INSERT/UPDATE/DELETE statement and returns { lastID, changes }
    // Note: run executes only one statement; no trailing semicolon is needed

    // Inline values directly (suitable for fixed data)
    // const r1 = await db.run(`INSERT INTO groups (name) VALUES ('Admin'), ('Editor'), ('Guest')`);
    // console.log("Insert groups:", r1); // { lastID: 3, changes: 3 }

    // ? placeholders (recommended: prevent SQL injection)
    // const r2 = await db.run(
    //     "INSERT INTO users (username, email, password, group_id) VALUES (?, ?, ?, ?)",
    //     ["alice", "alice@example.com", "password123", 1]
    // );
    // console.log("Insert users:", r2); // { lastID: 1, changes: 1 }

    // prepare - precompiled statements, suitable for batch inserts (compile once, execute multiple times)
    // const stmt = await db.prepare(
    //     "INSERT INTO users (username, email, password, group_id) VALUES (?, ?, ?, ?)"
    // );
    // await stmt.run("bob",  "bob@example.com",  "pass123", 2);
    // await stmt.run("jack", "jack@example.com", "pass456", 3);
    // await stmt.finalize(); // release resources

    // ===== Read: all / get =====
    // all returns an array of all rows matching the condition
    // const users = await db.all("SELECT * FROM users WHERE group_id = ?", [2]);
    // console.log("Query multiple rows:", users);

    // get returns only the first matching record (even if there are multiple)
    // const user = await db.get("SELECT * FROM users WHERE username = ?", ["alice"]);
    // console.log("Query single row:", user);

    // LIKE fuzzy query, % means any characters
    // const user2 = await db.get("SELECT * FROM users WHERE email LIKE ?", ["%@abc.com"]);
    // console.log("LIKE query:", user2);

    // ===== Update: run =====
    // const r3 = await db.run(
    //     "UPDATE users SET password = ? WHERE username = ?",
    //     ["newpass", "alice"]
    // );
    // console.log("Update result:", r3); // { lastID: 0, changes: 1 }

    // ===== Delete: run =====
    // const r4 = await db.run("DELETE FROM users WHERE username = ?", ["alice"]);
    // console.log("Delete result:", r4); // { lastID: 0, changes: 1 }
  } catch (error) {
    console.error("Database operation failed:", error);
    throw error;
  } finally {
    if (db) {
      await db.close();
      console.log("Database connection closed");
    }
  }
}

sqliteDemo();
