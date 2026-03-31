[← 返回首页](../readme.md)

# 第 16 章：HTTP 会话管理——Session 探索

本章以**观察为主**，不要求从零编写代码，而是运行提供好的服务器，通过浏览器 DevTools、服务器日志和数据库文件，亲眼看清 Session 的完整生命周期。

## 启动方式

```bash
cd codes
npm install

# SQLite 版本（主要演示）
npm run dev

# PostgreSQL 版本（对比演示）
npm run dev-pg    # 需先修改 src/app-pg.ts 中的 dbConfig
```

测试账号：`admin / cisco`（管理员）、`jack / cisco`（普通用户）

---

## 16.1 为什么需要 Session？

HTTP 是**无状态协议**——每一次请求对服务器来说都是陌生的，它不会记得上一次请求是谁发的。

这带来了一个现实问题：用户登录之后，下一个请求怎么让服务器知道"我还是刚才那个人"？

常见的解决思路：

| 方案 | 做法 | 问题 |
|---|---|---|
| 每次都带账号密码 | 请求时带 `Authorization` 头 | 密码频繁传输，安全风险高 |
| 把用户信息存 Cookie | 直接把 userId 写到 Cookie | 客户端可以随意篡改 |
| Session | 服务端存用户信息，Cookie 只存一个 ID | 安全，ID 本身没有意义 |

**Session 的工作原理：**

```
1. 用户登录成功
      ↓
2. 服务器创建一条 Session 记录，存入 Session Store（数据库）
   Session 内容：{ user: { id, username, role } }
      ↓
3. 服务器生成一个随机 Session ID，通过 Set-Cookie 发给浏览器
   Set-Cookie: easyblog.sid=s%3Axxx...
      ↓
4. 浏览器后续每次请求都自动带上这个 Cookie
   Cookie: easyblog.sid=s%3Axxx...
      ↓
5. 服务器收到请求，用 Cookie 里的 ID 查 Session Store，恢复用户信息
   → req.session.user 就有数据了
```

---

## 16.2 代码结构：A → Session 中间件 → B

`app.ts` 的中间件顺序是本章最重要的设计：

```
请求进入
   │
   ▼
日志中间件 A    ← 打印"session 中间件处理之前"的 req 状态
   │
   ▼
Session 中间件  ← 读取 Cookie，查 Session Store，将数据挂载到 req.session
   │
   ▼
日志中间件 B    ← 打印"session 中间件处理之后"的 req 状态
   │
   ▼
路由处理器
```

**中间件 A** 关注的是请求的原始状态：

```typescript
console.log("req.headers: ", req.headers);         // 浏览器发来的原始 headers（含 Cookie）
console.log("❌ req.sessionID: ", req.sessionID);  // 此时还是 undefined
console.log("❌ req.session: ",   req.session);    // 此时还是 undefined
```

**中间件 B** 关注 session 中间件挂载的结果：

```typescript
console.log("✅ req.sessionID: ", req.sessionID);  // 已有值
console.log("✅ req.session: ",   req.session);    // 已有结构，登录后含 user 对象
```

两个中间件夹住 Session 中间件，清晰地展示了：**`req.session` 是 Session 中间件动态注入到 request 对象上的，不是请求自带的**。

---

## 16.3 Session 中间件配置详解

```typescript
app.use(session({
    secret: "topsecret",      // 签名密钥，防止客户端伪造 Session ID
    resave: false,            // session 未修改时不重新写入 store（减少 IO）
    saveUninitialized: false, // 未登录的匿名 session 不存入 store（节省空间）
    name: "easyblog.sid",     // Cookie 名称，默认是 connect.sid

    cookie: {
        secure: false,        // true = 仅 HTTPS 传输（生产环境应开启）
        httpOnly: true,       // 禁止前端 JS 读取此 Cookie（防 XSS）
        maxAge: 5 * 60 * 1000,// Cookie 有效期 5 分钟
        sameSite: "strict"    // 仅同源请求携带（防 CSRF）
    },

    store: new SQLiteStore({  // Session 持久化存储
        db: 'sessions.db',
        table: 'sessions',
        dir: './db',
    }),
}));
```

### TypeScript 接口扩展

`express-session` 默认的 `SessionData` 类型没有 `user` 字段，需要用模块扩充（module augmentation）来补充：

```typescript
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
```

这样 `req.session.user` 才能获得正确的 TypeScript 类型检查。

---

## 16.4 观察实验：跟着这个步骤做

### 第一步：首次访问（无 Cookie）

打开浏览器访问 `http://localhost:3000`，观察：

**服务器日志（中间件 A）：**
```
req.headers: { host: 'localhost:3000', ... }
// 注意：headers 里没有 Cookie 字段
❌ req.sessionID: undefined
❌ req.session:   undefined
```

**服务器日志（中间件 B）：**
```
✅ req.sessionID: xxxxxxxxxxxxxxxxxxxxxxxx   ← 随机生成的 ID
✅ req.session:   Session { cookie: { ... } } ← 空 session，无 user
```

