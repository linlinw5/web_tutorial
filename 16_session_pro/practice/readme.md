[← 返回章节首页](../README.md)

# 练习：实现基于 Session 的用户认证系统

## 已预配好的部分（无需修改）

| 文件/目录 | 说明 |
|---|---|
| `backend/src/db/` | ConnectionManager、createUser、checkPassword、getAllGroups 全部完整 |
| `backend/src/utils/shutdownConnection.ts` | 优雅退出，完整 |
| `backend/views/` | 所有 EJS 模板，完整 |
| `backend/public/css/` `public/images/` | 样式与图片资源，完整 |
| `frontend/tsconfig.json` | 编译配置（输出到 backend/public/js/），完整 |

## 需要你完成的部分

按以下顺序实现，每步完成后用 `api_test.http` 或浏览器验证：

### Step 1：实现 authCheck 中间件

`backend/src/utils/authCheck.ts`

- `isAuthenticated`：检查 `req.session.user`，未登录跳转 `/auth/login`
- `isAdmin`：检查 `group_id === 1`，无权限返回 403

### Step 2：实现 API 路由

`backend/src/routes/api_auth.ts`

- `POST /register`：调用 `createUser()`，注意字段校验（400）和错误处理（500）
- `POST /login`：调用 `checkPassword()`，成功后写入 `req.session.user`（401）

用 `../api_test.http` 测试注册和登录接口。

### Step 3：配置 app.ts

`backend/src/app.ts`

- 补全 `SessionData` 接口扩充（user 字段）
- 配置 session 中间件的 `store`（SQLiteStore）
- 挂载路由

### Step 4：实现 Web 路由

`backend/src/routes/auth.ts`

按 TODO 注释逐一完成 6 个路由，注意：
- `/login` 已登录时需重定向
- `/profile` 使用 `isAuthenticated` 守卫
- `/admin` 使用 `isAdmin` 守卫
- `/logout` 需同时销毁 session 和清除 Cookie

### Step 5：实现前端脚本

```bash
cd frontend
tsc -w   # 开启监视编译
```

- `frontend/src/login.ts`：拦截表单提交，fetch `/api/auth/login`
- `frontend/src/register.ts`：拦截表单提交，验证密码一致，fetch `/api/auth/register`

## 启动

```bash
# 终端 1 - 后端
cd practice/backend
npm install
npm run dev

# 终端 2 - 前端编译
cd practice/frontend
tsc -w
```

参考实现见 `../codes/`。
