/*
开始之前，先试试：
chrome://dino/
https://jakesgordon.com/games/tetris/
*/ 

const canvas = document.querySelector("#myCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

console.log("Canvas size:", canvas.width, canvas.height);

// 改变画布大小
canvas.width = 400;
canvas.height = 400;

console.log("Canvas size修改后:", canvas.width, canvas.height);

// 绘制一条线
ctx.moveTo(0, 0);
ctx.lineTo(80, 80);
ctx.stroke()

// 绘制一个矩形
ctx.fillStyle = "red";
ctx.fillRect(100, 100, 50, 50);
ctx.strokeStyle = "black";
ctx.strokeRect(100, 100, 50, 50);


// 捕获键盘输入 - 上下左右
function handleKeyDown(event: KeyboardEvent) {
    console.log(event.key);
}

window.addEventListener("keydown", handleKeyDown);
