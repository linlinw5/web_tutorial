[← 返回章节首页](../../readme.md)

# Step 03：数据库事务——createBlog 与 updateBlogById

为 `dbBlog.ts` 补充写操作函数，两个函数都涉及**多张表的原子性写入**，需要用数据库事务保证一致性。

## 本步骤新增内容

- `src/db/dbBlog.ts`：新增 `createBlog` 和 `updateBlogById` 两个函数

## 为什么需要事务

创建一篇博客需要两步数据库操作：

```sql
INSERT INTO blogs ...        -- 第 1 步：写入博客内容
INSERT INTO blog_tags ...    -- 第 2 步：关联标签
```

如果第 1 步成功、第 2 步失败，就会留下一篇"没有标签"的孤立博客记录——数据不一致。

**事务（Transaction）** 保证这两步"要么全做，要么全不做"：

```sql
BEGIN TRANSACTION;
  INSERT INTO blogs ...
  INSERT INTO blog_tags ...
COMMIT;          -- 全部成功才提交
-- 若中途出错：
ROLLBACK;        -- 撤销所有操作，恢复原状
```

## createBlog 实现

```typescript
export async function createBlog(title, content, img, userId, published, tags): Promise<CUDResponse> {
    let db: any = null;
    try {
        db = await getConnection();
        await db.run("BEGIN TRANSACTION");

        // 1. 插入博客主体
        const result = await db.run(
            "INSERT INTO blogs (title, content, img, user_id, published) VALUES (?, ?, ?, ?, ?)",
            [title, content, img, userId, published ? 1 : 0]
        );

        // 2. 批量插入标签关联（Promise.all 并行执行）
        if (tags.length > 0) {
            await Promise.all(tags.map(tagId =>
                db.run("INSERT INTO blog_tags (blog_id, tag_id) VALUES (?, ?)", [result.lastID, tagId])
            ));
        }

        await db.run("COMMIT");
        return { success: true, message: `Blog id: ${result.lastID} created successfully` };
    } catch (error) {
        db && await db.run("ROLLBACK");   // 出错时回滚
        throw new Error("Failed to create blog");
    }
}
```

## updateBlogById 实现

更新博客标签的策略：**先删除旧关联，再插入新关联**（delete + re-insert），比逐条比较差异更简单可靠：

```typescript
await db.run("DELETE FROM blog_tags WHERE blog_id = ?", [id]);
await Promise.all(tags.map(tagId =>
    db.run("INSERT INTO blog_tags (blog_id, tag_id) VALUES (?, ?)", [id, tagId])
));
```

整个"更新博客 + 更新标签"同样包在一个事务中。

## 测试

```bash
tsx ./src/db/temp_test.ts
# 输出：{ success: true, message: 'Blog id: 60 updated successfully' }
```
