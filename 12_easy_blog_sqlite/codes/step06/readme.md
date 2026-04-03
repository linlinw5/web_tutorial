[← Back to Chapter Home](../../readme.md)

# Step 06: Public Homepage Implementation

Complete the blog homepage with CSR rendering, EJS template splitting, and pagination.

## What's New in This Step

- `frontend/src/home.ts`: CSR script for the blog list (fetch + DOM rendering)
- `frontend/src/tools.ts`: `renderPagination` utility function (reusable across multiple pages)
- `frontend/src/elements.ts`: Shared DOM element references
- `frontend/src/types.ts`: TypeScript interfaces for the frontend
- `frontend/tsconfig.json`: Compiles `frontend/src/` to `backend/public/js/`
- `views/partial/header.ejs`, `views/partial/footer.ejs`: Extracted common sections
- `views/home.ejs`, `views/error.ejs`: Updated to use the include-partial pattern

## Frontend TypeScript Compilation Flow

```
frontend/src/*.ts  ──tsc -w──►  backend/public/js/*.js  ──Express static──►  browser
```

Run `tsc -w` inside the `frontend/` directory to compile TypeScript to JavaScript in `backend/public/js/`. EJS templates load the output via `<script src="/js/home.js">`.

## EJS Partials (Template Reuse)

The header and footer are extracted into standalone files and included in each page:

```ejs
<%- include('partial/header', { title, tags, script_name }) %>

<!-- Page body content -->

<%- include('partial/footer') %>
```

## `frontend/src/home.ts`: Blog List CSR

```typescript
async function fetchAndRenderBlogs(limit = 6, offset = 0) {
    const response = await fetch(`/api/blogs?limit=${limit}&offset=${offset}`);
    const blogs = await response.json();
    blogGrid.innerHTML = blogs.data.map(blogToHtml).join("");
    renderPagination({ total: blogs.total, limit, offset, pagination, fetchAndRenderBlogs });
}
document.addEventListener("DOMContentLoaded", () => { fetchAndRenderBlogs(); });
```

## Pagination Algorithm (`frontend/src/tools.ts`)

Pagination buttons show only 5 pages centered around the current page, preventing button overflow when there are many pages:

```typescript
let currentPage = Math.floor(offset / limit) + 1;
let totalPages  = Math.ceil(total / limit);
let startPage   = currentPage - 2;          // keep current page roughly centered
if (startPage < 1) startPage = 1;
let endPage     = startPage + 4;
if (endPage > totalPages) {
    endPage   = totalPages;
    startPage = Math.max(endPage - 4, 1);   // pad backward when near the end
}
```

`renderPagination` accepts `fetchAndRenderBlogs` as a callback and calls it when a pagination button is clicked, refreshing the content without triggering a page navigation. The function is designed to be reusable — the tag-filtered page (Step 08) calls it as well.

## Results

- Homepage

  ![step06 homepage](../../assets/step06-01.png)

- Single blog post page (styling to be refined)

  ![step06 blog page](../../assets/step06-02.png)

- 404 page

  ![step06 404](../../assets/step06-03.png)
