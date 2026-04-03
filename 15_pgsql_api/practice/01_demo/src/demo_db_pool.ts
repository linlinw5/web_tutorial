import pg from 'pg';

// Complete the following exercises here (using pg.Pool connection pool mode):
//
// 1. Configure dbConfig with additional connection pool parameters:
//    max / idleTimeoutMillis / connectionTimeoutMillis
//
// 2. Create pg.Pool instance
//    Note: Pool does not need manual connect(), directly call pool.query()
//
// 3. Query all users: SELECT * FROM users
//    Print result.rows
//
// 4. Write cleanup() function to call pool.end() and close the connection pool
//
// 5. Listen for SIGINT / SIGTERM signals, call cleanup() before exiting
//    Compare the difference between this and Client mode shutdown approach
