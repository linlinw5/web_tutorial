[← Back to Chapter Home](../README.md)

# Exercise: Implement a Session-Based User Authentication System

## Pre-configured Parts (No Modifications Needed)

| File/Directory | Description |
|---|---|
| `backend/src/db/` | ConnectionManager, createUser, checkPassword, getAllGroups — all complete |
| `backend/src/utils/shutdownConnection.ts` | Graceful shutdown, complete |
| `backend/views/` | All EJS templates, complete |
| `backend/public/css/` `public/images/` | Styles and image assets, complete |
| `frontend/tsconfig.json` | Compilation config (output to backend/public/js/), complete |

## Parts You Need to Complete

Implement in the following order. After each step, verify with `api_test.http` or the browser:

### Step 1: Implement the authCheck Middleware

`backend/src/utils/authCheck.ts`

- `isAuthenticated`: check `req.session.user`; redirect to `/auth/login` if not logged in
- `isAdmin`: check `group_id === 1`; return 403 if no permission

### Step 2: Implement the API Routes

`backend/src/routes/api_auth.ts`

- `POST /register`: call `createUser()`, handle field validation (400) and error handling (500)
- `POST /login`: call `checkPassword()`, write to `req.session.user` on success (401 on failure)

Test the register and login endpoints using `../api_test.http`.

### Step 3: Configure app.ts

`backend/src/app.ts`

- Add the `SessionData` interface extension (user field)
- Configure the session middleware `store` (SQLiteStore)
- Mount the routes

### Step 4: Implement the Web Routes

`backend/src/routes/auth.ts`

Complete the 6 routes following the TODO comments, noting:
- `/login` should redirect if already logged in
- `/profile` should use the `isAuthenticated` guard
- `/admin` should use the `isAdmin` guard
- `/logout` must destroy the session AND clear the Cookie

### Step 5: Implement the Frontend Scripts

```bash
cd frontend
tsc -w   # start watch compilation
```

- `frontend/src/login.ts`: intercept form submission, fetch `/api/auth/login`
- `frontend/src/register.ts`: intercept form submission, verify passwords match, fetch `/api/auth/register`

## Starting Up

```bash
# Terminal 1 - Backend
cd practice/backend
npm install
npm run dev

# Terminal 2 - Frontend compilation
cd practice/frontend
tsc -w
```

Reference implementation is in `../codes/`.
