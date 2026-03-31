[← 返回首页](../readme.md)

# 第 21 章：在真实项目中使用 Jest

上一章介绍了 Jest 的基本用法。本章将它放进一个真实的后端项目里——Easy Blog 的 SQLite 版 API Server——演示在有数据库依赖的场景下，测试应该怎么写，项目应该做哪些改造。

本章没有设计 practice。代码在 `codes/backend/`，建议对照阅读。

---

## 为什么选数据库层来测？

一个典型的后端项目，代码大致分三层：

```
路由层 (routes/)   ← 解析请求、调用 db 函数、返回响应
数据库层 (db/)     ← 封装 SQL，直接操作数据库
工具/配置          ← 连接管理、环境变量等
```

路由层的逻辑依赖 HTTP 请求和响应，测起来需要模拟整个请求流程，成本较高。数据库层就纯粹得多：给一个函数传参，看它返回什么——这正是单元测试最擅长的场景。

所以我们只测 `src/db/` 下的三个文件：`ConnectionManager.ts`、`blogs.ts`、`tags.ts`。

---

## 第一个问题：测试不能碰真实数据库

如果测试直接连开发数据库，每次跑测试都会向里面写入、删除数据，跑完之后数据库一团糟。更严重的是，如果开发库里已经有数据，某些测试可能因为数据状态不干净而随机失败。

解决方案是：**让测试使用一个独立的、完全隔离的数据库**。

SQLite 有一个特性完美契合这个需求：**内存数据库（`:memory:`）**。内存数据库存在于内存中，进程结束后消失，每次测试开始时都是一张白纸，天然隔离。

### 多环境配置：`src/config.ts`

```typescript
export const DBPATHS: DatabasePaths = {
  dev: "./data/dev.sqlite", // 开发环境：本地文件
  prod: "./data/prod.sqlite", // 生产环境：本地文件
  test: ":memory:", // 测试环境：内存数据库
};
```

三个环境，三条路径。`config.ts` 还导出了 `options` 对象，控制当前启动使用哪个环境：

```typescript
export const options: AppOptions = {
  env: "dev", // 正常启动时用开发数据库
};
```

### 按环境隔离的 ConnectionManager

`ConnectionManager` 用**单例模式**管理连接，且每个环境各有一个独立实例：

```typescript
// 静态 Map，每个环境一个实例
private static instances: Map<string, ConnectionManager> = new Map();

public static getInstance(env: Environment = 'dev'): ConnectionManager {
    if (!this.instances.has(env)) {
        this.instances.set(env, new ConnectionManager(env));
    }
    return this.instances.get(env)!;
}
```

这样，开发用 `getInstance('dev')`，测试用 `getInstance('test')`，两边的连接和数据完全互不干扰。

---

## 第二个问题：`db/blogs.ts` 怎么知道该用哪个数据库？

`blogs.ts` 在文件顶部就决定了用哪个数据库实例：

```typescript
import { options } from "../config.ts";

const dbManager = ConnectionManager.getInstance(options.env);
```

它从 `config.ts` 的 `options.env` 读取环境。正常运行时是 `"dev"`，没问题。但测试时，我们需要它用 `"test"`。

直接改 `config.ts` 不行——那会影响所有人。这时候就需要用到 **Jest 的 `jest.mock`**。

### `jest.mock`：拦截模块导入

在测试文件的最顶部（必须在任何 `import` 之前），写：

```typescript
jest.mock("../../config.ts", () => {
    const config = jest.requireActual("../../config"); // 获取原始模块
    return {
        ...config,
        options: {
            ...config.options,
            env: "test",  // 只改这一个字段
        },
    };
});

// 在 mock 之后才导入被测函数
import { getAllBlogs, createBlog, ... } from "../../db/blogs.ts";
```

Jest 在运行测试文件之前，会先执行所有 `jest.mock(...)` 调用。当 `blogs.ts` 被导入、执行 `import { options } from "../config.ts"` 时，拿到的已经是被替换过的 `options`（`env: "test"`）。于是 `dbManager` 会指向测试环境的内存数据库。

这是在真实项目中使用 Jest 最关键的技巧之一：**通过 mock 模块来切换依赖，而不是修改源代码**。

---

## Jest 配置：只覆盖 `db/` 层

`jest.config.js` 做了两件事：

```javascript
const baseDir = "<rootDir>/src/db";
const baseTestDir = "<rootDir>/src/__tests__";

const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  collectCoverage: true,

  // 只统计 src/db/ 下的文件的覆盖率，忽略路由、工具函数等
  collectCoverageFrom: [`${baseDir}/**/*.ts`],

  // 只运行 src/__tests__/ 下的测试文件
  testMatch: [`${baseTestDir}/**/*.test.ts`],
};
```

- `collectCoverageFrom`：告诉 Jest 覆盖率只统计 `src/db/` 下的代码。如果不配置，Jest 会把所有被加载过的文件都算进去，报告里会出现路由、工具函数等，显得杂乱。
- `testMatch`：只在 `src/__tests__/` 下找测试文件，避免误跑其他位置的文件。

---

## 三个测试文件

测试文件放在 `src/__tests__/db/` 下，对应三个被测模块。

### 1. `ConnectionManager.test.ts`：测基础设施

这个文件测的是连接管理器本身，不需要 `jest.mock`，直接用 `'test'` 环境实例就好。

重点测试：

