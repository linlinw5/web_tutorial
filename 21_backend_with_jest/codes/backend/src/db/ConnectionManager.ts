import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import type { Environment } from "../types/index.ts";
import { DBPATHS } from "../config.ts";

export class ConnectionManager {
    private db: Database | null = null;
    private env: Environment;

    // 静态缓存：每个环境一个实例
    private static instances: Map<string, ConnectionManager> = new Map();

    // 私有构造函数，防止直接 new
    private constructor(env: Environment) {
        this.env = env;
    }

    // 获取指定环境的实例(单例)，默认为开发环境
    public static getInstance(env: Environment = 'dev'): ConnectionManager {
        if (!this.instances.has(env)) {
            this.instances.set(env, new ConnectionManager(env));
        }
        return this.instances.get(env)!;
    }

    public async getConnection(): Promise<Database> {
        try {
            if (!this.db) {
                const dbPath = DBPATHS[this.env];
                this.db = await open({
                    filename: dbPath,
                    driver: sqlite3.Database,
                });
                // 启用外键约束(SQLite 默认关闭)
                await this.db.exec('PRAGMA foreign_keys = ON;');
            }
            return this.db;
        } catch (error) {
            throw error;
        }
    }

    public async closeConnection(): Promise<void> {
        if (this.db) {
            await this.db.close();
            this.db = null;
        }
    }

    // 初始化数据库表
    public async initializeDatabase(): Promise<void> {
        try {
            const db = await this.getConnection();
            await db.exec(`
                CREATE TABLE IF NOT EXISTS groups (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL UNIQUE
                );

                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    group_id INTEGER,
                    username TEXT NOT NULL UNIQUE,
                    email TEXT NOT NULL UNIQUE,
                    password TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE SET NULL
                );

                CREATE TABLE IF NOT EXISTS blogs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    title TEXT NOT NULL,
                    content TEXT NOT NULL,
                    published BOOLEAN DEFAULT 0,
                    img TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                );

                CREATE TABLE IF NOT EXISTS tags (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL UNIQUE
                );

                CREATE TABLE IF NOT EXISTS blog_tags (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    blog_id INTEGER NOT NULL,
                    tag_id INTEGER NOT NULL,
                    FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE,
                    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
                    UNIQUE(blog_id, tag_id)
                );
            `);
        } catch (error) {
            throw error;
        }
    }
}
