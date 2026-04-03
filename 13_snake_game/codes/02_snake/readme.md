[← Back to Chapter Home](../../readme.md)

# Step 02: Keyboard-Controlled Dot Movement

Using a procedural approach: a red square on a black canvas moves via the arrow keys, and wraps around when it reaches an edge.

## What's New in This Step

- `interface Point`: describes the position and color of a drawable square
- `drawDot()`: clears the canvas before each move, then redraws
- Four-direction keyboard response + edge wrap-around logic

## Core Code

```typescript
interface Point {
    x: number;
    y: number;
    fillStyle: string;
    strokeStyle: string;
}

const unit = 20; // 20px per cell, evenly divides the 400px canvas

let redDot: Point = { x: 100, y: 100, fillStyle: "red", strokeStyle: "white" };

function drawDot(dot: Point) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    ctx.fillStyle = dot.fillStyle;
    ctx.fillRect(dot.x, dot.y, unit, unit);
}

function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "ArrowLeft") {
        redDot.x -= unit;
        if (redDot.x < 0) redDot.x = canvas.width - unit; // Reappear from the right
    }
    else if (event.key === "ArrowRight") {
        redDot.x += unit;
        if (redDot.x >= canvas.width) redDot.x = 0;        // Reappear from the left
    }
    drawDot(redDot);
}
```

## Design Notes

- **`unit = 20`**: The 400px canvas holds exactly 20 cells. All coordinates are integer multiples of `unit`, avoiding alignment issues.
- **Redraw instead of erase**: Every move fills the entire background with black to overwrite the old state, then draws the new position — this pattern is used throughout the game.
- **Wrap-around**: `x < 0` → reappear on the right; `x >= canvas.width` → reappear on the left; the same logic applies to all four directions.
