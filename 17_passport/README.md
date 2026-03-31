[← 返回首页](../readme.md)

# 第 17 章：Passport.js 认证中间件

本章在第 16 章 Session 的基础上，引入 Passport.js，深入理解认证中间件如何与 Session 协作。重点是观察和理解**序列化 / 反序列化**机制。

技术栈：Express + TypeScript（tsx）+ Passport.js + express-session + connect-sqlite3

## 启动方式

```bash
cd codes
npm install

# 本地策略（app.ts）
npm run dev

# Google OAuth（app-google.ts，需配置 config.ts）
npm run dev-google
```

访问 `http://localhost:3000`，测试账号：`admin / cisco`，`jack / cisco`

---

## 本章学习目标

本章**以观察为主，不需要动手实现**。反复测试以下流程，观察控制台日志和浏览器 Session 状态：

1. 登录 → 观察序列化日志
2. 访问受保护页面 → 观察反序列化日志
3. 退出 → 观察 Session 清除过程

---

## 17.1 Passport 简介

Passport 是专为 Node.js 设计的**认证中间件**，核心特点：

- **不替代 Session**：Passport 依赖 express-session 存储数据，两者协作使用
- **策略模式（Strategy）**：把不同认证方式（本地用户名密码、Google OAuth、JWT 等）抽象为独立的"策略"，主代码无需改动
- **统一接口**：无论哪种策略，登录后都通过 `req.user` 访问当前用户，通过 `req.isAuthenticated()` 检查登录状态

与第 16 章纯 Session 方式对比：

| 对比项            | 第 16 章（纯 Session）             | 第 17 章（Passport）          |
| ----------------- | ---------------------------------- | ----------------------------- |
| 用户存入 Session  | `req.session.user = user`（整个对象）| 只存 `user.id`（由 Passport 序列化）|
| 检查登录状态      | `req.session.user` 是否存在        | `req.isAuthenticated()`       |
| 访问当前用户      | `req.session.user`                 | `req.user`                    |
| 添加更多登录方式  | 需要大量改动主代码                  | 注册新策略，主代码不变         |

---

## 17.2 安装与中间件配置

```bash
npm install passport passport-local passport-google-oauth20
npm install @types/passport @types/passport-local @types/passport-google-oauth20
```

**中间件挂载顺序（不能颠倒）：**

```typescript
app.use(session({ ... }));           // 1. 先启动 Session
app.use(passport.initialize());      // 2. 初始化 Passport
app.use(passport.session());         // 3. 启用 Passport 的 Session 支持
```

`passport.initialize()` 在 `req` 上注入 `isAuthenticated()`、`user`、`login()`、`logout()` 等方法。`passport.session()` 则在每次请求时自动调用反序列化，把 Session 里存的 ID 还原成完整的用户对象。

Passport 在 `req` 上挂载的属性和方法：

```typescript
req.isAuthenticated()  // 检查是否已登录
req.user               // 当前登录的用户对象（未登录时为 undefined）
req.login(user, cb)    // 手动登录（API 路由中使用）
req.logout(cb)         // 登出
```

---

## 17.3 配置本地策略（LocalStrategy）

策略的作用是：**拿到用户提交的凭证，决定认证成功还是失败**。

```typescript
passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "username", // 表单字段名（默认就是 username）
      passwordField: "password", // 表单字段名（默认就是 password）
    },
    (username, password, done) => {
      const user = findUser(username);

      if (!user) {
        return done(null, false, { message: "用户名不存在" }); // 认证失败
      }
      if (user.password !== password) {
        return done(null, false, { message: "密码错误" });      // 认证失败
      }

      return done(null, user); // 认证成功，传入用户对象
    },
  ),
);
```

`done` 回调的三种情况：

| 调用方式                        | 含义           |
| ------------------------------- | -------------- |
| `done(null, user)`              | 认证成功       |
| `done(null, false, { message })` | 认证失败（非错误）|
| `done(err)`                     | 系统错误       |

---

## 17.4 序列化与反序列化（最重要！）

