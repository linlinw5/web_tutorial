[← 返回首页](../readme.md)

# Mock API 服务器

第七章 Fetch 系列练习（`07_fetch_1` / `07_fetch_2` / `07_fetch_3`）的后端依赖。提供用户数据的增删改查接口，数据存储在内存中，重启后恢复初始状态。

## 快速启动

```bash
cd 07_mock_api
npm install
npm run dev
```

启动后访问 `http://localhost:3000` 查看接口文档。

---

## 接口列表

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/users` | 获取所有用户 |
| GET | `/api/users/:id` | 获取单个用户 |
| POST | `/api/users` | 新增用户 |
| PUT | `/api/users/:id` | 修改用户 |
| DELETE | `/api/users/:id` | 删除用户 |
| GET | `/reset` | 重置数据为初始状态 |

### POST / PUT 请求体格式

支持两种格式：

**JSON（推荐）：**

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada","email":"ada@example.com"}'
```

**www-form-urlencoded：**

```bash
curl -X POST http://localhost:3000/api/users \
  -d "name=Ada&email=ada@example.com"
```

### 响应格式

用户对象结构：

```json
{
  "id": 1,
  "name": "Tom",
  "email": "tom@abc.com",
  "image": "/images/tom.png"
}
```

---

## 接口测试

项目根目录提供了 `rest_client.http`，涵盖所有接口的测试用例，包括正常请求和错误场景（404）。

使用方式：在 VS Code 中安装 [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) 插件，打开 `rest_client.http`，点击每个请求上方的 **Send Request** 即可发送。

> 测试前确保 Mock API 服务器已启动（`npm run dev`）。如果测试过程中数据被改动，访问 `/reset` 可一键恢复初始状态。

---

## 项目结构

```
07_mock_api/
  src/
    index.ts          ← Express 应用入口，中间件与路由挂载
    routes/
      users.ts        ← /api/users 路由处理器（完整 CRUD）
    data/
      users.ts        ← 内存数据，初始用户列表与重置函数
    types/
      user.ts         ← User 接口定义
  public/
    images/           ← 用户头像图片
  dist/               ← TypeScript 编译输出
```

## 技术说明

- **Express v5**：路由与中间件
- **CORS**：允许所有域名跨域访问（开发环境专用配置）
- **数据存储**：内存数组，重启后恢复初始状态；访问 `/reset` 可手动重置
- **TypeScript**：源码位于 `src/`，编译至 `dist/`，使用 ESM 模块（`"type": "module"`）
