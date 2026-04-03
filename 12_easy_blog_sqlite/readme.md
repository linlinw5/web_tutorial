[← Back to Home](../readme.md)

# Chapter 12: Milestone Project — Easy Blog

The capstone project for Phase 2, connecting all knowledge from the previous 11 chapters (Express, TypeScript, SQLite, EJS, Tailwind CSS, Fetch API) into a complete full-stack blog system.

The project is built **without a frontend/backend separation**: a single Express server handles both the REST API and page routing, with SQLite as the database. Page rendering uses an **SSR + CSR hybrid** model, built progressively across 10 steps.

## Tech Stack

- **Backend**: Express + TypeScript (run directly with tsx) + SQLite (`sqlite` package)
- **Templating**: EJS (server-side rendering)
- **Styling**: Tailwind CSS (CLI compilation)
- **Frontend interactions**: Native TypeScript → compiled to JavaScript, calls API via Fetch

## Project Structure

```
12_easy_blog_sqlite/
  codes/
    step01/ ~ step10/   ← 10 progressive steps, each independently runnable
      backend/          ← Express server
        src/
          index.ts               ← Entry point: mounts middleware and routes
          db/
            ConnectionManager.ts ← Database singleton connection
            dbBlog.ts            ← Blog data access layer
            dbTag.ts             ← Tag data access layer (Step10 includes caching)
          routes/
            api/                 ← REST API routes
            web/                 ← Page routes (blogs + admin)
          types/                 ← TypeScript interface definitions
        views/
          partial/               ← header.ejs + footer.ejs (reusable)
          home.ejs / blog.ejs / addBlog.ejs / editBlog.ejs / error.ejs
        public/
          css/input.css          ← Tailwind configuration
          js/                    ← Frontend scripts (compiled from frontend/)
        data/
          dev.sqlite             ← Database file
          console.sql            ← Schema creation + seed data
      frontend/                  ← Frontend TypeScript source
        src/
          home.ts                ← Blog homepage CSR script
          tag.ts                 ← Tag filter page CSR script
          admin_home.ts          ← Admin homepage CSR script
          admin_add_blog.ts      ← Add blog interaction script
          admin_edit_blog.ts     ← Edit blog interaction script
          tools.ts               ← renderPagination utility (reusable)
          elements.ts            ← Shared DOM element references
          types.ts               ← Frontend interface definitions
        tsconfig.json            ← Compiles to backend/public/js/
    html_reference/              ← Static HTML design mockups (reference only)
  assets/                        ← Screenshots of each step's result
  readme.md
```

## 10-Step Build Roadmap

| Step | Core Content | Key Concepts |
|---|---|---|
| [Step 01](./codes/step01/readme.md) | Project scaffold | tsx + concurrently + Tailwind CLI |
| [Step 02](./codes/step02/readme.md) | Database design + data access layer | Multi-table design, TypeScript interfaces, many-to-many relationships |
| [Step 03](./codes/step03/readme.md) | createBlog + updateBlogById | Database transactions (BEGIN / COMMIT / ROLLBACK) |
| [Step 04](./codes/step04/readme.md) | REST API routes | Express Router, CRUD, graceful shutdown |
| [Step 05](./codes/step05/readme.md) | Web route framework | SSR + CSR hybrid, page redirects |
| [Step 06](./codes/step06/readme.md) | Public homepage | Frontend TS compilation, EJS partials, pagination algorithm |
| [Step 07](./codes/step07/readme.md) | Single blog post page | EJS data rendering, Tailwind styling |
| [Step 08](./codes/step08/readme.md) | Tag filter page | URLSearchParams, route ordering, utility function reuse |
| [Step 09](./codes/step09/readme.md) | Admin panel | Form pre-fill, blog CRUD, custom modal dialog |
| [Step 10](./codes/step10/readme.md) | Performance optimization | In-memory cache, TTL, module-level variables |

## How to Run (using step10 as example)

```bash
cd codes/step10/backend
npm install
npm run dev
# Visit http://localhost:3000
```

To modify frontend scripts, start compilation in `frontend/`:

```bash
cd codes/step10/frontend
tsc -w
```
