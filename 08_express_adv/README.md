[← Back to Home](../readme.md)

# Chapter 8: Building an Express API Server from Scratch

Chapter 7 used a pre-prepared Mock API server. This chapter manually re-implements that same server from scratch to understand the reason behind every line of configuration — including what CORS is, why it is needed, and how to simplify development commands with `concurrently`.

## Directory Structure

```
08_express_adv/
  README.md
  rest_client.http     ← API test script
  codes/
    package.json
    tsconfig.json
    src/
      index.ts         ← Complete implementation
    public/
      images/          ← User avatar images
  practice/
    package.json
    tsconfig.json
    src/
      index.ts         ← Complete the implementation here
    public/
      images/
```

**Workflow:**

```bash
cd codes       # or practice
npm install
npm run dev
```

---

## 8.1 Project Initialization

```bash
npm init -y                       # generate package.json
npm install express cors          # runtime dependencies
npm install -D typescript nodemon concurrently @types/express @types/cors
```

Add `"type": "module"` to `package.json` to use ESM syntax (`import` / `export`):

```json
{
  "type": "module"
}
```

Initialize the TypeScript configuration:

```bash
npx tsc --init
```

Adjust the key options in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist"
  }
}
```

---

## 8.2 npm scripts and concurrently

Developing this backend project requires two processes running simultaneously:

| Process | Command | Purpose |
|---|---|---|
| TypeScript compiler | `tsc -w` | Watch for changes in `src/`, auto-compile to `dist/` |
| Node.js server | `nodemon ./dist/index.js` | Watch for changes in `dist/`, auto-restart the server |

Opening two terminal windows every time is inconvenient. `concurrently` lets you start multiple processes with a single command:

```bash
npx concurrently "tsc -w" "nodemon ./dist/index.js"
```

Write this command into the `scripts` field of `package.json` so you only need `npm run dev`:

```json
"scripts": {
  "dev": "concurrently \"tsc -w\" \"nodemon ./dist/index.js\""
}
```

> **`npm` vs `npx`:** `npm` is for installing and managing packages and running scripts; `npx` is for directly executing a command provided by a package without installing it globally. Commands inside `scripts` are looked up by npm in the local `node_modules/.bin/`, so `npx` is not needed there.

---

## 8.3 Middleware Configuration

```typescript
app.use(cors(corsOptions));                      // CORS support (see 8.4)
app.use(express.json());                         // parse request bodies with Content-Type: application/json
app.use(express.urlencoded({ extended: true })); // parse request bodies with Content-Type: application/x-www-form-urlencoded
app.use(express.static("public"));               // serve the public/ directory as static files
```

`express.json()` and `express.urlencoded()` are request body parsing middlewares. Without them, `req.body` is always `undefined`; with them, Express automatically parses the request body according to the `Content-Type` header and attaches the result to `req.body`.

Adding two log lines in the POST route clearly shows the difference between the two formats:

```typescript
app.post("/api/users", (req, res) => {
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("Request body:", req.body);
    // ...
});
```

---

## 8.4 CORS: How It Works and How to Configure It

### Same-Origin Policy

Browsers enforce a security rule called the **Same-Origin Policy**. An "origin" consists of three parts:

```
protocol + hostname + port
http://localhost:5500   ← frontend (VS Code Live Server)
http://localhost:3000   ← backend (Express)
```

The two differ in port, making them **different origins**. The browser blocks the frontend from reading responses from a different origin, even if the request was sent and the server responded.

### How CORS Solves This

CORS (Cross-Origin Resource Sharing) is a mechanism by which the server signals its intentions to the browser. By adding an `Access-Control-Allow-Origin` header to the response, it tells the browser "this response may be read by the specified origin."

```
Example response header:
Access-Control-Allow-Origin: http://localhost:5500
```

When the browser sees this header and confirms the origin is on the allowlist, it permits JavaScript to read the response data.

### Configuration in Express

```typescript
import cors from "cors";

const corsOptions = {
    origin: "http://localhost:5500",              // only allow this origin
    methods: ["GET", "POST", "PUT", "DELETE"],    // allowed HTTP methods
};

app.use(cors(corsOptions));
```

**Demonstrating the CORS error:** Comment out the `app.use(cors(...))` line, then send a request from the frontend page. The browser console will show:

```
Access to fetch at 'http://localhost:3000/api/users' from origin
'http://localhost:5500' has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

This error appears in the **browser**, not on the server, because the request actually reached the server and received a response — it is the browser that is intercepting it. Requests sent via curl or REST Client will not have CORS issues because they are not browsers.

> `origin: "*"` allows any origin, suitable for fully public APIs (such as `07_mock_api`). In production, always specify allowed domain names explicitly to prevent sensitive data from being read by malicious sites.

---

## 8.5 Complete CRUD Routes

```typescript
// Get all users
app.get("/api/users", (req, res) => {
    res.json(users);
});

// Get a single user
app.get("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const user = users.find((u) => u.id === id);
    user ? res.json(user) : res.status(404).json({ error: "User not found" });
});

// Create a user
app.post("/api/users", (req, res) => {
    const { name, email } = req.body;
    const newUser: User = { id: Date.now(), name, email, image: "/images/default.png" };
    users.push(newUser);
    res.status(201).json(newUser);
});

// Update a user
app.put("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const { name, email } = req.body;
    const user = users.find((u) => u.id === id);
    if (user) {
        user.name = name;
        user.email = email;
        res.json(user);
    } else {
        res.status(404).json({ error: "User not found" });
    }
});

// Delete a user
app.delete("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = users.findIndex((u) => u.id === id);
    if (index >= 0) {
        users.splice(index, 1);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: "User not found" });
    }
});

// 404 catch-all route (must be last)
app.use((req, res) => {
    res.status(404).json({ error: "Route Not Found" });
});
```

HTTP status code conventions:

| Status Code | Meaning | Use Case |
|---|---|---|
| `200` | OK | Successful read, update, or delete (default) |
| `201` | Created | Resource created successfully |
| `404` | Not Found | Resource does not exist |

---

## 8.6 Thinking About Next Steps

This chapter's API server still has three obvious limitations:

- **Data is not persistent**: Uses an in-memory array to simulate a database; data is lost on restart. Solved in the next step by introducing SQLite (Chapter 9).
- **Code is not layered**: All routes, middleware, and data live in a single `index.ts` file. Real projects should be split by functional module (demonstrated in Chapter 11).
- **No access control**: Anyone can create, read, update, and delete. Real projects require user authentication and permission middleware (Chapters 16–19).
