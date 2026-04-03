[← Back to Chapter Home](../../readme.md)

# Step 04: Game Loop + Food Class

Make the snake **move automatically**, driven by a `setInterval` game loop; add a `Food` class that randomly places food on the canvas.

## What's New in This Step

- `Food` class: random coordinate generation (`relocate()`), called automatically on initialization
- `Snake.direction` property: tracks the current movement direction, defaults to right
- `Snake.changeDirection()`: prevents a direct 180° reversal
- `window.setInterval(drawGame, 100)`: main game loop

## Food Class

```typescript
class Food {
    x: number;
    y: number;

    constructor(...) {
        this.relocate(); // Randomly generate position on initialization
    }

    relocate() {
        // canvas 400px / unit 20px = 20 cells
        // Math.floor(Math.random() * 20) gives an integer from 0 to 19
        // Multiplying by unit gives 0, 20, 40, ..., 380
        this.x = Math.floor(Math.random() * (canvas.width / unit)) * unit;
        this.y = Math.floor(Math.random() * (canvas.height / unit)) * unit;
    }
}
```

## Reverse-Direction Prevention

```typescript
changeDirection(newDirection: Direction) {
    if (this.direction === Direction.Left  && newDirection === Direction.Right) return;
    if (this.direction === Direction.Right && newDirection === Direction.Left)  return;
    if (this.direction === Direction.Up    && newDirection === Direction.Down)  return;
    if (this.direction === Direction.Down  && newDirection === Direction.Up)    return;
    this.direction = newDirection;
}
```

The snake cannot reverse directly — if it's currently moving left, pressing right has no effect.

## Main Game Loop

```typescript
function drawGame() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Clear
    food.draw();
    snake.draw();
    snake.move(snake.direction); // Advance one cell automatically each frame
}

window.setInterval(drawGame, 100); // Execute every 100ms
```

`setInterval` replaces the manual key-triggered movement from Step 03 — the snake now moves on its own.
