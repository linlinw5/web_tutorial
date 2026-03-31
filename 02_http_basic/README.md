[← 返回首页](../readme.md)

# 第 2 章：HTTP 协议基础

## 课程目标

- 理解 HTTP 协议的工作原理与请求-响应模型
- 掌握请求方法、请求头、URL 结构的含义
- 理解 HTTP 状态码的分类与使用场景
- 理解 REST API 的设计规范
- 使用 Node.js 原生 `http` 模块实现路由分发与权限控制
- 学会使用 curl 和 REST Client 测试 API 接口
- 使用 nodemon 实现保存即重启的开发体验

---

## 一、HTTP 协议概述

### 什么是 HTTP

HTTP（HyperText Transfer Protocol，超文本传输协议）定义了浏览器（客户端）与 Web 服务器之间如何请求和传输数据。

- 基于文本的协议，数据以纯文本格式传输
- 采用**请求（Request）/ 响应（Response）**模型
- 默认端口：80（HTTP），443（HTTPS）

### 客户端-服务器模型

```
用户输入网址
     ↓
浏览器发起 HTTP 请求  →  服务器接收请求、处理数据
                      ←  服务器返回 HTTP 响应
     ↓
浏览器渲染响应内容
```

### 无状态协议

HTTP 是**无状态**的：每次请求之间没有上下文关联，服务器不会自动记住客户端的状态。

例如，先访问 `/login` 登录成功，再访问 `/profile`，服务器默认并不知道你已经登录过。解决方案：Cookie、Session、Token（后续章节介绍）。

### HTTP 版本演进

| 版本 | 发布年份 | 主要特点 |
|---|---|---|
| HTTP/1.0 | 1996 | 引入头部字段，但每次请求都重新建立连接 |
| HTTP/1.1 | 1997 | 长连接（Keep-Alive）、多种请求方法，目前最广泛使用 |
| HTTP/2 | 2015 | 二进制帧格式、多路复用、头部压缩 |
| HTTP/3 | 2022+ | 基于 UDP（QUIC），连接更快，适合移动网络 |

---

## 二、HTTP 请求（Request）

### 请求方法（`req.method`）

| 方法 | 说明 |
|---|---|
| `GET` | 获取资源（如网页、图片） |
| `POST` | 提交数据（如表单、JSON） |
| `PUT` | 替换整个资源 |
| `PATCH` | 部分更新资源 |
| `DELETE` | 删除资源 |

### 请求头（`req.headers`）

请求头提供额外的上下文信息，例如：

| 请求头 | 含义 |
|---|---|
| `Content-Type` | 请求体的数据类型（如 `application/json`） |
| `Accept` | 客户端期望的响应类型 |
| `User-Agent` | 客户端软件标识（浏览器信息） |
| `Authorization` | 授权令牌（如 `Bearer <token>`） |
| `Cookie` | 发送给服务器的 Cookie 内容 |

### 请求 URL（`req.url`）

```
http://example.com:80/api/users?name=jack&age=18
                      │          └────────────── 查询参数（query string）
                      └───────────────────────── 路径（pathname）
```

---

## 三、HTTP 响应（Response）

服务器向客户端返回的完整响应由**状态码**、**响应头**、**响应体**三部分组成。

```js
res.statusCode = 200;                              // 状态码
res.setHeader("Content-Type", "text/html");        // 响应头
res.write("<h1>Hello</h1>");                       // 响应体
res.end();                                         // 发送响应
```

### 常用状态码

| 分类 | 状态码 | 含义 |
|---|---|---|
| **2xx 成功** | 200 | OK，请求成功 |
| | 201 | Created，资源已创建 |
| | 204 | No Content，无响应体 |
| **3xx 重定向** | 301 | 永久重定向 |
| | 302 | 临时重定向 |
| | 304 | 资源未修改（缓存命中） |
| **4xx 客户端错误** | 400 | Bad Request，参数错误 |
| | 401 | Unauthorized，未认证 |
| | 403 | Forbidden，禁止访问 |
| | 404 | Not Found，资源不存在 |
| | 405 | Method Not Allowed，方法不允许 |
| **5xx 服务端错误** | 500 | Internal Server Error |
| | 502 | Bad Gateway |
| | 503 | Service Unavailable |

