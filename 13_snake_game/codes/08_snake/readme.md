[← 返回章节首页](../../readme.md)

# Step 08：ScoreBoard 类

新增 `ScoreBoard` 类，统计当前得分和本次游戏最高得分，并实时更新页面上的 DOM 元素。

## HTML 结构（index.html）

```html
<table>
    <tr><th>当前分数</th><th>最高得分</th></tr>
    <tr>
        <td id="myScore">0</td>
        <td id="highestScore">0</td>
    </tr>
</table>
```

## ScoreBoard 类

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
        this.currentScore += 10; // 每吃一个食物 +10 分
        if (this.currentScore > this.highScore) {
            this.highScore = this.currentScore;
        }
        this.draw(); // 立刻更新 DOM
    }
}
```

## 集成到游戏循环

```typescript
let scoreBoard = new ScoreBoard();
scoreBoard.draw(); // 初始化显示 0 / 0

function drawGame() {
    // ...
    if (head.x === food.x && head.y === food.y) {
        food.relocate(snake);
        scoreBoard.updateScore(); // 吃到食物时更新分数
    } else {
        snake.removeTail();
    }
    // ...
}
```

> 注意：此步骤的最高分仅在本次游戏会话内有效，页面刷新后归零。Step 09 将用 `localStorage` 持久化。
