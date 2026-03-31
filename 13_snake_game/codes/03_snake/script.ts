// 本项目目的是建一个黑色的画布，画布中有一个红点
// 这个红点可以通过键盘的上下左右键来移动
// 当红点移动到画布边缘时，如果继续按下去，红点会从另一边出现
// 用class思想实现

const canvas = document.querySelector("#myCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const unit = 20;

canvas.width = 400;
canvas.height = 400;

// 定义方向的枚举
// 这样可以让代码更清晰，避免使用字符串
// 例如：redDot.move(Direction.Left) 比 redDot.move("Left") 更清晰，而且不会出现笔误，因为ts会检查枚举值
// 如果使用字符串，可能会写错，比如写成 "left" 而不是 "Left"
enum Direction {
    Left = "Left",
    Right = "Right",
    Up = "Up",
    Down = "Down"
}

class Snake {
    x: number;
    y: number;
    fillStyle: string;
    strokeStyle: string;

    // 构造函数
    constructor(x: number, y: number, fillStyle: string, strokeStyle: string) {
        this.x = x;
        this.y = y;
        this.fillStyle = fillStyle;
        this.strokeStyle = strokeStyle;
    }
    
    draw() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = this.fillStyle;
        ctx.fillRect(this.x, this.y, unit, unit);
        ctx.strokeStyle = this.strokeStyle;
        ctx.strokeRect(this.x, this.y, unit, unit);
    }

    move(direction: Direction) {
        // 可以用if else，也可以用switch
        // 这里用switch
        switch (direction) {
            case Direction.Left:
                this.x -= unit;
                if (this.x < 0) {
                    this.x = canvas.width - unit; // 从右边出现
                }
                break;
            case Direction.Right:
                this.x += unit;
                if (this.x >= canvas.width) {
                    this.x = 0; // 从左边出现
                }
                break;
            case Direction.Up:
                this.y -= unit;
                if (this.y < 0) {
                    this.y = canvas.height - unit; // 从下边出现
                }
                break;
            case Direction.Down:
                this.y += unit;
                if (this.y >= canvas.height) {
                    this.y = 0; // 从上边出现
                }
                break;
        }
        this.draw();  // 移动后重新绘制点
    }
}

let snake: Snake = new Snake(0, 0, "red", "white");
snake.draw();


function handleKeyDown(event: KeyboardEvent) {
    const key = event.key;
    if (key === "ArrowLeft") {
        snake.move(Direction.Left);
    } else if (key === "ArrowRight") {
        snake.move(Direction.Right);
    } else if (key === "ArrowUp") {
        snake.move(Direction.Up);
    } else if (key === "ArrowDown") {
        snake.move(Direction.Down);
    }
}

window.addEventListener("keydown", handleKeyDown);