import express from "express";
import session from "express-session";
// @ts-ignore
import connectSqlite3 from "connect-sqlite3";  // 这个包的ts类型定义可能不完整，所以需要忽略ts检查

// 🎯 生产环境一般使用redis作为session存储，这里为了方便演示，使用sqlite3作为session存储
// connect-sqlite3 包是 Express Session 存储适配器，它实现了 store 必须实现特定的接口

// 这个接口定义了 session 存储的基本操作方法，如 get、set、destroy 等
// 通过这个适配器，我们可以将 session 数据存储到 SQLite 数据库中
// 这样可以在服务器重启后仍然保留用户的 session 数据



// 当用户通过认证后，我们会将用户信息存储到 session 中
// 这样在后续的请求中，我们可以通过 session 来获取用户信息
// Express Session 默认的类型定义中没有 user 属性，需要扩展 Session 接口
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
// 创建 SQLite Session Store
const SQLiteStore = connectSqlite3(session);

// 常规中间件配置
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // 提供静态文件服务




// 🛠️ 日志中间件A
// 这个中间件用于打印请求的 url 和 headers 信息
// 在session中间件之前添加，说明这些信息是request请求中自己携带的
app.use((req, res, next) => {
    let now = new Date();
    console.log("\n+--------------------------------------------------------------");
    console.log(`| 🌸 接收到一个 http request 🫡🫡🫡`);
    console.log(`| 🌸 本地时间： ${now.toLocaleString()}`)
    console.log(`| 🌸 UTC时间:  ${now.toUTCString()}`);
    console.log("+--------------------------------------------------------------");
    console.log("\n=== 日志中间件A😋 ===");
    console.log("=== 原始request相关信息, 特别注意是否有🚗🚗🚗 cookie 🚗🚗🚗 ===");
    console.log("req.url: ", req.url);
    console.log("req.headers: ", req.headers);
    console.log("\n=== 此时request对象还没有Session信息，因为还没有经过session中间件处理 ===");
    console.log("❌ req.sessionID: ", req.sessionID);
    console.log("❌ req.session: ", req.session);
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
        rolling: false,             // 每次请求是否重新设置 cookie 的过期时间

        cookie: {
            secure: false,          // 在 HTTPS 下设置为 true，表示 cookie 只能通过 HTTPS 传输
            httpOnly: true,         // 只允许服务器访问 cookie，防止客户端Javascript脚本访问
            maxAge: 5 * 60 * 1000, // (毫秒)设置 cookie 的过期时间为 5 分钟
            sameSite: "strict"      // 防止 CSRF 攻击，设置为 'strict' | 'lax' | 'none'
        },

        // 使用 SQLite 作为 session store
        store: new SQLiteStore({
            db: 'sessions.db',      // SQLite 数据库文件名
            table: 'sessions',      // 表名
            dir: './db',            // 数据库文件存放目录
            concurrentDB: true,     // 启用 WAL 模式，支持并发读写
        }),
    })
);

// 🛠️ 日志中间件B
// 这个中间件用于打印 session ID 和 session 数据
// 在session中间件之后添加，说明这是request数据进入服务器之后，session中间件处理完，附加到request对象上的
app.use((req, res, next) => {
    console.log("\n\n🍀🍀🍀🍀能看到这个日志，说明请求已经经过了 session 中间件处理🍀🍀🍀🍀\n\n");
    console.log("👆=== 日志中间件B😋 ===");
    console.log("=== session中间件已经处理完毕，Session信息就被attach到request对象上了🍔🍔🍔 ===");
    console.log("✅ req.sessionID: ", req.sessionID);
    console.log("✅ req.session: ", req.session);
    console.log("👆=== 如果看不到用户的id、name、role等相关信息，说明这是一个未经过认证的会话 ===");
    console.log("👆=== 未经过认证的会话，每次刷新网页，sessionID都会发生变化 ===");
    console.log("👆=== 如果看到了用户的id、name、role等相关信息，说明这是一个经过认证的会话 ===");
    console.log("👆=== 经过认证的会话，sessionID不会变化，除非用户登出或会话过期 ===");
    console.log("\n=== 接下来就丢给路由处理了 ===👇");
    console.log("\n🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑");
    next();
});




// 路由处理
app.get("/", (req, res) => {
    res.send(`
        <h1>Welcome to the session demo!</h1>
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
            <p>Session Data: ${JSON.stringify(req.session)}</p>
            <p>You need to <a href='/login'>Login</a> first.</p>`);
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
