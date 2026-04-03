# Example 3: Express + TypeScript + Tailwind CSS Dev Environment

## How to Run

```bash
npm install
npm run dev
# Visit http://localhost:3000
```

## Prerequisite: Install tsx Globally

`tsx` can run `.ts` files directly without compiling with `tsc` first:

```bash
npm install -g tsx

# Verify installation
npm list -g
```

> Official docs: https://tsx.is/

## Steps to Set Up from Scratch

**1. Install dependencies**

```bash
npm init -y
npm install express @types/express ejs @types/ejs
npm install tailwindcss @tailwindcss/cli
npm install concurrently
```

**2. Create files and directories**

```
src/index.ts
views/index.ejs
public/css/input.css
public/image/
```

**3. `package.json` configuration**

```json
{
  "type": "module",
  "scripts": {
    "dev": "concurrently \"tsx watch ./src/index.ts\" \"npx @tailwindcss/cli -i ./public/css/input.css -o ./public/css/output.css --watch\"",
    "build": "tsc",
    "buildcss": "npx @tailwindcss/cli -i ./public/css/input.css -o ./public/css/output.css --minify"
  }
}
```

- `dev`: Runs the Express server (tsx watch) and Tailwind compiler (--watch) in parallel
- `build`: Compile TypeScript with `tsc` for production
- `buildcss`: Minify CSS for production (`--minify`)

**4. `src/index.ts`**

```typescript
import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', 'views');

app.get('/', (req, res) => {
    res.render('index.ejs', { title: 'Home Page' });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
```

**5. `views/index.ejs`** — include the compiled CSS

```html
<link rel="stylesheet" href="/css/output.css">
```

Use the absolute path `/css/output.css` because static files are served through Express routing.

**6. `public/css/input.css`**

```css
@import "tailwindcss";

.btn-primary {
    @apply px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600;
}
```

## `tsconfig.json` Reference

```json
{
    "compilerOptions": {
        "target": "es2020",
        "module": "es2020",
        "rootDir": "./src",
        "outDir": "./dist",
        "moduleResolution": "bundler",
        "allowImportingTsExtensions": true,
        "rewriteRelativeImportExtensions": true,
        "esModuleInterop": true,
        "strict": true,
        "skipLibCheck": true
    }
}
```
