import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20"; // 🔧 添加 Google 策略
// @ts-ignore
import connectSqlite3 from "connect-sqlite3";

import { config } from "./config"; // 🔧 从配置文件导入 Google OAuth 配置

const app = express();
const PORT = 3000;

const SQLiteStore = connectSqlite3(session);

// 🔧 解析请求体的中间件（必需！）
app.use(express.urlencoded({ extended: true })); // 解析 form 数据
app.use(express.json()); // 解析 JSON 数据

// 🛠️ Session中间件配置
app.use(
  session({
    secret: "topsecret", // 用于签名 session ID cookie 的密钥
    resave: false, // session 没有被修改时不重新保存
    saveUninitialized: false, // 未初始化的 session 不保存
    name: "easyblog.sid", // cookie 名称
    rolling: false, // 不在每次请求时重置过期时间

    cookie: {
      secure: false, // 开发环境设为 false，生产环境 HTTPS 下设为 true
      httpOnly: true, // 防止 XSS 攻击，cookie 只能服务器访问
      maxAge: 30 * 60 * 1000, // 30 分钟过期（教学用，时间长一点）
      sameSite: "strict", // 防止 CSRF 攻击
    },

    // 使用 SQLite 作为 session 存储
    store: new SQLiteStore({
      db: "sessions.db",
      table: "sessions",
      dir: "./db",
      concurrentDB: true,
    }),
  }),
);

// 🔐 Passport 中间件初始化
app.use(passport.initialize()); // 初始化 Passport
app.use(passport.session()); // 启用 Passport 的 session 支持

// 📚 扩展用户接口，支持 Google 登录
interface User {
  id: number;
  username: string;
  password?: string; // Google 用户可能没有密码
  role: string;
  email: string;
  googleId?: string; // Google 用户 ID
  avatar?: string; // 头像 URL
  provider: "local" | "google"; // 登录方式
}

const users: User[] = [
  {
    id: 1,
    username: "admin",
    password: "cisco",
    role: "admin",
    email: "admin@abc.com",
    provider: "local",
  },
  {
    id: 2,
    username: "jack",
    password: "cisco",
    role: "user",
    email: "jack@abc.com",
    provider: "local",
  },
];

// 🔍 辅助函数
function findUser(username: string) {
  return users.find((user) => user.username === username);
}

function findUserById(id: number) {
  return users.find((user) => user.id === id);
}

// 🔍 通过 Google ID 查找用户
function findUserByGoogleId(googleId: string): User | undefined {
  return users.find((user) => user.googleId === googleId);
}

// 🔍 通过邮箱查找用户
function findUserByEmail(email: string): User | undefined {
  return users.find((user) => user.email === email);
}

// 🆕 创建新用户
function createUser(userData: Partial<User>): User {
  const newUser: User = {
    id: users.length + 1,
    username: userData.username as string,
    role: "user",
    email: userData.email || "",
    googleId: userData.googleId,
    avatar: userData.avatar,
    provider: userData.provider || "local",
  };
  users.push(newUser);
  console.log("新用户创建成功:", newUser);
  return newUser;
}

// 🎯 配置 Passport Local Strategy
passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    (username, password, done) => {
      console.log(`🔐 本地登录尝试: ${username}`);

      const user = findUser(username);

      if (!user) {
        console.log(`❌ 用户不存在: ${username}`);
        return done(null, false, { message: "用户名不存在" });
      }

      if (user.password !== password) {
        console.log(`❌ 密码错误: ${username}`);
        return done(null, false, { message: "密码错误" });
      }

      console.log(`✅ 本地登录成功: ${username}`);
      return done(null, user);
    },
  ),
);

// 🌐 配置 Google OAuth 2.0 Strategy
passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: config.clientID, // 🔧 从配置文件获取 clientID
      clientSecret: config.clientSecret, // 🔧 从配置文件获取 clientSecret
      callbackURL: config.callbackURL, // 🔧 从配置文件获取 callbackURL
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("Profile from google: ", JSON.stringify(profile));
      const email = profile.emails?.[0]?.value;
      const avatar = profile.photos?.[0]?.value;
      let user;

      // 1. 首先尝试通过 Google ID 查找用户
      user = findUserByGoogleId(profile.id);
      if (user) {
        console.log("🌸Google OAuth 找到已存在的 Google 用户:", user.username);
        return done(null, user);
      }

      // 2. 如果没找到，尝试通过邮箱查找（可能是已有用户）
      if (email) {
        user = findUserByEmail(email);
        if (user) {
          console.log("🌸Google OAuth 将 Google 账号绑定到现有用户:", user.username);
          user.googleId = profile.id;
          user.avatar = avatar;
          return done(null, user);
        }
      }

      // 3. 上述两种可能都不符合，则说明是一个新用户，因此需要创建新用户
      console.log("🌸Google OAuth 创建新的 Google 用户");
      const newUser = createUser({
        username: profile.displayName,
        email: email || "",
        googleId: profile.id,
        avatar: avatar || "",
        provider: "google",
        role: "user",
      });
      return done(null, newUser);
    },
  ),
);

// 📦 序列化用户
passport.serializeUser((user, done) => {
  console.log(`📦 序列化用户: ${JSON.stringify(user)})`);
  done(null, (user as User).id);
});

