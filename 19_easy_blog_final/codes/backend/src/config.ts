// 数据库连接配置：从 process.env 读取，集中管理，避免硬编码
export const dbConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string), // .env 所有值均为字符串，数字需手动转换
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 10,                       // 连接池最大连接数
    idleTimeoutMillis: 30000,      // 空闲连接超时时间（ms）
    connectionTimeoutMillis: 2000, // 获取连接超时时间（ms）
};

// Session 配置：store 在 app.ts 中单独配置，因为 store 依赖 pool
export const sessionConfig = {
    secret: process.env.SESSION_SECRET as string, // 用于签名 Session ID Cookie 的密钥
    resave: false,            // 未修改时不重新保存 Session
    saveUninitialized: false, // 未认证用户不创建 Session，不发送 Cookie
    name: "easyblog.sid",     // Cookie 名称
    cookie: { maxAge: 25 * 60 * 1000 }, // Cookie 有效期：25 分钟
};