这是 Passport 与纯 Session 最大的区别，也是本章的核心概念。

### 问题：为什么不直接把整个用户对象存进 Session？

Session 存储在数据库里，如果用户对象很大（有头像、权限列表等），每次请求都要把大量数据写入/读出 Session store，开销很高。而且用户信息可能变化（比如改了昵称），Session 里存的就是旧数据。

### Passport 的解法：只存 ID

```typescript
// 序列化：登录成功后，Passport 问"存什么进 Session？"
passport.serializeUser((user, done) => {
  done(null, (user as User).id); // 只存 ID，例如：1
});

// 反序列化：每次请求时，Passport 问"根据 Session 里的 ID，给我完整的用户对象"
passport.deserializeUser((id, done) => {
  const user = findUserById(id as number); // 从数据库查最新数据
  if (user) {
    return done(null, user);
  }
  return done(new Error("用户不存在"));
});
```

### 整个生命周期

```
POST /login
  → LocalStrategy 验证通过，返回 user 对象
  → serializeUser(user, done) 被调用
  → done(null, user.id)  →  Session 里存入 { passport: { user: 1 } }
  → 响应客户端（Set-Cookie: easyblog.sid=...）

GET /profile（携带 Cookie）
  → express-session 读取 Session，找到 { passport: { user: 1 } }
  → deserializeUser(1, done) 被调用
  → 从数据库查询 id=1 的用户 → done(null, user)
  → req.user = user（完整用户对象）
  → req.isAuthenticated() 返回 true
  → 路由处理函数执行
```

用图来理解：

```
浏览器                     服务器                      Session Store
  |                          |                               |
  |-- POST /login ---------->|                               |
  |                     验证通过                              |
  |                   serializeUser                          |
  |                   存入 user.id=1                         |
  |                          |-------- 写入 id=1 ----------->|
  |<-- Set-Cookie: sid=abc --|                               |
  |                          |                               |
  |-- GET /profile (sid=abc)->|                              |
  |                          |------- 读取 sid=abc -------->|
  |                          |<------ { user: 1 } ----------|
  |                   deserializeUser(1)                     |
  |                   查到完整用户对象                        |
  |                   req.user = { id:1, username:"admin"...}|
  |<-- 200 个人资料页 --------|                               |
```

在数据库中观察 Session 数据结构（`db/sessions.db` 的 `sessions` 表）：

![Session 存储](./assets/passport_session.png)

Session 里存储的内容类似：`{"cookie":{...},"passport":{"user":1}}`，只有一个 ID，而不是完整的用户数据。

---

## 17.5 登录流程

`passport.authenticate("local", options)` 是一个**返回中间件的函数**，它内部会调用 LocalStrategy，并根据结果决定下一步：

```typescript
// 表单提交方式（最简洁）
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/?message=登录成功",
    failureRedirect: "/login?error=用户名或密码错误",
  }),
);
```

API 路由中需要返回 JSON 而不是重定向，此时用**手动回调方式**：

```typescript
app.post("/api/auth/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return res.status(500).json({ error: "系统错误" });
    if (!user) return res.status(401).json({ error: info?.message });

    // 手动调用 req.login() 写入 Session
    req.login(user, (err) => {
      if (err) return res.status(500).json({ error: "登录失败" });
      res.json({ success: true, user });
    });
  })(req, res, next); // ← 注意：需要立即调用，传入 req/res/next
});
```

两种方式的对比：

| 方式             | 适用场景     | Session 写入     |
| ---------------- | ------------ | ---------------- |
| `options` 对象   | 表单提交、重定向 | Passport 自动完成 |
| 手动回调         | API、需要自定义响应 | 需手动调用 `req.login()` |

---

## 17.6 登录状态判断

Passport 提供的守卫写法比第 16 章更简洁：

```typescript
// 第 16 章（纯 Session）
function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.redirect("/auth/login");
}

// 第 17 章（Passport）
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next(); // ← 直接调用方法
  res.redirect("/login?error=需要登录才能访问此页面");
}

function isAdmin(req, res, next) {
  if (req.isAuthenticated() && (req.user as User).role === "admin") return next();
  res.redirect("/login?error=需要管理员权限");
}
```

