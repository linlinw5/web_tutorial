[← Back to Home](../readme.md)

# Chapter 18: Environment Variables and dotenv

This chapter solves a practical problem: **sensitive information such as database passwords and secret keys must not be hardcoded into source code**. By using dotenv, configuration is separated from code, placed in a `.env` file, and the `.env` file is kept off GitHub.

Tech stack: Express + TypeScript + PostgreSQL + dotenv

## How to Start

```bash
cd codes
npm install

# Copy the example file and fill in your local configuration
cp .env_example .env
# Edit .env and enter your database information

npm run dev
```

---

## 18.1 Why Environment Variables Are Needed

Writing passwords directly into source code has two serious problems:

1. **Exposure risk**: Once the code is uploaded to GitHub, the password is visible to everyone
2. **Inflexibility**: Development machines, test servers, and production servers use different database addresses — you would have to change the code every time you switch

Environment variables are key-value pairs provided by the operating system for passing configuration between processes. Any program can read them through a standard interface, independent of any specific language or framework.

**Temporarily setting an environment variable in the terminal (Linux / macOS / Git Bash):**

```bash
export DB_PASSWORD="cisco123"
echo $DB_PASSWORD        # output: cisco123
```

**Reading environment variables in Node.js:**

```typescript
process.env.DB_PASSWORD  // returns "cisco123"
```

`process.env` is a built-in Node.js object — no import needed, available anywhere.

---

## 18.2 The .env File and dotenv

Manually running `export` in the terminal only lasts for the current shell session and disappears on restart. In real development, a `.env` file is used to persist configuration, and the `dotenv` library loads it automatically at program startup.

**`.env` file format:**

```
PORT="3000"
DB_HOST="10.0.0.133"
DB_USER="postgres"
DB_PASSWORD="Cisco123"
DB_NAME="db4"
DB_PORT="5432"
```

One `KEY=VALUE` per line; quotes are optional. dotenv also supports the `export KEY=VALUE` format, making it convenient to load with `source .env` in a shell.

**Installing dotenv:**

```bash
npm install dotenv
```

**The simplest way to load it:**

```typescript
import dotenv from 'dotenv';
dotenv.config(); // reads .env from the project root and writes all key-value pairs into process.env
```

After calling `dotenv.config()`, all variables in `.env` are available in `process.env`, and can be accessed anywhere via `process.env.KEY`.

> **Type note**: All values loaded by dotenv are of type `string`, even if written as numbers. Manual conversion is required when a number is needed:
>
> ```typescript
> parseInt(process.env.DB_PORT as string)  // "5432" → 5432
> ```

---

## 18.3 .env Must Never Be Committed to GitHub

Add `.env` to `.gitignore` and Git will ignore the file:

```
# .gitignore
.env
```

Verify that it works:

```bash
git status   # .env should not appear in the list
```

**Companion practice: provide a `.env_example` file**

`.env` is not committed, but other developers need to know which variables are required. The convention is to commit a `.env_example` file with placeholder values (no real passwords):

```
PORT="3000"
DB_HOST="your_db_host"
DB_USER="your_db_user"
DB_PASSWORD="your_db_password"
DB_NAME="your_db_name"
DB_PORT="5432"
```

New team members can run `cp .env_example .env`, fill in their own configuration, and the project is ready to run.

---

## 18.4 Key Issue: dotenv Must Execute First

After moving sensitive information into `.env`, there is one common pitfall.

Look at `ConnectionManager.ts`:

```typescript
import { dbConfig } from "../config.ts";  // config.ts reads from process.env
export const pool = new pg.Pool(dbConfig);
```

`config.ts` reads `process.env.DB_HOST` and other variables at module load time. If dotenv has not yet executed at that point, `process.env` does not have these values, `dbConfig` will be full of `undefined`, and the connection pool creation will fail.

**ES module execution order**

In ES modules (`"type": "module"`), imports are **hoisted**: all import statements execute before the rest of the file's code, in the order they are written.

Using this characteristic, the dotenv loading logic is placed in a dedicated `env.ts` file, which is then made the **first import** in `app.ts`:

```typescript
// app.ts
import './env.ts';              // ← first import; dotenv.config() runs here

import express from 'express';
import { pool } from './db/ConnectionManager.ts';  // ← process.env is already populated at this point
```

Execution order:

```
app.ts begins parsing
  → env.ts executes (dotenv.config() runs, .env is written into process.env)
  → express module initializes
  → ConnectionManager.ts executes (reads process.env, values are now available)
  → rest of app.ts executes
```

This order guarantees that no matter how complex the project structure is, as long as `env.ts` is the first import in `app.ts`, the environment variables will always be ready first.

---

## 18.5 config.ts: Centralizing Configuration

`process.env.DB_HOST` scattered throughout the codebase is hard to maintain, and typos are easy to miss. The convention is to gather all configuration into `config.ts`, perform type conversion there, and export everything from one place:

```typescript
// config.ts
export const dbConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string), // string → number
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
};
```

When other modules need database configuration, they simply `import { dbConfig } from './config'` — no direct access to `process.env` in business code.

---

## 18.6 Complete Data Flow

```
.env file
  → dotenv.config() (env.ts)
  → process.env (Node.js global)
  → config.ts (reads and converts types)
  → ConnectionManager.ts (creates connection pool using dbConfig)
  → app.ts (uses connection pool to handle requests)
```

File relationships:

```
src/
  env.ts             ← does one thing only: loads .env
  config.ts          ← does one thing only: reads from process.env and exports configuration
  app.ts             ← first line imports env.ts, then proceeds normally with business logic
  db/
    ConnectionManager.ts  ← imports config, creates connection pool
```

---

## 18.7 Building Good Habits

Starting from this chapter, **all projects should handle sensitive information this way**. Code in previous chapters had passwords written directly into source files — that was a teaching simplification to keep the focus on each chapter's core concepts. This must never be done in a real project.

Checklist:

- [ ] `.env` is listed in `.gitignore`
- [ ] A `.env_example` file exists at the project root (with placeholder values, no real passwords)
- [ ] `env.ts` is the first import in `app.ts`
- [ ] All configuration is centralized in `config.ts`; business code does not access `process.env` directly
