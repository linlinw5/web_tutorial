[← Back to Chapter Home](../../readme.md)

# Step 03: Database Transactions — createBlog and updateBlogById

Add write operation functions to `dbBlog.ts`. Both functions involve **atomic writes across multiple tables** and require database transactions to guarantee consistency.

## What's Added in This Step

- `src/db/dbBlog.ts`: two new functions — `createBlog` and `updateBlogById`

## Why Transactions Are Needed

Creating a blog post requires two database operations:

```sql
INSERT INTO blogs ...        -- Step 1: write the blog content
INSERT INTO blog_tags ...    -- Step 2: associate tags
```

If Step 1 succeeds but Step 2 fails, an orphaned blog record with no tags is left behind — the data is inconsistent.

A **Transaction** guarantees these two steps are "all or nothing":

```sql
BEGIN TRANSACTION;
  INSERT INTO blogs ...
  INSERT INTO blog_tags ...
COMMIT;          -- commit only if everything succeeds
-- If an error occurs midway:
ROLLBACK;        -- undo all operations and restore the previous state
```

## createBlog Implementation

```typescript
export async function createBlog(title, content, img, userId, published, tags): Promise<CUDResponse> {
    let db: any = null;
    try {
        db = await getConnection();
        await db.run("BEGIN TRANSACTION");

        // 1. Insert the blog record
        const result = await db.run(
            "INSERT INTO blogs (title, content, img, user_id, published) VALUES (?, ?, ?, ?, ?)",
            [title, content, img, userId, published ? 1 : 0]
        );

        // 2. Bulk insert tag associations (Promise.all runs in parallel)
        if (tags.length > 0) {
            await Promise.all(tags.map(tagId =>
                db.run("INSERT INTO blog_tags (blog_id, tag_id) VALUES (?, ?)", [result.lastID, tagId])
            ));
        }

        await db.run("COMMIT");
        return { success: true, message: `Blog id: ${result.lastID} created successfully` };
    } catch (error) {
        db && await db.run("ROLLBACK");   // roll back on error
        throw new Error("Failed to create blog");
    }
}
```

## updateBlogById Implementation

The strategy for updating blog tags is **delete old associations, then insert new ones** (delete + re-insert). This is simpler and more reliable than comparing differences row by row:

```typescript
await db.run("DELETE FROM blog_tags WHERE blog_id = ?", [id]);
await Promise.all(tags.map(tagId =>
    db.run("INSERT INTO blog_tags (blog_id, tag_id) VALUES (?, ?)", [id, tagId])
));
```

The entire "update blog + update tags" operation is also wrapped in a single transaction.

## Testing

```bash
tsx ./src/db/temp_test.ts
# Output: { success: true, message: 'Blog id: 60 updated successfully' }
```
