[← Back to Home](../readme.md)

# Chapter 2: HTTP Protocol Fundamentals

## Learning Objectives

- Understand how the HTTP protocol works and the request-response model
- Understand the meaning of request methods, request headers, and URL structure
- Understand the classification and use cases of HTTP status codes
- Understand the design conventions of REST APIs
- Implement route dispatching and access control using Node.js's native `http` module
- Learn to test API endpoints using curl and REST Client
- Use nodemon for a save-and-restart development experience

---

## 1. HTTP Protocol Overview

### What is HTTP

HTTP (HyperText Transfer Protocol) defines how browsers (clients) request and transfer data with web servers.

- A text-based protocol; data is transmitted in plain text format
- Uses a **Request / Response** model
- Default ports: 80 (HTTP), 443 (HTTPS)

### Client-Server Model

```
User enters a URL
     ↓
Browser sends HTTP request  →  Server receives request, processes data
                            ←  Server returns HTTP response
     ↓
Browser renders the response content
```

### Stateless Protocol

HTTP is **stateless**: there is no shared context between requests, and the server does not automatically remember the client's state.

For example, if you visit `/login` and log in successfully, then visit `/profile`, the server does not know by default that you have already logged in. Solutions: Cookie, Session, Token (covered in later chapters).

### HTTP Version History

| Version  | Release Year | Key Features |
|----------|-------------|--------------|
| HTTP/1.0 | 1996 | Introduced header fields, but each request reopens a connection |
| HTTP/1.1 | 1997 | Persistent connections (Keep-Alive), multiple request methods — currently the most widely used |
| HTTP/2   | 2015 | Binary frame format, multiplexing, header compression |
| HTTP/3   | 2022+ | Based on UDP (QUIC), faster connections, suited for mobile networks |

---

## 2. HTTP Request

### Request Methods (`req.method`)

| Method   | Description                          |
|----------|--------------------------------------|
| `GET`    | Retrieve a resource (e.g. web page, image) |
| `POST`   | Submit data (e.g. form, JSON)        |
| `PUT`    | Replace an entire resource           |
| `PATCH`  | Partially update a resource          |
| `DELETE` | Delete a resource                    |

### Request Headers (`req.headers`)

Request headers provide additional context, for example:

| Header          | Meaning                                           |
|-----------------|---------------------------------------------------|
| `Content-Type`  | Data type of the request body (e.g. `application/json`) |
| `Accept`        | Response type expected by the client              |
| `User-Agent`    | Client software identifier (browser info)         |
| `Authorization` | Authorization token (e.g. `Bearer <token>`)       |
| `Cookie`        | Cookie content sent to the server                 |

### Request URL (`req.url`)

```
http://example.com:80/api/users?name=jack&age=18
                      │          └────────────── query string
                      └───────────────────────── pathname
```

---

## 3. HTTP Response

The complete response from the server to the client consists of three parts: **status code**, **response headers**, and **response body**.

```js
res.statusCode = 200;                              // Status code
res.setHeader("Content-Type", "text/html");        // Response header
res.write("<h1>Hello</h1>");                       // Response body
res.end();                                         // Send the response
```

### Common Status Codes

| Class              | Code | Meaning                              |
|--------------------|------|--------------------------------------|
| **2xx Success**    | 200  | OK, request succeeded                |
|                    | 201  | Created, resource has been created   |
|                    | 204  | No Content, no response body         |
| **3xx Redirect**   | 301  | Moved Permanently                    |
|                    | 302  | Found (temporary redirect)           |
|                    | 304  | Not Modified (cache hit)             |
| **4xx Client Error** | 400 | Bad Request, invalid parameters    |
|                    | 401  | Unauthorized, not authenticated      |
|                    | 403  | Forbidden, access denied             |
|                    | 404  | Not Found, resource does not exist   |
|                    | 405  | Method Not Allowed                   |
| **5xx Server Error** | 500 | Internal Server Error              |
|                    | 502  | Bad Gateway                          |
|                    | 503  | Service Unavailable                  |

---

## 4. nodemon

Manually restarting the server after every code change (Ctrl+C → restart node) is tedious during development. **nodemon** watches for file changes and restarts automatically, without any manual intervention.

```bash
# Install globally (only needs to be done once)
sudo npm install -g nodemon

# Verify installation
nodemon --version
```

Usage is identical to `node` — just replace `node` with `nodemon`:

```bash
# Before
node codes/server_01.js

# With nodemon (auto-restarts when files are saved)
nodemon server_01.js
```

---

## 5. Code Walkthroughs

All example code is in the `codes/` directory. Enter that directory before starting:

```bash
cd codes
nodemon server_01.js
```

### server_01: The Most Basic HTTP Server

Demonstrates creating an HTTP server, setting the status code, and writing response headers and body.

```js
import http from "http";

const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.write("<h1>Hello, World!</h1>");
    res.end();
});

server.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
```

Start the server and visit `http://localhost:3000` to observe the browser output. After modifying and saving the code, nodemon auto-restarts — no manual action needed.

---

### server_02: Observing Request Headers and Method

Observe `req.headers` and `req.method` for each request in the terminal.

```js
const server = http.createServer((req, res) => {
    console.log("req.headers:", req.headers);
    console.log("req.method:", req.method);

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.write("<h1>Hello, World!</h1>");
    res.end();
});
```

Start the server, then send requests using a browser or curl, and observe the request information printed in the **terminal**.

---

### server_03: Parsing the Request URL

