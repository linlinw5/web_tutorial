[← Back to Home](../readme.md)

# Chapter 3: Express Framework Basics

## Directory Convention

Starting from this chapter, each chapter follows a consistent directory structure:

```
chapter-directory/
  README.md      ← Tutorial documentation (what you're reading now)
  codes/         ← Complete reference code for comparison
  practice/      ← Your practice directory; follow the tutorial and write code here
```

**`codes/`** contains the final implementation of all examples in this chapter. You can run them at any time to verify the results.

**`practice/`** is your working directory: a `package.json` is already provided. Run `npm install`, then follow the tutorial and write the code yourself. Check `codes/` for reference when stuck.

> Recommended approach: write the code yourself first, then look at `codes/` if you get stuck — rather than copying directly.

---

## Learning Objectives

- Understand the purpose of frameworks: compare against the native `http` module to see what problems Express solves
- Master Express's middleware mechanism, understand the difference between `app.use()` and `app.get()`
- Be able to write page routes (returning HTML) and API routes (returning JSON)
- Use the EJS template engine to render dynamic pages
- Use `express.static()` to serve static assets

---

## 1. Why Use a Framework?

Looking back at the previous chapter, writing a server with routes using the native `http` module looked like this:

```js
// Native http module — routing is all manual if/else
const server = http.createServer((req, res) => {
    const { pathname } = url.parse(req.url);

    if (pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Home</h1>');
    } else if (pathname === '/about') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>About</h1>');
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});
```

As routes multiply, the `if/else` chain grows rapidly and becomes hard to maintain. **Express** is the most popular web framework for Node.js. It wraps these tedious details so developers can focus on business logic:

```js
// Express — each route is declared independently, clear and concise
app.get('/', (req, res) => res.send('<h1>Home</h1>'));
app.get('/about', (req, res) => res.send('<h1>About</h1>'));
```

---

## 2. Initializing the Project

Enter your practice directory and install dependencies to get started:

```bash
cd practice
npm install
```

`practice/package.json` already has `"type": "module"` and the required dependencies preset — no manual configuration needed.

If you want to start from a completely empty directory, you can also initialize it yourself:

```bash
npm init -y
npm install express ejs
# Then manually add "type": "module" to package.json
```

**All examples in this chapter are run inside `practice/` (or `codes/`):**

```bash
nodemon app01.js
```

---

## 3. app01: Minimal Express Server and Middleware

`codes/app01.js` demonstrates the two most fundamental concepts in Express: **middleware** and **routes**.

```js
import express from 'express';

const app = express();
const port = 3000;

// ── Middleware: applies to all requests ──────────────────────────────────
app.use((req, res, next) => {
    console.log(`Received ${req.method} request: ${req.path}`);
    console.log(`Query params:`, req.query);
    next();  // Must call next(), otherwise the request stops here
});

// ── Route: handles GET / only ─────────────────────────────────────
app.get('/', (req, res) => {
    res.send('<h1>Welcome to the Express server!</h1>');
    // Route handling is complete; no need to call next()
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
```

Start it:

```bash
nodemon app01.js
```

### Middleware

**Middleware** is a function that executes before (or after) a request reaches its final route. Its signature is `(req, res, next)`.

```
Request arrives
   ↓
Middleware 1 (logging) → next()
   ↓
Middleware 2 (auth) → next()
   ↓
Route handler (sends response)
```

`next()` is the "pass along" signal — calling it continues execution down the chain; not calling it stops the request at the current middleware.

### `app.use()` vs `app.get()`

| | `app.use()` | `app.get()` / `app.post()` etc. |
|---|---|---|
| **Method matching** | All HTTP methods | Specified method only |
| **Path matching** | Prefix match (`/api` matches `/api/users`) | Exact match |
| **Typical use** | Middleware (logging, auth, body parsing) | Business routes |

---

## 4. app02: Page Routes and API Routes

`codes/app02.js` demonstrates multiple route definitions, extracting `req.query` parameters, JSON responses, and using `app.use()` as a catch-all for 404s.

```bash
nodemon app02.js
```

**Route overview:**

