// 专门负责加载 .env 文件的模块
// 必须在 app.ts 中作为第一个 import，确保环境变量在所有其他模块执行之前就已就绪
import dotenv from 'dotenv';
dotenv.config(); // 读取项目根目录的 .env 文件，将其中的键值对写入 process.env
