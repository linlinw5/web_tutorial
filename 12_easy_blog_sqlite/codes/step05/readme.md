[← Back to Chapter Home](../../readme.md)

# Step 05: Designing Web Routes (SSR + CSR Hybrid)

Build on top of the existing API routes by adding a web route layer for the browser, enabling page rendering.

## What's Added in This Step

- `src/routes/web/blogs.ts`: blog frontend page routes
- `src/routes/web/admin.ts`: admin dashboard routes (scaffolded, no content yet)
- `src/routes/web/index.ts`: barrel export
- `src/index.ts`: mount web routes, homepage redirect
- `views/blog.ejs`: single blog post page template (temporarily displays raw data via `JSON.stringify`)
- `public/js/home.js`: placeholder script (just a `console.log` for now)

## SSR + CSR Hybrid Design

This project uses a hybrid rendering strategy for its web pages:

| Content | Rendering | Reason |
|---|---|---|
| Navigation tag list (tags) | **SSR** (server-side query, passed to EJS) | Tags change infrequently; no need for dynamic refresh |
| Blog list | **CSR** (JS fetches the API after page load) | Requires pagination without full page reloads |
| Single blog post content | **SSR** | Content is static; better for SEO |

## Web Route Implementation

```typescript
// routes/web/blogs.ts
router.get('/', async (req, res) => {
    const tags = await getAllTags();               // SSR: query tags on the server
    res.render('home.ejs', {
        title: 'Easy Blog - Home',
        script_name: 'home.js',                   // tells EJS which frontend script to load
        tags                                      // tags rendered directly into the template
    });
    // The blog list is NOT fetched here; the browser loads home.js and fetches /api/blogs itself
});

router.get('/:id', async (req, res) => {
    const tags  = await getAllTags();
    const blog  = await getBlogById(id);          // SSR: query blog content on the server
    const blogTags = await getTagsByBlogId(id);
    res.render('blog.ejs', { title, tags, blog, blogTags });
});
```

## New Configuration in `src/index.ts`

```typescript
import { blogs as webBlogsRoute, admin as webAdminRoute } from "./routes/web/index.ts";

app.get("/", (req, res) => { res.redirect("/web/blogs"); });  // homepage redirect

app.use("/web/blogs", webBlogsRoute);
app.use("/web/admin", webAdminRoute);
```

## Result of This Step

Pages are now accessible. SSR content (tags, blog post body) renders directly, while the CSR blog list section temporarily prints raw data using `JSON.stringify`.

- Homepage (tags via SSR + blog list CSR placeholder)

  ![step05 homepage](../../assets/step05-01.png)

- Single blog post page (fully SSR)

  ![step05 blog page](../../assets/step05-02.png)
