[← Back to Chapter Home](../../readme.md)

# Step 06: Eating Food + Body Growth

When the snake's head touches food, the body grows by one segment, the food is repositioned randomly, and the new position is guaranteed not to land on the snake.

## Key Change: `move()` No Longer Calls `pop` Directly

In Step 05, `move()` called `this.segments.pop()` at the end to remove the tail.
Step 06 separates that out:

```typescript
// pop is commented out inside move():
// this.segments.pop();

// New standalone method:
removeTail() {
    this.segments.pop();
}
```

The game loop decides whether to call `removeTail()` based on whether food was eaten:

```typescript
function drawGame() {
    // ...
    snake.move(snake.direction);
    const head = snake.segments[0];

    if (head.x === food.x && head.y === food.y) {
        food.relocate(snake); // Food eaten: don't remove tail → body grows by 1
    } else {
        snake.removeTail();   // Not eaten: remove tail → length unchanged
    }
}
```

## Ensuring Food Doesn't Land on the Snake

```typescript
relocate(snake?: Snake) {
    let isOnSnake = true;
    while (isOnSnake) {
        this.x = Math.floor(Math.random() * (canvas.width / unit)) * unit;
        this.y = Math.floor(Math.random() * (canvas.height / unit)) * unit;
        // Array.some(): returns true as soon as any segment overlaps with the food position
        isOnSnake = snake?.segments.some(
            seg => seg.x === this.x && seg.y === this.y
        ) || false;
    }
}
```

`Array.some()` returns `true` as soon as it finds a matching element without iterating further — well suited for collision detection.

## Growth Mechanism Summary

```
Before eating food:  [head] [body] [body] [tail]
After move():        [newHead] [head→body] [body] [body] [tail]   ← unshift inserts new head
Without calling pop: [newHead] [head→body] [body] [body] [tail]   ← tail kept, body +1
```
