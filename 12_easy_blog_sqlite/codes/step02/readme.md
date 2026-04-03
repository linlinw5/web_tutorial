[← Back to Chapter Home](../../readme.md)

# Step 02: Database Design and Data Access Layer

Create the database using DataGrip, design the table schema, and write data access functions for use by subsequent routes.

## What's Added in This Step

- `backend/data/dev.sqlite`: database file created with DataGrip
- `backend/data/console.sql`: table creation SQL + initial test data
- `src/db/ConnectionManager.ts`: singleton database connection
- `src/db/dbBlog.ts`: blog-related query functions
- `src/db/dbTag.ts`: tag-related query functions
- `src/types/`: TypeScript interface definitions (`Blog`, `Tag`, etc.)
- `src/db/temp_test.ts`: temporary test script

## Database Design

This project involves 5 tables. Blogs and tags have a **many-to-many** relationship, implemented through the junction table `blog_tags`:

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
    UNIQUE(blog_id, tag_id)   -- prevent duplicate associations
);
```

## TypeScript Interfaces (`src/types/`)

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

All interfaces are exported through `src/types/index.ts` using the barrel pattern.

## Data Access Functions (`src/db/`)

**dbBlog.ts:**

| Function | Description |
|---|---|
| `getAllBlogs(offset, limit)` | Paginated query, JOIN users to return username |
| `getBlogById(id)` | Fetch a single post, JOIN users |
| `getBlogsByTagId(tagId, offset, limit)` | Filter by tag, three-table JOIN |
| `deleteBlogById(id)` | Delete a post, returns `CUDResponse` |

**dbTag.ts:**

| Function | Description |
|---|---|
| `getAllTags()` | Fetch all tags |
| `getTagsByBlogId(blogId)` | Fetch tags associated with a specific blog post |

## Temporary Testing

```bash
cd backend
tsx ./src/db/temp_test.ts
# Example output:
# [ { id: 1, name: 'Technical' }, { id: 2, name: 'Life' }, ... ]
```

`temp_test.ts` is only used during early development to verify that functions work correctly. Later chapters will replace it with Jest tests.
