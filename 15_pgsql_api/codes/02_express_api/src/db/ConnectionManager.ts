import pg from 'pg';

const dbConfig = {
    host: "10.0.0.133",
    port: 5432,
    user: "postgres",
    password: "Cisco123",
    database: "db2",
    max: 10, // 连接池最大连接数
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
};

export const pool = new pg.Pool(dbConfig);
