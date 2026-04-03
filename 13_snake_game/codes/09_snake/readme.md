[← Back to Chapter Home](../../readme.md)

# Step 09: Persisting the High Score with localStorage

Use the BOM's `localStorage` API to save the high score in the browser's local storage so it survives page refreshes.

## localStorage Overview

`localStorage` is a key-value store provided by the browser. Data persists across page refreshes and browser closes (unless manually cleared).

| Operation | API |
|---|---|
| Read | `localStorage.getItem("key")` → `string \| null` |
| Write | `localStorage.setItem("key", value)` |
| Delete | `localStorage.removeItem("key")` |
| Clear all | `localStorage.clear()` |

All values are stored as **strings** and must be converted to the appropriate type after reading.

## ScoreBoard Update

```typescript
class ScoreBoard {
    constructor(currentScore = 0, highScore = 0) {
        // Read the previously saved high score from localStorage
        const stored = window.localStorage.getItem("highScore");
        this.highScore    = stored ? parseInt(stored) : highScore;
        this.currentScore = currentScore;
    }

    updateScore() {
        this.currentScore += 10;
        if (this.currentScore > this.highScore) {
            this.highScore = this.currentScore;
            // Write to localStorage immediately when a new record is set
            window.localStorage.setItem("highScore", this.highScore.toString());
        }
        this.draw();
    }
}
```

Compared to Step 08, only two changes were made:
1. **Constructor**: reads and restores the historical high score from `localStorage` on initialization
2. **`updateScore()`**: calls `setItem` to write when a new record is broken

The caller (game loop) requires no modifications.

## Complete Snake Game Feature Overview

At this point the Snake Game has all core features:

| Feature | Implemented in |
|---|---|
| Canvas drawing | Step 01 |
| Keyboard-controlled movement | Step 02 |
| Object-oriented refactor + enum | Step 03 |
| Game loop + food | Step 04 |
| Multi-segment body | Step 05 |
| Eating food and growing | Step 06 |
| Self-collision game over | Step 07 |
| Scoreboard | Step 08 |
| High score persistence | Step 09 |
