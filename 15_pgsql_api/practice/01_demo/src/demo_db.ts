import pg from 'pg';

// 在这里完成以下练习（使用 pg.Client 单连接模式）：
//
// 1. 配置 dbConfig（host / port / user / password / database）
//    连接到你自己的 PostgreSQL 实例
//
// 2. 创建 pg.Client 实例并 connect()
//
// 3. 用 $1 $2 占位符插入一条用户数据（INSERT ... RETURNING *）
//    观察返回值的结构（result.rows[0]）
//
// 4. 查询多行：SELECT * FROM users WHERE password = $1
//    打印 result.rows
//
// 5. 查询单行：SELECT * FROM users WHERE username = $1
//    打印 result.rows[0]
//
// 6. 更新：UPDATE users SET password = $1 WHERE username = $2 RETURNING *
//    打印更新后的行
//
// 7. 删除：DELETE FROM users WHERE username = $1 RETURNING *
//    打印被删除的行
//
// 8. 在 finally 块中调用 db.end() 关闭连接
