/*
Before starting, try these:
chrome://dino/
https://jakesgordon.com/games/tetris/
*/ 

const canvas = document.querySelector("#myCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

console.log("Canvas size:", canvas.width, canvas.height);

// Change canvas size
canvas.width = 400;
canvas.height = 400;

console.log("Canvas size after modification:", canvas.width, canvas.height);

// Draw a line
ctx.moveTo(0, 0);
ctx.lineTo(80, 80);
ctx.stroke()

// Draw a rectangle
ctx.fillStyle = "red";
ctx.fillRect(100, 100, 50, 50);
ctx.strokeStyle = "black";
ctx.strokeRect(100, 100, 50, 50);


// Capture keyboard input - arrow keys
function handleKeyDown(event: KeyboardEvent) {
    console.log(event.key);
}

window.addEventListener("keydown", handleKeyDown);
