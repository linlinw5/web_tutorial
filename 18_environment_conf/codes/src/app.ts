// env.ts 必须是第一个 import
// ES 模块的 import 会被提升（hoist）并按顺序执行：
//   1. 所有 import 语句先于本文件其他代码执行
//   2. 执行顺序与 import 语句的书写顺序一致
// 因此把 env.ts 放在首位，可确保 dotenv.config() 在 ConnectionManager 等模块
// 读取 process.env 之前就已执行完毕
import './env.ts';

import express from 'express';
import { pool } from './db/ConnectionManager.ts';

const app = express();
const port = process.env.PORT; // 从环境变量获取端口，避免硬编码

app.get('/', async (req, res) => {
    const result = await pool.query('SELECT * FROM users');
    let users = result.rows;
    console.log(users);
    res.json({users});
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
