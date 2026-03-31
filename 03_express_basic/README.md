[← 返回首页](../readme.md)

# 第 3 章：Express 框架基础

## 目录约定

从本章开始，每章统一采用以下目录结构：

```
本章目录/
  README.md      ← 教程文档（你正在读的这份）
  codes/         ← 完整的参考代码，供对照和参考
  practice/      ← 你的练习目录，在这里跟着教程动手操作
```

**`codes/`** 是本章所有示例的最终实现，可以随时运行来验证效果。

**`practice/`** 是你的工作目录：已预置好 `package.json`，运行 `npm install` 后按照教程一步步自己写代码。卡住时再对照 `codes/` 查看参考实现。

> 建议先自己动手写，遇到问题再看 `codes/`，而不是直接复制。

---

## 课程目标

- 理解框架的意义：对比原生 `http` 模块，感受 Express 解决了什么问题
- 掌握 Express 的中间件机制，理解 `app.use()` 与 `app.get()` 的区别
- 能够编写页面路由（返回 HTML）和 API 路由（返回 JSON）
- 使用 EJS 模板引擎渲染动态页面
- 使用 `express.static()` 托管静态资源

---

## 一、为什么要用框架？

回顾上一章，用原生 `http` 模块写一个带路由的服务器时，代码是这样的：

```js
// 原生 http 模块——路由全靠手写 if/else
const server = http.createServer((req, res) => {
    const { pathname } = url.parse(req.url);

    if (pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>首页</h1>');
    } else if (pathname === '/about') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>关于</h1>');
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});
```

随着路由增多，`if/else` 链会急剧膨胀，维护困难。**Express** 是 Node.js 最流行的 Web 框架，它封装了这些繁琐细节，让开发者专注于业务逻辑：

```js
// Express——每个路由独立声明，清晰简洁
app.get('/', (req, res) => res.send('<h1>首页</h1>'));
app.get('/about', (req, res) => res.send('<h1>关于</h1>'));
```

---

## 二、初始化项目

进入你的练习目录，安装依赖后即可开始：

```bash
cd practice
npm install
```

`practice/package.json` 已预置 `"type": "module"` 和所需依赖，无需手动配置。

如果你想从完全空白的目录开始，也可以自行初始化：

```bash
npm init -y
npm install express ejs
# 然后在 package.json 中手动添加 "type": "module"
```

**本章所有示例均在 `practice/`（或 `codes/`）目录下运行：**

```bash
nodemon app01.js
```

---

## 三、app01：最简 Express 服务器与中间件

`codes/app01.js` 演示了 Express 最核心的两个概念：**中间件** 和 **路由**。

```js
import express from 'express';

const app = express();
const port = 3000;

// ── 中间件：对所有请求生效 ──────────────────────────────────
app.use((req, res, next) => {
    console.log(`收到 ${req.method} 请求: ${req.path}`);
    console.log(`查询参数:`, req.query);
    next();  // 必须调用 next()，否则请求在此中止
});

// ── 路由：只处理 GET / ─────────────────────────────────────
app.get('/', (req, res) => {
    res.send('<h1>欢迎使用Express服务器！</h1>');
    // 路由处理完毕，无需调用 next()
});

app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});
```

启动：

```bash
nodemon app01.js
```

### 中间件（Middleware）

**中间件**是一个函数，在请求到达最终路由之前（或之后）执行，签名为 `(req, res, next)`。

```
请求进入
   ↓
中间件 1（日志）→ next()
   ↓
中间件 2（认证）→ next()
   ↓
路由处理（返回响应）
```

`next()` 是"放行"信号——调用它才会继续向下执行；不调用则请求停在当前中间件。

### `app.use()` vs `app.get()`

| | `app.use()` | `app.get()` / `app.post()` 等 |
|---|---|---|
| **匹配方法** | 所有 HTTP 方法 | 仅指定方法 |
| **路径匹配** | 前缀匹配（`/api` 匹配 `/api/users`） | 精确匹配 |
| **典型用途** | 中间件（日志、认证、解析请求体） | 业务路由 |

---

## 四、app02：页面路由与 API 路由

`codes/app02.js` 演示了多路由定义、`req.query` 取参数、JSON 响应，以及用 `app.use()` 兜底处理 404。

```bash
nodemon app02.js
```

**路由一览：**

