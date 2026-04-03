# Example 1: Including Tailwind CSS via CDN

> Official docs: https://tailwindcss.com/docs/installation/play-cdn

## How to Use

No packages to install. Just add a single `<script>` line in `<head>`:

```html
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
```

After that, you can use all Tailwind utility classes directly on HTML elements:

```html
<p class="text-red-500 text-2xl bg-green-400">Hello Tailwind</p>
```

## How to Run

Open `index.html` directly in a browser — no commands needed.

## Use Cases

- Quickly exploring Tailwind utility classes
- Prototype validation and demos

> **Note:** The CDN approach parses all Tailwind classes in the browser at runtime, which is not suitable for production environments. For real projects, use Tailwind CLI for local compilation.
