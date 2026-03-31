// 现在要把最高分写入localStorage
// 以便在页面刷新后仍然能保持最高分

const canvas = document.querySelector("#myCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const unit = 20;
const myScore = document.querySelector("#myScore") as HTMLDivElement;
const highestScore = document.querySelector("#highestScore") as HTMLDivElement;

canvas.width = 400;
canvas.height = 400;

enum Direction {
    Left = "Left",
    Right = "Right",
    Up = "Up",
    Down = "Down"
}

interface Point {
    x: number;
    y: number;
    fillStyle: string;
    strokeStyle: string;
}

class Snake {
    segments: Point[] = [];
    direction: Direction = Direction.Left; // 默认向左移动

    // 构造函数
    constructor(x: number, y: number, headstyle: string = "red", bodystyle: string = "lightblue", strokeStyle: string = "white", initLength: number = 3) {
        for (let i = 0; i < initLength; i++) {
            this.segments.push({
                x: x + i * unit,
                y: y,
                fillStyle: i === 0 ? headstyle: bodystyle,
                strokeStyle: strokeStyle
            });
        }
    }
    
    draw() {
        this.segments.forEach((segment) => {
            ctx.fillStyle = segment.fillStyle;
            ctx.fillRect(segment.x, segment.y, unit, unit);
            ctx.strokeStyle = segment.strokeStyle;
            ctx.strokeRect(segment.x, segment.y, unit, unit);
        });
    }

    move(direction: Direction) {
        let currentHead: Point = this.segments[0];
        let firstBody: Point = this.segments[1];
        let newHead: Point;

        // 根据方向计算新的蛇头位置
        switch (direction) {
            case Direction.Left:
                newHead = { x: currentHead.x - unit, y: currentHead.y, fillStyle: currentHead.fillStyle, strokeStyle: currentHead.strokeStyle };
                if (newHead.x < 0) {
                    newHead.x = canvas.width - unit; // 从右边出现
                }
                break;
            case Direction.Right:
                newHead = { x: currentHead.x + unit, y: currentHead.y, fillStyle: currentHead.fillStyle, strokeStyle: currentHead.strokeStyle };
                if (newHead.x >= canvas.width) {
                    newHead.x = 0; // 从左边出现
                }
                break;
            case Direction.Up:
                newHead = { x: currentHead.x, y: currentHead.y - unit, fillStyle: currentHead.fillStyle, strokeStyle: currentHead.strokeStyle };
                if (newHead.y < 0) {
                    newHead.y = canvas.height - unit; // 从下边出现
                }
                break;
            case Direction.Down:
                newHead = { x: currentHead.x, y: currentHead.y + unit, fillStyle: currentHead.fillStyle, strokeStyle: currentHead.strokeStyle };
                if (newHead.y >= canvas.height) {
                    newHead.y = 0; // 从上边出现
                }
                break;
        }
        currentHead.fillStyle = firstBody.fillStyle; // 将当前头部变为身体颜色
        this.segments.unshift(newHead); // 在头部添加新的位置
        // this.segments.pop(); // 移除尾部的最后一个段落
    }

    removeTail() {
        this.segments.pop(); // 移除尾部的最后一个段落
    }

    changeDirection(newDirection: Direction) {
        // 确保不能直接反向移动
        // 如果当前向左，不能直接向右；如果当前向右，不能直接向左
        // 如果当前向上，不能直接向下；如果当前向下，不能直接向上
        
        if (this.direction === Direction.Left && newDirection === Direction.Right) return; // 不允许从左直接转右
        if (this.direction === Direction.Right && newDirection === Direction.Left)  return; // 不允许从右直接转左
        if (this.direction === Direction.Up && newDirection === Direction.Down) return; // 不允许从上直接转下
        if (this.direction === Direction.Down && newDirection === Direction.Up) return; // 不允许从下直接转上

        // 如果不是反向移动，就允许改变方向
        this.direction = newDirection;
    }
    checkCollisionWithSelf(): boolean {
        const head = this.segments[0];
        // 检查蛇头是否与身体的其他部分相撞
        return this.segments.slice(1).some(seg => seg.x === head.x && seg.y === head.y);
        // 从索引 1 开始切片，跳过头部（索引 0），只取身体部分
    }
}

class Food {
    x: number;
    y: number;
    fillStyle: string;
    strokeStyle: string;
    // 构造函数
    constructor(x: number = 0, y: number = 0, fillStyle: string = "yellow", strokeStyle: string = "white") {
        this.x = x;
        this.y = y;
        this.fillStyle = fillStyle;
        this.strokeStyle = strokeStyle;
        this.relocate(); // 初始化时随机生成位置
    }
    
    draw() {
        ctx.fillStyle = this.fillStyle;
        ctx.fillRect(this.x, this.y, unit, unit);
        ctx.strokeStyle = this.strokeStyle;
        ctx.strokeRect(this.x, this.y, unit, unit);
    }
    relocate(snake?: Snake) {
        // 确保食物不会生成在蛇身上
        let isOnSnake: Boolean = true;
        while (isOnSnake) {
            this.x = Math.floor(Math.random() * (canvas.width / unit)) * unit;
            this.y = Math.floor(Math.random() * (canvas.height / unit)) * unit;
            isOnSnake = snake?.segments.some(seg => seg.x === this.x && seg.y === this.y) || false; // 如果蛇存在，检查食物位置是否在蛇身上
        }
    }
}


class ScoreBoard {
    currentScore: number;
    highScore: number;

    constructor(currentScore: number = 0, highScore: number = 0) {
        // 从 localStorage 获取最高分
        const storedHighScore = window.localStorage.getItem("highScore");
        this.highScore = storedHighScore ? parseInt(storedHighScore) : highScore; // 如果有存储的最高分，则使用它，否则使用传入的值
        this.currentScore = currentScore;
    }

    draw() {
        myScore.textContent = this.currentScore.toString();
        highestScore.textContent = this.highScore.toString();
    }
    updateScore() {
        this.currentScore += 10; // 每吃到一个食物得分增加10
        if (this.currentScore > this.highScore) {
            this.highScore = this.currentScore; // 更新最高分
            window.localStorage.setItem("highScore", this.highScore.toString()); // 将最高分存储到 localStorage
        }
        this.draw(); // 更新得分板显示
    }
}



// 创建蛇和食物实例
let snake: Snake  = new Snake(0, 0);
let food: Food = new Food();
let scoreBoard: ScoreBoard = new ScoreBoard();

// 初始化得分板
scoreBoard.draw();

// 绘制游戏
function drawGame() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    food.draw();
    snake.draw();
    snake.move(snake.direction);
    // 检查蛇头是否碰到食物
    const head = snake.segments[0];
    if (head.x === food.x && head.y === food.y) {
        food.relocate(snake); // 重新生成食物位置
        scoreBoard.updateScore(); // 更新得分
    } else {
        snake.removeTail(); // 移除尾部的最后一个段落
    }
    // 检查蛇头是否碰到自己身体
    if (snake.checkCollisionWithSelf()) {
        clearInterval(gameLoop); // 停止游戏
        alert("游戏结束，你吃到了自己！"); // 弹出提示
    }
}

const gameLoop = window.setInterval(drawGame, 200); // 每200毫秒更新一次画布


// 处理键盘事件
function handleKeyDown(event: KeyboardEvent) {
    const key = event.key;
    if (key === "ArrowLeft") {
        snake.changeDirection(Direction.Left);
    } else if (key === "ArrowRight") {
        snake.changeDirection(Direction.Right);
    } else if (key === "ArrowUp") {
        snake.changeDirection(Direction.Up);
    } else if (key === "ArrowDown") {
        snake.changeDirection(Direction.Down);
    }
}

window.addEventListener("keydown", handleKeyDown);