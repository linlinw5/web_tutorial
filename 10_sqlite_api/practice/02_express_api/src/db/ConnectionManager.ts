import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

// ===== 写法一：函数式单例（推荐） =====
// 用模块级变量保存连接，首次调用时创建，后续调用直接复用

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


// ===== 写法二：Class 静态方法 =====
// 效果与写法一完全相同，用静态属性保存连接

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
