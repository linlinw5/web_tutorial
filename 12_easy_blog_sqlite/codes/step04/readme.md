[← 返回章节首页](../../readme.md)

# Step 04：设计 REST API 路由

将数据访问函数接入 Express 路由，对外暴露完整的博客 CRUD API。

## 本步骤新增内容

- `src/routes/api/blogs.ts`：博客 API 路由（6 个端点）
- `src/routes/api/index.ts`：barrel 导出
- `src/index.ts`：挂载 API 路由、开启请求体解析、添加 404 兜底和优雅退出
- `backend/api_test.http`：REST Client 测试脚本
- `views/error.ejs`：错误页面模板

## API 路由一览（`/api/blogs`）

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/blogs?offset=0&limit=6` | 分页查询所有博客 |
| GET | `/api/blogs/:id` | 查询单篇博客 |
| GET | `/api/blogs/tag/:tag?offset=0&limit=6` | 按标签过滤查询 |
| POST | `/api/blogs` | 新建博客 |
| PATCH | `/api/blogs/:id` | 更新博客 |
| DELETE | `/api/blogs/:id` | 删除博客（返回 204） |

## `src/index.ts` 新增配置

```typescript
// 开启请求体解析（POST/PATCH 需要）
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 挂载 API 路由
app.use("/api/blogs", apiBlogsRoute);

// 兜底 404
app.use((req, res) => {
    res.status(404).render("error", { title: "Page Not Found", image_name: "404.jpg" });
});

// 优雅退出：收到信号时先关闭数据库连接
process.on("SIGINT",  async () => { await closeConnection(); process.exit(0); });
process.on("SIGTERM", async () => { await closeConnection(); process.exit(0); });
```

## 路由文件组织方式

```typescript
// routes/api/index.ts — barrel 导出
import blogs from "./blogs.ts";
export { blogs };

// index.ts — 导入并挂载
import { blogs as apiBlogsRoute } from "./routes/api/index.ts";
app.use("/api/blogs", apiBlogsRoute);
```

## 至此

API 路由完成，可通过 `api_test.http`（VS Code REST Client）测试全部接口，验证增删改查正常工作。
