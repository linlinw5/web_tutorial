[← 返回首页](../readme.md)

# 第 18 章：环境变量与 dotenv

本章解决一个实际问题：**数据库密码、密钥等敏感信息不能硬编码进代码**。通过 dotenv 把配置从代码中剥离，放进 `.env` 文件，并确保 `.env` 不会被上传到 GitHub。

技术栈：Express + TypeScript + PostgreSQL + dotenv

## 启动方式

```bash
cd codes
npm install

# 复制示例文件，填入本地真实配置
cp .env_example .env
# 编辑 .env，填入你的数据库信息

npm run dev
```

---

## 18.1 为什么需要环境变量

直接把密码写进代码，有两个严重问题：

1. **泄露风险**：代码上传 GitHub 后，密码对所有人可见
2. **僵化**：开发机、测试服务器、生产服务器的数据库地址不同，每次切换都要改代码

环境变量（Environment Variables）是操作系统提供的键值对存储，用于在进程之间传递配置信息。任何程序都可以通过标准接口读取，不依赖具体语言或框架。

**在终端中临时设置环境变量（Linux / macOS / Git Bash）：**

```bash
export DB_PASSWORD="cisco123"
echo $DB_PASSWORD        # 输出：cisco123
```

**Node.js 中读取环境变量：**

```typescript
process.env.DB_PASSWORD  // 返回 "cisco123"
```

`process.env` 是 Node.js 内置对象，无需 import，随时可用。

---

## 18.2 .env 文件与 dotenv

在终端手动 `export` 只在当前 shell 会话有效，重启就消失。实际开发中用 `.env` 文件持久化配置，再用 `dotenv` 库在程序启动时自动加载。

**`.env` 文件格式：**

```
PORT="3000"
DB_HOST="10.0.0.133"
DB_USER="postgres"
DB_PASSWORD="Cisco123"
DB_NAME="db4"
DB_PORT="5432"
```

每行一个 `KEY=VALUE`，可以加引号也可以不加。dotenv 也支持 `export KEY=VALUE` 格式，方便直接用 `source .env` 在 shell 中加载。

**安装 dotenv：**

```bash
npm install dotenv
```

**最简单的加载方式：**

```typescript
import dotenv from 'dotenv';
dotenv.config(); // 读取项目根目录的 .env，将键值对写入 process.env
```

调用 `dotenv.config()` 之后，`.env` 里的所有变量就进入了 `process.env`，后续任何地方都可以通过 `process.env.KEY` 访问。

> **类型注意**：dotenv 加载后，所有值的类型均为 `string`，即使写的是数字也一样。需要数字时必须手动转换：
>
> ```typescript
> parseInt(process.env.DB_PORT as string)  // "5432" → 5432
> ```

---

## 18.3 .env 绝对不能上传 GitHub

把 `.env` 加入 `.gitignore`，Git 就会忽略这个文件：

```
# .gitignore
.env
```

验证是否生效：

```bash
git status   # .env 不应出现在列表中
```

**配套做法：提供 `.env_example`**

`.env` 自己不上传，但要让其他开发者知道需要哪些变量。约定提交一个 `.env_example` 文件，填入占位值（不含真实密码）：

```
PORT="3000"
DB_HOST="your_db_host"
DB_USER="your_db_user"
DB_PASSWORD="your_db_password"
DB_NAME="your_db_name"
DB_PORT="5432"
```

新同事拿到代码后执行 `cp .env_example .env`，再填入自己的配置即可运行。

---

## 18.4 关键问题：dotenv 必须最先执行

把敏感信息放进 `.env` 之后，有一个容易踩到的坑。

看 `ConnectionManager.ts`：

```typescript
import { dbConfig } from "../config.ts";  // config.ts 读取 process.env
export const pool = new pg.Pool(dbConfig);
```

`config.ts` 在模块加载时就读取了 `process.env.DB_HOST` 等变量。如果此时 dotenv 还没有执行，`process.env` 里没有这些值，`dbConfig` 里全是 `undefined`，连接池创建失败。

**ES 模块的执行顺序**

ES 模块（`"type": "module"`）的 import 会被**提升（hoist）**：所有 import 语句先于本文件其他代码执行，执行顺序与书写顺序一致。

利用这个特性，把 dotenv 加载逻辑单独放进 `env.ts`，再在 `app.ts` 中把它放在**第一个 import**：

```typescript
// app.ts
import './env.ts';              // ← 第一个，dotenv.config() 在这里执行

import express from 'express';
import { pool } from './db/ConnectionManager.ts';  // ← 此时 process.env 已就绪
```

执行顺序：

```
app.ts 开始解析
  → 执行 env.ts（dotenv.config() 运行，.env 写入 process.env）
  → 执行 express 模块初始化
  → 执行 ConnectionManager.ts（读取 process.env，此时已有值）
  → app.ts 其余代码执行
```

这个顺序保证了无论项目结构多复杂，只要 `env.ts` 是 `app.ts` 的第一个 import，环境变量就一定最先就绪。

---

## 18.5 config.ts：集中管理配置

散落在各处的 `process.env.DB_HOST` 很难维护，出现拼写错误也不容易发现。约定把所有配置项集中到 `config.ts`，转换好类型后统一导出：

```typescript
// config.ts
export const dbConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string), // 字符串 → 数字
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
};
```

其他模块需要数据库配置时，直接 `import { dbConfig } from './config'`，不再直接访问 `process.env`。

---

## 18.6 完整数据流

```
.env 文件
  → dotenv.config()（env.ts）
  → process.env（Node.js 全局）
  → config.ts（读取并转换类型）
  → ConnectionManager.ts（用 dbConfig 创建连接池）
  → app.ts（使用连接池处理请求）
```

文件关系：

```
src/
  env.ts             ← 只做一件事：加载 .env
  config.ts          ← 只做一件事：从 process.env 读取并导出配置
  app.ts             ← 第一行 import env.ts，之后正常写业务
  db/
    ConnectionManager.ts  ← import config，创建连接池
```

---

## 18.7 养成习惯

从本章开始，**所有项目都应该这样处理敏感信息**。本章之前的代码把密码直接写进源码，是为了让注意力集中在各章核心知识点上，属于教学简化，实际项目中绝对不能这么做。

检查清单：

- [ ] `.env` 在 `.gitignore` 中
- [ ] 项目根目录有 `.env_example`（占位值，不含真实密码）
- [ ] `env.ts` 是 `app.ts` 的第一个 import
- [ ] 所有配置项统一在 `config.ts` 中管理，不在业务代码里直接访问 `process.env`
