[← 返回首页](../readme.md)

# 第 13 章：贪吃蛇游戏——面向对象入门

通过制作一款经典贪吃蛇游戏，系统学习面向对象编程（OOP）思想，掌握 HTML5 Canvas 2D 绘图，并了解 BOM 的 `localStorage` API。

项目以 **9 个递进步骤**构建：从最简单的 Canvas 绘图开始，逐步引入 class、enum、游戏循环、碰撞检测，最终完成一个带持久化最高分的完整游戏。

## 技术栈

- **TypeScript**（编译为 JS 在浏览器运行）
- **HTML5 Canvas 2D API**
- **BOM `localStorage`**（数据持久化）
- 无任何框架或外部依赖

## 项目结构

```
13_snake_game/
  codes/
    01_snake/ ~ 09_snake/  ← 9 个递进步骤，每步均可独立运行
      index.html           ← 页面（引用 script.js）
      script.ts            ← TypeScript 源码
      script.js            ← 编译产物（直接提供，可直接运行）
      style.css
      tsconfig.json
  practice/                ← 练习目录
    index.html             ← 页面（完整，无需修改）
    style.css              ← 样式（完整，无需修改）
    tsconfig.json
    script.ts              ← 骨架代码，填写 TODO 完成游戏
```

## 9 步构建路线图

| 步骤                                  | 核心内容        | 关键知识点                                |
| ------------------------------------- | --------------- | ----------------------------------------- |
| [Step 01](./codes/01_snake/readme.md) | 认识 Canvas     | getContext、fillRect、strokeRect、keydown |
| [Step 02](./codes/02_snake/readme.md) | 键盘控制红点    | interface Point、重绘模式、wrap-around    |
| [Step 03](./codes/03_snake/readme.md) | Class 重构      | class Snake、enum Direction、switch       |
| [Step 04](./codes/04_snake/readme.md) | 游戏循环 + 食物 | setInterval、Food 类、防反向逻辑          |
| [Step 05](./codes/05_snake/readme.md) | 多节身体        | segments 数组、unshift + pop 移动算法     |
| [Step 06](./codes/06_snake/readme.md) | 吃食物增长      | removeTail()、Array.some()、碰撞检测      |
| [Step 07](./codes/07_snake/readme.md) | 自撞游戏结束    | checkCollisionWithSelf()、clearInterval   |
| [Step 08](./codes/08_snake/readme.md) | 计分板          | ScoreBoard 类、DOM 更新、textContent      |
| [Step 09](./codes/09_snake/readme.md) | 最高分持久化    | localStorage.getItem / setItem            |

## 练习

[`practice/`](./practice/readme.md) 目录提供了完整游戏的骨架代码，保留类结构和方法签名，实现体替换为 TODO 注释。建议按 9 步路线图顺序逐步填充，完成后与 `codes/09_snake/script.ts` 对照。

```bash
cd practice
tsc -w       # 监视编译，保存后直接刷新浏览器查看效果
```

## 如何运行

每个步骤目录内已包含编译好的 `script.js`，可直接用浏览器打开 `index.html` 运行。

如需修改 TypeScript 源码，在对应目录执行：

```bash
tsc -w    # 开启监视模式，保存时自动编译
```

## 最终成果

![贪吃蛇](./assets/snake.png)
