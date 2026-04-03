"use strict";
// The purpose of this project is to create a black canvas with a red dot
// The red dot moves right by default; the user can control its direction using arrow keys
// Design a new Food class; Food will appear randomly on the canvas
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
    this.direction = Direction.Right; // Move right by default
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
  }
  changeDirection(newDirection) {
    // Ensure the snake cannot move directly backwards
    // If moving left, cannot directly move right; if moving right, cannot directly move left
    // If moving up, cannot directly move down; if moving down, cannot directly move up
    if (this.direction === Direction.Left && newDirection === Direction.Right) return; // Cannot turn directly from left to right
    if (this.direction === Direction.Right && newDirection === Direction.Left) return; // Cannot turn directly from right to left
    if (this.direction === Direction.Up && newDirection === Direction.Down) return; // Cannot turn directly from up to down
    if (this.direction === Direction.Down && newDirection === Direction.Up) return; // Cannot turn directly from down to up
    // If not moving backwards, allow direction change
    this.direction = newDirection;
  }
}
class Food {
  // Constructor
  constructor(x = 0, y = 0, fillStyle = "yellow", strokeStyle = "white") {
    this.x = x;
    this.y = y;
    this.fillStyle = fillStyle;
    this.strokeStyle = strokeStyle;
    this.relocate(); // Generate random position on initialization
  }
  draw() {
    ctx.fillStyle = this.fillStyle;
    ctx.fillRect(this.x, this.y, unit, unit);
    ctx.strokeStyle = this.strokeStyle;
    ctx.strokeRect(this.x, this.y, unit, unit);
  }
  relocate() {
    // Generate random Food position
    // canvas.width / unit = 400 / 20 = 20
    // Math.random() * 20 range is [0, 20), i.e., 0 to 19.999...
    // Math.floor() rounds to 0, 1, 2, 3, ..., 19
    // After multiplying by unit: 0, 20, 40, 60, ..., 380
    this.x = Math.floor(Math.random() * (canvas.width / unit)) * unit;
    this.y = Math.floor(Math.random() * (canvas.height / unit)) * unit;
  }
}
// Create red dot and Food instances
let redDot = new Point(0, 0, "red", "white");
let food = new Food();
// Draw game
function drawGame() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  food.draw();
  redDot.draw();
  redDot.move(redDot.direction);
}
window.setInterval(drawGame, 100); // Update canvas every 100 milliseconds
// Handle keyboard events
function handleKeyDown(event) {
  const key = event.key;
  if (key === "ArrowLeft") {
    redDot.changeDirection(Direction.Left);
  } else if (key === "ArrowRight") {
    redDot.changeDirection(Direction.Right);
  } else if (key === "ArrowUp") {
    redDot.changeDirection(Direction.Up);
  } else if (key === "ArrowDown") {
    redDot.changeDirection(Direction.Down);
  }
}
window.addEventListener("keydown", handleKeyDown);
