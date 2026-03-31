"use strict";
// 本项目目的是建一个黑色的画布，画布中有一个红点
// 红点默认自己会向右移动，用户可以通过键盘的上下左右键来控制红点的移动方向
// 新设计一个食物类，食物会随机出现在画布上
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
class Point {
    // 构造函数
    constructor(x, y, fillStyle, strokeStyle) {
        this.direction = Direction.Right; // 默认向右移动
        this.x = x;
        this.y = y;
        this.fillStyle = fillStyle;
        this.strokeStyle = strokeStyle;
    }
    draw() {
        ctx.fillStyle = this.fillStyle;
        ctx.fillRect(this.x, this.y, unit, unit);
        ctx.strokeStyle = this.strokeStyle;
        ctx.strokeRect(this.x, this.y, unit, unit);
    }
    move(direction) {
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
// 创建红点和食物实例
let redDot = new Point(0, 0, "red", "white");
let food = new Food();
// 绘制游戏
function drawGame() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    food.draw();
    redDot.draw();
    redDot.move(redDot.direction);
}
window.setInterval(drawGame, 100); // 每100毫秒更新一次画布
// 处理键盘事件
function handleKeyDown(event) {
    const key = event.key;
    if (key === "ArrowLeft") {
        redDot.changeDirection(Direction.Left);
    }
    else if (key === "ArrowRight") {
        redDot.changeDirection(Direction.Right);
    }
    else if (key === "ArrowUp") {
        redDot.changeDirection(Direction.Up);
    }
    else if (key === "ArrowDown") {
        redDot.changeDirection(Direction.Down);
    }
}
window.addEventListener("keydown", handleKeyDown);
