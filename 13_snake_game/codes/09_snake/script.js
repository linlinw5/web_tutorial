"use strict";
// Now save the highest score to localStorage
// To preserve the highest score after page refresh
const canvas = document.querySelector("#myCanvas");
const ctx = canvas.getContext("2d");
const unit = 20;
const myScore = document.querySelector("#myScore");
const highestScore = document.querySelector("#highestScore");
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
        // Calculate new snake head position based on direction
        switch (direction) {
            case Direction.Left:
                newHead = { x: currentHead.x - unit, y: currentHead.y, fillStyle: currentHead.fillStyle, strokeStyle: currentHead.strokeStyle };
                if (newHead.x < 0) {
                    newHead.x = canvas.width - unit; // Appear from the right
                }
                break;
            case Direction.Right:
                newHead = { x: currentHead.x + unit, y: currentHead.y, fillStyle: currentHead.fillStyle, strokeStyle: currentHead.strokeStyle };
                if (newHead.x >= canvas.width) {
                    newHead.x = 0; // Appear from the left
                }
                break;
            case Direction.Up:
                newHead = { x: currentHead.x, y: currentHead.y - unit, fillStyle: currentHead.fillStyle, strokeStyle: currentHead.strokeStyle };
                if (newHead.y < 0) {
                    newHead.y = canvas.height - unit; // Appear from the bottom
                }
                break;
            case Direction.Down:
                newHead = { x: currentHead.x, y: currentHead.y + unit, fillStyle: currentHead.fillStyle, strokeStyle: currentHead.strokeStyle };
                if (newHead.y >= canvas.height) {
                    newHead.y = 0; // Appear from the top
                }
                break;
        }
        currentHead.fillStyle = firstBody.fillStyle; // Change current head to body color
        this.segments.unshift(newHead); // Add new position to the head
        // this.segments.pop(); // Remove the last segment from the tail
    }
    removeTail() {
        this.segments.pop(); // Remove the last segment from the tail
    }
    changeDirection(newDirection) {
        // Ensure the snake cannot move directly backwards
        // If moving left, cannot directly move right; if moving right, cannot directly move left
        // If moving up, cannot directly move down; if moving down, cannot directly move up
        if (this.direction === Direction.Left && newDirection === Direction.Right)
            return; // Cannot turn directly from left to right
        if (this.direction === Direction.Right && newDirection === Direction.Left)
            return; // Cannot turn directly from right to left
        if (this.direction === Direction.Up && newDirection === Direction.Down)
            return; // Cannot turn directly from up to down
        if (this.direction === Direction.Down && newDirection === Direction.Up)
            return; // Cannot turn directly from down to up
        // If not moving backwards, allow direction change
        this.direction = newDirection;
    }
    checkCollisionWithSelf() {
        const head = this.segments[0];
        // Check if snake head collides with other body parts
        return this.segments.slice(1).some(seg => seg.x === head.x && seg.y === head.y);
        // Slice from index 1, skip the head (index 0), take only the body parts
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
    relocate(snake) {
        // Ensure food does not generate on the snake body
        let isOnSnake = true;
        while (isOnSnake) {
            this.x = Math.floor(Math.random() * (canvas.width / unit)) * unit;
            this.y = Math.floor(Math.random() * (canvas.height / unit)) * unit;
            isOnSnake = (snake === null || snake === void 0 ? void 0 : snake.segments.some(seg => seg.x === this.x && seg.y === this.y)) || false; // If snake exists, check if food position is on the snake body
        }
    }
}
class ScoreBoard {
    constructor(currentScore = 0, highScore = 0) {
        // Get the highest score from localStorage
        const storedHighScore = window.localStorage.getItem("highScore");
        this.highScore = storedHighScore ? parseInt(storedHighScore) : highScore; // If there is a stored highest score, use it; otherwise use the passed value
        this.currentScore = currentScore;
    }
    draw() {
        myScore.textContent = this.currentScore.toString();
        highestScore.textContent = this.highScore.toString();
    }
    updateScore() {
        this.currentScore += 10; // Every time you eat food, score increases by 10
        if (this.currentScore > this.highScore) {
            this.highScore = this.currentScore; // Update highest score
            window.localStorage.setItem("highScore", this.highScore.toString()); // Store the highest score to localStorage
        }
        this.draw(); // Update score board display
    }
}
// Create snake and food instances
let snake = new Snake(0, 0);
let food = new Food();
let scoreBoard = new ScoreBoard();
// Initialize score board
scoreBoard.draw();
// Draw game
function drawGame() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    food.draw();
    snake.draw();
    snake.move(snake.direction);
    // Check if snake head touches food
    const head = snake.segments[0];
    if (head.x === food.x && head.y === food.y) {
        food.relocate(snake); // Regenerate food position
        scoreBoard.updateScore(); // Update score
    }
    else {
        snake.removeTail(); // Remove the last segment from the tail
    }
    // Check if snake head collides with its own body
    if (snake.checkCollisionWithSelf()) {
        clearInterval(gameLoop); // Stop game
        alert("Game Over，You bit yourself！"); // Show alert
    }
}
const gameLoop = window.setInterval(drawGame, 200); // Update canvas every 200 milliseconds
// Handle keyboard events
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
