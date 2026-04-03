import express from "express";
import session from "express-session";
// @ts-ignore
import connectSqlite3 from "connect-sqlite3";
import { gracefulShutdown } from "./utils/shutdownConnection.ts";

// TODO 1: 用模块扩充（module augmentation）为 express-session 的 SessionData 添加 user 字段
// user 字段包含：id, username, email, group_id, groupname
declare module "express-session" {
    interface SessionData {
        // ...
    }
}

// TODO 2: import 你编写的路由模块
// import authRoutes from "./routes/auth.ts";
// import apiAuthRoutes from "./routes/api_auth.ts";

const app = express();
const PORT = 3000;
const SQLiteStore = connectSqlite3(session);

// 基础中间件（不用改）
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

// TODO 3: 配置 session 中间件
// 参考配置项：secret / resave / saveUninitialized / name / cookie.maxAge / store
// store 使用 SQLiteStore，db 文件存到 ./data/sessions.db
app.use(
    session({
        secret: "topsecret",
        resave: false,
        saveUninitialized: false,
        name: "easyblog.sid",
        cookie: { maxAge: 5 * 60 * 1000 },
        store: new SQLiteStore({
            // ...
        }),
    })
);

// TODO 4: 挂载路由
// GET / → 重定向到 /auth
// /auth       → authRoutes
// /api/auth   → apiAuthRoutes

gracefulShutdown();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
