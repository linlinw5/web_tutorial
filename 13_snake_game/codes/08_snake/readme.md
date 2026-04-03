[← Back to Chapter Home](../../readme.md)

# Step 08: ScoreBoard Class

Add a `ScoreBoard` class to track the current score and the session high score, updating the DOM elements on the page in real time.

## HTML Structure (index.html)

```html
<table>
    <tr><th>Current Score</th><th>High Score</th></tr>
    <tr>
        <td id="myScore">0</td>
        <td id="highestScore">0</td>
    </tr>
</table>
```

## ScoreBoard Class

```typescript
const myScore      = document.querySelector("#myScore")      as HTMLDivElement;
const highestScore = document.querySelector("#highestScore") as HTMLDivElement;

class ScoreBoard {
    currentScore: number;
    highScore: number;

    constructor(currentScore = 0, highScore = 0) {
        this.currentScore = currentScore;
        this.highScore = highScore;
    }

    draw() {
        myScore.textContent      = this.currentScore.toString();
        highestScore.textContent = this.highScore.toString();
    }

    updateScore() {
        this.currentScore += 10; // +10 points per food eaten
        if (this.currentScore > this.highScore) {
            this.highScore = this.currentScore;
        }
        this.draw(); // Update the DOM immediately
    }
}
```

## Integration into the Game Loop

```typescript
let scoreBoard = new ScoreBoard();
scoreBoard.draw(); // Initialize display at 0 / 0

function drawGame() {
    // ...
    if (head.x === food.x && head.y === food.y) {
        food.relocate(snake);
        scoreBoard.updateScore(); // Update score when food is eaten
    } else {
        snake.removeTail();
    }
    // ...
}
```

> Note: the high score in this step is only valid within the current game session and resets on page refresh. Step 09 will persist it using `localStorage`.
