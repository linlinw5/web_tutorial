import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

// 在这里完成以下练习：
//
// 1. 连接数据库（open），数据库文件路径：./data/db.sqlite
//
// 2. 用 exec 建表：
//    groups 表（id, name）
//    users 表（id, group_id FK, username, email, password, created_at）
//
// 3. 用 run 插入数据（? 占位符）：
//    向 groups 插入 Admin / Editor / Guest
//    向 users 插入至少 2 条记录
//
// 4. 用 all 查询所有 users
//
// 5. 用 get 查询单个 user（按 username）
//
// 6. 用 run 更新一条记录的 password
//
// 7. 用 run 删除一条记录
//
// 8. 关闭数据库连接（finally 块中）
