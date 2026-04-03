const canvas = document.querySelector("#myCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const unit = 20;
const myScore = document.querySelector("#myScore") as HTMLDivElement;
const highestScore = document.querySelector("#highestScore") as HTMLDivElement;

canvas.width = 400;
canvas.height = 400;

// TODO: Define Direction enum (Left / Right / Up / Down)
enum Direction {
  // ...
}

// TODO: Define Point interface (x, y, fillStyle, strokeStyle)
interface Point {
  // ...
}

// ─────────────────────────────────────────
// Snake class
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
    initLength: number = 3,
  ) {
    // TODO: Use a for loop to initialize segments array
    // Index 0 is the head (headstyle), others are body (bodystyle)
  }

  draw() {
    // TODO: Traverse segments and draw each segment with ctx.fillRect / ctx.strokeRect
  }

  move(direction: Direction) {
    // TODO:
    // 1. Get current head segments[0] and first body segment segments[1]
    // 2. Calculate new head coordinates based on direction (with boundary wrap-around)
    // 3. Change current head color to body color
    // 4. unshift new head
    // （Do not pop here; external code decides whether to remove tail）
  }

  removeTail() {
    // TODO: Remove the last element of segments
  }

  changeDirection(newDirection: Direction) {
    // TODO: Prevent 180° reversal; update this.direction if valid
  }

  checkCollisionWithSelf(): boolean {
    // TODO: Return whether snake head collides with any body segment
    return false;
  }
}

// ─────────────────────────────────────────
// Food class
// ─────────────────────────────────────────
class Food {
  x: number = 0;
  y: number = 0;
  fillStyle: string;
  strokeStyle: string;

  constructor(fillStyle: string = "yellow", strokeStyle: string = "white") {
    this.fillStyle = fillStyle;
    this.strokeStyle = strokeStyle;
    this.relocate();
  }

  draw() {
    // TODO: Draw food square
  }

  relocate(snake?: Snake) {
    // TODO: Randomly generate coordinates; regenerate if overlapping with snake body (use while loop + Array.some)
  }
}

// ─────────────────────────────────────────
// ScoreBoard class
// ─────────────────────────────────────────
class ScoreBoard {
  currentScore: number;
  highScore: number;

  constructor(currentScore: number = 0) {
    // TODO: Read historical high score from localStorage (key: "highScore") and initialize this.highScore
    this.currentScore = currentScore;
    this.highScore = 0; // Replace with value from localStorage
  }

  draw() {
    // TODO: Write currentScore / highScore to corresponding DOM element textContent
  }

  updateScore() {
    // TODO: currentScore += 10; if it breaks the record, update highScore and write to localStorage; call draw()
  }
}

// ─────────────────────────────────────────
// Game main loop
// ─────────────────────────────────────────
const snake = new Snake(0, 0);
const food = new Food();
const scoreBoard = new ScoreBoard();
scoreBoard.draw();

function drawGame() {
  // 1. Clear canvas (black background)
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Draw food and snake
  food.draw();
  snake.draw();
  snake.move(snake.direction);

  // 3. TODO: Check if snake head touches food
  //    - Yes: food.relocate(snake), scoreBoard.updateScore()
  //    - No: snake.removeTail()

  // 4. TODO: Check for self-collision
  //    - Hit itself: clearInterval(gameLoop), alert Game Over
}

const gameLoop = window.setInterval(drawGame, 200);

// ─────────────────────────────────────────
// Keyboard events
// ─────────────────────────────────────────
function handleKeyDown(event: KeyboardEvent) {
  // TODO: Map ArrowLeft/Right/Up/Down to snake.changeDirection()
}

window.addEventListener("keydown", handleKeyDown);
