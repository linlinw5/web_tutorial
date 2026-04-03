[← Back to Chapter Home](../../readme.md)

# Step 04: Designing REST API Routes

Wire the data access functions into Express routes, exposing a complete blog CRUD API.

## What's Added in This Step

- `src/routes/api/blogs.ts`: blog API routes (6 endpoints)
- `src/routes/api/index.ts`: barrel export
- `src/index.ts`: mount API routes, enable request body parsing, add 404 fallback and graceful shutdown
- `backend/api_test.http`: REST Client test script
- `views/error.ejs`: error page template

## API Route Overview (`/api/blogs`)

| Method | Path | Description |
|---|---|---|
| GET | `/api/blogs?offset=0&limit=6` | Paginated query of all blogs |
| GET | `/api/blogs/:id` | Fetch a single blog post |
| GET | `/api/blogs/tag/:tag?offset=0&limit=6` | Filter by tag |
| POST | `/api/blogs` | Create a new blog post |
| PATCH | `/api/blogs/:id` | Update a blog post |
| DELETE | `/api/blogs/:id` | Delete a blog post (returns 204) |

## New Configuration in `src/index.ts`

```typescript
// Enable request body parsing (required for POST/PATCH)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount API routes
app.use("/api/blogs", apiBlogsRoute);

// 404 fallback
app.use((req, res) => {
    res.status(404).render("error", { title: "Page Not Found", image_name: "404.jpg" });
});

// Graceful shutdown: close the database connection before exiting
process.on("SIGINT",  async () => { await closeConnection(); process.exit(0); });
process.on("SIGTERM", async () => { await closeConnection(); process.exit(0); });
```

## Route File Organization

```typescript
// routes/api/index.ts — barrel export
import blogs from "./blogs.ts";
export { blogs };

// index.ts — import and mount
import { blogs as apiBlogsRoute } from "./routes/api/index.ts";
app.use("/api/blogs", apiBlogsRoute);
```

## At This Point

The API routes are complete. All endpoints can be tested using `api_test.http` (VS Code REST Client) to verify that create, read, update, and delete operations work correctly.
