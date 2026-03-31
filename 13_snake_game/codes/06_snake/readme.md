[← 返回章节首页](../../readme.md)

# Step 06：吃食物 + 身体增长

蛇头碰到食物时身体增长 1 节，食物重新随机生成，且保证不落在蛇身上。

## 关键改造：`move()` 不再直接 pop

Step 05 中 `move()` 末尾直接调用 `this.segments.pop()` 去掉尾巴。
Step 06 把这一步拆出来：

```typescript
// move() 里注释掉了 pop：
// this.segments.pop();

// 新增独立方法：
removeTail() {
    this.segments.pop();
}
```

在游戏循环中根据是否吃到食物来决定要不要调用 `removeTail()`：

```typescript
function drawGame() {
    // ...
    snake.move(snake.direction);
    const head = snake.segments[0];

    if (head.x === food.x && head.y === food.y) {
        food.relocate(snake); // 吃到食物：不移除尾巴 → 身体变长 1 节
    } else {
        snake.removeTail();   // 没吃到：移除尾巴 → 长度不变
    }
}
```

## 食物不落在蛇身上

```typescript
relocate(snake?: Snake) {
    let isOnSnake = true;
    while (isOnSnake) {
        this.x = Math.floor(Math.random() * (canvas.width / unit)) * unit;
        this.y = Math.floor(Math.random() * (canvas.height / unit)) * unit;
        // Array.some()：只要有一个节点坐标与食物重合，就重新生成
        isOnSnake = snake?.segments.some(
            seg => seg.x === this.x && seg.y === this.y
        ) || false;
    }
}
```

`Array.some()` 找到满足条件的元素就立即返回 `true`，不遍历全部——用在碰撞检测上很合适。

## 增长原理小结

```
吃到食物前：[头] [身] [身] [尾]
move() 后：  [新头] [头→身] [身] [身] [尾]   ← unshift 插入新头
不调用 pop：  [新头] [头→身] [身] [身] [尾]   ← 尾巴保留，身体 +1
```
