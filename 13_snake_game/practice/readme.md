[← Back to Chapter Home](../readme.md)

# Exercise: Implement Snake Game from Scratch

Following the 9-step roadmap, fill in the implementation incrementally on top of the skeleton in `script.ts` to complete a full Snake Game with persistent high score.

## File Reference

| File | Description |
|---|---|
| `index.html` | Page structure — no modifications needed |
| `style.css` | Styles — no modifications needed |
| `tsconfig.json` | TypeScript configuration — no modifications needed |
| `script.ts` | **Write your code here** |

## Suggested Implementation Order

1. Complete the `Direction` enum and `Point` interface
2. Implement the `Snake` constructor (initialize segments)
3. Implement `Snake.draw()` and verify the snake appears on the canvas
4. Implement `Snake.move()` and `changeDirection()` for keyboard control
5. Implement the `Food` class (`draw` + `relocate`)
6. Add food-eating logic to `drawGame()` (`removeTail` vs no pop)
7. Implement `checkCollisionWithSelf()` for game over
8. Implement `ScoreBoard.draw()` and `updateScore()`
9. Read from `localStorage` in the `ScoreBoard` constructor and write in `updateScore()`

## How to Run

```bash
tsc -w    # Watch mode: automatically compiles to script.js on save
# Open index.html in a browser
```

Reference implementation: [`../codes/09_snake/script.ts`](../codes/09_snake/script.ts).
