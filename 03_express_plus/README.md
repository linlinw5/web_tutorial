[← Back to Home](../readme.md)

# Phase Project: Express Simple Blog System

## Directory Convention

```
03_express_plus/
  README.md
  codes/          ← Complete reference implementation, can be run directly for comparison
  practice/       ← Your working directory
    package.json  ← Pre-configured; run npm install to get started
    data.js       ← Blog data (use as-is; no modifications needed)
    html_refercence/  ← Project starting point: pre-designed static pages
```

---

## Project Objective

This project is the capstone exercise for Chapter 3. The goal is to convert the **static HTML website** already designed in `practice/html_refercence/` into a **dynamic website** powered by Express + EJS.

Before (static):

- Page content is hardcoded in HTML
- Navigation links point to fixed `.html` files
- Cannot generate content dynamically from data

After (dynamic):

- Data comes from `data.js` (later chapters will replace this with a database)
- Routes are managed by Express
- Pages are rendered by EJS templates; header/footer are extracted as partials for reuse

---

## Data Structure

`data.js` exports two arrays. Understanding their structure is the first step:

```js
// Tags (categories)
const tags = [
  { id: 1, name: "Frontend Development" },
  { id: 2, name: "Backend Development" },
  { id: 3, name: "Full-Stack Development" },
];

// Blog posts
const blogs = [
  {
    id: 1,
    title: "JavaScript Async Programming Best Practices",
    content: "...",
    image: "/images/a1.avif",
    author: "Li Ming",
    tag_id: 3, // Corresponds to id in tags
    created_at: "2025-10-01",
  },
  // ...
];
```

`blog.tag_id` links to `tag.id` — this is the most fundamental data relationship.

---

## Project Structure

The completed directory structure looks like this:

```
practice/
  server.js
  data.js
  package.json
  views/
    index.ejs           ← Home page: blog card list
    blog.ejs            ← Blog detail page
    tag.ejs             ← Blog list filtered by tag
    error.ejs           ← Unified error page (400 / 404)
    partials/
      header.ejs        ← Shared header (includes navigation)
      footer.ejs        ← Shared footer
  public/
    css/style.css
    favicon.ico
    images/
```

---

## Implementation Steps

### Step 1: Initialize the Project

```bash
cd practice
npm install
```

Create `server.js` and set up the basic Express skeleton:

```js
import express from "express";
import { blogs, tags } from "./data.js";

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));

// Routes go here...

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

Start it:

```bash
nodemon server.js
```

---

### Step 2: Organize Static Assets

Copy `html_refercence/css/` and `html_refercence/images/` into the `public/` directory so that `express.static("public")` can serve the static files.

---

### Step 3: Extract EJS Partials

Looking at the three HTML files, the `<header>` and `<footer>` sections are identical. Extract them to avoid duplicating them in every page:

**`views/partials/header.ejs`** — Contains the full `<html>`, `<head>`, `<header>` opening tag, up to the `<main>` opening tag.

Key point: the tag links in the navigation bar need to be generated dynamically — change from static hardcoding to a loop:

```html
<!-- Before (static) -->
<li><a href="./tag.html">Technical</a></li>
<li><a href="./tag.html">Education</a></li>

<!-- After (dynamic) -->
<% for (let item of tags) { %>
<li><a href="/tag/<%= item.id %>"><%= item.name %></a></li>
<% } %>
```

Note: `tags` must be passed to the template from the route. **Every route's `res.render()` must pass `tags`**, because the header uses it.

**`views/partials/footer.ejs`** — Contains `</main>`, `<footer>`, `</body>`, `</html>`.

Include them in templates that need them:

```html
<%- include('./partials/header') %>

<!-- Page content -->

<%- include('./partials/footer') %>
```

---

### Step 4: Implement Three Routes

#### Route 1: Home Page `GET /`

Returns a card list of all blog posts.

```js
app.get("/", (req, res) => {
  res.render("index", { title: "Home", blogs, tags });
});
```

In **`views/index.ejs`**, loop to render blog cards, and truncate `content` to the first 100 characters as a summary:

```html
<% for (let blog of blogs) { %>
<div class="blogCard">
  <div class="image"><img src="<%= blog.image %>" alt="" /></div>
  <div class="content">
    <p><%= blog.created_at %></p>
    <h2><a href="/blog?id=<%= blog.id %>"><%= blog.title %></a></h2>
    <hr />
    <p><%= blog.content.slice(0, 100) %></p>
  </div>
</div>
<% } %>
```

---

#### Route 2: Blog Detail `GET /blog?id=1`

Receive the blog id via a **query parameter** (`req.query.id`).

```js
app.get("/blog", (req, res) => {
  const blogId = Number(req.query.id);
  if (isNaN(blogId) || blogId <= 0) {
    return res.status(400).render("error", { title: "Bad Request", image_name: "400.png", tags });
  }

  const blogById = blogs.find((b) => b.id === blogId);
  if (!blogById) {
    return res.status(404).render("error", { title: "Blog Not Found", image_name: "404.png", tags });
  }

  res.render("blog", { title: blogById.title, blogById, tags });
});
```

> **Query Parameters vs Path Parameters**
>
> |                 | Syntax       | How to Read     | Use Case                           |
> | --------------- | ------------ | --------------- | ---------------------------------- |
> | Query parameter | `/blog?id=1` | `req.query.id`  | Optional params, filter conditions |
> | Path parameter  | `/blog/1`    | `req.params.id` | Resource identifiers               |

---

#### Route 3: Tag Page `GET /tag/:id`

Receive the tag id via a **path parameter** (`req.params.id`), and filter all blogs under that tag.

```js
app.get("/tag/:id", (req, res) => {
  const tagId = Number(req.params.id);
  if (isNaN(tagId) || tagId <= 0) {
    return res.status(400).render("error", { title: "Bad Request", image_name: "400.png", tags });
  }

  const tag = tags.find((t) => t.id === tagId);
  const blogsByTag = blogs.filter((b) => b.tag_id === tagId);

  if (!tag || blogsByTag.length === 0) {
    return res.status(404).render("error", { title: "No Blogs Found", image_name: "404.png", tags });
  }

  res.render("tag", { title: tag.name, blogsByTag, tags });
});
```

---

#### Catch-all 404

Place this after all routes:

```js
app.use((req, res) => {
  res.status(404).render("error", { title: "Page Not Found", image_name: "404.png", tags });
});
```

---

## Final Result

**Home page `/`** — Blog card list

![Home page](./assets/blog1.png)

**Blog detail page `/blog?id=1`**

![Blog detail](./assets/blog2.png)

**Tag page `/tag/:id`** — Filtered by category

![Tag page](./assets/blog3.png)

**400 Bad Request** — Invalid parameters (e.g. `/tag/abc`)

![400 error page](./assets/blog_bad_req.png)

**404 Not Found** — Resource does not exist (e.g. `/blog?id=99`)

![404 error page](./assets/blog_not_found.png)
