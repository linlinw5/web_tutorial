import pg from "pg";
import { dbConfig } from "../config.ts";

// 启动时打印连接配置（方便调试，注意生产环境不要打印密码）
console.log("Database configuration:", dbConfig);

// 使用 config.ts 中集中管理的配置创建连接池
// 此时 process.env 已由 env.ts 填充，dbConfig 中的值均已就绪
export const pool = new pg.Pool(dbConfig);
