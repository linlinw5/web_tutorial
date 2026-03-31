[← 返回章节首页](../../readme.md)

# Step 01：认识 Canvas

了解 `<canvas>` 元素的基本用法：获取上下文、修改画布尺寸、绘制图形，以及捕获键盘事件。

## Canvas 基础

`<canvas>` 是 HTML5 引入的绘图元素，默认尺寸 300×150 px。通过 `getContext("2d")` 获取二维绘图上下文。

目前支持的上下文类型：

```typescript
const ctx2d = canvas.getContext("2d");           // 二维绘图
const gl    = canvas.getContext("webgl");         // WebGL 1.0
const gl2   = canvas.getContext("webgl2");        // WebGL 2.0
const bmp   = canvas.getContext("bitmaprenderer");
const webgpu = canvas.getContext("webgpu");       // 新兴 GPU 编程 API
```

## 本步骤代码要点

```typescript
const canvas = document.querySelector("#myCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

// 修改画布大小
canvas.width = 400;
canvas.height = 400;

// 绘制一条线
ctx.moveTo(0, 0);
ctx.lineTo(80, 80);
ctx.stroke();

// 绘制填充矩形 + 描边矩形
ctx.fillStyle = "red";
ctx.fillRect(100, 100, 50, 50);
ctx.strokeStyle = "black";
ctx.strokeRect(100, 100, 50, 50);

// 捕获键盘事件
function handleKeyDown(event: KeyboardEvent) {
    console.log(event.key);
}
window.addEventListener("keydown", handleKeyDown);
```

## 关键知识点

| 方法 | 说明 |
|---|---|
| `canvas.getContext("2d")` | 获取 2D 绘图上下文 |
| `ctx.fillRect(x, y, w, h)` | 绘制填充矩形 |
| `ctx.strokeRect(x, y, w, h)` | 绘制描边矩形（空心） |
| `ctx.fillStyle` / `ctx.strokeStyle` | 设置填充色 / 描边色 |
| `event.key` | 获取按下的键名，如 `"ArrowLeft"` |

## 如何运行

```bash
cd 01_snake
tsc          # 将 script.ts 编译为 script.js
# 用浏览器打开 index.html
```

或者开启监视模式：

```bash
tsc -w
```
