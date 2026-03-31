[← 返回章节首页](../../readme.md)

# Step 02：数据库设计与数据访问层

用 DataGrip 创建数据库，设计表结构，并编写数据访问函数供后续路由调用。

## 本步骤新增内容

- `backend/data/dev.sqlite`：用 DataGrip 创建数据库文件
- `backend/data/console.sql`：建表 SQL + 初始测试数据
- `src/db/ConnectionManager.ts`：单例数据库连接
- `src/db/dbBlog.ts`：博客相关查询函数
- `src/db/dbTag.ts`：标签相关查询函数
- `src/types/`：TypeScript 接口定义（`Blog`、`Tag` 等）
- `src/db/temp_test.ts`：临时测试脚本

## 数据库设计

本项目涉及 5 张表，其中博客与标签是**多对多**关系，通过中间表 `blog_tags` 实现：

```
groups ←── users ←── blogs ←──┐
                               blog_tags
                  tags ────────┘
```

```sql
CREATE TABLE blogs (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER NOT NULL,
    title      TEXT NOT NULL,
    content    TEXT NOT NULL,
    published  BOOLEAN DEFAULT 0,
    img        TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE blog_tags (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    blog_id  INTEGER NOT NULL,
    tag_id   INTEGER NOT NULL,
    FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id)  REFERENCES tags(id)  ON DELETE CASCADE,
    UNIQUE(blog_id, tag_id)   -- 防止重复关联
);
```

## TypeScript 接口（`src/types/`）

```typescript
// types/blog.ts
export interface Blog {
    id: number; title: string; content: string;
    img: string; user_id: number; published: number;
    created_at: string; username: string;
}
export interface BlogWithTags extends Blog { tags: number[]; }
export interface BlogsResponse { total: number; data: Blog[]; }
export interface CUDResponse { success: boolean; message?: string; error?: string; }

// types/tag.ts
export interface Tag { id: number; name: string; }
```

所有接口统一通过 `src/types/index.ts` 导出（barrel 模式）。

## 数据访问函数（`src/db/`）

**dbBlog.ts：**

| 函数 | 说明 |
|---|---|
| `getAllBlogs(offset, limit)` | 分页查询，JOIN users 返回 username |
| `getBlogById(id)` | 查单篇，JOIN users |
| `getBlogsByTagId(tagId, offset, limit)` | 按标签过滤，三表 JOIN |
| `deleteBlogById(id)` | 删除，返回 `CUDResponse` |

**dbTag.ts：**

| 函数 | 说明 |
|---|---|
| `getAllTags()` | 查全部标签 |
| `getTagsByBlogId(blogId)` | 查某篇博客关联的标签 |

## 临时测试

```bash
cd backend
tsx ./src/db/temp_test.ts
# 输出示例：
# [ { id: 1, name: 'Technical' }, { id: 2, name: 'Life' }, ... ]
```

`temp_test.ts` 只在开发初期验证函数是否正确，后续章节会改写为 Jest 测试。