使用方式不变：

```typescript
app.get("/profile", isAuthenticated, (req, res) => { ... });
app.get("/admin",   isAdmin,          (req, res) => { ... });
```

---

## 17.7 退出登录

退出需要三步，顺序不能乱：

```typescript
app.get("/logout", (req, res) => {
  // 第一步：Passport 清除 req.user，并从 Session 中删除 passport 字段
  req.logout((err) => {
    if (err) return res.status(500).send("退出失败");

    // 第二步：销毁整个 Session（从 Session store 中删除记录）
    req.session.destroy((err) => {
      if (err) return res.status(500).send("退出失败");

      // 第三步：通知浏览器删除 Cookie
      res.clearCookie("easyblog.sid");
      res.redirect("/");
    });
  });
});
```

为什么需要三步？

- `req.logout()` 只清除内存中的认证状态，但 Session 记录仍在 store 里
- `req.session.destroy()` 才真正删除 store 中的 Session 记录
- `res.clearCookie()` 通知浏览器删除 Cookie（否则浏览器还会带着已失效的 Cookie 发请求）

---

## 17.8 Google OAuth 2.0（app-google.ts）

OAuth 2.0 是一种**授权协议**，让用户用第三方账号（Google、GitHub 等）登录，无需在本站注册密码。

### 配置步骤

1. 在 [Google Cloud Console](https://console.cloud.google.com/) 创建项目，开启 OAuth 2.0 凭据
2. 设置回调 URL：`http://localhost:3000/auth/google/callback`
3. 将 Client ID 和 Secret 填入 `config.ts`

```typescript
// config.ts
export const config = {
  clientID: "replace-with-your-client-id.apps.googleusercontent.com",
  clientSecret: "replace-with-your-client-secret",
  callbackURL: "/auth/google/callback",
};
```

### GoogleStrategy 配置

与 LocalStrategy 不同，Google 策略的回调参数是 OAuth 返回的用户信息（`profile`）：

```typescript
passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: config.clientID,
      clientSecret: config.clientSecret,
      callbackURL: config.callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails?.[0]?.value;

      // 三步查找逻辑
      // 1. 通过 Google ID 查找 → 已用 Google 登录过的老用户
      let user = findUserByGoogleId(profile.id);
      if (user) return done(null, user);

      // 2. 通过邮箱查找 → 用邮箱注册过但从未用 Google 登录的用户
      if (email) {
        user = findUserByEmail(email);
        if (user) {
          user.googleId = profile.id; // 绑定 Google ID
          return done(null, user);
        }
      }

      // 3. 都没找到 → 全新用户，自动注册
      const newUser = createUser({
        username: profile.displayName,
        email: email || "",
        googleId: profile.id,
        provider: "google",
      });
      return done(null, newUser);
    },
  ),
);
```

### Google OAuth 路由

```typescript
// 发起授权：跳转到 Google 授权页面
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"], // 申请权限范围
    prompt: "select_account",    // 弹出账号选择
  }),
);

// 回调处理：Google 授权完成后重定向到这里
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/?message=google登录成功",
    failureRedirect: "/login?error=Google登录失败",
  }),
);
```

### OAuth 2.0 完整流程

```
用户点击"使用 Google 登录"
  → GET /auth/google
  → 重定向到 Google 授权页（accounts.google.com/...）

用户在 Google 授权页同意授权
  → Google 重定向回 GET /auth/google/callback?code=xxx
  → Passport 用 code 换取 accessToken
  → GoogleStrategy 回调执行（查找或创建用户）
  → serializeUser 把 user.id 写入 Session
  → 重定向到首页
```

序列化/反序列化的逻辑对 Google 用户和本地用户完全相同：都是存 `user.id`，之后每次请求都通过 `findUserById` 还原。这正是 Passport 策略模式的价值——无论什么登录方式，后续的 Session 管理代码一字不改。
