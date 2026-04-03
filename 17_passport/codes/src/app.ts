// express-session 只会添加这些到 req 对象：
// req.sessionID  // session ID
// req.session    // session 数据对象

// passport.initialize() 和 passport.session() 会添加：
// req.isAuthenticated()  // 检查是否已认证的方法
// req.user              // 当前登录的用户对象（如果已认证）
// req.login()           // 登录方法
// req.logout()          // 登出方法

import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
// @ts-ignore
import connectSqlite3 from "connect-sqlite3";

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
    email: "admin@abc.com",
  },
  {
    id: 2,
    username: "jack",
    password: "cisco",
    role: "user",
    email: "jack@abc.com",
  },
];

// 🔍 根据用户名查找用户的辅助函数
function findUser(username: string) {
  return users.find((user) => user.username === username);
}

// 🔍 根据ID查找用户的辅助函数
function findUserById(id: number) {
  return users.find((user) => user.id === id);
}

// 🎯 配置 Passport Local Strategy
passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "username", // 指定用户名字段名
      passwordField: "password", // 指定密码字段名
    },
    (username, password, done) => {
      console.log(`🔐 尝试登录: ${username}`);

      // 查找用户
      const user = findUser(username);

      if (!user) {
        console.log(`❌ 用户不存在: ${username}`);
        return done(null, false, { message: "用户名不存在" });
      }

      // 验证密码（实际项目中应该使用 bcrypt 等加密库）
      if (user.password !== password) {
        console.log(`❌ 密码错误: ${username}`);
        return done(null, false, { message: "密码错误" });
      }

      console.log(`✅ 登录成功: ${username}`);
      return done(null, user); // 验证成功，返回用户对象
    },
  ),
);

// 📦 序列化用户：将用户对象转换为存储在 session 中的标识符
passport.serializeUser((user, done) => {
  console.log(`📦 序列化用户: ${JSON.stringify(user)})`);
  done(null, (user as User).id); // 只存储用户 ID 到 session
});

// 📤 反序列化用户：根据 session 中的标识符重建用户对象
passport.deserializeUser((id, done) => {
  console.log(`📤 反序列化用户 ID: ${id}`);
  const user = findUserById(id as number);

  if (user) {
    console.log(`📤 反序列化找到用户: ${JSON.stringify(user)}`);
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

// 登录页面路由
app.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/profile"); // 已登录用户重定向到profile页面
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
    `);
});

// 处理登录表单提交
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/?message=local登录成功", // 登录成功重定向到首页
    failureRedirect: "/login?error=登录失败，请检查用户名和密码", // 登录失败重定向
  }),
  // 会自动接收表单中提交的用户名和密码
);

// 个人资料页面（需要登录）
app.get("/profile", isAuthenticated, (req, res) => {
  res.send(`
            <h1>个人资料</h1>
            <p><strong>req.sessionID: </strong> ${req.sessionID}</p>
            <p><strong>req.session: </strong> ${JSON.stringify(req.session)}</p>
            <p><strong>req.isAuthenticated(): </strong> ${req.isAuthenticated()}</p>
            <p><strong>req.user: </strong> ${JSON.stringify(req.user)}</p>
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
    `);
});

// 退出登录
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("退出登录时发生错误:", err);
      res.status(500).send("退出登录失败");
    }
    // 销毁 session
    req.session.destroy((err) => {
      if (err) {
        console.error("销毁 session 时发生错误:", err);
        res.status(500).send("退出登录失败");
      }
      // 清除 cookie
      res.clearCookie("easyblog.sid");
      res.redirect("/?message=已成功退出登录");
    });
  });
});

// 附录：供参考，专门的 API 登录路由
app.post("/api/auth/login", (req, res, next) => {
  console.log("API 登录请求:", req.body);

  passport.authenticate("local", (err: any, user: any, info: any) => {
    const response = {
      timestamp: new Date().toISOString(),
      sessionId: req.sessionID,
      success: false,
      message: "",
      data: null as any,
      error: null as any,
    };

    if (err) {
      response.success = false;
      response.message = "认证过程中发生错误";
      response.error = {
        code: "AUTHENTICATION_ERROR",
        details: err.message,
      };
      return res.status(500).json(response);
    }

    if (!user) {
      response.success = false;
      response.message = info?.message || "用户名或密码错误";
      response.error = {
        code: "INVALID_CREDENTIALS",
        details: info,
      };
      return res.status(401).json(response);
    }

    req.login(user, (err) => {
      if (err) {
        response.success = false;
        response.message = "登录失败";
        response.error = {
          code: "LOGIN_ERROR",
          details: err.message,
        };
        return res.status(500).json(response);
      }

      response.success = true;
      response.message = "登录成功";
      response.data = {
        user: {
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          email: user.email,
        },
        sessionInfo: {
          sessionId: req.sessionID,
          isAuthenticated: req.isAuthenticated(),
          loginTime: new Date().toISOString(),
        },
      };

      res.json(response);
    });
  })(req, res, next);
});

// API 退出登录
app.post("/api/auth/logout", (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({
      success: false,
      message: "用户未登录",
    });
  }

  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "退出登录失败",
        error: err.message,
      });
    }

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "销毁会话失败",
          error: err.message,
        });
      }

      res.clearCookie("easyblog.sid");
      res.json({
        success: true,
        message: `用户 ${(req.user as any).username} 已成功退出登录`,
      });
    });
  });
});

// 获取当前用户信息 API
app.get("/api/auth/me", (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({
      success: false,
      message: "用户未登录",
      isAuthenticated: false,
    });
  }

  res.json({
    success: true,
    message: "获取用户信息成功",
    isAuthenticated: true,
    user: req.user,
    sessionId: req.sessionID,
  });
});

// 🚀 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`测试账号: 管理员: admin / cisco, 普通用户: jack / cisco`);
});