---

## 四、nodemon

每次修改代码后都要手动重启服务器（Ctrl+C → node 重新启动），开发时很繁琐。**nodemon** 会监听文件变化并自动重启，不需要手动干预。

```bash
# 全局安装（只需执行一次）
sudo npm install -g nodemon

# 验证安装
nodemon --version
```

使用方式与 `node` 完全相同，把 `node` 换成 `nodemon` 即可：

```bash
# 之前
node codes/server_01.js

# 使用 nodemon（文件修改保存后自动重启）
nodemon server_01.js
```

---

## 五、代码演示

所有演示代码在 `codes/` 目录下，先进入该目录再启动：

```bash
cd codes
nodemon server_01.js
```

### server_01：最基础的 HTTP 服务器

演示 HTTP 服务器的创建、状态码设置、响应头与响应体的写入。

```js
import http from "http";

const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.write("<h1>Hello, World!</h1>");
    res.end();
});

server.listen(port, () => {
    console.log(`服务器运行在端口:${port}`);
});
```

启动后访问 `http://localhost:3000`，观察浏览器输出。修改代码保存后 nodemon 会自动重启，无需手动操作。

---

### server_02：观察请求头与请求方法

在终端中观察每次请求的 `req.headers` 和 `req.method`。

```js
const server = http.createServer((req, res) => {
    console.log("req.headers:", req.headers);
    console.log("req.method:", req.method);

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.write("<h1>Hello, World!</h1>");
    res.end();
});
```

启动服务器后，用浏览器或 curl 发送请求，在**终端**中观察打印出的请求信息。

---

### server_03：解析请求 URL

使用 `url.parse()` 拆解请求路径与查询参数。

```js
import url from "url";

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);  // true 表示将 query 解析为对象
    console.log("pathname:", parsedUrl.pathname);
    console.log("query:", parsedUrl.query);

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.write("<h1>Hello, World!</h1>");
    res.end();
});
```

访问 `http://localhost:3000/?id=1&name=zhangsan`，在终端观察 `parsedUrl` 的输出。

---

### server_04：不同的 Content-Type

通过修改 `Content-Type` 响应头，控制客户端对响应体的解析方式。

```js
// 切换注释来对比三种效果：
// res.setHeader('Content-Type', 'text/plain');     // 纯文本
// res.setHeader('Content-Type', 'text/html');      // HTML
res.setHeader("Content-Type", "application/json");  // JSON
```

完整代码见 `codes/server_04.js`，修改 `Content-Type` 后保存，nodemon 自动重启，刷新浏览器即可观察差异。

---

### server_05：完整路由分发（重点）

综合运用前四个知识点，实现带路由分发、查询参数解析、权限验证的完整服务器。

**路由说明：**

| 路由 | 方法 | 说明 |
|---|---|---|
| `/` | GET | 首页，返回导航链接列表 |
| `/test` | GET / POST | GET 返回成功，POST 返回成功，其他返回 405 |
| `/users` | ANY | 返回所有用户的 HTML 列表 |
| `/user?id=1` | ANY | 按 id 查询用户，无 id 返回 400，未找到返回 404 |
| `/api/users` | ANY | 返回所有用户的 JSON |
| `/api/user?id=1` | ANY | 按 id 查询用户的 JSON，错误时返回对应 JSON 错误信息 |
| `/admin` | ANY | 需携带 `Authorization: Bearer Cisco123` 请求头或 `?password=Cisco123` 查询参数才能访问，否则返回 403 |
| 其他路径 | ANY | 返回 404 |

