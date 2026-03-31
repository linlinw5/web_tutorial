[← 返回首页](../readme.md)

# 第 10 章：用 JavaScript 操作 SQLite 数据库

本章分两个阶段：

- **阶段一（`codes/01_demo_db`）**：用纯 Node.js 脚本演示 `sqlite` 包的增删改查，不涉及 HTTP 服务，只需运行一个 `.ts` 文件，观察数据库操作的结果。
- **阶段二（`codes/02_express_api`）**：将数据库操作整合进 Express，构建可以用 REST Client 测试的完整 API 服务。

## 目录约定

```
10_sqlite_api/
  README.md
  rest_client.http              ← 接口测试脚本（阶段二使用）
  codes/
    01_demo_db/                 ← 【阶段一】纯脚本演示 sqlite 操作
      package.json
      tsconfig.json
      src/
        demo_db.ts
      data/
        db.sqlite
    02_express_api/             ← 【阶段二】Express + sqlite 完整 API
      package.json
      tsconfig.json
      src/
        app.ts
        db/
          ConnectionManager.ts
      data/
        db.sqlite               ← 数据库文件
        init.sql                ← 建表 + 初始数据 SQL
  practice/
    01_demo_db/                 ← 同上，供学生练习
    02_express_api/
```

**阶段一工作流：**

```bash
cd codes/01_demo_db
npm install
npm run build
npm start           # node ./dist/demo_db.js
```

**阶段二工作流：**

```bash
cd codes/02_express_api
npm install
npm run dev
# 启动后用 rest_client.http 测试各接口
```

---

## 10.1 为什么用 `sqlite` 包

Node.js 操作 SQLite 有三个主流选择：

| 包 | 风格 | 说明 |
|---|---|---|
| `sqlite3` | 回调式 | 底层驱动，直接绑定 SQLite C 库，稳定但 API 较原始 |
| `sqlite` | Promise / async-await | 基于 `sqlite3` 封装，提供现代 API，与 `pg`（PostgreSQL）风格一致 |
| `better-sqlite3` | **同步** | 性能最好，但同步 API 与 `pg` 的 Promise 风格不兼容 |

本课程选择 `sqlite`：API 风格与后续章节的 `pg` 包高度相似，学会这套操作模式后可以平滑迁移到 PostgreSQL。

```bash
npm install sqlite sqlite3
```

---

## 10.2 阶段一：Node.js 脚本操作 sqlite

> 对应项目：`codes/01_demo_db`，完整代码见 `src/demo_db.ts`。

### 10.2.1 连接数据库

```typescript
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

const db: Database = await open({
    filename: "./data/db.sqlite", // 相对于 process.cwd()（运行命令的目录）
    driver: sqlite3.Database,
});
```

> `filename` 路径相对于**运行 `node` 命令时所在的目录**（`process.cwd()`），不是源文件的位置。在项目根目录运行 `node ./dist/demo_db.js` 时，`./data/db.sqlite` 指向的是项目根目录下的 `data/` 文件夹。

### 10.2.2 五个核心方法

| 方法 | 用途 | 返回值 |
|---|---|---|
| `db.exec(sql)` | 执行 DDL（建表、建索引），可含多条语句 | `void`（出错抛异常） |
| `db.run(sql, params?)` | 执行一条增/改/删语句 | `{ lastID, changes }` |
| `db.all(sql, params?)` | 查询多行 | 行对象数组 |
| `db.get(sql, params?)` | 查询单行（只返回第一条匹配） | 行对象或 `undefined` |
| `db.prepare(sql)` | 预编译语句（批量插入场景） | `Statement` 对象 |

**exec — 建表**

