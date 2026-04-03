// Now add the functionality for the snake to eat Food
// When the snake head touches Food, the snake length increases by 1 and Food position regenerates randomly

const canvas = document.querySelector("#myCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const unit = 20;

canvas.width = 400;
canvas.height = 400;

enum Direction {
    Left = "Left",
    Right = "Right",
    Up = "Up",
    Down = "Down"
}

interface Point {
    x: number;
    y: number;
    fillStyle: string;
    strokeStyle: string;
}

class Snake {
    segments: Point[] = [];
    direction: Direction = Direction.Left; // Move left by default

    // Constructor
    constructor(x: number, y: number, headstyle: string = "red", bodystyle: string = "lightblue", strokeStyle: string = "white", initLength: number = 3) {
        for (let i = 0; i < initLength; i++) {
            this.segments.push({
                x: x + i * unit,
                y: y,
                fillStyle: i === 0 ? headstyle: bodystyle,
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

    move(direction: Direction) {
        let currentHead: Point = this.segments[0];
        let firstBody: Point = this.segments[1];
        let newHead: Point;

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

    changeDirection(newDirection: Direction) {
        // Ensure the snake cannot move directly backwards
        // If moving left, cannot directly move right; if moving right, cannot directly move left
        // If moving up, cannot directly move down; if moving down, cannot directly move up
        
        if (this.direction === Direction.Left && newDirection === Direction.Right) return; // Cannot turn directly from left to right
        if (this.direction === Direction.Right && newDirection === Direction.Left)  return; // Cannot turn directly from right to left
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
    relocate(snake?: Snake) {
        // Ensure food does not generate on the snake body
        let isOnSnake: Boolean = true;
        while (isOnSnake) {
            this.x = Math.floor(Math.random() * (canvas.width / unit)) * unit;
            this.y = Math.floor(Math.random() * (canvas.height / unit)) * unit;
            isOnSnake = snake?.segments.some(seg => seg.x === this.x && seg.y === this.y) || false; // If snake exists, check if food position is on the snake body
            // some() method checks if at least one element in the array satisfies the condition
            // If a matching element is found, return true immediately
            // If no elements match, return false
        }
    }
}

// Create snake and food instances
let snake: Snake  = new Snake(0, 0);
let food: Food = new Food();

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
    } else {
        snake.removeTail(); // Remove the last segment from the tail
    }
}

window.setInterval(drawGame, 200); // Update canvas every 200 milliseconds



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