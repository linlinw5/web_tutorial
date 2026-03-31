[← 返回首页](../readme.md)

# 第 12 章：里程碑项目——Easy Blog

阶段二的综合项目，将前 11 章的所有知识（Express、TypeScript、SQLite、EJS、Tailwind CSS、Fetch API）串联为一个完整的全栈博客系统。

项目以**不前后端分离**的方式构建：同一个 Express 服务器同时提供 REST API 和页面路由，SQLite 作为数据库。页面渲染采用 **SSR + CSR 混合**模式，通过 10 个递进步骤逐步完成。

## 技术栈

- **后端**：Express + TypeScript（tsx 直接运行）+ SQLite（`sqlite` 包）
- **模板**：EJS（服务端渲染）
- **样式**：Tailwind CSS（CLI 编译）
- **前端交互**：原生 TypeScript → 编译为 JavaScript，通过 Fetch 调用 API

## 项目结构

```
12_easy_blog_sqlite/
  codes/
    step01/ ~ step10/   ← 10 个递进步骤，每步均可独立运行
      backend/          ← Express 服务器
        src/
          index.ts               ← 入口：挂载中间件和路由
          db/
            ConnectionManager.ts ← 数据库单例连接
            dbBlog.ts            ← 博客数据访问层
            dbTag.ts             ← 标签数据访问层（Step10 含缓存）
          routes/
            api/                 ← REST API 路由
            web/                 ← 页面路由（blogs + admin）
          types/                 ← TypeScript 接口定义
        views/
          partial/               ← header.ejs + footer.ejs（可复用）
          home.ejs / blog.ejs / addBlog.ejs / editBlog.ejs / error.ejs
        public/
          css/input.css          ← Tailwind 配置
          js/                    ← 前端脚本（由 frontend/ 编译生成）
        data/
          dev.sqlite             ← 数据库文件
          console.sql            ← 建表 + 初始数据
      frontend/                  ← 前端 TypeScript 源码
        src/
          home.ts                ← 博客首页 CSR 脚本
          tag.ts                 ← 标签过滤页 CSR 脚本
          admin_home.ts          ← 后台首页 CSR 脚本
          admin_add_blog.ts      ← 新增博客交互脚本
          admin_edit_blog.ts     ← 编辑博客交互脚本
          tools.ts               ← renderPagination 分页工具（复用）
          elements.ts            ← 共享 DOM 元素引用
          types.ts               ← 前端接口定义
        tsconfig.json            ← 编译到 backend/public/js/
    html_reference/              ← 静态 HTML 设计稿（参考用）
  assets/                        ← 各步骤效果截图
  readme.md
```

## 10 步构建路线图

| 步骤 | 核心内容 | 关键知识点 |
|---|---|---|
| [Step 01](./codes/step01/readme.md) | 项目脚手架 | tsx + concurrently + Tailwind CLI |
| [Step 02](./codes/step02/readme.md) | 数据库设计 + 数据访问层 | 多表设计、TypeScript 接口、多对多关系 |
| [Step 03](./codes/step03/readme.md) | createBlog + updateBlogById | 数据库事务（BEGIN / COMMIT / ROLLBACK） |
| [Step 04](./codes/step04/readme.md) | REST API 路由 | Express Router、CRUD、优雅退出 |
| [Step 05](./codes/step05/readme.md) | Web 路由框架 | SSR + CSR 混合、页面重定向 |
| [Step 06](./codes/step06/readme.md) | 前台首页页面 | 前端 TS 编译、EJS partials、分页算法 |
| [Step 07](./codes/step07/readme.md) | 单篇博客页面 | EJS 数据渲染、Tailwind 样式 |
| [Step 08](./codes/step08/readme.md) | 标签过滤页面 | URLSearchParams、路由顺序、工具函数复用 |
| [Step 09](./codes/step09/readme.md) | 管理后台 | 表单预填、博客增删改、自定义弹窗 |
| [Step 10](./codes/step10/readme.md) | 性能优化 | 内存缓存、TTL、模块级变量 |

## 启动方式（以 step10 为例）

```bash
cd codes/step10/backend
npm install
npm run dev
# 访问 http://localhost:3000
```

前端脚本如需修改，在 `frontend/` 中开启编译：

```bash
cd codes/step10/frontend
tsc -w
```
