import express from 'express';

const app = express();
const PORT: number = 3000;

// 在这里完成以下配置：
//
// 1. 用 express.static() 托管 public 目录
//
// 2. 设置 EJS 为视图引擎（view engine）
//
// 3. 设置视图目录为 'views'
//
// 4. 创建 GET / 路由，渲染 index.ejs，传入 { title: 'Home Page' }

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
