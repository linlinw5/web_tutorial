import pg from 'pg';

const dbConfig = {
    host: "10.0.0.133",
    port: 5432,
    user: "postgres",
    password: "Cisco123",
    database: "db2",
    max: 10, // 连接池最大连接数
    idleTimeoutMillis: 30000, // 空闲连接超时时间
    connectionTimeoutMillis: 2000, // 连接超时时间
    // allowExitOnIdle: true         // 允许进程在连接池空闲时退出
    // 当编写服务模式的应用时，通常不需要设置 allowExitOnIdle，因为连接池会在应用运行期间保持活动状态。
    // 但在某些脚本或测试中，如果需要在所有连接关闭后退出进程，可以设置为 true。
};

const pool = new pg.Pool(dbConfig);


async function pgDemo() {
    try {
        // ==== 查 ====
        const users = await pool.query("SELECT * FROM users");
        console.log("查询到的用户数据：", users.rows);
        
    } catch (error) {
        console.error("查询失败：", error);
        throw error; // 重新抛出错误，以便调用者可以处理
    }
}

// 应用关闭时的清理函数
async function cleanup() {
    try {
        await pool.end(); // 只在应用关闭时调用
        console.log('连接池已关闭');
    } catch (error) {
        console.error('关闭连接池时出错:', error);
    }
}



// 监听进程退出信号
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);


pgDemo();