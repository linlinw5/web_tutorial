import pg from 'pg';

// 在这里完成以下练习：
//
// 1. 配置 dbConfig（host / port / user / password / database / max / idleTimeoutMillis / connectionTimeoutMillis）
//
// 2. 创建 pg.Pool 实例并导出（export const pool = ...）
//    整个应用共用这一个 pool，所有路由从这里 import