Use `url.parse()` to break down the request path and query parameters.

```js
import url from "url";

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);  // true parses query as an object
    console.log("pathname:", parsedUrl.pathname);
    console.log("query:", parsedUrl.query);

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.write("<h1>Hello, World!</h1>");
    res.end();
});
```

Visit `http://localhost:3000/?id=1&name=zhangsan` and observe the `parsedUrl` output in the terminal.

---

### server_04: Different Content-Types

Control how the client parses the response body by changing the `Content-Type` response header.

```js
// Toggle these comments to compare the three effects:
// res.setHeader('Content-Type', 'text/plain');     // Plain text
// res.setHeader('Content-Type', 'text/html');      // HTML
res.setHeader("Content-Type", "application/json");  // JSON
```

See the full code in `codes/server_04.js`. After changing `Content-Type` and saving, nodemon auto-restarts — just refresh the browser to observe the difference.

---

### server_05: Full Route Dispatching (Key Example)

Combines all concepts from the previous four examples to implement a complete server with route dispatching, query parameter parsing, and permission verification.

**Route overview:**

| Route         | Method    | Description                                                   |
|---------------|-----------|---------------------------------------------------------------|
| `/`           | GET       | Home page, returns a list of navigation links                 |
| `/test`       | GET / POST | GET returns success, POST returns success, others return 405 |
| `/users`      | ANY       | Returns an HTML list of all users                             |
| `/user?id=1`  | ANY       | Look up a user by id; no id returns 400, not found returns 404 |
| `/api/users`  | ANY       | Returns all users as JSON                                     |
| `/api/user?id=1` | ANY   | Look up a user by id as JSON; errors return corresponding JSON error messages |
| `/admin`      | ANY       | Requires the `Authorization: Bearer Cisco123` header or `?password=Cisco123` query parameter; otherwise returns 403 |
| Other paths   | ANY       | Returns 404                                                   |

See the full code in `codes/server_05.js`.

---

## 6. REST API Design Conventions

### What is a REST API

REST (Representational State Transfer) is a resource-based web architecture style:
- Each resource corresponds to a unique URL
- Standard HTTP methods (GET, POST, PUT, PATCH, DELETE) express the intended operation

| Method   | Action                    |
|----------|---------------------------|
| `GET`    | Read a resource           |
| `POST`   | Create a resource         |
| `PUT`    | Replace an entire resource |
| `PATCH`  | Partially update a resource |
| `DELETE` | Delete a resource         |

### RESTful Route Conventions

Resource paths use **plural nouns** — no verbs:

| Action               | Path              | Method        |
|----------------------|-------------------|---------------|
| Get all users        | `/api/users`      | GET           |
| Get a single user    | `/api/users/:id`  | GET           |
| Create a new user    | `/api/users`      | POST          |
| Update user info     | `/api/users/:id`  | PUT / PATCH   |
| Delete a user        | `/api/users/:id`  | DELETE        |

---

## 7. Testing Tools

### curl

curl is a command-line HTTP client that can send all types of requests directly to a server.

```bash
# GET request
curl http://localhost:3000/

# GET with query parameters
curl "http://localhost:3000/api/user?id=1"

# GET with auth header
curl -H "Authorization: Bearer Cisco123" http://localhost:3000/admin

# POST sending JSON
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "jack", "age": 18}'

# POST sending form data
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "name=jack&age=18"

# PUT request
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "jack updated", "age": 20}'

# DELETE request
curl -X DELETE http://localhost:3000/api/users/1

# -v shows full request and response headers
curl -v http://localhost:3000/
```

**Common flags:**
- `-X`: specify the request method
- `-H`: set a request header
- `-d`: set the request body
- `-v`: show detailed request and response information

### REST Client (VSCode Extension)

After installing the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension in VSCode, you can write and send requests directly in `.http` files without switching to the terminal.

Test cases are in `codes/rest_client.http`. Requests are separated by `###`. Click **Send Request** above any request to send it.

---

## Exercises

### Exercise 1

Create an HTTP server using Node.js's `http` module, running on **port 5000**:

- `GET /`: return 200, HTML displaying green `<h1>Hello NodeJS!</h1>`; other methods return 403, HTML displaying red `<h1>403 Forbidden!</h1>`
- `GET /secret`:
  - Accessing directly returns 403, HTML displaying `<h1>require token!</h1>`
  - With request header `Authorization: Bearer Cisco123`, return 200, HTML displaying `<h1>I like JavaScript - Authorization!</h1>`
  - With query parameter `token=Cisco123`, return 200, HTML displaying `<h1>I like JavaScript - Query!</h1>`
- All other routes: return 404, HTML displaying `The path: <current pathname> not found!`

### Exercise 2

Extend Exercise 1 with the following (define a `users` array to store user information):

```js
const users = [
    { id: 1, name: "jack", age: 18 },
    { id: 2, name: "tom", age: 19 },
    { id: 3, name: "jerry", age: 20 },
];
```

- `ANY /api/users`: return 200, JSON format: `{ total: <array length>, data: <user array> }`
- `ANY /user`: must include the `?id=` query parameter; otherwise return 400 (HTML); look up by id; not found returns 404 (HTML); found returns 200 (HTML displaying name and age)
- `ANY /api/secret`:
  - Accessing directly returns 403, JSON: `{ success: false, message: "require token!" }`
  - With `Authorization: Bearer Cisco123`, return 200, JSON: `{ success: true, message: "You got my secret: I like JavaScript!" }`