**浏览器 DevTools（F12 → Application → Storage → Cookies）：**
- 此时 Cookie 列表中**看不到** `easyblog.sid`——因为 `saveUninitialized: false`，匿名 session 不写入 store，服务器也不会下发 `Set-Cookie` 响应头

### 第二步：多次刷新（未登录）

每次刷新页面，观察日志：
- **未登录状态下，每次请求的 `sessionID` 都不同**——浏览器虽然带着 Cookie，但 store 里没有对应记录，Session 中间件每次都生成新 ID

### 第三步：登录

访问 `/login`，输入 `admin / cisco` 登录成功，观察：

**服务器日志：**
```
✅ req.session: Session {
    cookie: { ... },
    user: { id: 1, username: 'admin', role: 'admin', email: 'admin@abc.com' }
}
```

**浏览器 DevTools（F12 → Application → Storage → Cookies）：**
- 登录后 `easyblog.sid` **首次出现**，此 Session ID 同步写入了 `sessions.db`

### 第四步：登录后再次刷新

多次刷新页面，观察：
- **sessionID 保持不变**——浏览器带着 Cookie，Session 中间件从 store 里找到对应记录，`req.session.user` 有值
- 中间件 A 的日志里 `req.headers.cookie` 可以看到 Cookie 被自动携带

### 第五步：查看数据库

用 VS Code 的 SQLite Viewer 插件或 DataGrip 打开 `codes/db/sessions.db`，查看 `sessions` 表：
- 可以看到刚才登录产生的 session 记录
- 字段包含：`sid`（Session ID）、`sess`（JSON 格式的 session 内容）、`expired`（过期时间）

![session 在数据库中的存储形式](./assets/session.png)

### 第六步：退出登录

访问 `/logout`，观察：

**服务器：**
```typescript
req.session.destroy()  // 从 store 删除这条 session 记录
res.clearCookie("easyblog.sid")  // 通知浏览器清除 Cookie
```

**浏览器 Cookie：**
- `easyblog.sid` 消失
- 此后访问 `/profile` 返回 401 Unauthorized

---

## 16.5 路由一览

| 路由 | 说明 |
|---|---|
| `GET /` | 首页，显示当前 sessionID 和 session 内容 |
| `GET /login` | 登录表单（已登录则重定向到 /profile） |
| `POST /login` | 处理登录，验证成功后将 user 写入 `req.session.user` |
| `GET /profile` | 受保护页面，未登录返回 401 |
| `GET /logout` | 销毁 session + 清除 Cookie |

---

## 16.6 app-pg.ts：换成 PostgreSQL Store

`app-pg.ts` 演示了将 session 存储从 SQLite 换为 PostgreSQL 的配置变化，其余路由逻辑完全相同。

**SQLite 版本：**
```typescript
import connectSqlite3 from "connect-sqlite3";
const SQLiteStore = connectSqlite3(session);

store: new SQLiteStore({
    db: 'sessions.db',
    table: 'sessions',
    dir: './db',
})
```

**PostgreSQL 版本：**
```typescript
import connectPg from "connect-pg-simple";
const pgStore = connectPg(session);

store: new pgStore({
    pool,                       // 传入已有的 pg.Pool 实例
    createTableIfMissing: true, // 自动建表
    tableName: "session"
})
```

两者的切换点只有一处：`store` 字段。**Session 中间件的接口是统一的**，适配器屏蔽了底层存储的差异——这是适配器模式的典型应用。

---

## 16.7 Session Store 的选型：SQLite、PostgreSQL 还是 Redis？

| | SQLite | PostgreSQL | Redis |
|---|---|---|---|
| 适用场景 | 本地开发、教学演示 | 中小型应用、不引入额外服务 | 生产环境、高并发 |
| 性能 | 低 | 中 | 极高（内存级，纳秒访问） |
| TTL 自动过期 | 需手动清理 | 需手动清理 | 原生支持（`EXPIRE` 命令） |
| 部署复杂度 | 无需安装 | 需要 PostgreSQL 服务 | 需要 Redis 服务 |
| 横向扩展 | 不支持 | 有限 | 容易 |

**为什么生产环境推荐 Redis？**

1. **天然 TTL**：`EXPIRE session_id 1800` 设置 30 分钟自动过期，无需定期清理过期 session
2. **内存级速度**：每次请求都会读 session，Redis 的百万 QPS 远优于数据库的磁盘 IO
3. **数据模型契合**：Session 本质就是 `{ key: sessionID, value: JSON }`，键值模型天然匹配
4. **易于水平扩展**：多台服务器可以共享同一个 Redis，轻松支持负载均衡

**推荐的实践分工：**

| 数据类型 | 存储方案 |
|---|---|
| 用户资料 / 订单 / 文章 | PostgreSQL |
| 登录状态（Session） | Redis（`connect-redis`） |
| 接口缓存 / 限流计数 | Redis |
