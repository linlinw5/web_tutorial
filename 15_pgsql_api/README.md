[← 返回首页](../readme.md)

# 第 15 章：用 Node.js 操作 PostgreSQL

本章分两个阶段：

- **阶段一（`codes/01_demo`）**：用纯 TypeScript 脚本演示 `pg` 包的增删改查，对比 `Client`（单连接）与 `Pool`（连接池）两种使用方式。
- **阶段二（`codes/02_express_api`）**：将 `pg` 整合进 Express，构建与第 10 章 SQLite API 功能对等的 REST API，用 `rest_client.http` 测试各接口。

## 目录结构

```
15_pgsql_api/
  README.md
  rest_client.http              ← 接口测试脚本（阶段二使用）
  codes/
    01_demo/                    ← 【阶段一】pg 基础操作演示
      tsconfig.json
      src/
        demo_db.ts              ← Client 单连接：增删改查 + $占位符
        demo_db_pool.ts         ← Pool 连接池：查询演示 + 优雅退出
    02_express_api/             ← 【阶段二】Express + pg 完整 API
      package.json
      tsconfig.json
      src/
        app.ts                  ← 路由与业务逻辑
        db/
          ConnectionManager.ts  ← 导出全局 Pool 实例
  practice/
    01_demo/                    ← 阶段一练习骨架
      tsconfig.json
      src/
        demo_db.ts              ← Client 模式 TODO
        demo_db_pool.ts         ← Pool 模式 TODO
    02_express_api/             ← 阶段二练习骨架
      package.json
      tsconfig.json
      src/
        app.ts                  ← 6 个路由 + 优雅退出 TODO
        db/
          ConnectionManager.ts  ← Pool 导出 TODO
```

> **注意：** 运行前需修改各文件 `dbConfig` 中的 `host` / `password` / `database` 为你自己的 PostgreSQL 配置。

---

## 阶段一：pg 基础操作（`codes/01_demo`）

```bash
cd codes/01_demo
npm init -y
npm install pg @types/pg tsx
npx tsx src/demo_db.ts
npx tsx src/demo_db_pool.ts
```

### 15.1 Client vs Pool

`pg` 是 Node.js 连接 PostgreSQL 的官方驱动，提供两种连接方式：

| | `pg.Client` | `pg.Pool` |
|---|---|---|
| 连接数 | 一次一个连接 | 维护多个连接，按需借用归还 |
| 适用场景 | 脚本、一次性任务 | Express 服务、高并发应用 |
| 生命周期 | 手动 `connect()` → 用完 `end()` | 应用启动时创建，关闭时 `pool.end()` |

**Client 用法（`demo_db.ts`）**

```typescript
import pg from 'pg';

const db = new pg.Client({
    host: "localhost", port: 5432,
    user: "postgres", password: "your_password", database: "mydb"
});

async function pgDemo() {
    try {
        await db.connect();
        const users = await db.query("SELECT * FROM users WHERE password = $1", ["password123"]);
        console.log(users.rows);
    } finally {
        await db.end(); // 用完必须手动关闭
    }
}
pgDemo();
```

**Pool 用法（`demo_db_pool.ts`）**

```typescript
import pg from 'pg';

const pool = new pg.Pool({
    host: "localhost", port: 5432,
    user: "postgres", password: "your_password", database: "mydb",
    max: 10,                    // 最大连接数
    idleTimeoutMillis: 30000,   // 空闲连接超时
    connectionTimeoutMillis: 2000
});

// 直接调用 pool.query()，无需手动 connect / end
const users = await pool.query("SELECT * FROM users");
console.log(users.rows);

// 应用退出时统一关闭连接池
process.on('SIGINT',  async () => { await pool.end(); });
process.on('SIGTERM', async () => { await pool.end(); });
```

### 15.2 与 SQLite（sqlite 包）的操作差异

两个包的最大区别是**方法粒度**：

| 场景 | sqlite 包 | pg 包 |
|---|---|---|
| 查询多行 | `db.all(sql)` | `pool.query(sql)` → `.rows` |
| 查询单行 | `db.get(sql)` | `pool.query(sql)` → `.rows[0]` |
| 执行写操作 | `db.run(sql)` | `pool.query(sql)` → `.rows`（可含 RETURNING） |
| 占位符语法 | `?` | `$1, $2, $3, ...` |

