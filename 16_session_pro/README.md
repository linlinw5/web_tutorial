[← 返回首页](../readme.md)

# 第 16 章（进阶）：基于 Session 的用户认证系统

本章是 Session 的完整应用案例：从零搭建一个支持注册、登录、权限保护的用户认证系统。

技术栈：Express + TypeScript（tsx）+ SQLite + EJS + bcrypt + express-session

## 启动方式

```bash
# 后端
cd codes/backend
npm install
npm run dev

# 前端（另开一个终端）
cd codes/frontend
tsc -w
```

访问 `http://localhost:3000`

---

## 设计思路：先 API，后页面

本章的开发顺序刻意安排为：**先写 API 接口，用 `api_test.http` 验证通过，再写前端页面**。

这样做的好处：

- 接口逻辑和界面逻辑分离，哪里出问题一目了然
- 接口调试完毕后，前端只需关注 `fetch` 调用和 UI 交互

---

## 16.1 项目结构

```
16_session_pro/
  codes/
    backend/
      src/
        app.ts                    ← 入口：中间件 + 路由挂载
        db/
          ConnectionManager.ts    ← 自动初始化数据库（重点）
          users.ts                ← createUser / checkPassword（含 bcrypt）
          groups.ts               ← getAllGroups
        routes/
          api_auth.ts             ← POST /api/auth/register + /api/auth/login
          auth.ts                 ← Web 路由（含 isAuthenticated / isAdmin 守卫）
        utils/
          authCheck.ts            ← isAuthenticated / isAdmin 中间件
          shutdownConnection.ts   ← 优雅退出
      views/                      ← EJS 模板
      public/js/                  ← 前端编译产物
      data/
        db.sqlite                 ← 用户数据库（自动建表）
        sessions.db               ← Session 存储
    frontend/
      src/
        login.ts                  ← 登录表单 fetch 脚本
        register.ts               ← 注册表单 fetch 脚本
      tsconfig.json               ← 编译到 backend/public/js/
  api_test.http                   ← 接口测试（VS Code REST Client）
```

---

## 16.2 ConnectionManager：自动初始化数据库

这是本章升级版的 `ConnectionManager`，与之前章节的最大区别是：**首次连接时自动建表、自动插入初始数据**，不需要提前手动执行 SQL 脚本。

```typescript
export class ConnectionManager {
  private static db: Database | null = null;

  private static async initializeSchema(db: Database): Promise<void> {
    await db.exec("PRAGMA foreign_keys = ON;");

    // 建表（如果不存在）
    await db.exec(`
      CREATE TABLE IF NOT EXISTS groups ( ... );
      CREATE TABLE IF NOT EXISTS users  ( ... );
    `);

    // 插入初始分组数据（如果 groups 表为空）
    const groupCount = await db.get("SELECT COUNT(*) as count FROM groups");
    if (!groupCount || groupCount.count === 0) {
      await db.run("INSERT INTO groups (name) VALUES (?), (?), (?)", ["admin", "editor", "user"]);
    }
  }

  public static async getConnection(): Promise<Database> {
    if (!this.db) {
      this.db = await open({ filename: "./data/db.sqlite", driver: sqlite3.Database });
      await this.initializeSchema(this.db); // ← 只在首次连接时执行
    }
    return this.db; // 单例：后续调用直接返回已有连接
  }

  public static async closeConnection(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }
}
```

**关键设计点：**

| 特性         | 说明                                                                     |
| ------------ | ------------------------------------------------------------------------ |
| 单例模式     | `private static db` 保证全局只有一个连接                                 |
| 自动建表     | `CREATE TABLE IF NOT EXISTS` 保证幂等                                    |
| 自动初始数据 | 先 COUNT 再 INSERT，避免重复插入                                         |
| 优雅退出     | `shutdownConnection.ts` 在收到 SIGINT/SIGTERM 时调用 `closeConnection()` |

---

## 16.3 密码加密：bcrypt

明文密码绝对不能存数据库。本章使用 `bcrypt` 进行**单向哈希**：

```typescript
import bcrypt from "bcrypt";
const saltRounds = 12; // 哈希强度，数字越大越慢但越安全

// 注册时：哈希密码
const hashedPassword = await bcrypt.hash(password, saltRounds);
await db.run("INSERT INTO users (..., password, ...) VALUES (..., ?, ...)", [hashedPassword]);

// 登录时：对比密码
const isMatch = await bcrypt.compare(plainTextPassword, hashedPasswordFromDB);
// bcrypt.compare 内部处理了 salt，直接比对即可
```

**为什么不能用 MD5 或 SHA？**

- MD5/SHA 是通用哈希，速度极快，容易被彩虹表爆破
- bcrypt 有内置的随机 salt，且可以调节计算成本（`saltRounds`），专门为密码设计

**`checkPassword` 中的一个技巧：**

