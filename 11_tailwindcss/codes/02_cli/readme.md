# Example 2: Local Compilation with Tailwind CLI

> Official docs: https://tailwindcss.com/docs/installation/tailwind-cli

## How to Run

```bash
npm install
npm run dev
# Open public/index.html in a browser
```

`npm run dev` actually runs:

```bash
npx @tailwindcss/cli -i ./public/css/input.css -o ./public/css/output.css --watch
```

Watches for changes to `input.css` and automatically recompiles, updating `output.css`.

## Steps to Set Up from Scratch

```bash
npm init -y
npm install tailwindcss @tailwindcss/cli
```

Create the following files and directories:

```
public/
  css/
    input.css    ← Your Tailwind configuration
  index.html
```

**`input.css`** — at minimum, just one line:

```css
@import "tailwindcss";
```

**`package.json`** — add a dev script:

```json
"scripts": {
    "dev": "npx @tailwindcss/cli -i ./public/css/input.css -o ./public/css/output.css --watch"
}
```

**`index.html`** — include the compiled output file:

```html
<link rel="stylesheet" href="./css/output.css">
```

## Advanced input.css

```css
@import "tailwindcss";

/* Use @apply to bundle common combinations into a custom class */
.btn-primary {
    @apply py-2 px-4 bg-blue-700 hover:bg-blue-500 text-white rounded cursor-pointer;
}

/* Use @theme to extend with a custom color system */
@theme {
    --color-brand-primary: #00FF00;
    --color-brand-secondary: #FF0000;
}
```

Once defined, you can use `class="btn-primary"` or `class="text-brand-primary"` directly in HTML.