`pg` 只有一个 `query()` 方法，通过 `.rows` 访问结果，没有 `get` / `all` / `run` 的区分。

**占位符对比**

```typescript
// SQLite
db.run("INSERT INTO users (username, email) VALUES (?, ?)", [username, email]);

// PostgreSQL（$1 $2 有序编号，防止 SQL 注入）
pool.query("INSERT INTO users (username, email) VALUES ($1, $2)", [username, email]);
```

**利用 RETURNING 获取写操作返回值**

```typescript
// 插入后直接拿到含 id 的完整记录，无需再 SELECT
const result = await pool.query(
    "INSERT INTO users (username, email, password, group_id) VALUES ($1, $2, $3, $4) RETURNING *",
    [username, email, password, group_id]
);
const newUser = result.rows[0]; // { id: 11, username: '...', ... }
```

---

## 阶段二：Express + pg REST API（`codes/02_express_api`）

```bash
cd codes/02_express_api
npm install
npm run dev
# 启动后用 rest_client.http 测试各接口
```

### 15.3 ConnectionManager：导出全局 Pool

```typescript
// src/db/ConnectionManager.ts
import pg from 'pg';

export const pool = new pg.Pool({
    host: "localhost", port: 5432,
    user: "postgres", password: "your_password", database: "mydb",
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
```

整个应用共用一个 `pool` 实例，所有路由直接 `import { pool } from "./db/ConnectionManager.ts"` 即可，无需在每个请求中新建连接。

### 15.4 路由设计

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/users` | 查询用户列表（支持 `?page=&limit=` 分页） |
| GET | `/api/users/:id` | 查询单个用户（JOIN groups 返回 group_name） |
| POST | `/api/users` | 新增用户（RETURNING * 返回完整记录） |
| PATCH | `/api/users/:id` | 修改密码 |
| DELETE | `/api/users/:id` | 删除用户（204 No Content） |

**分页查询**

```typescript
app.get("/api/users", async (req, res) => {
    const page   = Number(req.query.page)  || 1;
    const limit  = Number(req.query.limit) || 3;
    const offset = (page - 1) * limit;

    const users = await pool.query(
        "SELECT * FROM users LIMIT $1 OFFSET $2", [limit, offset]
    );
    const total = await pool.query("SELECT COUNT(*) as count FROM users");
    res.json({ total: total.rows[0].count, data: users.rows });
});
```

**JOIN 查询（单个用户）**

```typescript
app.get("/api/users/:id", async (req, res) => {
    const query = `
        SELECT u.id, u.username, u.email, g.name as group_name
        FROM users u
        JOIN groups g ON u.group_id = g.id
        WHERE u.id = $1
    `;
    const user = await pool.query(query, [Number(req.params.id)]);
    if (user.rows.length > 0) {
        res.json(user.rows[0]);
    } else {
        res.status(404).json({ error: "User not found" });
    }
});
```

**优雅退出**

```typescript
process.on("SIGINT",  async () => { await pool.end(); process.exit(0); });
process.on("SIGTERM", async () => { await pool.end(); process.exit(0); });
```

收到终止信号时先关闭连接池、释放所有数据库连接，再退出进程。

### 15.5 rest_client.http 接口测试

使用 VS Code REST Client 插件打开根目录的 `rest_client.http`，每个请求块可以单独点击"Send Request"执行。

测试覆盖了：
- 分页查询（page / limit 参数）
- JOIN 查询（返回 group_name）
- 新增用户（含必填字段校验，期望 400）
- 修改密码（含不存在用户，期望 404）
- 删除用户（期望 204）
- 访问不存在路由（期望 404）

---

## 练习

`practice/` 目录按阶段提供骨架代码，每个文件仅保留 import 和 TODO 注释，需自行填充实现。

**阶段一（`practice/01_demo`）**

```bash
cd practice/01_demo
npm init -y
npm install pg @types/pg tsx
npx tsx src/demo_db.ts       # 练习 Client 单连接
npx tsx src/demo_db_pool.ts  # 练习 Pool 连接池
```

**阶段二（`practice/02_express_api`）**

```bash
cd practice/02_express_api
npm install
npm run dev
# 用根目录的 rest_client.http 验证各接口
```

参考实现见 `codes/` 对应子目录。
