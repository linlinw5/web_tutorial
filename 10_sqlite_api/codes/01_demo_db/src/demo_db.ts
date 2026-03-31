import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

// 数据库文件路径相对于运行命令时的工作目录（process.cwd()），不是相对于源文件位置
// 在项目根目录运行 `node ./dist/demo_db.js` 时，cwd 就是项目根目录
console.log("当前工作目录：", process.cwd());

async function sqliteDemo(): Promise<void> {
    let db: Database | null = null;

    try {
        // ===== 10.2 连接数据库 =====
        db = await open({
            filename: "./data/db.sqlite",
            driver: sqlite3.Database,
        });
        console.log("数据库连接成功");

        // ===== 10.3 exec — 执行 DDL 建表 =====
        // exec 可以一次执行多条 SQL，通常用于建表、建索引等结构操作
        // 不返回查询结果，出错才抛异常；每条语句末尾必须有分号
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
        console.log("建表成功");


        // ===== 增：run =====
        // run 执行一条增/改/删语句，返回 { lastID, changes }
        // 注意：run 只执行一条语句，末尾不需要分号

        // 直接拼值（适合固定数据）
        // const r1 = await db.run(`INSERT INTO groups (name) VALUES ('Admin'), ('Editor'), ('Guest')`);
        // console.log("插入 groups：", r1); // { lastID: 3, changes: 3 }

        // ? 占位符（推荐：防止 SQL 注入）
        // const r2 = await db.run(
        //     "INSERT INTO users (username, email, password, group_id) VALUES (?, ?, ?, ?)",
        //     ["alice", "alice@example.com", "password123", 1]
        // );
        // console.log("插入 users：", r2); // { lastID: 1, changes: 1 }

        // prepare — 预编译语句，适合批量插入（只编译一次，执行多次）
        // const stmt = await db.prepare(
        //     "INSERT INTO users (username, email, password, group_id) VALUES (?, ?, ?, ?)"
        // );
        // await stmt.run("bob",  "bob@example.com",  "pass123", 2);
        // await stmt.run("jack", "jack@example.com", "pass456", 3);
        // await stmt.finalize(); // 释放资源


        // ===== 查：all / get =====
        // all 返回满足条件的所有行组成的数组
        // const users = await db.all("SELECT * FROM users WHERE group_id = ?", [2]);
        // console.log("查询多行：", users);

        // get 只返回第一条匹配的记录（即使有多条）
        // const user = await db.get("SELECT * FROM users WHERE username = ?", ["alice"]);
        // console.log("查询单行：", user);

        // LIKE 模糊查询，% 表示任意字符
        // const user2 = await db.get("SELECT * FROM users WHERE email LIKE ?", ["%@abc.com"]);
        // console.log("LIKE 查询：", user2);


        // ===== 改：run =====
        // const r3 = await db.run(
        //     "UPDATE users SET password = ? WHERE username = ?",
        //     ["newpass", "alice"]
        // );
        // console.log("修改结果：", r3); // { lastID: 0, changes: 1 }


        // ===== 删：run =====
        // const r4 = await db.run("DELETE FROM users WHERE username = ?", ["alice"]);
        // console.log("删除结果：", r4); // { lastID: 0, changes: 1 }

    } catch (error) {
        console.error("数据库操作失败：", error);
        throw error;
    } finally {
        if (db) {
            await db.close();
            console.log("数据库连接已关闭");
        }
    }
}

sqliteDemo();