```typescript
// exec 可以包含多条语句，每条末尾必须有分号
await db.exec(`
    CREATE TABLE IF NOT EXISTS groups (
        id   INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT    NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS users (
        id         INTEGER  PRIMARY KEY AUTOINCREMENT,
        group_id   INTEGER,
        username   TEXT     NOT NULL UNIQUE,
        email      TEXT     NOT NULL UNIQUE,
        password   TEXT     NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE SET NULL
    );
`);
```

**run — 增 / 改 / 删**

```typescript
// 直接拼值（适合固定数据）
const r1 = await db.run(`INSERT INTO groups (name) VALUES ('Admin'), ('Editor'), ('Guest')`);
console.log(r1); // { lastID: 3, changes: 3 }

// ? 占位符（推荐：防止 SQL 注入）
const r2 = await db.run(
    "INSERT INTO users (username, email, password, group_id) VALUES (?, ?, ?, ?)",
    ["alice", "alice@example.com", "password123", 1]
);
console.log(r2); // { lastID: 1, changes: 1 }
```

`lastID` 是最后一条插入记录的自增 id；`changes` 是本次操作影响的行数。

**prepare — 批量插入**

```typescript
// 预编译一次，执行多次，比循环调用 run 性能更好
const stmt = await db.prepare(
    "INSERT INTO users (username, email, password, group_id) VALUES (?, ?, ?, ?)"
);
await stmt.run("bob",  "bob@example.com",  "pass123", 2);
await stmt.run("jack", "jack@example.com", "pass456", 3);
await stmt.finalize(); // 必须释放资源
```

**all / get — 查**

```typescript
// all：返回所有匹配行
const users = await db.all("SELECT * FROM users WHERE group_id = ?", [2]);

// get：只返回第一条匹配（无论有多少条）
const user = await db.get("SELECT * FROM users WHERE username = ?", ["alice"]);

// LIKE 模糊查询，% 表示任意字符
const user2 = await db.get("SELECT * FROM users WHERE email LIKE ?", ["%@abc.com"]);
```

### 10.2.3 ? 占位符与 SQL 注入防护

直接把用户输入拼进 SQL 字符串存在 SQL 注入风险：

```typescript
// ❌ 危险：用户输入 "' OR '1'='1" 即可绕过密码验证
const user = await db.get(`SELECT * FROM users WHERE username = '${username}'`);

// ✅ 安全：? 由数据库驱动处理转义，不会被解释为 SQL 语法
const user = await db.get("SELECT * FROM users WHERE username = ?", [username]);
```

凡是涉及外部输入（用户提交、请求参数）的地方，一律使用 `?` 占位符。

---

## 10.3 阶段二：构建操作 sqlite 的 REST API

> 对应项目：`codes/02_express_api`，接口测试使用根目录的 `rest_client.http`。

### 10.3.1 ConnectionManager：单例连接

每次请求都重新 `open` 数据库连接会有额外开销，实际项目中应该复用同一个连接对象。

```typescript
let db: Database | null = null;

export async function getConnection(): Promise<Database> {
    if (!db) {
        // 第一次调用时建立连接
        db = await open({
            filename: "./data/db.sqlite",
            driver: sqlite3.Database,
        });
    }
    return db; // 后续调用直接返回已有连接
}

export async function closeConnection(): Promise<void> {
    if (db) {
        await db.close();
        db = null;
    }
}
```

也可以用 Class 静态属性实现同样效果（见 `src/db/ConnectionManager.ts`），两种写法结果完全相同，选其一即可。

### 10.3.2 在 Express 路由中使用数据库

在每个路由处理函数中调用 `getConnection()` 获取连接，然后执行查询：

```typescript
app.get("/api/users/:id", async (req, res) => {
    const userId = Number(req.params.id);
    try {
        const db = await getConnection();
        const user = await db.get(
            `SELECT u.id, u.username, u.email, g.name AS group_name
             FROM users AS u
             JOIN groups AS g ON u.group_id = g.id
             WHERE u.id = ?`,
            [userId]
        );
        user ? res.json(user) : res.status(404).json({ error: "User not found" });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user" });
    }
});
```

### 10.3.3 分页查询

```typescript
// GET /api/users?page=2&limit=3
const page   = Number(req.query.page)  || 1;
const limit  = Number(req.query.limit) || 3;
const offset = (page - 1) * limit;       // 第 2 页：跳过前 3 条

const users    = await db.all("SELECT * FROM users LIMIT ? OFFSET ?", [limit, offset]);
const totalRow = await db.get("SELECT COUNT(*) as count FROM users");

res.json({ total: totalRow.count, page, limit, data: users });
```

`LIMIT` 控制每页条数，`OFFSET` 控制从第几条开始取。同时返回 `total`（总记录数）供前端计算总页数。

### 10.3.4 优雅退出

进程收到终止信号时，应先关闭数据库连接再退出，避免数据损坏：

```typescript
async function gracefulShutdown(signal: string) {
    console.log(`收到 ${signal}，正在关闭数据库连接...`);
    await closeConnection();
    process.exit(0);
}

process.on("SIGINT",  () => gracefulShutdown("SIGINT"));   // Ctrl+C
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));  // kill 命令 / 部署平台停止
```

| 信号 | 触发方式 |
|---|---|
| `SIGINT` | 用户在终端按 Ctrl+C |
| `SIGTERM` | `kill <pid>` 命令，或 Docker / PM2 停止容器时发送 |