- **单例验证**：同一环境多次 `getInstance` 拿到的是同一个对象，不同环境的实例互相独立
- **连接复用**：多次 `getConnection` 拿到的是同一条连接，不会重复打开
- **建表幂等性**：多次调用 `initializeDatabase` 不会报错（因为 SQL 用了 `CREATE TABLE IF NOT EXISTS`）

```typescript
test("should return the same instance for the same environment", () => {
  const manager1 = ConnectionManager.getInstance("test");
  const manager2 = ConnectionManager.getInstance("test");
  expect(manager1).toBe(manager2); // 严格同一对象引用
});
```

### 2. `blogs.test.ts`：核心测试文件

这是本章最值得仔细阅读的文件，它演示了测试有数据库依赖的函数时，如何处理测试数据的准备和清理。

#### `beforeAll` 与 `beforeEach` 的分工

```typescript
beforeAll(async () => {
  // 只运行一次：建表、插入不会改变的基础数据（用户、标签、用户组）
  testManager = ConnectionManager.getInstance("test");
  await testManager.initializeDatabase();
  testDb = await testManager.getConnection();

  await testDb.run(`INSERT INTO groups ...`);
  await testDb.run(`INSERT INTO tags ...`);
  await testDb.run(`INSERT INTO users ...`);
});

beforeEach(async () => {
  // 每条测试前运行：清空博客相关的表，确保每条测试从干净状态开始
  await testDb.run("DELETE FROM blog_tags");
  await testDb.run("DELETE FROM blogs");
  await testDb.run('DELETE FROM sqlite_sequence WHERE name IN ("blogs", "blog_tags")');
});
```

这两层清理的职责不同：

- `beforeAll`：只需要设置一次的东西（用户、标签），在整个 describe 块里复用
- `beforeEach`：每条测试前都要重置的东西（博客数据），防止测试之间互相干扰

自增 ID 也要重置（`DELETE FROM sqlite_sequence`），否则每次插入的 ID 会一直往上涨，某些断言会失败。

#### 事务回滚测试

`createBlog` 和 `updateBlogById` 都使用了数据库事务：先插入博客，再插入标签关联，如果任何一步失败就回滚。测试如何验证事务真的回滚了？

```typescript
test("should handle transaction rollback on invalid tag", async () => {
  await expect(
    createBlog("Blog with Invalid Tag", "Content", "img.jpg", 1, true, [999]), // 不存在的标签 ID
  ).rejects.toThrow("Failed to create blog");

  // 关键断言：博客本身也没有被插入（事务回滚了）
  const blogs = await testDb.all("SELECT * FROM blogs");
  expect(blogs).toHaveLength(0);
});
```

传入一个不存在的 `tag_id = 999`，SQLite 的外键约束会拒绝这条插入，触发 `ROLLBACK`。测试随后直接查数据库，验证博客表也是空的——这才证明了事务真正回滚，而不只是函数抛了错。

#### 级联删除测试

```typescript
test("should delete blog and cascade delete tags", async () => {
  const result = await deleteBlogById(blogId);

  expect(result.success).toBe(true);

  // 验证博客没了
  const blog = await testDb.get("SELECT * FROM blogs WHERE id = ?", [blogId]);
  expect(blog).toBeUndefined();

  // 验证关联的 blog_tags 记录也被级联删除了
  const blogTags = await testDb.all("SELECT * FROM blog_tags WHERE blog_id = ?", [blogId]);
  expect(blogTags).toHaveLength(0);
});
```

外键级联删除是数据库层面的行为，只有直接查表才能验证它确实发生了。

### 3. `tags.test.ts`：测缓存逻辑

`tags.ts` 里的 `getAllTagsCached` 实现了一个 5 分钟 TTL 的内存缓存：第一次查数据库，之后直接返回缓存。

测试重点是验证缓存**确实生效**，以及 `clearTagsCache` **确实使缓存失效**：

```typescript
test("should return cached data on second call", async () => {
  const tags1 = await getAllTagsCached();
  expect(tags1).toHaveLength(5);

  // 绕过缓存，直接往数据库里插一条新数据
  await testDb.run("INSERT INTO tags (name) VALUES (?)", ["Vue.js"]);

  // 再次调用，应该仍然返回 5 条（缓存命中，没有查数据库）
  const tags2 = await getAllTagsCached();
  expect(tags2).toHaveLength(5);
});

test("should refresh cache after clearTagsCache", async () => {
  await getAllTagsCached(); // 建立缓存
  await testDb.run("INSERT INTO tags (name) VALUES (?)", ["Vue.js"]);
  clearTagsCache(); // 清除缓存
  const tags2 = await getAllTagsCached();
  expect(tags2).toHaveLength(6); // 现在能看到新数据
});
```

注意 `beforeEach` 里每次都调用了 `clearTagsCache()`，确保每条测试从无缓存的状态开始，不受前一条测试的影响。

---

## 运行测试

```bash
cd codes/backend
npm install
npm test
```

运行结果会输出每条测试的通过状态，以及 `src/db/` 三个文件的覆盖率报告。可视化报告在 `coverage/lcov-report/index.html`，用浏览器打开查看每行代码的覆盖情况。

---

## 附：test / it 常用修饰符速查

| 写法                          | 含义                                       |
| ----------------------------- | ------------------------------------------ |
| `test(...)` / `it(...)`       | 定义一条测试（两者等价）                   |
| `test.skip(...)` / `xit(...)` | 跳过这条测试，报告中标记为 skipped         |
| `test.only(...)` / `fit(...)` | 只运行这一条，其余全部跳过（调试时很有用） |
| `test.todo("...")`            | 占位，标记一个还没写的测试                 |
