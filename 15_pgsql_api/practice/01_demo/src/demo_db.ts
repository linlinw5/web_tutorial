import pg from 'pg';

// Complete the following exercises here (using pg.Client single connection mode):
//
// 1. Configure dbConfig (host / port / user / password / database)
//    Connect to your own PostgreSQL instance
//
// 2. Create pg.Client instance and connect()
//
// 3. Insert one user data using $1 $2 placeholders (INSERT ... RETURNING *)
//    Observe the structure of return value (result.rows[0])
//
// 4. Query multiple rows: SELECT * FROM users WHERE password = $1
//    Print result.rows
//
// 5. Query single row: SELECT * FROM users WHERE username = $1
//    Print result.rows[0]
//
// 6. Update: UPDATE users SET password = $1 WHERE username = $2 RETURNING *
//    Print the updated row
//
// 7. Delete: DELETE FROM users WHERE username = $1 RETURNING *
//    Print the deleted row
//
// 8. Call db.end() in finally block to close the connection