| Route | Method | Description |
|---|---|---|
| `/` | GET | Home page, returns navigation links |
| `/test` | GET | Returns HTML |
| `/test` | POST | Returns HTML (test with REST Client) |
| `/api/users` | GET | Returns all users in JSON format |
| `/api/user?id=1` | GET | Look up user by id, JSON format |
| `/admin` | GET | Requires `Authorization: Bearer Cisco123` header |
| Other paths | ANY | Catch-all 404, handled by `app.use()` |

**Key code snippet — extracting query parameters:**

```js
// Access /api/user?id=1
app.get('/api/user', (req, res) => {
    if (!req.query.id) {
        return res.status(400).json({ success: false, message: 'Missing user ID parameter' });
    }
    // req.query.id is a string; convert to number before comparing
    const user = users.find(u => u.id === parseInt(req.query.id));
    // ...
});
```

**Key code snippet — catch-all 404 middleware (must be placed after all routes):**

```js
app.use((req, res) => {
    res.status(404).send(`<h1>404 - "${req.path}" does not exist</h1>`);
});
```

See the full code in `codes/app02.js`.

---

## 5. app03: EJS Template Engine and Static Files

`codes/app03.js` demonstrates how to render dynamic pages with EJS and how to serve static assets such as CSS and images.

```bash
nodemon app03.js
```

### Project File Structure

```
03_express_basic/
  codes/
    app03.js          ← Server entry point
    data.js           ← Blog data (simulated database)
    package.json
    views/
      home.ejs        ← Home page template
      blog.ejs        ← Blog detail template
      error.ejs       ← Error page template
    public/
      css/
        style.css     ← Global styles
      images/
        logo.jpg      ← Site logo
```

### Configuring the Template Engine and Static Files

```js
app.set('view engine', 'ejs');   // Declare EJS as the template engine
app.set('views', './views');     // Template file directory (relative to run directory)
app.use(express.static('public')); // Static asset directory (/css/... /images/...)
```

### Rendering Pages: `res.render()`

```js
app.get('/', (req, res) => {
    // First argument: template file name
    // Second argument: variables passed to the template
    res.render('home.ejs', { title: 'Blog Home', blogs });
});
```

### EJS Basic Syntax

EJS is a template language that embeds JavaScript inside HTML. You only need to know three types of tags:

| Tag | Purpose | Example |
|---|---|---|
| `<%= expression %>` | Output a variable value (HTML-escaped) | `<%= blog.title %>` |
| `<%- expression %>` | Output raw HTML (unescaped) | `<%- include('partials/header') %>` |
| `<% statement %>` | Execute JS logic (no output) | `<% for (let item of blogs) { %>` |

**`views/home.ejs` example:**

```html
<h1><%= title %></h1>
<ul>
    <% for (let blog of blogs) { %>
        <li>
            <a href="/blog?id=<%= blog.id %>"><%= blog.title %></a>
        </li>
    <% } %>
</ul>
```

**`views/error.ejs` example:**

```html
<h1><%= title %></h1>
<p><%= message %></p>
<p><a href="/">Back to Home</a></p>
```

---

## 6. Common `res` Methods Compared

| Method | Description | Typical Use |
|---|---|---|
| `res.send(string)` | Send an HTML string | Simple pages, debugging |
| `res.json(object)` | Send JSON, auto-sets `Content-Type` | API routes |
| `res.render(view, data)` | Render an EJS template | Page routes |
| `res.status(code)` | Set status code (chainable) | `res.status(404).json(...)` |
| `res.redirect(url)` | Redirect | Redirect after login |

---

## Exercises

Referencing `app02.js` and `app03.js`, complete the following tasks:

1. Create a new Express server on port **4000**
2. In `data.js`, define a `products` array (at least 5 items, each with `id`, `name`, `price`, and `category` fields)
3. Implement the following routes:
   - `GET /`: render the home page, displaying a list of all product names, each clickable and linking to a detail page
   - `GET /product?id=1`: render a product detail page showing all fields; return 400 if id is missing, 404 if product is not found
   - `GET /api/products`: return all products as JSON
   - `GET /api/products?category=electronics`: filter by `category`, return matching products as JSON
4. Add a stylesheet in `public/css/` and reference it in the EJS templates
