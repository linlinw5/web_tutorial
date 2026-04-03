[← Back to Home](../readme.md)

# Chapter 21: Using Jest in a Real Project

The previous chapter introduced the basics of Jest. This chapter places it inside a real backend project — the SQLite version of the Easy Blog API Server — to demonstrate how to write tests and what changes a project needs when database dependencies are involved.

There is no practice exercise designed for this chapter. The code is in `codes/backend/`; reading it alongside this document is recommended.

---

## Why Test the Database Layer?

A typical backend project has roughly three layers:

```
Routes layer (routes/)   ← parse requests, call db functions, return responses
Database layer (db/)     ← encapsulate SQL, interact directly with the database
Utilities / config       ← connection management, environment variables, etc.
```

The routes layer depends on HTTP requests and responses; testing it requires simulating an entire request flow, which is costly. The database layer is much more self-contained: pass arguments to a function, observe what it returns — this is exactly the scenario unit testing handles best.

So we test only the three files under `src/db/`: `ConnectionManager.ts`, `blogs.ts`, and `tags.ts`.

---

## Problem 1: Tests Must Not Touch the Real Database

If tests connect directly to the development database, every test run writes and deletes data inside it, leaving the database in a messy state. Worse, if the development database already has data, some tests may fail randomly because the data is not in a clean state.

The solution is: **let tests use an independent, fully isolated database**.

SQLite has a feature that fits this need perfectly: **in-memory databases (`:memory:`)**. An in-memory database lives entirely in memory and disappears when the process ends. Every test run starts with a blank slate — isolation is built in.

### Multi-Environment Configuration: `src/config.ts`

```typescript
export const DBPATHS: DatabasePaths = {
  dev: "./data/dev.sqlite", // development: local file
  prod: "./data/prod.sqlite", // production: local file
  test: ":memory:", // test: in-memory database
};
```

Three environments, three paths. `config.ts` also exports an `options` object that controls which environment the current startup uses:

```typescript
export const options: AppOptions = {
  env: "dev", // use the development database on normal startup
};
```

### Environment-Isolated ConnectionManager

`ConnectionManager` uses the **singleton pattern** to manage connections, with a separate instance for each environment:

```typescript
// static Map, one instance per environment
private static instances: Map<string, ConnectionManager> = new Map();

public static getInstance(env: Environment = 'dev'): ConnectionManager {
    if (!this.instances.has(env)) {
        this.instances.set(env, new ConnectionManager(env));
    }
    return this.instances.get(env)!;
}
```

This way, development uses `getInstance('dev')` and tests use `getInstance('test')` — connections and data on both sides are completely independent.

---

## Problem 2: How Does `db/blogs.ts` Know Which Database to Use?

`blogs.ts` decides which database instance to use at the top of the file:

```typescript
import { options } from "../config.ts";

const dbManager = ConnectionManager.getInstance(options.env);
```

It reads the environment from `options.env` in `config.ts`. This is `"dev"` during normal operation — no problem. But during testing, we need it to use `"test"`.

Directly changing `config.ts` is not an option — that would affect everyone. This is where **Jest's `jest.mock`** comes in.

### `jest.mock`: Intercepting Module Imports

At the very top of the test file (before any `import` statements), write:

```typescript
jest.mock("../../config.ts", () => {
    const config = jest.requireActual("../../config"); // get the original module
    return {
        ...config,
        options: {
            ...config.options,
            env: "test",  // change only this one field
        },
    };
});

// import the functions under test AFTER the mock
import { getAllBlogs, createBlog, ... } from "../../db/blogs.ts";
```

Before running a test file, Jest executes all `jest.mock(...)` calls first. When `blogs.ts` is imported and runs `import { options } from "../config.ts"`, it receives the replaced `options` (with `env: "test"`). As a result, `dbManager` points to the in-memory test database.

This is one of the most important techniques for using Jest in real projects: **swap dependencies via module mocks, not by modifying source code**.

---

## Jest Configuration: Coverage Scoped to the `db/` Layer

`jest.config.js` does two things:

```javascript
const baseDir = "<rootDir>/src/db";
const baseTestDir = "<rootDir>/src/__tests__";

const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  collectCoverage: true,

  // collect coverage only for files under src/db/, ignore routes, utilities, etc.
  collectCoverageFrom: [`${baseDir}/**/*.ts`],

  // only run test files under src/__tests__/
  testMatch: [`${baseTestDir}/**/*.test.ts`],
};
```

- `collectCoverageFrom`: tells Jest to count coverage only for code under `src/db/`. Without this setting, Jest would include all loaded files, causing routes, utilities, and other files to appear in the report — cluttering the output.
- `testMatch`: only looks for test files under `src/__tests__/`, preventing accidental execution of files elsewhere.

---

## Three Test Files

Test files are in `src/__tests__/db/`, corresponding to the three modules under test.

### 1. `ConnectionManager.test.ts`: Testing the Infrastructure

This file tests the connection manager itself. No `jest.mock` is needed — just use the `'test'` environment instance directly.

Key tests:

- **Singleton verification**: multiple calls to `getInstance` with the same environment return the same object; instances from different environments are independent
- **Connection reuse**: multiple calls to `getConnection` return the same connection, not new ones
- **Schema initialization idempotency**: calling `initializeDatabase` multiple times does not throw errors (because the SQL uses `CREATE TABLE IF NOT EXISTS`)

