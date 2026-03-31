# 案例一：通过 CDN 引入 Tailwind CSS

> 官方文档：https://tailwindcss.com/docs/installation/play-cdn

## 使用方式

无需安装任何包，在 `<head>` 中加入一行 `<script>` 即可：

```html
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
```

之后可以直接在 HTML 元素上使用所有 Tailwind 工具类：

```html
<p class="text-red-500 text-2xl bg-green-400">Hello Tailwind</p>
```

## 启动方式

直接用浏览器打开 `index.html`，无需任何命令。

## 适用场景

- 快速体验 Tailwind 工具类
- 原型验证与演示

> **注意：** CDN 方式会在浏览器中实时解析所有 Tailwind 类，性能不适合生产环境。正式项目请使用 Tailwind CLI 本地编译。
