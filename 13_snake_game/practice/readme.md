[← 返回章节首页](../readme.md)

# 练习：从零实现贪吃蛇

按照 9 步路线图，在 `script.ts` 的骨架基础上逐步填充实现，完成一个带最高分持久化的完整贪吃蛇游戏。

## 文件说明

| 文件 | 说明 |
|---|---|
| `index.html` | 页面结构，无需修改 |
| `style.css` | 样式，无需修改 |
| `tsconfig.json` | TypeScript 配置，无需修改 |
| `script.ts` | **在此填写代码** |

## 建议实现顺序

1. 补全 `Direction` 枚举和 `Point` 接口
2. 实现 `Snake` 构造函数（初始化 segments）
3. 实现 `Snake.draw()`，确认蛇能在画布上显示
4. 实现 `Snake.move()` 和 `changeDirection()`，实现键盘控制
5. 实现 `Food` 类（draw + relocate）
6. 在 `drawGame()` 里加入吃食物逻辑（`removeTail` vs 不 pop）
7. 实现 `checkCollisionWithSelf()`，游戏结束
8. 实现 `ScoreBoard.draw()` 和 `updateScore()`
9. 在 `ScoreBoard` 构造函数中读取 `localStorage`，`updateScore()` 中写入

## 运行方式

```bash
tsc -w    # 监视模式，保存时自动编译为 script.js
# 用浏览器打开 index.html
```

参考实现见 [`../codes/09_snake/script.ts`](../codes/09_snake/script.ts)。
