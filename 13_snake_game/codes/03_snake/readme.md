[← Back to Chapter Home](../../readme.md)

# Step 03: Refactor with a Class + TypeScript enum

Rewrite the procedural code from Step 02 in an object-oriented style, and introduce `enum Direction` for type-safe direction handling.

## What's New in This Step

- `class Snake`: encapsulates coordinates, color, drawing, and movement logic
- `enum Direction`: TypeScript enum replacing bare strings
- Four-direction keyboard response now calls `snake.move(Direction.Left)`, etc.

## enum Direction

```typescript
enum Direction {
    Left  = "Left",
    Right = "Right",
    Up    = "Up",
    Down  = "Down"
}
```

Benefits of using an enum:
- Type safety — TypeScript compile error if you pass the wrong direction
- No typo risk (`"left"` vs `"Left"`)
- Better readability (`Direction.Left` is clearer than `"Left"`)

## class Snake

```typescript
class Snake {
    x: number;
    y: number;
    fillStyle: string;
    strokeStyle: string;

    constructor(x: number, y: number, fillStyle: string, strokeStyle: string) { ... }

    draw() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        ctx.fillStyle = this.fillStyle;
        ctx.fillRect(this.x, this.y, unit, unit);
    }

    move(direction: Direction) {
        switch (direction) {
            case Direction.Left:
                this.x -= unit;
                if (this.x < 0) this.x = canvas.width - unit;
                break;
            // Right / Up / Down follow the same pattern...
        }
        this.draw(); // Redraw immediately after moving
    }
}
```

## Comparison with Step 02

| | Step 02 | Step 03 |
|---|---|---|
| Data | Bare `Point` object | `Snake` class instance |
| Movement | Scattered in event callbacks | Encapsulated in `snake.move()` |
| Direction | String `"ArrowLeft"` | `enum Direction` |
| Drawing | Standalone function `drawDot()` | Class method `snake.draw()` |
