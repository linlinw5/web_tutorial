[← Back to Chapter Home](../../readme.md)

# Step 07: Self-Collision Detection + Game Over

When the snake's head collides with its own body, the game ends: the game loop stops and an alert is shown.

## New Method: `checkCollisionWithSelf()`

```typescript
checkCollisionWithSelf(): boolean {
    const head = this.segments[0];
    // slice(1) skips index 0 (the head itself) and checks only body segments
    return this.segments.slice(1).some(
        seg => seg.x === head.x && seg.y === head.y
    );
}
```

## Game Loop Update

```typescript
// Save the intervalId in a variable so it can be cleared later
const gameLoop = window.setInterval(drawGame, 200);

function drawGame() {
    // ... movement, eating food ...

    if (snake.checkCollisionWithSelf()) {
        clearInterval(gameLoop); // Stop the game loop
        alert("Game over — you ran into yourself!");
    }
}
```

Previously `window.setInterval(...)` was called without saving the return value, making it impossible to stop the timer later.
This step stores the returned `intervalId` in the `gameLoop` variable for use with `clearInterval()`.

## Key Concepts

| | Description |
|---|---|
| `Array.slice(1)` | Returns a new array starting from index 1, without modifying the original |
| `setInterval()` return value | A timer ID of type `number` |
| `clearInterval(id)` | Pass the ID to stop the corresponding timer |
