// Let the snake move on its own; the user can control its direction using arrow keys
// Design a new Food class; Food will appear randomly on the canvas

const canvas = document.querySelector("#myCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const unit = 20;

canvas.width = 400;
canvas.height = 400;

enum Direction {
  Left = "Left",
  Right = "Right",
  Up = "Up",
  Down = "Down",
}

class Snake {
  x: number;
  y: number;
  fillStyle: string;
  strokeStyle: string;
  direction: Direction = Direction.Right; // Move right by default

  // Constructor
  constructor(x: number, y: number, fillStyle: string, strokeStyle: string) {
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

  move(direction: Direction) {
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

  changeDirection(newDirection: Direction) {
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
  x: number;
  y: number;
  fillStyle: string;
  strokeStyle: string;
  // Constructor
  constructor(x: number = 0, y: number = 0, fillStyle: string = "yellow", strokeStyle: string = "white") {
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
let snake: Snake = new Snake(0, 0, "red", "white");
let food: Food = new Food();

// Draw game
function drawGame() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  food.draw();

  snake.draw();
  snake.move(snake.direction);
}

window.setInterval(drawGame, 100); // Update canvas every 100 milliseconds

// Handle keyboard events
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
