[← 返回章节首页](../../readme.md)

# Step 03：用 Class 重构 + TypeScript enum

将 Step 02 的过程式代码改写为面向对象风格，引入 `enum Direction` 让方向表达更安全。

## 本步骤新增内容

- `class Snake`：封装坐标、颜色、绘制、移动逻辑
- `enum Direction`：TypeScript 枚举，替代裸字符串
- 四方向键盘响应改为调用 `snake.move(Direction.Left)` 等

## enum Direction

```typescript
enum Direction {
    Left  = "Left",
    Right = "Right",
    Up    = "Up",
    Down  = "Down"
}
```

使用枚举的好处：
- 类型安全——传错方向时 TypeScript 编译报错
- 避免拼写错误（`"left"` vs `"Left"`）
- 代码可读性更强（`Direction.Left` 比 `"Left"` 更明确）

## class Snake

```typescript
class Snake {
    x: number;
    y: number;
    fillStyle: string;
    strokeStyle: string;

    constructor(x: number, y: number, fillStyle: string, strokeStyle: string) { ... }

    draw() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height); // 清空画布
        ctx.fillStyle = this.fillStyle;
        ctx.fillRect(this.x, this.y, unit, unit);
    }

    move(direction: Direction) {
        switch (direction) {
            case Direction.Left:
                this.x -= unit;
                if (this.x < 0) this.x = canvas.width - unit;
                break;
            // Right / Up / Down 同理...
        }
        this.draw(); // 移动后立刻重绘
    }
}
```

## 与 Step 02 的对比

| | Step 02 | Step 03 |
|---|---|---|
| 数据 | 裸 `Point` 对象 | `Snake` class 实例 |
| 移动 | 散落在事件回调中 | 封装在 `snake.move()` |
| 方向 | 字符串 `"ArrowLeft"` | `enum Direction` |
| 绘制 | 独立函数 `drawDot()` | class 方法 `snake.draw()` |
