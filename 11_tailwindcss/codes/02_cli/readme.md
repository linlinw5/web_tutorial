# 案例二：使用 Tailwind CLI 本地编译

> 官方文档：https://tailwindcss.com/docs/installation/tailwind-cli

## 启动方式

```bash
npm install
npm run dev
# 用浏览器打开 public/index.html
```

`npm run dev` 实际执行：

```bash
npx @tailwindcss/cli -i ./public/css/input.css -o ./public/css/output.css --watch
```

监听 `input.css` 的变动，自动重新编译并更新 `output.css`。

## 从零搭建步骤

```bash
npm init -y
npm install tailwindcss @tailwindcss/cli
```

创建以下文件和目录：

```
public/
  css/
    input.css    ← 你写的 Tailwind 配置
  index.html
```

**`input.css`** 最基础只需一行：

```css
@import "tailwindcss";
```

**`package.json`** 加入 dev 脚本：

```json
"scripts": {
    "dev": "npx @tailwindcss/cli -i ./public/css/input.css -o ./public/css/output.css --watch"
}
```

**`index.html`** 引入编译后的输出文件：

```html
<link rel="stylesheet" href="./css/output.css">
```

## input.css 进阶写法

```css
@import "tailwindcss";

/* 用 @apply 封装常用组合，定义自己的 class */
.btn-primary {
    @apply py-2 px-4 bg-blue-700 hover:bg-blue-500 text-white rounded cursor-pointer;
}

/* 用 @theme 扩展自定义颜色体系 */
@theme {
    --color-brand-primary: #00FF00;
    --color-brand-secondary: #FF0000;
}
```

定义后即可在 HTML 中直接使用 `class="btn-primary"` 或 `class="text-brand-primary"`。
