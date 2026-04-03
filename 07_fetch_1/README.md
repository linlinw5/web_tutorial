[← Back to Home](../readme.md)

# Chapter 7: Making API Calls with Fetch

## Prerequisites

All requests in this chapter are sent to a local Mock API server. **You must start it before running any code:**

```bash
cd 07_mock_api
npm install
npm run dev
```

After starting, visit `http://localhost:3000` to verify the server is running.

## Directory Structure

```
07_fetch_1/
  README.md
  codes/
    tsconfig.json
    index.html        ← Demo page
    src/
      script.ts       ← Complete implementation
    dist/
  practice/
    tsconfig.json
    index.html        ← Same as above, for student use
    src/
      script.ts       ← Complete the implementation here
    dist/
```

**Workflow:**

```bash
cd codes       # or practice
tsc --watch
# Open index.html
```

---

## 7.1 fetch Basics and Promises

`fetch()` is an asynchronous request API provided natively by the browser. Calling it immediately returns a `Promise<Response>` object.

```typescript
// Calling fetch inside a synchronous function only gives you a pending Promise
function fetchTest() {
    const promise: Promise<Response> = fetch("https://jsonplaceholder.typicode.com/posts/1");
    console.log(promise); // Promise { <pending> }
}
fetchTest();
```

A Promise has three states:

| State | Meaning |
|---|---|
| `pending` | Request has been sent, waiting for a response |
| `fulfilled` | Request succeeded, holds the response result |
| `rejected` | Request failed, holds the error reason |

### async / await

Use `async/await` to handle asynchronous requests in a synchronous style:

```typescript
async function fetchData() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts/1");
        console.log(response); // Response object: status code, headers, body, etc.

        if (response.ok) {
            const data = await response.json(); // parse response body as JSON
            console.log(data);
        } else {
            throw new Error(`Request failed with status: ${response.status}`);
        }
    } catch (error) {
        console.error("Request error:", error);
    } finally {
        console.log("Request flow complete"); // executes regardless of success or failure
    }
}

fetchData();
```

### .then() / .catch()

`async/await` is syntactic sugar for Promises. The same logic can be written using the `.then().catch()` chain style:

```typescript
function fetchData() {
    fetch("https://jsonplaceholder.typicode.com/posts/1")
        .then((response) => {
            if (response.ok) {
                return response.json(); // return the next Promise
            } else {
                throw new Error(`Request failed with status: ${response.status}`);
            }
        })
        .then((data) => {
            console.log(data); // the JSON-parsed result from the previous .then
        })
        .catch((error) => {
            console.error("Request error:", error); // catches both network errors and manual throws
        })
        .finally(() => {
            console.log("Request flow complete");
        });
}

fetchData();
```

Both styles are equivalent — the choice is a matter of preference. The chain style can become deeply nested and harder to read with many callbacks; `async/await` reads more like synchronous code and is easier to debug.

> **This course consistently uses `async/await` syntax.**

### Common Response Object Properties

```typescript
response.ok       // true when status code is 200–299
response.status   // HTTP status code, e.g. 200, 404, 500
response.json()   // parse response body as JSON, returns Promise
response.text()   // parse response body as plain text, returns Promise
```

---

## 7.2 GET Requests: Fetching Data

```typescript
interface User {
    id: number;
    name: string;
    email: string;
    image: string;
}

const baseUrl = "http://localhost:3000";

async function getUserList() {
    try {
        const response = await fetch(`${baseUrl}/api/users`); // GET by default
        if (response.ok) {
            const users: User[] = await response.json();
            renderUserList(users);
        } else {
            throw new Error(`Fetch failed with status: ${response.status}`);
        }
    } catch (err) {
        console.error(err);
    }
}
```

### Inspecting Requests with Firefox Network Tools

Open Firefox DevTools (`F12`) → **Network** tab. After refreshing the page, you can see the details of every `fetch` request. Click on a request to view the method, URL, status code, request headers, response body, and more in the right panel.

![Firefox Network Tools](./assets/fetch_1.png)

This is the most direct way to debug network requests — when results don't match expectations, come here first to confirm what was actually sent and received.

---

## 7.3 POST Requests: Submitting Data

POST requests require specifying `method`, `headers`, and `body` in the second argument to `fetch`.

### Option 1: JSON Format (Recommended)

```typescript
async function addUserJSON(name: string, email: string) {
    const response = await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email }) // serialize object to JSON string
    });
    const result = await response.json();
    console.log(result);
}
```

### Option 2: www-form Format

```typescript
async function addUserWWW(name: string, email: string) {
    const body = new URLSearchParams();
    body.append("name", name);
    body.append("email", email);
    // body.toString() → "name=Alice&email=alice@example.com"

    const response = await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: body.toString()
    });
    const result = await response.json();
    console.log(result);
}
```

### Native HTML Form vs Fetch Submission

An HTML `<form>` with `method="POST"` also sends a request in `application/x-www-form-urlencoded` format, producing the same result as Option 2, but it reloads the page. Fetch submission does not reload the page and gives you full control over the request and response handling.

### curl Test Reference

```bash
# JSON format
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com"}'

# www-form format
curl -X POST http://localhost:3000/api/users \
  -d "name=Alice&email=alice@example.com"
```

---

## 7.4 Error Handling

Fetch errors fall into two categories, each handled differently:

| Error Type | When It Occurs | How to Handle |
|---|---|---|
| Network error | Cannot connect to server (no network, port unreachable) | Caught by `catch` |
| HTTP error | Server returns a 4xx / 5xx status code | Check `response.ok` and manually `throw` |

```typescript
async function safeRequest() {
    try {
        const response = await fetch(`${baseUrl}/api/users/999`);

        // fetch does not throw for 4xx/5xx — you must check manually
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
    } catch (err) {
        // Both network errors (e.g. server not started) and manual throws are caught here
        console.error("Request failed:", err);
    }
}
```

---

## 7.5 TypeScript Type Constraints for Response Data

Use `interface` to describe the data structure returned by the backend, letting the compiler verify that field usage is correct:

```typescript
interface User {
    id: number;
    name: string;
    email: string;
    image: string;
}

// Explicitly tell TypeScript: response.json() parses to User[]
const users: User[] = await response.json();

// After this, the IDE provides autocomplete for fields and reports errors on typos
console.log(users[0].name);   // ✅
console.log(users[0].nname);  // ❌ compile error
```

> This is precisely why TypeScript was introduced in Chapter 4: when integrating with a backend, define the data structure with an `interface` first, then write the request logic. This dramatically reduces field typo errors and type mismatches.
