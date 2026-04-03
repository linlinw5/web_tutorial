[← Back to Chapter Home](../../readme.md)

# Step 01: Introduction to Canvas

Learn the basic usage of the `<canvas>` element: getting the context, resizing the canvas, drawing shapes, and capturing keyboard events.

## Canvas Basics

`<canvas>` is a drawing element introduced in HTML5, with a default size of 300×150 px. Use `getContext("2d")` to obtain a 2D drawing context.

Currently supported context types:

```typescript
const ctx2d = canvas.getContext("2d");           // 2D drawing
const gl    = canvas.getContext("webgl");         // WebGL 1.0
const gl2   = canvas.getContext("webgl2");        // WebGL 2.0
const bmp   = canvas.getContext("bitmaprenderer");
const webgpu = canvas.getContext("webgpu");       // Emerging GPU programming API
```

## Key Code for This Step

```typescript
const canvas = document.querySelector("#myCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

// Resize the canvas
canvas.width = 400;
canvas.height = 400;

// Draw a line
ctx.moveTo(0, 0);
ctx.lineTo(80, 80);
ctx.stroke();

// Draw a filled rectangle + stroked rectangle
ctx.fillStyle = "red";
ctx.fillRect(100, 100, 50, 50);
ctx.strokeStyle = "black";
ctx.strokeRect(100, 100, 50, 50);

// Capture keyboard events
function handleKeyDown(event: KeyboardEvent) {
    console.log(event.key);
}
window.addEventListener("keydown", handleKeyDown);
```

## Key Concepts

| Method | Description |
|---|---|
| `canvas.getContext("2d")` | Get the 2D drawing context |
| `ctx.fillRect(x, y, w, h)` | Draw a filled rectangle |
| `ctx.strokeRect(x, y, w, h)` | Draw a stroked rectangle (outline only) |
| `ctx.fillStyle` / `ctx.strokeStyle` | Set fill color / stroke color |
| `event.key` | Get the name of the pressed key, e.g. `"ArrowLeft"` |

## How to Run

```bash
cd 01_snake
tsc          # Compile script.ts to script.js
# Open index.html in a browser
```

Or enable watch mode:

```bash
tsc -w
```
