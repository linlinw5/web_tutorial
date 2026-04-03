[← Back to Chapter Home](../../readme.md)

# Step 01: Project Scaffolding

Initialize the `backend/` project from scratch and set up the complete development environment skeleton for Express + TypeScript + Tailwind CSS + SQLite.

## What's Added in This Step

- Initialize the `backend/` npm project and install all dependencies
- Configure `package.json` startup scripts (`tsx watch` + Tailwind watch running in parallel)
- Configure `tsconfig.json`
- Create the minimal `src/index.ts` (single GET `/` route)
- Create the minimal `views/home.ejs` (references the Tailwind output stylesheet)

## How to Start

```bash
cd backend
npm install
npm run dev
# Visit http://localhost:3000
```

## Installing Dependencies

```bash
npm install express @types/express ejs @types/ejs
npm install tailwindcss @tailwindcss/cli
npm install sqlite3 sqlite
npm install concurrently
```

> **Prerequisite:** Install `tsx` globally (one-time only)
> ```bash
> npm install -g tsx
> ```

## Key Configuration: `package.json` Scripts

```json
"scripts": {
    "dev": "concurrently \"tsx watch ./src/index.ts\" \"npx @tailwindcss/cli -i ./public/css/input.css -o ./public/css/output.css --watch\"",
    "build": "tsc",
    "buildcss": "npx @tailwindcss/cli -i ./public/css/input.css -o ./public/css/output.css --minify"
}
```

`dev` uses `concurrently` to run two watch processes simultaneously:
- `tsx watch ./src/index.ts`: runs TypeScript directly, auto-restarts on file changes
- `npx @tailwindcss/cli ... --watch`: watches `input.css` and recompiles CSS automatically

## Directory Structure

```
backend/
  src/
    index.ts        ← Express entry point, GET / renders home.ejs
  views/
    home.ejs        ← Base template, references /css/output.css
  public/
    css/
      input.css     ← @import "tailwindcss"
      output.css    ← Compiled output, auto-updated
    image/
  data/             ← Database directory (used starting from Step 02)
  package.json
  tsconfig.json
```

## Result of This Step

![step01 result](../../assets/step01.png)
