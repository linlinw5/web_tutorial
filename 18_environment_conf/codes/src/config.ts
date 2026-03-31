// 集中管理所有可配置项
// 从 process.env 读取环境变量，转换为正确的类型后导出
// 其他模块只需 import config，无需直接访问 process.env
export const dbConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string), // .env 中所有值均为字符串，数字类型需手动转换
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 10,                      // 连接池最大连接数
    idleTimeoutMillis: 30000,     // 空闲连接超时时间（ms）
    connectionTimeoutMillis: 2000, // 获取连接超时时间（ms）
};