// 📤 反序列化用户
passport.deserializeUser((id, done) => {
  console.log(`📤 反序列化用户ID: ${id}`);
  const user = findUserById(id as number);

  if (user) {
    console.log(`📤 反序列化找到用户: ${JSON.stringify(user)})`);
    return done(null, user);
  }

  console.log(`📤 反序列化失败, 用户不存在, ID: ${id}`);
  return done(new Error("用户不存在"));
});

// 🛡️ 身份验证中间件
function isAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction): void {
  if (req.isAuthenticated()) {
    return next(); // 已登录，继续处理
  }
  // 未登录，重定向到登录页面
  res.redirect("/login?error=需要登录才能访问此页面");
}

function isAdmin(req: express.Request, res: express.Response, next: express.NextFunction): void {
  if (req.isAuthenticated() && (req.user as User).role === "admin") {
    return next(); // 已登录且是管理员，继续处理
  }
  // 未登录或不是管理员，重定向到登录页面
  res.redirect("/login?error=需要管理员权限才能访问此页面");
}

// 首页路由
app.get("/", (req, res) => {
  res.send(`
            <h1>🏠 Passport.js Demo</h1>
            ${req.query.message ? `<div> ${req.query.message}</div>` : ""}
            <p><strong>req.sessionID: </strong> ${req.sessionID}</p>
            <p><strong>req.session: </strong> ${JSON.stringify(req.session)}</p>
            <p><strong>req.isAuthenticated(): </strong> ${req.isAuthenticated()}</p>
            <p><strong>req.user: </strong> ${JSON.stringify(req.user)}</p>
            <ul>
                <li>Try <a href="/login">登录页面</a></li>
                <li>Try <a href="/profile">个人资料</a></li>
                <li>Try <a href="/admin">管理页面</a></li>
                <li>Try <a href="/logout">退出登录</a></li>
            </ul>
    `);
});

// 登录页面路由（支持多种登录方式）
app.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/profile");
  }
  res.send(`
            <h1>用户登录</h1>
            ${req.query.error ? `<div>${req.query.error}</div>` : ""}
            <p><strong>req.sessionID: </strong> ${req.sessionID}</p>
            <p><strong>req.session: </strong> ${JSON.stringify(req.session)}</p>
            <p><strong>req.isAuthenticated(): </strong> ${req.isAuthenticated()}</p>
            <p><strong>req.user: </strong> ${JSON.stringify(req.user)}</p>
            <form action="/login" method="POST">
                <input type="text" name="username" placeholder="输入用户名" required>
                <input type="password" name="password" placeholder="输入密码" required>
                <button type="submit">登录</button>
            </form>
            <hr>
            <div>
                <a href="/auth/google">Ⓖ 使用 Google 登录</a>
            </div>
        </div>
    `);
});

// 处理登录表单提交
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/?message=local登录成功", // 登录成功重定向到首页
    failureRedirect: "/login?error=登录失败，请检查用户名和密码", // 登录失败重定向
  }),
);

// Google OAuth 路由
// 发起 Google OAuth 认证
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"], // 请求用户的基本信息和邮箱
    prompt: "select_account", // 或者用 'consent' 强制重新授权
  }),
);
// 处理 Google OAuth 回调（认证结束后的回调，成功咋办，失败咋办）
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/?message=google登录成功", // 登录成功重定向到首页
    failureRedirect: "/login?error=Google登录失败",
  }),
);

// 个人资料页面（需要登录）
app.get("/profile", isAuthenticated, (req, res) => {
  res.send(`
        <h1>个人资料</h1>
        <p><strong>req.sessionID: </strong> ${req.sessionID}</p>
        <p><strong>req.session: </strong> ${JSON.stringify(req.session)}</p>
        <p><strong>req.isAuthenticated(): </strong> ${req.isAuthenticated()}</p>
        <p><strong>req.user: </strong> ${JSON.stringify(req.user)}</p>
        <p><a href="/logout">退出登录</a></p>
        <p><a href="/">返回首页</a></p>
    `);
});

// 管理页面（需要管理员权限）
app.get("/admin", isAdmin, (req, res) => {
  res.send(`
        <h1>管理员面板</h1>
        <p><strong>req.sessionID: </strong> ${req.sessionID}</p>
        <p><strong>req.session: </strong> ${JSON.stringify(req.session)}</p>
        <p><strong>req.isAuthenticated(): </strong> ${req.isAuthenticated()}</p>
        <p><strong>req.user: </strong> ${JSON.stringify(req.user)}</p>
        <p><a href="/logout">退出登录</a></p>
        <p><a href="/">返回首页</a></p>
    `);
});

// 退出登录
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("退出登录时发生错误:", err);
      res.status(500).send("退出登录失败");
    }
    req.session.destroy((err) => {
      if (err) {
        console.error("销毁 session 时发生错误:", err);
        res.status(500).send("退出登录失败");
      }
      res.clearCookie("easyblog.sid");
      res.redirect("/?message=已成功退出登录");
    });
  });
});

// 🚀 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`local测试账号: 管理员: admin / cisco, 普通用户: jack / cisco`);
});
