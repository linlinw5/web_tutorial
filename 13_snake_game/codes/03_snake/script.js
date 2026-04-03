"use strict";
// The purpose of this project is to create a black canvas with a red dot
// This red dot can be moved by arrow keys
// When the red dot reaches the edge, it reappears from the other side
// Implemented using class concept
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
    // Constructor
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
        // You can use if else or switch
        // Using switch here
        switch (direction) {
            case Direction.Left:
                this.x -= unit;
                if (this.x < 0) {
                    this.x = canvas.width - unit; // Appear from the right
                }
                break;
            case Direction.Right:
                this.x += unit;
                if (this.x >= canvas.width) {
                    this.x = 0; // Appear from the left
                }
                break;
            case Direction.Up:
                this.y -= unit;
                if (this.y < 0) {
                    this.y = canvas.height - unit; // Appear from the bottom
                }
                break;
            case Direction.Down:
                this.y += unit;
                if (this.y >= canvas.height) {
                    this.y = 0; // Appear from the top
                }
                break;
        }
        this.draw(); // Redraw the dot after moving
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
