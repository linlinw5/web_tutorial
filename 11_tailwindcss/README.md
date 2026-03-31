[← 返回首页](../readme.md)

# 第 11 章：Tailwind CSS

本章通过三个递进案例掌握 Tailwind CSS 的三种使用方式：

| 案例   | 目录               | 说明                                                |
| ------ | ------------------ | --------------------------------------------------- |
| 案例一 | `codes/01_cdn`     | 通过 CDN 引入，零配置，适合快速体验                 |
| 案例二 | `codes/02_cli`     | 使用 Tailwind CLI 本地编译，支持自定义类与主题      |
| 案例三 | `codes/03_express` | 完整开发环境：Express + TypeScript + EJS + Tailwind |

## 目录约定

```
11_tailwindcss/
  README.md
  codes/
    01_cdn/          ← 案例一：CDN 方式
    02_cli/          ← 案例二：Tailwind CLI
    03_express/      ← 案例三：Express + TypeScript + Tailwind
  practice/
    01_cdn/          ← 练习一
    02_cli/          ← 练习二
    03_express/      ← 练习三
```

---

## 11.1 案例一：通过 CDN 引入（零配置体验）

> 官方文档：https://tailwindcss.com/docs/installation/play-cdn

在 `<head>` 中加一个 `<script>` 标签即可使用所有 Tailwind 工具类，无需安装任何包：

```html
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
```

```html
<p class="text-red-500 text-2xl bg-green-400">Hello Tailwind</p>
```

**适合场景：** 临时体验、原型验证。生产项目应使用 CLI 本地编译，避免在浏览器中实时解析带来的性能开销。

**工作流：**

```bash
# 直接用浏览器打开 index.html，无需任何命令
```

---

## 11.2 案例二：Tailwind CLI 本地编译

> 官方文档：https://tailwindcss.com/docs/installation/tailwind-cli

### 11.2.1 安装与初始化

```bash
cd codes/02_cli
npm install
npm run dev
```

`npm run dev` 实际执行：

```bash
npx @tailwindcss/cli -i ./public/css/input.css -o ./public/css/output.css --watch
```

- `-i`：输入文件（你写的 CSS）
- `-o`：输出文件（Tailwind 编译生成，自动包含所有用到的工具类）
- `--watch`：监听文件变动，自动重新编译

在 HTML 中引入编译后的输出文件：

```html
<link rel="stylesheet" href="./css/output.css" />
```

### 11.2.2 `input.css` 的写法

```css
/* 引入 Tailwind 核心 */
@import "tailwindcss";

/* 用 @apply 封装常用组合，定义自己的 class */
.btn-primary {
  @apply py-2 px-4 bg-blue-700 hover:bg-blue-500 text-white rounded cursor-pointer;
}

/* 用 @theme 扩展颜色体系 */
@theme {
  --color-brand-primary: #00ff00;
  --color-brand-secondary: #ff0000;
}
```

- **`@apply`**：把多个工具类合并为一个自定义 class，避免 HTML 中堆叠大量类名
- **`@theme`**：声明自定义 CSS 变量，在模板中可直接用 `text-brand-primary`、`bg-brand-secondary` 等

### 11.2.3 响应式前缀

Tailwind 的响应式系统基于**移动优先（mobile-first）**：不带前缀的类始终生效，带前缀的类在对应断点以上生效。

| 前缀  | 断点     | 含义         |
| ----- | -------- | ------------ |
| `sm:` | ≥ 640px  | 小屏及以上   |
| `md:` | ≥ 768px  | 中屏及以上   |
| `lg:` | ≥ 1024px | 大屏及以上   |
| `xl:` | ≥ 1280px | 超大屏及以上 |

```html
<!-- 手机上 text-sm，中屏以上 text-xl -->
<h1 class="text-sm md:text-xl font-bold">我的网站</h1>
```

### 11.2.4 常用布局工具类

**Flexbox 布局：**

```html
<!-- 水平排列，左右两端对齐 -->
<div class="flex justify-between items-center">...</div>

<!-- 纵向排列，间距 16px -->
<div class="flex flex-col gap-4">...</div>

<!-- flex-grow 比例控制 -->
<div class="grow-1">占 1 份</div>
<div class="grow-2">占 2 份</div>
```

**典型页面布局（header + sidebar + main + footer）：**

```html
<body class="flex flex-col min-h-screen">
  <header class="bg-green-700 text-white p-4">...</header>

  <div class="flex flex-1">
    <aside class="w-64 bg-amber-300 p-4">...</aside>
    <main class="flex-1 p-4">...</main>
  </div>

  <footer class="bg-gray-800 text-white p-4">...</footer>
</body>
```

`min-h-screen` 保证页面至少撑满整个视口高度；`flex-1` 让 main 区域占满剩余空间。

---

## 11.3 案例三：Express + TypeScript + Tailwind 完整开发环境

### 11.3.1 `tsx`：跳过编译直接运行 TypeScript

普通开发流程需要先 `tsc` 编译再运行 `node`。

tsx（TypeScript Execute） 是一个用于在 Node.js 环境中直接运行 TypeScript 文件的工具。它基于 esbuild 构建，提供快速的 TypeScript 编译和执行能力，并支持现代模块系统。`tsx` 可以直接运行 `.ts` 文件：

```bash
# 全局安装一次即可
npm install -g tsx

# 直接运行（等同于 node index.js）
tsx ./src/index.ts

# 监听文件变动，自动重启（等同于 nodemon）
tsx watch ./src/index.ts
```

> 与上一章的 `tsc -w + nodemon` 方案相比，`tsx watch` 更简洁——省去了 `dist/` 目录和 `nodemon` 配置。代价是不做类型检查（只做转译）。两种方案都可用，选其一即可。

### 11.3.2 用 `concurrently` 并行运行两个 watch 进程

Express 服务器和 Tailwind 编译需要同时运行：

```json
"scripts": {
    "dev": "concurrently \"tsx watch ./src/index.ts\" \"npx @tailwindcss/cli -i ./public/css/input.css -o ./public/css/output.css --watch\"",
    "build": "tsc",
    "buildcss": "npx @tailwindcss/cli -i ./public/css/input.css -o ./public/css/output.css --minify"
}
```

- `dev`：开发模式，两个 watch 进程并行
- `build`：用 `tsc` 编译 TypeScript（生产部署时使用）
- `buildcss`：编译并压缩 CSS（`--minify`，生产部署时使用）

### 11.3.3 项目结构与启动

```bash
cd codes/03_express
npm install
npm run dev
# 访问 http://localhost:3000
```

```
03_express/
  src/
    index.ts          ← Express 入口
  views/
    index.ejs         ← EJS 模板，引用 /css/output.css
  public/
    css/
      input.css       ← 你写的 Tailwind 配置
      output.css      ← 编译生成，自动更新
  package.json
  tsconfig.json
```

EJS 模板中引入编译后的 CSS（通过 `express.static("public")` 托管）：

```ejs
<link rel="stylesheet" href="/css/output.css">
```

注意路径使用 `/css/output.css`（绝对路径），而不是 `./css/output.css`（相对路径），因为静态文件是通过 Express 路由托管的。
