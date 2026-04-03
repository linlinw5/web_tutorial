import pg from 'pg';

// Complete the following exercises here:
//
// 1. Configure dbConfig (host / port / user / password / database / max / idleTimeoutMillis / connectionTimeoutMillis）
//
// 2. Create pg.Pool instance and export (export const pool = ...)
//    The whole application shares this one pool, all routes import from here
