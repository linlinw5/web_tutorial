import pg from 'pg';

// 在这里完成以下练习（使用 pg.Pool 连接池模式）：
//
// 1. 配置 dbConfig，额外设置连接池参数：
//    max / idleTimeoutMillis / connectionTimeoutMillis
//
// 2. 创建 pg.Pool 实例
//    注意：Pool 不需要手动 connect()，直接调用 pool.query()
//
// 3. 查询所有用户：SELECT * FROM users
//    打印 result.rows
//
// 4. 编写 cleanup() 函数，调用 pool.end() 关闭连接池
//
// 5. 监听 SIGINT / SIGTERM 信号，退出前调用 cleanup()
//    对比与 Client 模式的关闭方式有何不同
