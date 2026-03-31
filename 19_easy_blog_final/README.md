[← 返回首页](../readme.md)

# 第 19 章：EasyBlog Final — 综合项目

本章是整个课程的收官项目。在 PostgreSQL 版博客系统的基础上，加入用户认证、权限管理、环境变量规范，并按 MVC 思路拆分代码结构。

`codes/` 目录提供完整的参考实现，供自行对照。

---

## 项目效果

**首页**：最新博客置顶展示 + 分页博客列表

![首页](assets/home.png)

**按标签筛选**：列表展示该标签下所有博客及作者

![按标签筛选](assets/by_tag_blogs.png)

**博客详情**：展示正文、作者、发布时间

![博客详情](assets/single_blog.png)

**登录 / 注册**

![登录](assets/login.png)
![注册](assets/register.png)

**用户资料页**：显示头像、用户名、邮箱、用户组，左侧导航根据权限动态显示

![用户资料](assets/user_profile.png)

**Editor / Admin — 管理我的博客**：带删除确认弹窗

![管理博客](assets/dailog.png)

**Admin — 管理所有博客**

![管理所有博客](assets/manage_blogs.png)

**Admin — 管理用户列表**（含修改密码 / 删除）

![管理用户](assets/manage_users.png)

---

## 项目要求

### 功能要求

**博客系统**
- 首页展示最新博客 + 分页列表
- 按标签筛选博客
- 博客详情页（展示内容、作者、标签）
- 登录用户可创建/编辑/删除自己的博客
- 管理员可删除任意博客

**用户认证**
- 本地注册/登录（用户名 + 密码，bcrypt 加密）
- Google OAuth 2.0 登录
- 已登录用户访问登录页自动跳转到个人资料页

**权限管理**
三个用户组（`groups` 表）：

| group_id | name   | 权限                         |
| -------- | ------ | ---------------------------- |
| 1        | admin  | 所有权限，包括用户管理       |
| 2        | editor | 可发布博客，可管理自己的文章 |
| 3        | guest  | 只能浏览，不能发布           |

**用户管理（仅 admin）**
- 查看所有用户列表（分页）
- 修改用户密码
- 删除用户（不能删除自己）

### 技术要求

| 类别     | 要求                                                                |
| -------- | ------------------------------------------------------------------- |
| 数据库   | PostgreSQL，使用 `pg` 包的 Pool 模式                                |
| 认证     | `passport` + `passport-local` + `passport-google-oauth20`          |
| Session  | `express-session` + `connect-pg-simple`（Session 存入 PostgreSQL） |
| 密码     | `bcrypt` 加密，禁止明文存储                                         |
| 环境变量 | `dotenv`，所有敏感信息放 `.env`，`.env` 加入 `.gitignore`          |
| 模板引擎 | EJS（服务端渲染）                                                   |
| 前端交互 | 原生 TypeScript + Fetch API，编译后作为静态文件服务                 |

### 数据库结构

```sql
groups      -- 用户组（admin / editor / guest）
users       -- 用户（含 google_id、avatar、provider 字段，支持 OAuth）
blogs       -- 博客文章
tags        -- 标签
blog_tags   -- 博客-标签多对多关联表
```

详见 `codes/backend/data/console.sql`。

---

## 项目结构

```
backend/
  src/
    env.ts              ← 加载 .env，必须是 app.ts 的第一个 import
    config.ts           ← 集中管理 dbConfig 和 sessionConfig
    app.ts              ← 中间件注册、路由挂载、优雅关闭
    db/                 ← 数据库访问层（只查表，不做业务判断）
    models/             ← TypeScript 接口定义
    routes/
      api/              ← 返回 JSON 的 API 路由
      web/              ← 返回 HTML 的页面路由
    utils/
      authCheck.ts      ← isAuthenticated / isAdmin 中间件
      configPassport.ts ← Passport 策略配置（Local + Google）
      shutdownConnection.ts ← 优雅关闭数据库连接
  views/                ← EJS 模板
  public/               ← 静态资源（CSS、图片、编译后的前端 JS）
  data/console.sql      ← 数据库建表脚本和示例数据

frontend/
  src/                  ← 前端 TypeScript 源码
  tsconfig.json         ← 编译目标：backend/public/js/

docker/
  docker-compose.yml    ← 一键启动 PostgreSQL 容器
```

---

## 启动方式

### 1. 启动 PostgreSQL（Docker）

项目提供了 Docker Compose 脚本，推荐在 WSL 中运行：

```bash
cd docker
docker compose up -d
```

这会启动一个 PostgreSQL 16 容器（端口 5432），数据库名 `db6`，持久化到 Docker volume `pg_data`。

> 停止：`docker compose down`
> 停止并删除数据：`docker compose down -v`

### 2. 配置环境变量

```bash
cd codes/backend
cp .env_example .env
# 编辑 .env，填入数据库连接信息和 Google OAuth 凭据
```

`.env` 示例内容参考 `.env_example`。

### 3. 安装依赖并启动后端

```bash
cd codes/backend
npm install
npm run dev
```

启动时会自动完成建表和测试数据的初始化（`initializeDatabase()`），无需手动执行 SQL。

### 4. 编译前端（另开终端）

```bash
cd codes/frontend
tsc -w
```

访问 `http://localhost:3000`

> 内置测试账号（密码均为 `123123`）：`alice`（admin）、`bob`（editor）、`charlie`（guest）等。

---

## 关键设计说明

**分层原则**

- `db/*.ts` 只负责查表，不对结果做业务判断（查不到返回 `undefined`，出错抛异常）
- `routes/*.ts` 负责业务判断（检查 null、权限校验、拼装响应）
- 两层各司其职，互不越权

**Passport 序列化**

登录后 Session 里只存 `user.id`，每次请求通过 `deserializeUser` 从数据库重新加载完整用户数据。因此 `req.user` 始终是最新数据。

**Google OAuth 账号合并逻辑**

1. 先用 `google_id` 查找 → 已用 Google 登录过的老用户
2. 再用邮箱查找 → 用邮箱注册过但首次用 Google 登录，自动绑定
3. 都没找到 → 创建新用户

---

## 写在最后

完成这个项目，意味着你已经从零开始，亲手搭建了一个完整的 Web 应用——它有自己的数据库、自己的认证体系、自己的前后端交互。每一个按钮背后的逻辑，每一次页面跳转的流转，你都清楚地知道发生了什么。

这种感觉，是跳过这个阶段的人很难拥有的。

如今的前端开发，Vue、React 几乎已经成了行业的默认语言。你可能会发现，身边很多人学 Web 开发，第一步就是打开某个框架的官方文档。他们能很快地搭出一个页面，却往往说不清楚数据是怎么流动的，不明白为什么状态变了视图却没有更新，遇到一个稍微偏门的问题就不知所措。

原因其实很简单——他们从未真正和浏览器"面对面"谈过话。

而你不一样。你用原生的方式操作过 DOM，手写过 Fetch 请求，自己处理过分页逻辑和权限跳转。这些事情做起来繁琐，却正因为繁琐，你才真正理解了框架在替你做什么。

当你日后第一次看到 Vue 的响应式数据，或者 React 的组件渲染，大概率会有一种"原来如此"的豁然开朗——那不是陌生的魔法，而是你已经熟悉的事情，换了一种更优雅的写法。

地基打得扎实，楼才能盖得高。
