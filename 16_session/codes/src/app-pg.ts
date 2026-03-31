import express from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import pg from "pg";

const dbConfig = {
    host: "10.0.0.133",
    port: 5432,
    user: "postgres",
    password: "Cisco123",
    database: "db4",
    max: 10, // 连接池最大连接数
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
};

export const pool = new pg.Pool(dbConfig);

declare module "express-session" {
    interface SessionData {
        user?: {
            id: number;
            username: string;
            role: string;
            email: string;
        };
    }
}

// 📚 模拟用户数据库（教学用）
interface User {
    id: number;
    username: string;
    password: string; // 实际项目中应该是加密后的密码
    role: string;
    email: string;
}

const users: User[] = [
    {
        id: 1,
        username: "admin",
        password: "cisco", // 实际项目中应该是加密后的密码
        role: "admin",
        email: "admin@abc.com"
    },
    {
        id: 2,
        username: "jack",
        password: "cisco",
        role: "user",
        email: "jack@abc.com"
    }
];


const app = express();
const PORT = 3000;
// 创建 Session Store
const pgStore = connectPg(session);

// 常规中间件配置
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // 提供静态文件服务


// 🛠️ 日志中间件A
app.use((req, res, next) => {
    let now = new Date();
    console.log("\n+--------------------------------------------------------------");
    console.log(`| 🌸 接收到一个 http request 🫡🫡🫡`);
    console.log("+--------------------------------------------------------------");
    console.log("\n=== 日志中间件A😋 ===");
    console.log("=== 原始request相关信息 ===");
    console.log("req.headers.cookie: ", req.headers.cookie);
    console.log("=== 接下来就丢给session中间件处理了 ===👇");
    next();
});

// 🛠️ Session中间件
app.use(
    session({
        secret: "topsecret",        // 用于签名 session ID cookie 的密钥，防止客户端篡改 session ID
        resave: false,              // 如果 session 没有被修改，则不重新保存到 session store
        saveUninitialized: false,   // 未初始化的 session 不会被保存到 session store
        name: "easyblog.sid",       // 设置 cookie 的名称，默认是 'connect.sid'
        // 使用 PostgreSQL 作为 session 存储
        cookie: { maxAge: 5 * 60 * 1000 },
        store: new pgStore({
            pool,
            createTableIfMissing: true,  // 如果表不存在则创建
            tableName: "session"   // 指定存储 session 的表名
        }),
    })
);

// 🛠️ 日志中间件B
app.use((req, res, next) => {
    console.log("\n\n🍀🍀🍀🍀能看到这个日志，说明请求已经经过了 session 中间件处理🍀🍀🍀🍀\n\n");
    console.log("👆=== 日志中间件B😋 ===");
    console.log("=== session中间件已经处理完毕，Session信息就被attach到request对象上了🍔🍔🍔 ===");
    console.log("✅ req.sessionID: ", req.sessionID);
    console.log("✅ req.session: ", req.session);
    console.log("\n=== 接下来就丢给路由处理了 ===👇");
    console.log("\n🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑");
    next();
});




// 路由处理
app.get("/", (req, res) => {
    res.send(`
        <h1>Welcome to the session demo pgsql version!</h1>
        <p>Session ID: ${req.sessionID}</p>
        <p>Session Data: ${JSON.stringify(req.session)}</p>
        <p>Try <a href="/login">Login</a></p>
        <p>Try <a href="/profile">Profile</a></p>
        <p>Try <a href="/logout">Logout</a></p>
    `); 
});

app.get("/login", (req, res) => {
    if (req.session.user) {
        // 如果用户已经登录，重定向到个人资料页面
        res.redirect("/profile");
    } else {
        res.send(`
                <h1>用户登录</h1>
                <p><strong>req.sessionID: </strong> ${req.sessionID}</p>
                <p><strong>req.session: </strong> ${JSON.stringify(req.session)}</p>
                <form action="/login" method="POST">
                    <input type="text" name="username" placeholder="输入用户名" required>
                    <input type="password" name="password" placeholder="输入密码" required>
                    <button type="submit">登录</button>
                </form>
        `);
    }
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    console.log(`登录请求: 用户名: ${username}, 密码: ${password}`);
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        // 登录成功，将用户信息存储到 session 中
        req.session.user = {
            id: user.id,
            username: user.username,
            role: user.role,
            email: user.email,
        }
        console.log(`用户 ${username} 登录成功，Session ID: ${req.sessionID}`);
        res.send(`<h1>Logged in!</h1>
            <p>Session ID: ${req.sessionID}</p>
            <p>Session Data: ${JSON.stringify(req.session)}</p>
            <p>Try <a href='/profile'>Profile</a></p>
            <p>Try <a href='/logout'>Logout</a></p>`);
    } else {
        // 登录失败，返回错误信息
        res.status(401).send(`<h1>Login Failed</h1>
            <p>Session ID: ${req.sessionID}</p>
            <p>Session Data: ${JSON.stringify(req.session)}</p>
            <p>Invalid username or password. Please try again.</p>
            <p>Try <a href='/login'>Login</a></p>`);
    }
});

app.get("/profile", (req, res) => {
    // 检查用户是否登录
    if (req.session.user) {
        res.send(`<h1>Welcome ${req.session.user.username}!</h1>
            <p>Session ID: ${req.sessionID}</p>
            <p>Session Data: ${JSON.stringify(req.session)}</p>
            <p>Your role: ${req.session.user.role}</p>
            <p>Your email: ${req.session.user.email}</p>
            <p>Try <a href='/logout'>Logout</a></p>`);
    } else {
        res.status(401).send(`<h1>Unauthorized</h1>
            <p>Session ID: ${req.sessionID}</p>
            <p>You need to <a href='/login?username=john&password=cisco'>Login</a> first.</p>`);
    }
});

app.get("/logout", (req, res) => {
    // 清除 session
    req.session.destroy((err) => {
        if (err) {
            res.status(500).send("Could not log out.");
        } else {
            res.clearCookie("easyblog.sid");
            console.log(`已退出登录，当前Session ID: ${req.sessionID}`);
            res.send(`<h1>Logged out!</h1>
                <p>Session ID: ${req.sessionID}</p>
                <p>Session Data: ${JSON.stringify(req.session)}</p>
                <p>Try <a href='/'>Back to Home</a></p>`);
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`测试账号: 管理员: admin / cisco, 普通用户: jack / cisco`);
});
