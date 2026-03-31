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
        console.log("数据库连接成功。");

        // PostgreSQL 的 pg 包没有像 SQLite 那样细分不同的方法，主要使用统一的 query() 方法：
        // query() 方法可以执行任意 SQL 语句，包括 SELECT、INSERT、UPDATE、DELETE 等。
        // 当执行单行语句时，sql 语句可以不带分号结尾；当执行多条语句时，必须用分号分隔。


        // 建表
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
        // console.log("test_table表初始化成功，返回结果为：", result1);


        // 和sqlite不同的是，pgsql支持returning子句来获取插入数据的返回值

        // ==== 增 ====
        // // 插入数据到groups表
        // const result2 = await db.query(`
        //     INSERT INTO groups (name)
        //     VALUES
        //     ('Admin'),
        //     ('Editor'),
        //     ('Guest')
        //     RETURNING *
        // `);
        // console.log("groups表数据插入成功，返回结果为：", result2);

        // // // 插入数据到users表
        // const result3 = await db.query(`INSERT INTO users (username, email, password, group_id)
        //     VALUES
        //     ('alice', 'alice@abc.com', 'password123', 1)
        //     RETURNING *
        // `);
        // console.log("users表数据插入成功，返回结果为：", result3);


        // // 通过$占位符传参
        // const result4 = await db.query(`INSERT INTO users (username, email, password, group_id)
        //     VALUES
        //     ($1, $2, $3, $4)
        //     RETURNING *`,
        //      ["bob", "bob@abc.com", "password123", 2]);
        // console.log("users表数据插入成功，返回结果为：", result4);


        // ==== 查 ====
        // 查询users表中的多行数据
        const users = await db.query("SELECT * FROM users WHERE password = $1;", ["password123"]);
        console.log("查询到的用户数据-多行：", users.rows);

        // pg的查询结果不区分多行和单行，不像sqlite的get()和all()方法，pg的query都是返回一个对象数组
        // 如果只查询一行数据，可以直接使用query()方法，结果会是一个包含单个对象的数组

        const user_result1 = await db.query("SELECT * FROM users WHERE username = $1;", ["alice"]);
        console.log("user_result1: ", user_result1.rows[0]); // 直接访问rows数组的第一个元素

        const user_result2 = await db.query("SELECT * FROM users WHERE email LIKE '%@abc.com'");
        console.log("user_result2: ", user_result2.rows); // 只会输出所有匹配的用户，% 可以出现在任意位置，表示“零个或多个任意字符”

        // ==== 改 ====
        // 更新用户的密码，并返回更新后的用户信息
        const updateResult = await db.query(`
            UPDATE users 
            SET password = $1 
            WHERE username = $2 
            RETURNING *
        `, ["newpassword123", "alice"]);
        console.log("更新后的用户信息：", updateResult.rows[0]);

        // ==== 删 ====
        // 删除用户数据，并返回被删除的用户信息
        const deleteResult = await db.query(`
            DELETE FROM users 
            WHERE username = $1 
            RETURNING *
        `, ["bob"]);
        console.log("被删除的用户信息：", deleteResult.rows[0]);



    } catch (error) {
        console.error("查询失败：", error);
        throw error; // 重新抛出错误，以便调用者可以处理
    }
    finally {
        await db.end();
        console.log("数据库连接已关闭。"); 
    }
}

pgDemo();

