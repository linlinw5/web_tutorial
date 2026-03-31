[← 返回章节首页](../../readme.md)

# Step 09：localStorage 持久化最高分

利用 BOM 的 `localStorage` API，将最高分存入浏览器本地存储，页面刷新后仍然保留。

## localStorage 简介

`localStorage` 是浏览器提供的键值存储，数据跨页面刷新和关闭持久存在（除非手动清除）。

| 操作 | API |
|---|---|
| 读取 | `localStorage.getItem("key")` → `string \| null` |
| 写入 | `localStorage.setItem("key", value)` |
| 删除 | `localStorage.removeItem("key")` |
| 清空 | `localStorage.clear()` |

所有值都以**字符串**存储，读取后需要自行转换类型。

## ScoreBoard 改造

```typescript
class ScoreBoard {
    constructor(currentScore = 0, highScore = 0) {
        // 从 localStorage 读取上次保存的最高分
        const stored = window.localStorage.getItem("highScore");
        this.highScore    = stored ? parseInt(stored) : highScore;
        this.currentScore = currentScore;
    }

    updateScore() {
        this.currentScore += 10;
        if (this.currentScore > this.highScore) {
            this.highScore = this.currentScore;
            // 打破记录时立即写入 localStorage
            window.localStorage.setItem("highScore", this.highScore.toString());
        }
        this.draw();
    }
}
```

与 Step 08 相比，只改动了两处：
1. **构造函数**：初始化时从 `localStorage` 读取并恢复历史最高分
2. **`updateScore()`**：打破记录时调用 `setItem` 写入

调用方（游戏循环）无需任何修改。

## 完整游戏功能一览

至此，贪吃蛇游戏已具备全部核心功能：

| 功能 | 实现于 |
|---|---|
| Canvas 绘图 | Step 01 |
| 键盘控制移动 | Step 02 |
| 面向对象重构 + enum | Step 03 |
| 游戏循环 + 食物 | Step 04 |
| 多节身体 | Step 05 |
| 吃食物增长 | Step 06 |
| 自撞游戏结束 | Step 07 |
| 记分板 | Step 08 |
| 最高分持久化 | Step 09 |
