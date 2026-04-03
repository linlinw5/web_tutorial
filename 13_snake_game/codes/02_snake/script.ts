// The purpose of this project is to create a black canvas with a red dot
// This red dot can be moved by arrow keys
// When the red dot reaches the edge, it reappears from the other side

const canvas = document.querySelector("#myCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const unit = 20;

interface Point {
    x: number;
    y: number;
    fillStyle: string;
    strokeStyle: string;
}

canvas.width = 400;
canvas.height = 400;

let redDot: Point = {
    x: 100,
    y: 100,
    fillStyle: "red",
    strokeStyle: "white"
};


function drawDot(dot: Point) {
    // Set canvas background to black
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Draw a dot
    ctx.fillStyle = dot.fillStyle;
    ctx.fillRect(dot.x, dot.y, unit, unit);
    ctx.strokeStyle = dot.strokeStyle;
    ctx.strokeRect(dot.x, dot.y, unit, unit);
}
drawDot(redDot);


function handleKeyDown(event: KeyboardEvent) {
    const key = event.key;
    if (key === "ArrowLeft") {
        console.log("Move Left");
        redDot.x = redDot.x - unit;
        if (redDot.x < 0) {
            redDot.x = canvas.width - unit; // Appear from the right
        }
        drawDot(redDot);
    }
    else if (key === "ArrowRight") {
        console.log("Move Right");
        redDot.x = redDot.x + unit;
        if (redDot.x >= canvas.width) {
            redDot.x = 0; // Appear from the left
        }
        drawDot(redDot);
    }
}

window.addEventListener("keydown", handleKeyDown);