```typescript
test("should return the same instance for the same environment", () => {
  const manager1 = ConnectionManager.getInstance("test");
  const manager2 = ConnectionManager.getInstance("test");
  expect(manager1).toBe(manager2); // strictly the same object reference
});
```

### 2. `blogs.test.ts`: The Core Test File

This is the file most worth reading carefully in this chapter. It demonstrates how to handle test data setup and cleanup when testing functions with database dependencies.

#### Division of Responsibility Between `beforeAll` and `beforeEach`

```typescript
beforeAll(async () => {
  // runs only once: create tables, insert base data that won't change (users, tags, groups)
  testManager = ConnectionManager.getInstance("test");
  await testManager.initializeDatabase();
  testDb = await testManager.getConnection();

  await testDb.run(`INSERT INTO groups ...`);
  await testDb.run(`INSERT INTO tags ...`);
  await testDb.run(`INSERT INTO users ...`);
});

beforeEach(async () => {
  // runs before each test: clear blog-related tables so every test starts from a clean state
  await testDb.run("DELETE FROM blog_tags");
  await testDb.run("DELETE FROM blogs");
  await testDb.run('DELETE FROM sqlite_sequence WHERE name IN ("blogs", "blog_tags")');
});
```

These two layers of cleanup have different responsibilities:

- `beforeAll`: things that only need to be set up once (users, tags), reused throughout the entire describe block
- `beforeEach`: things that must be reset before each test (blog data), to prevent tests from interfering with each other

Auto-increment IDs must also be reset (`DELETE FROM sqlite_sequence`), otherwise every insertion keeps increasing the ID counter and certain assertions will fail.

#### Transaction Rollback Test

Both `createBlog` and `updateBlogById` use database transactions: insert the blog first, then insert tag associations — if any step fails, roll back. How do tests verify the transaction actually rolled back?

```typescript
test("should handle transaction rollback on invalid tag", async () => {
  await expect(
    createBlog("Blog with Invalid Tag", "Content", "img.jpg", 1, true, [999]), // non-existent tag ID
  ).rejects.toThrow("Failed to create blog");

  // Key assertion: the blog itself was also not inserted (transaction rolled back)
  const blogs = await testDb.all("SELECT * FROM blogs");
  expect(blogs).toHaveLength(0);
});
```

Passing a non-existent `tag_id = 999` causes SQLite's foreign key constraint to reject the insertion, triggering a `ROLLBACK`. The test then queries the database directly and verifies the blogs table is also empty — this is the actual proof that the transaction rolled back, not just that the function threw an error.

#### Cascade Delete Test

```typescript
test("should delete blog and cascade delete tags", async () => {
  const result = await deleteBlogById(blogId);

  expect(result.success).toBe(true);

  // verify the blog is gone
  const blog = await testDb.get("SELECT * FROM blogs WHERE id = ?", [blogId]);
  expect(blog).toBeUndefined();

  // verify the associated blog_tags records were also cascade-deleted
  const blogTags = await testDb.all("SELECT * FROM blog_tags WHERE blog_id = ?", [blogId]);
  expect(blogTags).toHaveLength(0);
});
```

Cascade deletion on foreign keys is a database-level behavior. Only querying the table directly can verify it actually happened.

### 3. `tags.test.ts`: Testing Cache Logic

`getAllTagsCached` in `tags.ts` implements an in-memory cache with a 5-minute TTL: the first call queries the database; subsequent calls return the cached result.

The test focus is verifying that the cache **actually works** and that `clearTagsCache` **actually invalidates it**:

```typescript
test("should return cached data on second call", async () => {
  const tags1 = await getAllTagsCached();
  expect(tags1).toHaveLength(5);

  // bypass the cache and insert a new record directly into the database
  await testDb.run("INSERT INTO tags (name) VALUES (?)", ["Vue.js"]);

  // call again — should still return 5 items (cache hit, database not queried)
  const tags2 = await getAllTagsCached();
  expect(tags2).toHaveLength(5);
});

test("should refresh cache after clearTagsCache", async () => {
  await getAllTagsCached(); // populate the cache
  await testDb.run("INSERT INTO tags (name) VALUES (?)", ["Vue.js"]);
  clearTagsCache(); // clear the cache
  const tags2 = await getAllTagsCached();
  expect(tags2).toHaveLength(6); // now the new data is visible
});
```

Note that `beforeEach` calls `clearTagsCache()` before every test to ensure each test starts with no cached state, unaffected by the previous test.

---

## Running Tests

```bash
cd codes/backend
npm install
npm test
```

The output shows the pass/fail status of each test, plus a coverage report for the three files under `src/db/`. The visual report is at `coverage/lcov-report/index.html` — open it in a browser to see line-by-line coverage.

---

## Appendix: Common `test` / `it` Modifier Reference

| Syntax                        | Meaning                                                         |
| ----------------------------- | --------------------------------------------------------------- |
| `test(...)` / `it(...)`       | Define a test (the two are equivalent)                          |
| `test.skip(...)` / `xit(...)` | Skip this test; marked as skipped in the report                 |
| `test.only(...)` / `fit(...)` | Run only this test; skip all others (useful for debugging)      |
| `test.todo("...")`            | Placeholder; marks a test that has not been written yet         |
