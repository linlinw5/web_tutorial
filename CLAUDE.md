# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a full-stack web development bootcamp curriculum organized in 21 progressive modules, from HTTP fundamentals to a complete authenticated blog system with automated testing. Each numbered directory is a self-contained lesson or project. The course is taught in Chinese; all responses must be in Chinese.

## Language & Response Style

- **Always reply in Chinese**, regardless of the language the user writes in. Keep code, filenames, and variable names in English as-is.
- Be concise and direct. Do not restate what the user just said.
- Do not summarize "what you just did" at the end of a response — the user can see the diff.
- No emojis unless the user explicitly asks.

## Common Development Commands

Most Node.js modules follow the same pattern — check the specific module's `package.json` for exact scripts.

**Start a development server (TypeScript projects):**

```bash
npm run dev
# Runs: concurrently "tsc -w" "nodemon ./dist/app.js"
```

**Build TypeScript:**

```bash
npm run build
# Runs: tsc
```

**Run tests (chapters 20–21):**

```bash
npm test
# Runs: jest
```

**Plain JavaScript modules** (02_http_basic, 03_express_basic, 03_express_plus) — run directly:

```bash
node server_01.js
node app01.js
```

**Browser TypeScript projects** (05_dom_basic, 06_bom_basic, 07_fetch_*) — no build step; open `index.html` in a browser after running `tsc -w` manually.

**Mock API server** (required for 07_fetch_* exercises):

```bash
cd 07_mock_api && npm run dev
```

## Architecture & Structure

### TypeScript Compilation Pattern

All TypeScript projects follow: `src/` (source) → `dist/` (compiled output). Entry point is typically `src/app.ts` or `src/index.ts`, compiled to `dist/app.js`.

### Full-Stack Project Layout

Projects with separate frontend/backend (12_easy_blog_sqlite, 19_easy_blog_final) use:

```
<project>/
  backend/    ← Express server (src/ → dist/, EJS views, db/)
  frontend/   ← TypeScript compiled to JavaScript, served as static files
```

### Database Layers

- **SQLite** (ch. 9–13): Uses `sqlite` + `sqlite3` packages; `ConnectionManager` singleton pattern in `db/`; database files in `data/`
- **PostgreSQL** (ch. 14–19): Uses `pg` driver; connection config via `config.ts` and environment variables

### Authentication Stack (ch. 16–19)

Built incrementally across chapters:

1. `express-session` with SQLite or PostgreSQL store (`connect-sqlite3` / `connect-pg-simple`)
2. `passport` + `passport-local` for username/password auth
3. `bcrypt` for password hashing
4. `dotenv` for secrets (`.env` files, never committed)
5. `passport-google-oauth20` for Google OAuth

### Testing Stack (ch. 20–21)

- `jest` + `ts-jest` + `@types/jest`
- `jest.config.js` with `collectCoverageFrom` scoped to `src/db/` only
- `jest.mock` used to swap `config.ts` env to `"test"` (`:memory:` SQLite) without touching source code
- `beforeAll` for one-time setup (schema + seed data), `beforeEach` for per-test cleanup

### Final Project Structure (19_easy_blog_final)

The most complete module; its backend architecture is the reference implementation:

- `src/env.ts` — loads dotenv; **must be the first import** in `app.ts` (ES module hoisting issue)
- `src/config.ts` — centralizes `dbConfig`, `sessionConfig`, and `AppOptions`
- `src/app.ts` — Express setup, middleware registration, calls `initializeDatabase()` before `listen()`
- `src/db/` — data access layer only; no business logic
- `src/routes/api/` — JSON API routes
- `src/routes/web/` — EJS page routes
- `src/utils/authCheck.ts` — `isAuthenticated` / `isAdmin` middleware
- `src/utils/configPassport.ts` — Passport Local + Google strategies

## Technology Stack

- **Runtime**: Node.js with ES modules (`"type": "module"` in package.json)
- **Framework**: Express v5
- **Language**: TypeScript (all backend and most frontend code)
- **Templating**: EJS (server-side rendering)
- **Frontend**: Vanilla TypeScript/JS — no React/Vue; native DOM and Fetch APIs
- **Dev tooling**: `concurrently` (parallel tsc + nodemon), `nodemon` (hot reload), `tsx` (direct TS execution in ch. 21)

## Collaboration Rules

### 1. Plan First

- Enter plan mode for any non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, stop and re-plan immediately — do not keep pushing
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy

- Use subagents to keep the main context window clean
- Offload research, exploration, and parallel analysis to subagents
- One focused task per subagent

### 3. Self-Improvement Loop

- After any correction from the user: update `tasks/lessons.md` with the pattern
- Write rules that prevent the same mistake from recurring
- Review lessons at the start of each session

### 4. Verification Before Done

- Never mark a task complete without proving it works
- Ask: "Would a staff engineer approve this?"

### 5. Demand Elegance

- For non-trivial changes: pause and ask "is there a more elegant way?"
- Skip this for simple, obvious fixes — do not over-engineer

### 6. Autonomous Bug Fixing

- When given a bug report: just fix it. Do not ask for hand-holding.
- Point at logs, errors, or failing tests — then resolve them.

## Task Management

1. **Plan First**: Write plan to `tasks/todo.md` with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Capture Lessons**: Update `tasks/lessons.md` after any correction

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Touch minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
