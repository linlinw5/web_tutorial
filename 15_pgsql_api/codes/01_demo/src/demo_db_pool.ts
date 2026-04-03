import pg from 'pg';

const dbConfig = {
    host: "10.0.0.133",
    port: 5432,
    user: "postgres",
    password: "Cisco123",
    database: "db2",
    max: 10, // Max connections in the pool
    idleTimeoutMillis: 30000, // Idle connection timeout
    connectionTimeoutMillis: 2000, // Connection timeout
    // allowExitOnIdle: true         // Allow process to exit when connection pool is idle
    // When writing service-mode applications, usually no need to set allowExitOnIdle because the connection pool will remain active during application runtime.
    // However, in some scripts or tests, if you need to exit the process after all connections are closed, you can set it to true.
};

const pool = new pg.Pool(dbConfig);


async function pgDemo() {
    try {
        // ==== Query/Read ====
        const users = await pool.query("SELECT * FROM users");
        console.log("Queried user data:", users.rows);
        
    } catch (error) {
        console.error("Query failed:", error);
        throw error; // re-throw the error so the caller can handle it
    }
}

// Cleanup function when application closes
async function cleanup() {
    try {
        await pool.end(); // Only call when the application closes
        console.log('Connection pool closed');
    } catch (error) {
        console.error('Error closing connection pool:', error);
    }
}



// Listen for process exit signal
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);


pgDemo();