[← 返回章节首页](../../readme.md)

# Step 05：蛇有身体了

将蛇从单个方块扩展为有头有身体的多节结构：头部红色，身体蓝色，初始长度 3 节。

## 核心改造：`segments` 数组

```typescript
interface Point {
    x: number;
    y: number;
    fillStyle: string;
    strokeStyle: string;
}

class Snake {
    segments: Point[] = [];
    direction: Direction = Direction.Left; // 默认向左

    constructor(x, y, headstyle = "red", bodystyle = "lightblue",
                strokeStyle = "white", initLength = 3) {
        for (let i = 0; i < initLength; i++) {
            this.segments.push({
                x: x + i * unit,
                y: y,
                fillStyle: i === 0 ? headstyle : bodystyle, // 头部特殊颜色
                strokeStyle
            });
        }
    }
}
```

初始化时头部在最左侧（索引 0），其余节排在右边。

## 移动算法：unshift + pop

```typescript
move(direction: Direction) {
    const currentHead = this.segments[0];
    const firstBody   = this.segments[1];

    // 1. 根据方向计算新头部坐标（含 wrap-around）
    let newHead: Point = { ...currentHead, x: ..., y: ... };

    // 2. 当前头部变为身体颜色
    currentHead.fillStyle = firstBody.fillStyle;

    // 3. 新头部插入到数组最前面
    this.segments.unshift(newHead);

    // 4. 去掉尾部（蛇长度保持不变）
    this.segments.pop();
}
```

| 操作 | 效果 |
|---|---|
| `unshift(newHead)` | 在数组头部插入新头——蛇向前移动一格 |
| `pop()` | 去掉数组尾部——尾巴消失，整体长度不变 |

这两步合在一起，就实现了蛇的整体平移，不需要遍历修改每个节点的坐标。