```typescript
// 查询结果包含 password 字段（哈希值），但不应返回给调用方
const { password: _, ...userInfo } = user;
// 解构时把 password 提取出来，赋给 _（约定俗成表示"不使用"）
// 其余字段收集进 userInfo，安全地返回
return userInfo;
```

---

## 16.4 API 路由：先写接口

`src/routes/api_auth.ts` 挂载在 `/api/auth`：

| 方法 | 路径                 | 说明                                                    |
| ---- | -------------------- | ------------------------------------------------------- |
| POST | `/api/auth/register` | 注册新用户，成功返回 201                                |
| POST | `/api/auth/login`    | 登录，成功后将用户信息写入 `req.session.user`，返回 200 |

**登录接口的核心一行：**

```typescript
const user = await checkPassword(username, password); // 验证密码
req.session.user = user; // 登录状态写入 session
res.status(200).json({ message: "Login successful", user });
```

从这一刻起，后续所有携带 Cookie 的请求，`req.session.user` 都会有值。

用 `codes/backend/api_test.http` 测试接口，不需要打开浏览器。

---

## 16.5 authCheck：认证中间件

有了 Session 之后，路由守卫可以提取为独立的中间件，而不是在每个路由里重复写 `if (!req.session.user)`：

```typescript
// utils/authCheck.ts

export const isAuthenticated = (req, res, next) => {
  if (req.session.user) return next(); // 已登录，放行
  res.redirect("/auth/login"); // 未登录，跳转登录页
};

export const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.group_id === 1) return next();
  res.status(403).render("error", {
    // 无权限，返回 403
    title: "Access Denied",
    image_name: "403.png",
    user: req.session.user,
  });
};
```

使用时直接作为路由的第二个参数：

```typescript
router.get("/profile", isAuthenticated, (req, res) => { ... });
router.get("/admin",   isAdmin,          (req, res) => { ... });
```

对比重构前后：

```typescript
// ❌ 重构前：每个路由都要写
router.get("/profile", (req, res) => {
  if (!req.session.user) return res.redirect("/auth/login");
  res.render("profile", { ... });
});

// ✅ 重构后：中间件复用
router.get("/profile", isAuthenticated, (req, res) => {
  res.render("profile", { ... });
});
```

---

## 16.6 Web 路由设计

`src/routes/auth.ts` 挂载在 `/auth`：

| 路由                 | 守卫              | 说明                                        |
| -------------------- | ----------------- | ------------------------------------------- |
| `GET /auth`          | 无                | 首页，显示导航链接                          |
| `GET /auth/register` | 无                | 注册表单（SSR，从 DB 查 groups 填充下拉框） |
| `GET /auth/login`    | 无                | 登录表单；已登录则重定向到 `/auth/profile`  |
| `GET /auth/profile`  | `isAuthenticated` | 个人资料页，未登录跳转登录                  |
| `GET /auth/admin`    | `isAdmin`         | 管理员页，非管理员返回 403                  |
| `GET /auth/logout`   | 无                | 销毁 session + 清除 Cookie                  |

**注意 `/auth/login` 的防重复登录逻辑：**

```typescript
router.get("/login", (req, res) => {
  if (req.session.user) {
    res.redirect("/auth/profile"); // 已登录不让再看登录页
  } else {
    res.render("login", { ... });
  }
});
```

**`/auth/logout` 的正确写法：**

```typescript
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    // 从 session store 删除记录
    if (err) return res.status(500).send("Could not log out.");
    res.clearCookie("easyblog.sid"); // 通知浏览器清除 Cookie
    res.redirect("/auth");
  });
});
```

---

## 16.7 前端脚本：Fetch 交互

登录和注册页面的表单不使用传统的 `action` 提交，而是通过前端 TypeScript 脚本拦截 submit 事件，手动发 `fetch`：

```typescript
// frontend/src/login.ts
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // 阻止默认提交（不跳转页面）

  const formData = new FormData(event.target as HTMLFormElement);
  const data = {
    username: formData.get("username") as string,
    password: formData.get("password") as string,
  };

  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    window.location.href = "/auth/profile"; // 登录成功跳转
  } else {
    const { error } = await response.json();
    alert(error);
  }
});
```

**前端编译配置（`frontend/tsconfig.json`）：**

```json
{
  "compilerOptions": {
    "outDir": "../backend/public/js"  ← 编译产物直接输出到 backend 的静态目录
  }
}
```

EJS 模板中引用编译后的 JS：

```html
<script src="/js/login.js"></script>
← 由 Express 的 static 中间件提供
```

---

## 16.8 页面效果

-首页

![首页](./assets/auth.png)

-登录页

![登录](./assets/login.png)

-注册页

![注册](./assets/register.png)

-个人资料页

![个人资料](./assets/profile.png)

-管理员页（有权限）

![管理员](./assets/admin_page.png)

-管理员页（无权限）

![403](./assets/admin_page_403.png)
