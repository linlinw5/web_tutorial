const canvas = document.querySelector("#myCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const unit = 20;
const myScore      = document.querySelector("#myScore")      as HTMLDivElement;
const highestScore = document.querySelector("#highestScore") as HTMLDivElement;

canvas.width  = 400;
canvas.height = 400;

// TODO: 定义方向枚举 Direction（Left / Right / Up / Down）
enum Direction {
    // ...
}

// TODO: 定义 Point 接口（x, y, fillStyle, strokeStyle）
interface Point {
    // ...
}

// ─────────────────────────────────────────
// Snake 类
// ─────────────────────────────────────────
class Snake {
    segments: Point[] = [];
    direction: Direction = Direction.Left;

    constructor(
        x: number,
        y: number,
        headstyle: string = "red",
        bodystyle: string = "lightblue",
        strokeStyle: string = "white",
        initLength: number = 3
    ) {
        // TODO: 用 for 循环初始化 segments 数组
        // 索引 0 为头部（headstyle），其余为身体（bodystyle）
    }

    draw() {
        // TODO: 遍历 segments，用 ctx.fillRect / ctx.strokeRect 逐节绘制
    }

    move(direction: Direction) {
        // TODO:
        // 1. 取出当前头部 segments[0] 和第一个身体节 segments[1]
        // 2. 根据 direction 计算新头部坐标（含边界 wrap-around）
        // 3. 将当前头部颜色改为身体颜色
        // 4. unshift 新头部
        // （不在此处 pop，由外部决定是否移除尾部）
    }

    removeTail() {
        // TODO: 移除 segments 最后一个元素
    }

    changeDirection(newDirection: Direction) {
        // TODO: 禁止 180° 反向，合法时更新 this.direction
    }

    checkCollisionWithSelf(): boolean {
        // TODO: 返回蛇头是否与身体中任意节重合
        return false;
    }
}

// ─────────────────────────────────────────
// Food 类
// ─────────────────────────────────────────
class Food {
    x: number = 0;
    y: number = 0;
    fillStyle: string;
    strokeStyle: string;

    constructor(fillStyle: string = "yellow", strokeStyle: string = "white") {
        this.fillStyle   = fillStyle;
        this.strokeStyle = strokeStyle;
        this.relocate();
    }

    draw() {
        // TODO: 绘制食物方块
    }

    relocate(snake?: Snake) {
        // TODO: 随机生成坐标，若与蛇身重合则重新生成（用 while 循环 + Array.some）
    }
}

// ─────────────────────────────────────────
// ScoreBoard 类
// ─────────────────────────────────────────
class ScoreBoard {
    currentScore: number;
    highScore: number;

    constructor(currentScore: number = 0) {
        // TODO: 从 localStorage 读取历史最高分（key: "highScore"），初始化 this.highScore
        this.currentScore = currentScore;
        this.highScore = 0; // 替换为从 localStorage 读取的值
    }

    draw() {
        // TODO: 将 currentScore / highScore 写入对应 DOM 元素的 textContent
    }

    updateScore() {
        // TODO: currentScore += 10；若打破记录则更新 highScore 并写入 localStorage；调用 draw()
    }
}

// ─────────────────────────────────────────
// 游戏主循环
// ─────────────────────────────────────────
const snake      = new Snake(0, 0);
const food       = new Food();
const scoreBoard = new ScoreBoard();
scoreBoard.draw();

function drawGame() {
    // 1. 清空画布（黑色背景）
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. 绘制食物和蛇
    food.draw();
    snake.draw();
    snake.move(snake.direction);

    // 3. TODO: 检测蛇头是否碰到食物
    //    - 是：food.relocate(snake)，scoreBoard.updateScore()
    //    - 否：snake.removeTail()

    // 4. TODO: 检测自撞
    //    - 碰到自身：clearInterval(gameLoop)，alert 游戏结束
}

const gameLoop = window.setInterval(drawGame, 200);

// ─────────────────────────────────────────
// 键盘事件
// ─────────────────────────────────────────
function handleKeyDown(event: KeyboardEvent) {
    // TODO: 将 ArrowLeft/Right/Up/Down 映射到 snake.changeDirection()
}

window.addEventListener("keydown", handleKeyDown);
