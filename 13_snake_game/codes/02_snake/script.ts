// 本项目目的是建一个黑色的画布，画布中有一个红点
// 这个红点可以通过键盘的上下左右键来移动
// 当红点移动到画布边缘时，如果继续按下去，红点会从另一边出现

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
    // 将canvas背景设置为黑色
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // 画点点
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
            redDot.x = canvas.width - unit; // 从右边出现
        }
        drawDot(redDot);
    }
    else if (key === "ArrowRight") {
        console.log("Move Right");
        redDot.x = redDot.x + unit;
        if (redDot.x >= canvas.width) {
            redDot.x = 0; // 从左边出现
        }
        drawDot(redDot);
    }
}

window.addEventListener("keydown", handleKeyDown);