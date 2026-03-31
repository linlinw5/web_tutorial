"use strict";
// 现在要把红点改成蛇
// 蛇头部是红色的，身体是蓝色的，初始时，蛇有一个红色的头部和两个蓝色的身体
// 蛇默认自己会向右移动，用户可以通过键盘的上下左右键来控制蛇的移动方向
const canvas = document.querySelector("#myCanvas");
const ctx = canvas.getContext("2d");
const unit = 20;
canvas.width = 400;
canvas.height = 400;
var Direction;
(function (Direction) {
    Direction["Left"] = "Left";
    Direction["Right"] = "Right";
    Direction["Up"] = "Up";
    Direction["Down"] = "Down";
})(Direction || (Direction = {}));
class Snake {
    // 构造函数
    constructor(x, y, headstyle = "red", bodystyle = "lightblue", strokeStyle = "white", initLength = 3) {
        this.segments = [];
        this.direction = Direction.Left; // 默认向左移动
        for (let i = 0; i < initLength; i++) {
            this.segments.push({
                x: x + i * unit,
                y: y,
                fillStyle: i === 0 ? headstyle : bodystyle,
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
    move(direction) {
        let currentHead = this.segments[0];
        let firstBody = this.segments[1];
        let newHead;
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
        this.segments.pop(); // 移除尾部的最后一个段落
    }
    changeDirection(newDirection) {
        // 确保不能直接反向移动
        // 如果当前向左，不能直接向右；如果当前向右，不能直接向左
        // 如果当前向上，不能直接向下；如果当前向下，不能直接向上
        if (this.direction === Direction.Left && newDirection === Direction.Right)
            return; // 不允许从左直接转右
        if (this.direction === Direction.Right && newDirection === Direction.Left)
            return; // 不允许从右直接转左
        if (this.direction === Direction.Up && newDirection === Direction.Down)
            return; // 不允许从上直接转下
        if (this.direction === Direction.Down && newDirection === Direction.Up)
            return; // 不允许从下直接转上
        // 如果不是反向移动，就允许改变方向
        this.direction = newDirection;
    }
}
class Food {
    // 构造函数
    constructor(x = 0, y = 0, fillStyle = "yellow", strokeStyle = "white") {
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
    relocate() {
        // 随机生成食物的位置
        // canvas.width / unit = 400 / 20 = 20
        // Math.random() * 20 的范围是 [0, 20)，即 0 到 19.999...
        // Math.floor() 取整后的范围是 0, 1, 2, 3, ..., 19
        // 乘以 unit 后得到：0, 20, 40, 60, ..., 380
        this.x = Math.floor(Math.random() * (canvas.width / unit)) * unit;
        this.y = Math.floor(Math.random() * (canvas.height / unit)) * unit;
    }
}
// 创建蛇和食物实例
let snake = new Snake(0, 0);
let food = new Food();
// 绘制游戏
function drawGame() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    food.draw();
    snake.draw();
    snake.move(snake.direction);
}
window.setInterval(drawGame, 200); // 每200毫秒更新一次画布
// 处理键盘事件
function handleKeyDown(event) {
    const key = event.key;
    if (key === "ArrowLeft") {
        snake.changeDirection(Direction.Left);
    }
    else if (key === "ArrowRight") {
        snake.changeDirection(Direction.Right);
    }
    else if (key === "ArrowUp") {
        snake.changeDirection(Direction.Up);
    }
    else if (key === "ArrowDown") {
        snake.changeDirection(Direction.Down);
    }
}
window.addEventListener("keydown", handleKeyDown);
