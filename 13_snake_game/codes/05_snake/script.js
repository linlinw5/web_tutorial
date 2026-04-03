"use strict";
// Now change the red dot to a snake
// The snake head is red and the body is blue; initially, the snake has one red head and two blue body parts
// The snake moves right by default; the user can control its direction using arrow keys
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
  // Constructor
  constructor(x, y, headstyle = "red", bodystyle = "lightblue", strokeStyle = "white", initLength = 3) {
    this.segments = [];
    this.direction = Direction.Left; // Move left by default
    for (let i = 0; i < initLength; i++) {
      this.segments.push({
        x: x + i * unit,
        y: y,
        fillStyle: i === 0 ? headstyle : bodystyle,
        strokeStyle: strokeStyle,
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
    // Calculate new snake head position based on direction
    switch (direction) {
      case Direction.Left:
        newHead = {
          x: currentHead.x - unit,
          y: currentHead.y,
          fillStyle: currentHead.fillStyle,
          strokeStyle: currentHead.strokeStyle,
        };
        if (newHead.x < 0) {
          newHead.x = canvas.width - unit; // Appear from the right
        }
        break;
      case Direction.Right:
        newHead = {
          x: currentHead.x + unit,
          y: currentHead.y,
          fillStyle: currentHead.fillStyle,
          strokeStyle: currentHead.strokeStyle,
        };
        if (newHead.x >= canvas.width) {
          newHead.x = 0; // Appear from the left
        }
        break;
      case Direction.Up:
        newHead = {
          x: currentHead.x,
          y: currentHead.y - unit,
          fillStyle: currentHead.fillStyle,
          strokeStyle: currentHead.strokeStyle,
        };
        if (newHead.y < 0) {
          newHead.y = canvas.height - unit; // Appear from the bottom
        }
        break;
      case Direction.Down:
        newHead = {
          x: currentHead.x,
          y: currentHead.y + unit,
          fillStyle: currentHead.fillStyle,
          strokeStyle: currentHead.strokeStyle,
        };
        if (newHead.y >= canvas.height) {
          newHead.y = 0; // Appear from the top
        }
        break;
    }
    currentHead.fillStyle = firstBody.fillStyle; // Change current head to body color
    this.segments.unshift(newHead); // Add new position to the head
    this.segments.pop(); // Remove the last segment from the tail
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
// Create snake and food instances
let snake = new Snake(0, 0);
let food = new Food();
// Draw game
function drawGame() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  food.draw();
  snake.draw();
  snake.move(snake.direction);
}
window.setInterval(drawGame, 200); // Update canvas every 200 milliseconds
// Handle keyboard events
function handleKeyDown(event) {
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
