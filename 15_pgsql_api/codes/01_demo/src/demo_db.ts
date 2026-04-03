import pg from 'pg';

const dbConfig = {
    host: "10.0.0.133",
    port: 5432,
    user: "postgres",
    password: "Cisco123",
    database: "db2"
};

async function pgDemo() {
    const db = new pg.Client(dbConfig);
    try {
        await db.connect();
        console.log("Database connection successful.");

        // PostgreSQL's pg package does not have separate methods like SQLite; mainly uses a unified query() method:
        // The query() method can execute any SQL statement, including SELECT, INSERT, UPDATE, DELETE, etc.
        // For single statements, SQL statements do not require a semicolon; for multiple statements, they must be separated by semicolons.


        // Create table
        // const result1 = await db.query(`
        //     CREATE TABLE IF NOT EXISTS groups (
        //         id SERIAL PRIMARY KEY,
        //         name TEXT NOT NULL UNIQUE
        //     );

        //     CREATE TABLE IF NOT EXISTS users (
        //         id SERIAL PRIMARY KEY,
        //         group_id INTEGER,
        //         username TEXT NOT NULL UNIQUE,
        //         email TEXT NOT NULL UNIQUE,
        //         password TEXT NOT NULL,
        //         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        //         FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE SET NULL
        //     );
        // `);
        // console.log("test_table table initialization successful, return result:", result1);


        // Unlike SQLite, PostgreSQL supports RETURNING clause to get the return value of inserted data

        // ==== Create/Insert ====
        // // Insert data into groups table
        // const result2 = await db.query(`
        //     INSERT INTO groups (name)
        //     VALUES
        //     ('Admin'),
        //     ('Editor'),
        //     ('Guest')
        //     RETURNING *
        // `);
        // console.log("Data insertion into groups table successful, return result:", result2);

        // // // Insert data into users table
        // const result3 = await db.query(`INSERT INTO users (username, email, password, group_id)
        //     VALUES
        //     ('alice', 'alice@abc.com', 'password123', 1)
        //     RETURNING *
        // `);
        // console.log("Data insertion into users table successful, return result:", result3);


        // // Pass parameters through $ placeholders
        // const result4 = await db.query(`INSERT INTO users (username, email, password, group_id)
        //     VALUES
        //     ($1, $2, $3, $4)
        //     RETURNING *`,
        //      ["bob", "bob@abc.com", "password123", 2]);
        // console.log("Data insertion into users table successful, return result:", result4);


        // ==== Query/Read ====
        // Query multiple rows of data from users table
        const users = await db.query("SELECT * FROM users WHERE password = $1;", ["password123"]);
        console.log("Queried user data - multiple rows:", users.rows);

        // pg query results do not distinguish between multiple rows and single rows; unlike SQLite's get() and all() methods, pg query returns an array of objects
        // If querying only one row of data, you can use the query() method directly; the result will be an array containing a single object

        const user_result1 = await db.query("SELECT * FROM users WHERE username = $1;", ["alice"]);
        console.log("user_result1: ", user_result1.rows[0]); // Directly access the first element of the rows array

        const user_result2 = await db.query("SELECT * FROM users WHERE email LIKE '%@abc.com'");
        console.log("user_result2: ", user_result2.rows); // Will only output all matching users; % can appear at any position, representing "zero or more arbitrary characters"

        // ==== Update ====
        // Update user password and return updated user information
        const updateResult = await db.query(`
            UPDATE users 
            SET password = $1 
            WHERE username = $2 
            RETURNING *
        `, ["newpassword123", "alice"]);
        console.log("Updated user information:", updateResult.rows[0]);

        // ==== Delete ====
        // Delete user data and return deleted user information
        const deleteResult = await db.query(`
            DELETE FROM users 
            WHERE username = $1 
            RETURNING *
        `, ["bob"]);
        console.log("Deleted user information:", deleteResult.rows[0]);



    } catch (error) {
        console.error("Query failed:", error);
        throw error; // re-throw the error so the caller can handle it
    }
    finally {
        await db.end();
        console.log("Database connection closed."); 
    }
}

pgDemo();

