"use strict";
// 本项目目的是建一个黑色的画布，画布中有一个红点
// 这个红点可以通过键盘的上下左右键来移动
// 当红点移动到画布边缘时，如果继续按下去，红点会从另一边出现
// 用class思想实现
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
    move(direction) {
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
        this.draw(); // 移动后重新绘制点
    }
}
let redDot = new Point(0, 0, "red", "white");
redDot.draw();
function handleKeyDown(event) {
    const key = event.key;
    if (key === "ArrowLeft") {
        redDot.move(Direction.Left);
    }
    else if (key === "ArrowRight") {
        redDot.move(Direction.Right);
    }
    else if (key === "ArrowUp") {
        redDot.move(Direction.Up);
    }
    else if (key === "ArrowDown") {
        redDot.move(Direction.Down);
    }
}
window.addEventListener("keydown", handleKeyDown);
