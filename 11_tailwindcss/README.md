[← Back to Home](../readme.md)

# Chapter 11: Tailwind CSS

This chapter covers three progressive examples to master the three ways of using Tailwind CSS:

| Example   | Directory          | Description                                                 |
| --------- | ------------------ | ----------------------------------------------------------- |
| Example 1 | `codes/01_cdn`     | Via CDN, zero configuration, great for quick exploration    |
| Example 2 | `codes/02_cli`     | Local compilation with Tailwind CLI, supports custom classes and themes |
| Example 3 | `codes/03_express` | Full dev environment: Express + TypeScript + EJS + Tailwind |

## Directory Layout

```
11_tailwindcss/
  README.md
  codes/
    01_cdn/          ← Example 1: CDN approach
    02_cli/          ← Example 2: Tailwind CLI
    03_express/      ← Example 3: Express + TypeScript + Tailwind
  practice/
    01_cdn/          ← Exercise 1
    02_cli/          ← Exercise 2
    03_express/      ← Exercise 3
```

---

## 11.1 Example 1: Via CDN (Zero-Config Experience)

> Official docs: https://tailwindcss.com/docs/installation/play-cdn

Add a single `<script>` tag in `<head>` to use all Tailwind utility classes with no package installation required:

```html
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
```

```html
<p class="text-red-500 text-2xl bg-green-400">Hello Tailwind</p>
```

**Suitable for:** Quick exploration, prototype validation. Production projects should use the CLI for local compilation to avoid the performance overhead of real-time browser-side parsing.

**Workflow:**

```bash
# Just open index.html directly in a browser — no commands needed
```

---

## 11.2 Example 2: Tailwind CLI Local Compilation

> Official docs: https://tailwindcss.com/docs/installation/tailwind-cli

### 11.2.1 Installation and Initialization

```bash
cd codes/02_cli
npm install
npm run dev
```

`npm run dev` actually runs:

```bash
npx @tailwindcss/cli -i ./public/css/input.css -o ./public/css/output.css --watch
```

- `-i`: Input file (your CSS)
- `-o`: Output file (compiled by Tailwind, automatically includes all used utility classes)
- `--watch`: Watches for file changes and recompiles automatically

Include the compiled output file in HTML:

```html
<link rel="stylesheet" href="./css/output.css" />
```

### 11.2.2 Writing `input.css`

```css
/* Import Tailwind core */
@import "tailwindcss";

/* Use @apply to bundle common combinations into a custom class */
.btn-primary {
  @apply py-2 px-4 bg-blue-700 hover:bg-blue-500 text-white rounded cursor-pointer;
}

/* Use @theme to extend the color system */
@theme {
  --color-brand-primary: #00ff00;
  --color-brand-secondary: #ff0000;
}
```

- **`@apply`**: Merges multiple utility classes into a single custom class, avoiding a pile of class names in HTML
- **`@theme`**: Declares custom CSS variables, usable directly in templates as `text-brand-primary`, `bg-brand-secondary`, etc.

### 11.2.3 Responsive Prefixes

Tailwind's responsive system is **mobile-first**: classes without a prefix always apply; classes with a prefix apply at the specified breakpoint and above.

| Prefix | Breakpoint | Meaning               |
| ------ | ---------- | --------------------- |
| `sm:`  | ≥ 640px    | Small screens and up  |
| `md:`  | ≥ 768px    | Medium screens and up |
| `lg:`  | ≥ 1024px   | Large screens and up  |
| `xl:`  | ≥ 1280px   | Extra large and up    |

```html
<!-- text-sm on mobile, text-xl on medium screens and up -->
<h1 class="text-sm md:text-xl font-bold">My Website</h1>
```

### 11.2.4 Common Layout Utility Classes

**Flexbox layout:**

```html
<!-- Horizontal, space-between alignment -->
<div class="flex justify-between items-center">...</div>

<!-- Vertical stack with 16px gap -->
<div class="flex flex-col gap-4">...</div>

<!-- flex-grow ratio control -->
<div class="grow-1">Takes 1 share</div>
<div class="grow-2">Takes 2 shares</div>
```

**Typical page layout (header + sidebar + main + footer):**

```html
<body class="flex flex-col min-h-screen">
  <header class="bg-green-700 text-white p-4">...</header>

  <div class="flex flex-1">
    <aside class="w-64 bg-amber-300 p-4">...</aside>
    <main class="flex-1 p-4">...</main>
  </div>

  <footer class="bg-gray-800 text-white p-4">...</footer>
</body>
```

`min-h-screen` ensures the page fills at least the full viewport height; `flex-1` lets the main area occupy the remaining space.

---

## 11.3 Example 3: Express + TypeScript + Tailwind Full Dev Environment

### 11.3.1 `tsx`: Run TypeScript Directly Without Compiling

The normal dev workflow requires running `tsc` to compile before running `node`.

tsx (TypeScript Execute) is a tool for running TypeScript files directly in Node.js. Built on esbuild, it provides fast TypeScript compilation and execution with support for modern module systems. `tsx` can run `.ts` files directly:

```bash
# Install globally once
npm install -g tsx

# Run directly (equivalent to node index.js)
tsx ./src/index.ts

# Watch for file changes and auto-restart (equivalent to nodemon)
tsx watch ./src/index.ts
```

> Compared to the `tsc -w + nodemon` approach from the previous chapter, `tsx watch` is simpler — it eliminates the `dist/` directory and `nodemon` configuration. The trade-off is no type checking (transpile only). Both approaches are valid; pick one.

### 11.3.2 Running Two Watch Processes in Parallel with `concurrently`

The Express server and Tailwind compilation need to run simultaneously:

```json
"scripts": {
    "dev": "concurrently \"tsx watch ./src/index.ts\" \"npx @tailwindcss/cli -i ./public/css/input.css -o ./public/css/output.css --watch\"",
    "build": "tsc",
    "buildcss": "npx @tailwindcss/cli -i ./public/css/input.css -o ./public/css/output.css --minify"
}
```

- `dev`: Development mode, two watch processes running in parallel
- `build`: Compile TypeScript with `tsc` (for production deployment)
- `buildcss`: Compile and minify CSS (`--minify`, for production deployment)

### 11.3.3 Project Structure and Starting Up

```bash
cd codes/03_express
npm install
npm run dev
# Visit http://localhost:3000
```

```
03_express/
  src/
    index.ts          ← Express entry point
  views/
    index.ejs         ← EJS template, references /css/output.css
  public/
    css/
      input.css       ← Your Tailwind configuration
      output.css      ← Compiled output, auto-updated
  package.json
  tsconfig.json
```

Include the compiled CSS in the EJS template (served via `express.static("public")`):

```ejs
<link rel="stylesheet" href="/css/output.css">
```

Note the path uses `/css/output.css` (absolute path), not `./css/output.css` (relative path), because static files are served through Express routing.
