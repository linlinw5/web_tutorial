[← 返回章节首页](../../readme.md)

# Step 07：自撞检测 + 游戏结束

蛇头碰到自己身体时游戏结束，停止游戏循环并弹出提示。

## 新增：`checkCollisionWithSelf()`

```typescript
checkCollisionWithSelf(): boolean {
    const head = this.segments[0];
    // slice(1) 跳过索引 0（头部自身），只检查身体部分
    return this.segments.slice(1).some(
        seg => seg.x === head.x && seg.y === head.y
    );
}
```

## 游戏循环改造

```typescript
// 用变量保存 intervalId，以便事后 clear
const gameLoop = window.setInterval(drawGame, 200);

function drawGame() {
    // ... 移动、吃食物 ...

    if (snake.checkCollisionWithSelf()) {
        clearInterval(gameLoop); // 停止游戏循环
        alert("游戏结束，你吃到了自己！");
    }
}
```

之前直接 `window.setInterval(...)` 不保存返回值，就无法在事后停止定时器。
这一步把返回的 `intervalId` 存入 `gameLoop` 变量，供 `clearInterval()` 使用。

## 关键知识点

| | 说明 |
|---|---|
| `Array.slice(1)` | 返回从索引 1 开始的新数组，不修改原数组 |
| `setInterval()` 返回值 | `number` 类型的定时器 ID |
| `clearInterval(id)` | 传入 ID 停止对应的定时器 |
