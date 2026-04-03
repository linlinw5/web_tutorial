// env.ts 必须是第一个 import，确保 dotenv.config() 在所有模块读取 process.env 之前执行
import './env.ts';

import express from "express";
import session from "express-session";
import passport from "passport";
import connectPg from "connect-pg-simple";

import { sessionConfig } from "./config.ts";
import { pool } from "./db/ConnectionManager.ts";
import { configPassport } from './utils/configPassport.ts';
import { gracefulShutdown } from "./utils/shutdownConnection.ts";
import { initializeDatabase } from "./db/ConnectionManager.ts";
import routes from './routes/index.ts';

const app = express();
const PORT = process.env.PORT;

// 静态文件和模板引擎
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "views");

// 解析请求体
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session 中间件：使用 PostgreSQL 作为 Session Store
const pgStore = connectPg(session);
app.use(session({
    ...sessionConfig,
    store: new pgStore({ pool, createTableIfMissing: true, tableName: "session" })
}));

// Passport 中间件：顺序不能颠倒
// 1. passport.initialize() 在 req 上挂载 isAuthenticated/user/login/logout 等方法
// 2. passport.session() 每次请求时自动调用 deserializeUser，从 Session 中还原 req.user
app.use(passport.initialize());
app.use(passport.session());

// 注册 Passport 策略（Local + Google OAuth）和序列化/反序列化逻辑
configPassport();

// 统一路由入口
app.use('/', routes);

// 优雅关闭：收到 SIGINT/SIGTERM 时关闭数据库连接池再退出
gracefulShutdown();

// 先初始化数据库（建表 + 种子数据），完成后再启动服务器
// 确保服务器在数据库就绪之前不接受请求
initializeDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Failed to initialize database:", err);
        process.exit(1);
    });