| 路由 | 方法 | 说明 |
|---|---|---|
| `/` | GET | 首页，返回导航链接 |
| `/test` | GET | 返回 HTML |
| `/test` | POST | 返回 HTML（用 REST Client 测试） |
| `/api/users` | GET | 返回所有用户，JSON 格式 |
| `/api/user?id=1` | GET | 按 id 查询用户，JSON 格式 |
| `/admin` | GET | 需携带 `Authorization: Bearer Cisco123` 请求头 |
| 其他路径 | ANY | 兜底 404，由 `app.use()` 处理 |

**关键代码片段——获取查询参数：**

```js
// 访问 /api/user?id=1
app.get('/api/user', (req, res) => {
    if (!req.query.id) {
        return res.status(400).json({ success: false, message: '缺少用户ID参数' });
    }
    // req.query.id 是字符串，需转为数字再比较
    const user = users.find(u => u.id === parseInt(req.query.id));
    // ...
});
```

**关键代码片段——404 兜底中间件（必须放在所有路由之后）：**

```js
app.use((req, res) => {
    res.status(404).send(`<h1>404 - "${req.path}" 不存在</h1>`);
});
```

完整代码见 `codes/app02.js`。

---

## 五、app03：EJS 模板引擎与静态文件

`codes/app03.js` 演示如何用 EJS 渲染动态页面，以及如何托管 CSS、图片等静态资源。

```bash
nodemon app03.js
```

### 项目文件结构

```
03_express_basic/
  codes/
    app03.js          ← 服务器入口
    data.js           ← 博客数据（模拟数据库）
    package.json
    views/
      home.ejs        ← 首页模板
      blog.ejs        ← 博客详情模板
      error.ejs       ← 错误页模板
    public/
      css/
        style.css     ← 全局样式
      images/
        logo.jpg      ← 网站 logo
```

### 配置模板引擎与静态文件

```js
app.set('view engine', 'ejs');   // 声明使用 EJS
app.set('views', './views');     // 模板文件目录（相对于运行目录）
app.use(express.static('public')); // 静态资源目录（/css/... /images/...）
```

### 渲染页面：`res.render()`

```js
app.get('/', (req, res) => {
    // 第一个参数：模板文件名
    // 第二个参数：传递给模板的变量
    res.render('home.ejs', { title: '博客首页', blogs });
});
```

### EJS 基本语法

EJS 是在 HTML 中嵌入 JavaScript 的模板语言，只需掌握三种标签：

| 标签 | 用途 | 示例 |
|---|---|---|
| `<%= 表达式 %>` | 输出变量值（会转义 HTML） | `<%= blog.title %>` |
| `<%- 表达式 %>` | 输出原始 HTML（不转义） | `<%- include('partials/header') %>` |
| `<% 语句 %>` | 执行 JS 逻辑（不输出） | `<% for (let item of blogs) { %>` |

**`views/home.ejs` 示例：**

```html
<h1><%= title %></h1>
<ul>
    <% for (let blog of blogs) { %>
        <li>
            <a href="/blog?id=<%= blog.id %>"><%= blog.title %></a>
        </li>
    <% } %>
</ul>
```

**`views/error.ejs` 示例：**

```html
<h1><%= title %></h1>
<p><%= message %></p>
<p><a href="/">返回首页</a></p>
```

---

## 六、`res` 常用方法对比

| 方法 | 说明 | 典型场景 |
|---|---|---|
| `res.send(string)` | 发送 HTML 字符串 | 简单页面、调试 |
| `res.json(object)` | 发送 JSON，自动设置 `Content-Type` | API 路由 |
| `res.render(view, data)` | 渲染 EJS 模板 | 页面路由 |
| `res.status(code)` | 设置状态码（可链式调用） | `res.status(404).json(...)` |
| `res.redirect(url)` | 重定向 | 登录后跳转 |

---

## 课后练习

参考 `app02.js` 和 `app03.js`，完成以下任务：

1. 新建一个 Express 服务器，端口 **4000**
2. 在 `data.js` 中定义一个 `products` 数组（至少 5 条商品数据，包含 `id`、`name`、`price`、`category` 字段）
3. 实现以下路由：
   - `GET /`：渲染首页，显示所有商品的名称列表，每项可点击跳转到详情页
   - `GET /product?id=1`：渲染商品详情页，显示完整字段；id 缺失返回 400，商品不存在返回 404
   - `GET /api/products`：返回所有商品的 JSON
   - `GET /api/products?category=电子`：按 `category` 过滤，返回符合条件的商品 JSON
4. 在 `public/css/` 中添加样式文件，并在 EJS 模板中引用
