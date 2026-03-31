[← 返回章节首页](../../readme.md)

# Step 02：键盘控制红点移动

用过程式写法实现：黑色画布上一个红色方块，通过键盘上下左右键移动，到达边缘时从对面穿出（wrap-around）。

## 本步骤新增内容

- `interface Point`：描述可绘制方块的位置与颜色
- `drawDot()`：每次移动前先清空画布，再重新绘制
- 四方向键盘响应 + 边缘穿越逻辑

## 核心代码

```typescript
interface Point {
    x: number;
    y: number;
    fillStyle: string;
    strokeStyle: string;
}

const unit = 20; // 每格 20px，与画布 400px 整除

let redDot: Point = { x: 100, y: 100, fillStyle: "red", strokeStyle: "white" };

function drawDot(dot: Point) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height); // 清空画布
    ctx.fillStyle = dot.fillStyle;
    ctx.fillRect(dot.x, dot.y, unit, unit);
}

function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "ArrowLeft") {
        redDot.x -= unit;
        if (redDot.x < 0) redDot.x = canvas.width - unit; // 从右边出现
    }
    else if (event.key === "ArrowRight") {
        redDot.x += unit;
        if (redDot.x >= canvas.width) redDot.x = 0;        // 从左边出现
    }
    drawDot(redDot);
}
```

## 设计要点

- **`unit = 20`**：画布 400px 恰好是 20 个格子，所有坐标都是 unit 的整数倍，避免对齐问题
- **重绘而非擦除**：每次移动都先 `fillRect` 整个黑色背景覆盖旧状态，再画新位置——贯穿整个游戏的绘制模式
- **wrap-around**：`x < 0` → 从右边出现；`x >= canvas.width` → 从左边出现，四个方向同理
