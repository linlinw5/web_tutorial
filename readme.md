# 从 HTTP 到全栈开发系列 —— Web 开发入门

在万维网的细流之中，一切始于一次看不见的请求。

本书源于我 2024 至 2025 年间的学习与授课记录。那些零散的笔记、反复推敲的讲解，以及一次次实践中的困惑与顿悟，在如今的工具与协作之下，被重新编织为一组连贯的篇章。它既是回顾，也是再出发的起点。

这里的每一行文字，都站立在开源世界的肩膀之上。知识从互联网而来，也应回归互联网。因此，这些整理后的文档被开放出来，作为对开源社区的一点微小回应。

本教程面向初学者，亦欢迎已有基础的探索者。从 HTTP 协议的底层逻辑出发，逐步穿越服务端框架、数据存储与用户认证等关键领域，最终抵达一个完整运行的博客系统。在这个过程中，技术不再是孤立的工具，而是一条可以被理解、拆解与重建的路径。

我选择 Node.js、TypeScript 与 SQLite/PostgreSQL 作为基石，刻意避开过度封装的框架与抽象。没有捷径的遮蔽，只有更清晰的结构与原理——让每一个细节都可见，让每一次构建都有来处。

---

## 目录

- [阶段一：基础协议与原生开发（第 1–3 章）](#阶段一基础协议与原生开发)
- [阶段二：前后端全栈贯通（第 4–12 章）](#阶段二前后端全栈贯通)
- [阶段三：面向对象深入（第 13 章）](#阶段三面向对象深入)
- [阶段四：生产级数据库（第 14–15 章）](#阶段四生产级数据库)
- [阶段五：用户认证与综合实战（第 16–19 章）](#阶段五用户认证与综合实战)
- [阶段六：自动化测试（第 20–21 章）](#阶段六自动化测试)

---

## 阶段一：基础协议与原生开发

学习 Web 开发，第一个诱惑就是从框架开始：安装 React 或 Vue，页面动起来了，看上去很高效。但框架是对原理的封装，而封装的代价是：当它出了问题，你无从判断问题在哪里。好比住进一栋高度自动化的建筑，电、水、暖气全由系统控制；一旦停电，你发现自己连保险丝箱在哪儿都不知道。

这个阶段从 HTTP 协议本身开始，就是要先把"电路图"看懂。

---

### 第 1 章：Linux 基础（[`01_linux_basic`](./01_linux_basic/README.md)）

代码最终运行在服务器上，服务器通常跑的是 Linux。在动手写代码之前，先看一眼这个运行环境长什么样。

- 常用 Linux 命令：文件操作、权限管理、进程管理
- 理解 SSR（服务端渲染）与 CSR（客户端渲染）的区别
- 了解 Apache、PHP、Node.js 各自的定位与适用场景

---

### 第 2 章：HTTP 协议基础（[`02_http_basic`](./02_http_basic/README.md)）

不借助任何框架，用 Node.js 原生 `http` 模块手写服务器。目的只有一个：让 HTTP 请求-响应的每个细节都暴露在你眼前，无处遁形。

| 文件           | 演示内容                                                        |
| -------------- | --------------------------------------------------------------- |
| `server_01.js` | 创建最小 HTTP 服务器，设置状态码与 Content-Type，返回 HTML      |
| `server_02.js` | 读取 `req.headers` 与 `req.method`，理解 HTTP 请求的元数据      |
| `server_03.js` | 使用 `url.parse()` 解析 URL 与查询字符串（`?id=1&name=foo`）    |
| `server_04.js` | 对比三种响应格式：`text/plain`、`text/html`、`application/json` |
| `server_05.js` | 完整路由分发、HTTP 方法识别、基于 `Authorization` 头的权限校验  |

**核心知识点：**

- HTTP 请求-响应的完整生命周期
- 请求头、方法、URL 的获取与解析
- 状态码的语义（200、400、403、404、405）
- 不借助框架实现路由与权限验证

---

### 第 3 章：Express 框架基础（[`03_express_basic`](./03_express_basic/README.md) / [`03_express_plus`](./03_express_plus/README.md)）

有了上一章的铺垫，再来看 Express 就会明白：它不是魔法，只是把你已经会做的事情，用更简洁的语法包装起来。这种理解，和"直接上手 Express 却不知道它在做什么"，是两种截然不同的起点。

| 文件       | 演示内容                                                |
| ---------- | ------------------------------------------------------- |
| `app01.js` | Express 最小示例：应用创建、中间件概念、`next()` 的作用 |
| `app02.js` | 多路由定义、路径参数与查询参数提取、JSON 响应与错误处理 |
| `app03.js` | 集成 EJS 模板引擎、静态文件托管、从数据文件渲染页面     |

**核心知识点：**

- 中间件的执行顺序与 `next()` 的控制流作用
- `app.use()` 与 `app.get()` / `app.post()` 的适用场景区别
- `req.query`（查询字符串）、`req.params`（路径参数）的获取
- EJS 模板引擎的基本用法：变量渲染、列表循环、条件判断

---

## 阶段二：前后端全栈贯通

懂得了协议，就可以动手建了。这个阶段横跨前端、后端与数据库，目标不是把每个领域都学精，而是把各部分接通——让浏览器里的页面，能从服务器读数据，数据来自数据库。

这个过程有些像修一条铁路：每一段路轨都要对准，才能让列车从头跑到尾。结尾的里程碑项目，是对这段工作的一次验收：一个完整运行的博客系统，用原生的方式，从零搭起来。

---

### 第 4 章：TypeScript 基础语法（[`04_typescript_basic`](./04_typescript_basic/README.md)）

JavaScript 是动态语言，写起来快，但错误往往藏得很深——有时候一个拼错的属性名，要等到运行时才会暴露。TypeScript 在编译阶段就把这类错误拦下来，代价是需要显式地声明类型。这一章建立类型系统的基本认知，为后续所有 TypeScript 项目打底。

- 基本类型标注：`string`、`number`、`boolean`、`array`、`tuple`
- 接口（`interface`）与类型别名（`type`）的定义与使用
- 函数参数类型、返回值类型与可选参数
- 泛型基础（`Array<T>`）
- TypeScript 编译配置（`tsconfig.json`）与 `src/` → `dist/` 编译流程

---

### 第 5 章：DOM 操作与事件绑定（[`05_dom_basic`](./05_dom_basic/README.md)）

浏览器给了 JavaScript 一把钥匙，可以直接操控页面的每一个元素。在 React 和 Vue 把这把钥匙藏进框架之前，你应该先知道它长什么样，开哪扇门。

- `document.querySelector` / `querySelectorAll` 元素选取
- 修改元素内容（`textContent`、`innerHTML`）与样式（`classList`、`style`）
- 事件监听（`addEventListener`）与事件对象的使用
- 表单元素值的读取与动态 DOM 节点的创建与插入
- `innerHTML` 的 XSS 风险与安全替代方案（`textContent` / `createElement`）

---

### 第 6 章：BOM 与浏览器 API（[`06_bom_basic`](./06_bom_basic/README.md)）

DOM 操作的是页面内容，BOM 操作的是浏览器本身——地址栏、历史记录、弹窗、定时器。这一章也是一次横向对比：浏览器环境与 Node.js 环境提供的全局对象，有哪些相似，有哪些根本不同。

- `window` 对象：全局作用域、定时器（`setTimeout` / `setInterval`）
- `location` 对象：URL 读取、页面跳转与刷新
- `history` API：`pushState` / `replaceState` 实现无刷新导航
- 对话框 API：`alert`、`confirm`、`prompt`

---

### 第 7 章：使用 Fetch 进行 API 调用（[`07_fetch_1`](./07_fetch_1/README.md) / [`07_fetch_2`](./07_fetch_2/README.md)）

前端和后端之间靠什么对话？靠 HTTP 请求——这一章把第 2 章的协议知识，从服务端视角翻转到了客户端视角。本章依赖 [`07_mock_api`](./07_mock_api/readme.md) 提供测试接口，请先启动：

```bash
cd 07_mock_api && npm run dev
```

- `fetch()` 的基本语法与 Promise 链式调用
- 发送 GET 请求并解析 JSON 响应（`response.json()`）
- 发送 POST / PUT / DELETE 请求：设置 `Content-Type`，序列化请求体
- 错误处理：`response.ok`、HTTP 状态码检查、`try/catch` 捕获网络异常
- 多页面共享脚本：URL 参数传递、条件守卫模式

---

### 第 8 章：从零搭建 Express API 服务器（[`08_express_adv`](./08_express_adv/README.md)）

以第 7 章的 Mock API 为蓝图，自己动手把它实现出来。每一行配置都有来处，每一个中间件都有用意——这一章的目的，是让你对"一个后端服务是怎么搭起来的"有完整而清晰的认识。

- 项目初始化：`npm init`、安装依赖、`tsconfig.json` 配置
- `concurrently`：同时运行 `tsc -w` 和 `nodemon`，`npm scripts` 的写法
- 请求体解析中间件：`express.json()` 与 `express.urlencoded()`
- CORS 跨域原理：同源策略、`Access-Control-Allow-Origin` 响应头、origin 白名单配置
- 完整 CRUD 路由实现与 HTTP 状态码规范

---

### 第 9 章：SQLite 数据库入门（[`09_sqlite_1`](./09_sqlite_1/README.md)）

一个只活在内存里的服务器，重启就失忆。要让数据活下来，就需要数据库。这一章以 DataGrip 为工具，通过 Excel 类比理解关系型数据库，全程用 SQL 语句操作数据，不绕过任何细节。

- 关系型数据库基本概念：表、行、列、主键、外键、一对多关系
- DataGrip 创建与连接 SQLite 数据库文件
- DDL：`CREATE TABLE`（数据类型、`NOT NULL`、`UNIQUE`、`FOREIGN KEY`、`ON DELETE CASCADE`）
- DML：`INSERT`、`SELECT`、`JOIN`、`UPDATE`、`DELETE`
- `ALTER TABLE`：SQLite 支持与不支持的操作对比
- 重建表模式：SQLite 添加外键约束的标准数据迁移流程

---

### 第 10 章：用 JavaScript 操作 SQLite 数据库（[`10_sqlite_api`](./10_sqlite_api/README.md) / [`10_sqlite_api_pro`](./10_sqlite_api_pro/README.md)）

SQL 写得再好，也要能从代码里调用。这一章分两阶段：先用脚本演示 `sqlite` 包的增删改查，再整合进 Express 构建完整 REST API；进阶部分引入模块化分层结构，并对比 SSR 与 CSR 两种渲染方式。

- `sqlite` vs `sqlite3` vs `better-sqlite3` 的选择理由（与 `pg` 包风格统一）
- `exec` / `run` / `all` / `get` / `prepare` 五个核心方法与 `?` 占位符防 SQL 注入
- `ConnectionManager` 单例模式：复用数据库连接
- 分页查询：`LIMIT` + `OFFSET` + `COUNT(*)` 返回总数
- 优雅退出：监听 `SIGINT` / `SIGTERM` 关闭数据库连接
- 代码分层：`db/`（数据访问层）、`routes/api/`、`routes/web/`、barrel 导出
- SSR vs CSR：EJS 服务端渲染与客户端 Fetch + DOM 渲染的实现与对比

---

### 第 11 章：Tailwind CSS（[`11_tailwindcss`](./11_tailwindcss/README.md)）

样式是一道绕不过去的坎。Tailwind 的思路是把 CSS 原子化：不写自定义类名，直接在 HTML 上堆叠工具类。初看繁琐，用熟了之后会发现，改样式的速度提升不止一倍。

- Tailwind CSS 的设计理念：原子类 vs 传统 CSS
- 安装与配置：`@tailwindcss/cli`，`input.css` → `output.css` 编译流程
- `npm run dev` 中集成 Tailwind watch（与 `tsx watch` 并行运行）
- 常用工具类：排版、颜色、间距、Flex / Grid 布局
- 与 EJS 模板的集成

---

### 第 12 章：里程碑项目——简易 Blog 系统（[`12_easy_blog_sqlite`](./12_easy_blog_sqlite/readme.md)）

阶段二的综合项目，将前 11 章所有知识串联为一个完整的全栈博客系统，以 **10 个递进步骤**逐步构建，每步均可独立运行。这是第一座真正意义上的建筑物，而不只是零件。

**核心知识点：**

- 数据库事务：`createBlog` / `updateBlogById` 涉及多表写入，用 BEGIN / COMMIT / ROLLBACK 保证原子性
- SSR + CSR 混合：导航标签服务端渲染，博客列表客户端 Fetch + DOM 渲染
- EJS partials：header / footer 抽取为可复用模板片段
- 前端 TypeScript 编译：`frontend/src/*.ts` 通过 `tsc -w` 编译到 `backend/public/js/`
- 分页工具函数复用：`renderPagination` 被首页、标签页、后台页共用
- 多对多关系：博客与标签通过中间表 `blog_tags` 关联
- 内存缓存：为高频调用的 `getAllTags()` 添加 TTL 缓存，减少数据库压力

---

## 阶段三：面向对象深入

面向对象不是一种语法特性，而是一种组织复杂性的方式。要理解它，最好的场景不是 CRUD，而是**状态频繁变化、且必须可控**的系统——游戏天然满足这个条件。蛇每走一步，位置变了，食物可能消失，分数可能增加；如果没有合理的对象设计，这些状态会很快乱成一锅粥。

---

### 第 13 章：项目——贪吃蛇游戏（[`13_snake_game`](./13_snake_game/readme.md)）

纯前端项目，通过 9 个迭代版本，从一个会移动的点出发，一步步构建出有碰撞检测、有计分板、有本地存档的完整游戏。每一版都只新增一个概念，清晰可追溯。

| 版本       | 新增内容                                           |
| ---------- | -------------------------------------------------- |
| `01_snake` | HTML Canvas 基础，绘制矩形                         |
| `02_snake` | 键盘事件控制点的移动，实现边界环绕                 |
| `03_snake` | 用 Class 重构代码，引入 TypeScript `enum` 定义方向 |
| `04_snake` | 蛇自动移动，随机生成食物，键盘控制转向             |
| `05_snake` | 蛇身体渲染（红色头部 + 蓝色身体），改造 `Snake` 类 |
| `06_snake` | 吃食物逻辑：蛇身增长，食物重新随机生成             |
| `07_snake` | 自碰撞检测，游戏结束判断                           |
| `08_snake` | 设计 `ScoreBoard` 类，实现得分统计与历史最高分     |
| `09_snake` | 使用 `localStorage` 持久化最高分，页面刷新后仍保留 |

**核心知识点：**

- Canvas 2D 绘图 API（`clearRect`、`fillRect`、`fillStyle`）
- 面向对象设计：类的封装、属性与方法的职责划分
- 游戏循环：定时更新状态 → 重新渲染 → 碰撞检测
- `localStorage` 的读写与数据持久化

---

## 阶段四：生产级数据库

SQLite 够用，但不生产。它没有用户权限体系，不支持真正的并发，只是一个本地文件。真实项目用的是独立运行的数据库服务器——PostgreSQL 是其中最稳固的选择之一。从 SQLite 迁移到 PostgreSQL，不是在重复同样的事情，而是在接触不同的设计哲学：连接池、严格的类型约束、更完善的事务隔离。

---

### 第 14 章：PostgreSQL 入门（[`14_pgsql`](./14_pgsql/README.md)）

从安装开始，到用 psql 命令行建库、建用户、授权，再到与 SQLite 的语法差异对比——这一章的目标是让 PostgreSQL 从"陌生的黑盒"变成"熟悉的工具"。

- PostgreSQL 安装与服务管理
- 数据库、用户、权限的创建与管理（`createdb`、`createuser`、`GRANT`）
- psql 命令行工具的基本使用
- PostgreSQL 与 SQLite 的语法差异对比
- 事务基础：`BEGIN`、`COMMIT`、`ROLLBACK`

---

### 第 15 章：设计 API 对 PostgreSQL 进行操作（[`15_pgsql_api`](./15_pgsql_api/README.md)）

把 PostgreSQL 接进 Express，构建可实际使用的后端 API。重点在于连接池的配置与参数化查询的使用——两者分别解决了"性能"与"安全"这两个最基础的后端命题。

- `pg` 模块的连接配置（`Pool` 连接池 vs 单次 `Client` 连接）
- 参数化查询（`$1`、`$2` 占位符）防止 SQL 注入
- 错误处理与数据库异常的统一捕获

---

## 阶段五：用户认证与综合实战

如果说数据库解决了"存什么"，认证解决的是"谁在说话"。这是 Web 开发里最容易出错、也最容易被轻视的一块：密码明文存储、Session 管理混乱、权限校验缺失——这些问题在小项目里看不出来，一旦上线就是漏洞。这个阶段一层一层剥开"用户身份"的问题，从最朴素的 Cookie 开始，一路走到 OAuth 第三方登录。

---

### 第 16 章：Express 中间件与 Session 机制（[`16_session`](./16_session/README.md) / [`16_session_pro`](./16_session_pro/README.md)）

HTTP 是无状态协议——每次请求，服务器默认不认识你是谁。Session 是为这个问题打的补丁：在服务端记住你，在客户端留一块凭据（Cookie）。这一章从原理讲起，再落到具体配置。

- `express-session` 的配置（`secret`、`resave`、`saveUninitialized`、`cookie` 选项）
- Cookie 安全属性：`httpOnly`（防 XSS）、`sameSite`（防 CSRF）、`secure`（仅 HTTPS）
- Session 存储适配器对比：内存（开发用）、SQLite（`connect-sqlite3`）、PostgreSQL（`connect-pg-simple`）
- `16_session_pro`：集成 `bcrypt` 进行密码哈希，Session 存储切换为 PostgreSQL

---

### 第 17 章：使用 Passport 实现用户认证（[`17_passport`](./17_passport/README.md)）

认证逻辑写多了，会发现它们高度相似：验证凭据、查用户、建 Session、挂 `req.user`。Passport 把这套流程抽象成"策略"，你只需要告诉它去哪里找用户，其余的它来做。本章覆盖两种策略：本地账号（用户名+密码）和 Google OAuth。

| 策略             | 说明                                   |
| ---------------- | -------------------------------------- |
| Local Strategy   | 用户名 + 密码表单登录，查询数据库验证  |
| Google OAuth 2.0 | 第三方社交账号登录，支持与本地账号合并 |

**核心知识点：**

- Passport 的工作流程：策略配置 → 认证中间件 → Session 序列化/反序列化
- `req.isAuthenticated()`、`req.user`、`req.login()`、`req.logout()` 的使用
- `serializeUser` / `deserializeUser`：Session 与数据库用户对象的映射
- OAuth 2.0 认证流程：重定向授权 → 回调处理 → 用户信息获取

---

### 第 18 章：使用环境变量管理敏感数据（[`18_environment_conf`](./18_environment_conf/README.md)）

数据库密码、OAuth 密钥、Session Secret——这些东西不能写死在代码里，更不能提交到 Git。这一章解决的是"代码与配置分离"这个问题，是项目走向可部署、可协作的必要一步。

- `dotenv` 的使用：`.env` 文件加载与 `process.env` 访问
- `.env` 文件的正确管理：加入 `.gitignore`，以 `.env_example` 留存格式模板
- TypeScript 中 `import` 顺序的陷阱：为什么 `env.ts` 必须是第一个 import
- 数据库连接信息、Session Secret、OAuth 密钥等敏感数据的集中管理

---

### 第 19 章：里程碑项目——EasyBlog 终极版（[`19_easy_blog_final`](./19_easy_blog_final/README.md)）

课程的收官项目。将 PostgreSQL、Passport（本地 + Google OAuth）、bcrypt、dotenv、用户权限管理整合进一个完整的博客系统，是前 18 章所有知识的汇聚点。

**技术栈：**

- 数据库：PostgreSQL（`pg` Pool 模式，Docker Compose 一键启动）
- 认证：Passport Local + Google OAuth 2.0（支持账号合并）
- Session：`express-session` + `connect-pg-simple`（存入 PostgreSQL）
- 权限：三级用户组（admin / editor / guest）
- 前端：原生 TypeScript + Fetch API，编译后静态托管

**功能列表：**

- 博客发布、编辑、删除与标签分类
- 用户注册（本地）、登录（本地 + Google）、登出
- 管理员用户管理（查看列表、修改密码、删除用户）
- 首次启动自动建表并注入测试数据，无需手动执行 SQL

---

## 阶段六：自动化测试

代码写完了，怎么知道它是对的？这个问题没有终极答案，只有程度之分。测试不能证明代码没有 bug，只能证明在目前覆盖到的情况下，行为符合预期——但这已经远胜于没有测试。至少，当你改动代码之后，你会知道哪里坏掉了，而不是靠运气发现。

---

### 第 20 章：Jest 入门（[`20_jest`](./20_jest/readme.md)）

从一个问题出发：你以前是怎么验证自己写的函数是对的？大概是 `console.log` 看输出。这种方式能用，但不可持续——函数一改，就要重新手动跑一遍。Jest 给了一个更好的答案：写一次断言，以后每次改完代码都可以一键验证。

- `describe` / `test` / `expect`：测试的基本结构
- AAA 模式：Arrange（准备）→ Act（执行）→ Assert（断言）
- `beforeEach` / `afterEach`：测试钩子，保持每条用例的独立性
- `test.each`：参数化测试，用一组数据跑同一个用例
- `test.skip` / `test.only`：调试时的精准控制
- 覆盖率报告：`collectCoverage` 配置与 HTML 可视化报告

---

### 第 21 章：在真实项目中使用 Jest（[`21_backend_with_jest`](./21_backend_with_jest/readme.md)）

把 Jest 放进一个有数据库依赖的真实后端项目里，问题就复杂多了：测试不能碰真实数据库，被测函数的环境得能切换，数据在测试前后得能重置。这一章以 Easy Blog 的 SQLite 版后端为例，演示这些问题各自的解法。

- 多环境配置：`dev` / `prod` / `test` 三套数据库路径，`test` 使用 `:memory:` 内存数据库
- `jest.mock`：在测试文件中拦截 `config.ts` 的导出，让被测函数切换到测试数据库
- `jest.config.js` 精细配置：用 `collectCoverageFrom` 只统计 `db/` 层的覆盖率
- `beforeAll` vs `beforeEach` 的分工：哪些数据只需要准备一次，哪些每条用例都要重置
- 事务回滚测试：如何验证回滚真的发生了（不是靠函数抛错，而是查表）
- 级联删除测试：验证外键约束的数据库层行为
- 缓存逻辑测试：验证缓存命中与 `clearCache` 的失效效果

---

## 后语：路还很长，但走过来的每一步都不算白费

有一个在认知领域被反复验证的悖论：在一个领域懂得越多，越会感到自己不懂的东西更多。初学者往往信心满满，因为他不知道自己不知道什么；而真正入门之后，视野打开了，才看到更大的未知在前方铺展开去。

这种感觉会让人恐慌。但请把它理解为一个好消息——我们的地图变大了，而不是我们的能力变弱了。

完成这 21 章，我们已经能够独立搭建一个有数据库、有认证、有权限管理的全栈 Web 应用，并为它的核心逻辑编写自动化测试。这件事，绝大多数"会写代码"的人都做不到。不是因为他们不够聪明，而是因为他们没有经历过这种系统性的、从底层原理开始的训练。

接下来，路自然还很长。在 web 开发领域，以下几个方向，是最值得投入的：

**React / Vue**——现代 Web 应用的前端语言。我们现在理解 DOM，理解事件，理解状态变化，理解 HTTP，理解 Fetch，甚至亲手写过分页逻辑和动态渲染。带着这些积累去看 React 的组件模型、Vue 的响应式系统，我们会发现它们不是陌生的魔法，而是我们已经做过的事情的更优雅的表达。这正是当初选择不走捷径的回报。

**Docker 与容器化**——软件如何在任何环境里稳定运行。我们在第 19 章已经接触了 Docker Compose 来启动 PostgreSQL，但容器的世界远不止于此。从 Dockerfile 到镜像，从单机容器到 Kubernetes 集群编排，这是现代软件工程另一块不可绕过的基石——尤其是当应用需要从"能跑"走向"可部署、可扩展、可运维"的时候。

这两个方向，我都会继续整理笔记，依然从最底层的原理讲起，依然不绕过细节，依然和各位一起把整个互联网的基础结构一层一层看清楚。

技术的世界没有终点，但有节奏。慢慢走，稳稳走。加油！共勉！

---

## 许可

本文档及相关代码以 MIT 协议发布。详情请见 （[`LICENSE`](./LICENSE)）

Author: Linlin Wang, Yan Bao

Contact: wanglinlin.cn@gmail.com
