[← 返回章节首页](../../readme.md)

# Step 04：游戏循环 + Food 类

让蛇**自动移动**，用 `setInterval` 驱动游戏循环；新增 `Food` 类，食物随机出现在画布上。

## 本步骤新增内容

- `Food` 类：随机坐标生成（`relocate()`），初始化时自动调用
- `Snake.direction` 属性：记录当前运动方向，默认向右
- `Snake.changeDirection()`：防止直接 180° 反向
- `window.setInterval(drawGame, 100)`：游戏主循环

## Food 类

```typescript
class Food {
    x: number;
    y: number;

    constructor(...) {
        this.relocate(); // 初始化时随机生成位置
    }

    relocate() {
        // canvas 400px / unit 20px = 20 格
        // Math.floor(Math.random() * 20) 得到 0~19 的整数
        // 乘以 unit 得到 0, 20, 40, ..., 380
        this.x = Math.floor(Math.random() * (canvas.width / unit)) * unit;
        this.y = Math.floor(Math.random() * (canvas.height / unit)) * unit;
    }
}
```

## 防反向逻辑

```typescript
changeDirection(newDirection: Direction) {
    if (this.direction === Direction.Left  && newDirection === Direction.Right) return;
    if (this.direction === Direction.Right && newDirection === Direction.Left)  return;
    if (this.direction === Direction.Up    && newDirection === Direction.Down)  return;
    if (this.direction === Direction.Down  && newDirection === Direction.Up)    return;
    this.direction = newDirection;
}
```

蛇不能直接掉头——如果当前向左，按右键无效。

## 游戏主循环

```typescript
function drawGame() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height); // 清空
    food.draw();
    snake.draw();
    snake.move(snake.direction); // 每帧自动前进一格
}

window.setInterval(drawGame, 100); // 每 100ms 执行一次
```

`setInterval` 替代了 Step 03 中靠按键才触发的手动移动，蛇从此会自己走。