完整代码见 `codes/server_05.js`。

---

## 六、REST API 设计规范

### 什么是 REST API

REST（Representational State Transfer）是一种基于资源的 Web 架构风格：
- 每一个资源对应一个唯一的 URL
- 通过标准 HTTP 方法（GET、POST、PUT、PATCH、DELETE）表达操作意图

| 方法 | 作用 |
|---|---|
| `GET` | 读取资源 |
| `POST` | 创建资源 |
| `PUT` | 替换整个资源 |
| `PATCH` | 部分更新资源 |
| `DELETE` | 删除资源 |

### RESTful 路由规范

资源路径使用**名词复数**，不使用动词：

| 动作 | 路径 | 方法 |
|---|---|---|
| 获取所有用户 | `/api/users` | GET |
| 获取单个用户 | `/api/users/:id` | GET |
| 创建新用户 | `/api/users` | POST |
| 更新用户信息 | `/api/users/:id` | PUT / PATCH |
| 删除用户 | `/api/users/:id` | DELETE |

---

## 七、测试工具

### curl

curl 是命令行 HTTP 客户端，可直接向服务器发送各类请求。

```bash
# GET 请求
curl http://localhost:3000/

# GET 带查询参数
curl "http://localhost:3000/api/user?id=1"

# GET 携带认证头
curl -H "Authorization: Bearer Cisco123" http://localhost:3000/admin

# POST 发送 JSON
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "jack", "age": 18}'

# POST 发送表单数据
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "name=jack&age=18"

# PUT 请求
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "jack updated", "age": 20}'

# DELETE 请求
curl -X DELETE http://localhost:3000/api/users/1

# -v 显示完整请求头和响应头
curl -v http://localhost:3000/
```

**常用参数说明：**
- `-X`：指定请求方法
- `-H`：设置请求头
- `-d`：设置请求体
- `-v`：显示详细的请求与响应信息

### REST Client（VSCode 插件）

在 VSCode 中安装 [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) 插件后，可以直接在 `.http` 文件中编写并发送请求，无需切换到终端。

测试用例见 `codes/rest_client.http`，用 `###` 分隔每个请求，点击请求上方的 **Send Request** 即可发送。

---

## 课后练习

### 练习一

用 Node.js 的 `http` 模块创建一个运行在 **5000 端口**的 HTTP 服务器：

- `GET /`：返回 200，HTML 显示绿色 `<h1>Hello NodeJS!</h1>`；其他方法返回 403，HTML 显示红色 `<h1>403 Forbidden!</h1>`
- `GET /secret`：
  - 直接访问返回 403，HTML 显示 `<h1>require token!</h1>`
  - 携带请求头 `Authorization: Bearer Cisco123` 时返回 200，HTML 显示 `<h1>I like JavaScript - Authorization!</h1>`
  - 查询参数包含 `token=Cisco123` 时返回 200，HTML 显示 `<h1>I like JavaScript - Query!</h1>`
- 其余路由：返回 404，HTML 显示 `The path: <当前pathname> not found!`

### 练习二

在练习一的基础上增加以下内容（定义一个 `users` 数组存储用户信息）：

```js
const users = [
    { id: 1, name: "jack", age: 18 },
    { id: 2, name: "tom", age: 19 },
    { id: 3, name: "jerry", age: 20 },
];
```

- `ANY /api/users`：返回 200，JSON 格式为 `{ total: <数组长度>, data: <用户数组> }`
- `ANY /user`：必须携带 `?id=` 查询参数，否则返回 400（HTML）；按 id 查找，未找到返回 404（HTML），找到返回 200（HTML 显示姓名和年龄）
- `ANY /api/secret`：
  - 直接访问返回 403，JSON：`{ success: false, message: "require token!" }`
  - 携带 `Authorization: Bearer Cisco123` 返回 200，JSON：`{ success: true, message: "You got my secret: I like JavaScript!" }`
