[← 返回首页](../readme.md)

# 第 8 章：从零搭建 Express API 服务器

第七章用的 Mock API 服务器是预先准备好的。本章手动从零实现同一个服务器，理解它的每一行配置背后的原因——包括 CORS 是什么、为什么需要它，以及如何用 `concurrently` 简化开发命令。

## 目录约定

```
08_express_adv/
  README.md
  rest_client.http     ← 接口测试脚本
  codes/
    package.json
    tsconfig.json
    src/
      index.ts         ← 完整实现
    public/
      images/          ← 用户头像图片
  practice/
    package.json
    tsconfig.json
    src/
      index.ts         ← 在这里完成实现
    public/
      images/
```

**工作流：**

```bash
cd codes       # 或 practice
npm install
npm run dev
```

---

## 8.1 项目初始化

```bash
npm init -y                       # 生成 package.json
npm install express cors          # 运行时依赖
npm install -D typescript nodemon concurrently @types/express @types/cors
```

在 `package.json` 中加上 `"type": "module"` 以使用 ESM 语法（`import` / `export`）：

```json
{
  "type": "module"
}
```

初始化 TypeScript 配置：

```bash
npx tsc --init
```

调整 `tsconfig.json` 的关键选项：

```json
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist"
  }
}
```

---

## 8.2 npm scripts 与 concurrently

开发这个后端项目需要同时运行两个进程：

| 进程 | 命令 | 作用 |
|---|---|---|
| TypeScript 编译器 | `tsc -w` | 监听 `src/` 变化，自动编译到 `dist/` |
| Node.js 服务器 | `nodemon ./dist/index.js` | 监听 `dist/` 变化，自动重启服务器 |

每次开发都要开两个终端窗口，很麻烦。`concurrently` 可以在一条命令中同时启动多个进程：

```bash
npx concurrently "tsc -w" "nodemon ./dist/index.js"
```

把这条命令写入 `package.json` 的 `scripts` 字段，以后只需 `npm run dev`：

```json
"scripts": {
  "dev": "concurrently \"tsc -w\" \"nodemon ./dist/index.js\""
}
```

> **`npm` vs `npx`：** `npm` 用于安装和管理包、运行 scripts；`npx` 用于直接执行某个包提供的命令，无需提前全局安装。scripts 中的命令由 npm 在本地 `node_modules/.bin/` 中查找，所以不需要加 `npx`。

---

## 8.3 中间件配置

```typescript
app.use(cors(corsOptions));                      // 跨域支持（见 8.4）
app.use(express.json());                         // 解析 Content-Type: application/json 的请求体
app.use(express.urlencoded({ extended: true })); // 解析 Content-Type: application/x-www-form-urlencoded 的请求体
app.use(express.static("public"));               // 将 public/ 目录暴露为静态文件服务
```

`express.json()` 和 `express.urlencoded()` 是请求体解析中间件。没有它们时，`req.body` 始终为 `undefined`；有了它们，Express 才会根据请求的 `Content-Type` 自动解析请求体，并把结果挂到 `req.body` 上。

在 POST 路由中打印两行日志，可以直观看到两种格式的区别：

```typescript
app.post("/api/users", (req, res) => {
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("请求体:", req.body);
    // ...
});
```

---

## 8.4 CORS 跨域原理与配置

### 同源策略

浏览器有一条安全规则：**同源策略**（Same-Origin Policy）。"源"由三部分组成：

```
协议 + 域名 + 端口
http://localhost:5500   ← 前端（VS Code Live Server）
http://localhost:3000   ← 后端（Express）
```

两者端口不同，属于**不同源**。浏览器会阻止前端直接读取来自不同源的响应，即使请求已经发出且服务器已经响应。

### CORS 如何解决

CORS（Cross-Origin Resource Sharing，跨源资源共享）是服务器向浏览器表态的机制：通过在响应头中加入 `Access-Control-Allow-Origin`，告诉浏览器"这个响应可以被指定来源读取"。

```
响应头示例：
Access-Control-Allow-Origin: http://localhost:5500
```

浏览器看到这个响应头，确认来源在白名单中，才放行让 JavaScript 读取响应数据。

### Express 中的配置

```typescript
import cors from "cors";

const corsOptions = {
    origin: "http://localhost:5500",              // 只允许这个来源
    methods: ["GET", "POST", "PUT", "DELETE"],    // 允许的 HTTP 方法
};

app.use(cors(corsOptions));
```

**演示跨域报错：** 注释掉 `app.use(cors(...))` 这一行，然后从前端页面发起请求，浏览器控制台会出现：

```
Access to fetch at 'http://localhost:3000/api/users' from origin
'http://localhost:5500' has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

这条报错出现在**浏览器**而不是服务器，因为请求实际上已经到达服务器并拿到了响应——是浏览器在拦截。用 curl 或 REST Client 发请求不会有跨域问题，因为它们不是浏览器。

> `origin: "*"` 表示允许任意来源，适合完全公开的 API（如 `07_mock_api`）。生产环境中应明确指定允许的域名，避免数据被恶意网站读取。

---

## 8.5 完整 CRUD 路由

```typescript
// 获取所有用户
app.get("/api/users", (req, res) => {
    res.json(users);
});

// 获取单个用户
app.get("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const user = users.find((u) => u.id === id);
    user ? res.json(user) : res.status(404).json({ error: "User not found" });
});

// 新增用户
app.post("/api/users", (req, res) => {
    const { name, email } = req.body;
    const newUser: User = { id: Date.now(), name, email, image: "/images/default.png" };
    users.push(newUser);
    res.status(201).json(newUser);
});

// 修改用户
app.put("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const { name, email } = req.body;
    const user = users.find((u) => u.id === id);
    if (user) {
        user.name = name;
        user.email = email;
        res.json(user);
    } else {
        res.status(404).json({ error: "User not found" });
    }
});

// 删除用户
app.delete("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = users.findIndex((u) => u.id === id);
    if (index >= 0) {
        users.splice(index, 1);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: "User not found" });
    }
});

// 404 兜底路由（必须放在最后）
app.use((req, res) => {
    res.status(404).json({ error: "Route Not Found" });
});
```

HTTP 状态码规范：

| 状态码 | 含义 | 使用场景 |
|---|---|---|
| `200` | OK | 查询、修改、删除成功（默认） |
| `201` | Created | 新增资源成功 |
| `404` | Not Found | 资源不存在 |

---

## 8.6 对下一步的思考

本章的 API 服务器还有三个明显的局限：

- **数据不持久**：用内存数组模拟数据库，重启后数据丢失。下一步引入 SQLite（第 9 章）解决。
- **代码不分层**：所有路由、中间件、数据都在 `index.ts` 一个文件中。真实项目应按功能模块拆分（第 11 章展示）。
- **没有权限控制**：任何人都可以增删改查。真实项目需要用户认证和权限中间件（第 16–19 章）。
