# 案例三：Express + TypeScript + Tailwind CSS 开发环境

## 启动方式

```bash
npm install
npm run dev
# 访问 http://localhost:3000
```

## 前置：全局安装 tsx

`tsx` 可以直接运行 `.ts` 文件，无需先用 `tsc` 编译：

```bash
npm install -g tsx

# 验证安装
npm list -g
```

> 官方文档：https://tsx.is/

## 从零搭建步骤

**1. 安装依赖**

```bash
npm init -y
npm install express @types/express ejs @types/ejs
npm install tailwindcss @tailwindcss/cli
npm install concurrently
```

**2. 创建文件和目录**

```
src/index.ts
views/index.ejs
public/css/input.css
public/image/
```

**3. `package.json` 配置**

```json
{
  "type": "module",
  "scripts": {
    "dev": "concurrently \"tsx watch ./src/index.ts\" \"npx @tailwindcss/cli -i ./public/css/input.css -o ./public/css/output.css --watch\"",
    "build": "tsc",
    "buildcss": "npx @tailwindcss/cli -i ./public/css/input.css -o ./public/css/output.css --minify"
  }
}
```

- `dev`：并行运行 Express 服务器（tsx watch）和 Tailwind 编译器（--watch）
- `build`：生产环境用 `tsc` 编译 TypeScript
- `buildcss`：生产环境压缩 CSS（`--minify`）

**4. `src/index.ts`**

```typescript
import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', 'views');

app.get('/', (req, res) => {
    res.render('index.ejs', { title: 'Home Page' });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
```

**5. `views/index.ejs`** 引入编译后的 CSS

```html
<link rel="stylesheet" href="/css/output.css">
```

注意使用绝对路径 `/css/output.css`，因为静态文件通过 Express 路由托管。

**6. `public/css/input.css`**

```css
@import "tailwindcss";

.btn-primary {
    @apply px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600;
}
```

## `tsconfig.json` 参考

```json
{
    "compilerOptions": {
        "target": "es2020",
        "module": "es2020",
        "rootDir": "./src",
        "outDir": "./dist",
        "moduleResolution": "bundler",
        "allowImportingTsExtensions": true,
        "rewriteRelativeImportExtensions": true,
        "esModuleInterop": true,
        "strict": true,
        "skipLibCheck": true
    }
}
```
