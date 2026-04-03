[← Back to Home](../readme.md)

# Chapter 9: Introduction to SQLite Databases

This chapter introduces the fundamental concepts of relational databases and uses DataGrip to demonstrate how to work with a SQLite database. The focus throughout is on SQL commands — observing the statements DataGrip generates, then writing custom queries by hand.

The complete SQL script is in [`scripts/console.sql`](./scripts/console.sql) and can be opened directly in DataGrip for step-by-step execution.

---

## 9.1 Core Concepts of Relational Databases

### Understanding "Tables" with Excel

A **table** in a database is essentially the same as an Excel spreadsheet — rows are records and columns are fields.

Using student information as an example, each row is one student (a record) and each column is one attribute (a field):

| Record # | Student ID | Name | Age | Grade | Home Address | Enrollment Date |
| -------- | ---------- | ---- | --- | ----- | ------------ | --------------- |
| 1 | A20241001 | Wei Zhang | 18 | 1 | Haidian District, Beijing | 2023/9/1 |
| 2 | A20241002 | Jing Li | 19 | 2 | Xuhui District, Shanghai | 2022/9/1 |
| 3 | B20241003 | Lei Wang | 20 | 3 | Tianhe District, Guangzhou | 2021/9/1 |

### When Two Tables Are Related

If there is also an articles table that stores the author's name directly in a column:

| Article # | Title | Content | Author | Date |
| --------- | ----- | ------- | ------ | ---- |
| 101 | Applications of AI in Education | This article explores AI technology in modern educational settings… | Wei Zhang | 2024/12/15 |
| 102 | Comparison of Frontend Frameworks | Compares the strengths of React, Vue, and Angular… | Jing Li | 2024/12/20 |
| 103 | Trends in Green Energy Development | Analyzes the current state, challenges, and future of global green energy… | Lei Wang | 2025/1/5 |
| 104 | Blockchain Applications in Finance | Introduces blockchain use cases in payments, settlement, and supply chain finance… | Fang Chen | 2025/1/8 |
| 105 | Urban Traffic Problems and Solutions | Explores the causes of traffic congestion and potential smart traffic solutions… | Qiang Liu | 2025/1/10 |

This design has obvious problems:

- Author names are stored redundantly, wasting space
- If a student changes their name, the "Author" column in every article must be updated
- Students with identical names cannot be distinguished

The correct approach is: the articles table stores only the student's **ID**, and uses that ID to look up the student in the student table — this is a **Foreign Key**.

### Primary Keys and Foreign Keys

| Concept | Description |
| ------- | ----------- |
| **Primary Key** | Uniquely identifies a record; cannot repeat within the same table; typically an auto-incrementing integer `id` |
| **Foreign Key** | References the primary key of another table, establishing a relationship between the two tables |

The diagram below shows the relationship between the `users` and `blogs` tables:

![Relationship between users and blogs](./assets/users_blogs_table.png)

The `user_id` column in the `blogs` table (foreign key) references the `id` column (primary key) in the `users` table. One user can publish many blog posts — this is a **one-to-many** relationship.

### Multi-Table Relationships

As requirements grow, more tables can be added. The diagram below adds a `groups` table to record each user's permission group:

![Three-table relationship: groups, users, blogs](./assets/groups_users_blogs_table.png)

`users.group_id` references `groups.id`, and `blogs.user_id` references `users.id`. The three tables form a chain of relationships through primary and foreign keys.

---

## 9.2 Overview of Major Relational Databases

| Database | Initial Year | Characteristics |
| -------- | ------------ | --------------- |
| SQLite | 2000 | Embedded, lightweight, serverless; the database is a single file; ideal for teaching and local development |
| PostgreSQL | 1989 | Open source, full-featured, best standards compliance; suitable for production environments |
| MySQL | 1995 | Common in web development, simple and efficient, large community |
| Oracle | 1979 | Leader in commercial databases, highly stable, suitable for large enterprises |
| MSSQL | 1989 | Microsoft product, deeply integrated with Windows |

This chapter uses **SQLite** — no database service installation required; the database is simply a `.sqlite` file, making it ideal for beginners.

---

## 9.3 Creating a Database in DataGrip

1. Open DataGrip → **New Project**
2. In the Database Explorer on the left → **+** → **Data Source** → **SQLite**
3. In the **File** field, select or create a `.sqlite` file path (the demo in this chapter uses the `data/` directory)
4. Click **Test Connection** (the first time will prompt you to download a driver — confirm as instructed) → **OK**

After a successful connection, right-click the database in the Database Explorer → **New** → **Query Console** to enter and execute SQL statements.

You can also use DataGrip's graphical wizard to build SQL statements step by step.

![DataGrip interface](./assets/datagrip.png)

> **About the `data/` directory:** This is the directory where DataGrip stores database files. `data/db1.sqlite` is the database file produced in this chapter's demo. It can be opened directly in DataGrip, or viewed with VS Code's SQLite Viewer extension.

---

## 9.4 DDL: Defining Table Structure

DDL (Data Definition Language) is used to create, modify, and delete database objects.

### CREATE TABLE

```sql
CREATE TABLE IF NOT EXISTS users (
    id         INTEGER  PRIMARY KEY AUTOINCREMENT,
    username   TEXT     NOT NULL UNIQUE,
    email      TEXT     NOT NULL UNIQUE,
    password   TEXT     NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blogs (
    id         INTEGER  PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER  NOT NULL,
    title      TEXT     NOT NULL,
    content    TEXT     NOT NULL,
    published  BOOLEAN  DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Keyword reference:**

| Keyword | Purpose |
| ------- | ------- |
| `PRIMARY KEY` | Primary key; value must be unique across the entire table |
| `AUTOINCREMENT` | Auto-increments the id when a new record is inserted |
| `NOT NULL` | This field cannot be null |
| `UNIQUE` | This field cannot have duplicate values across the table |
| `DEFAULT` | Uses this default value if the field is not provided on insert |
| `FOREIGN KEY ... REFERENCES` | Declares a foreign key referencing another table's primary key |
| `ON DELETE CASCADE` | When the referenced record is deleted, cascade-delete related records in this table |

**Common SQLite data types:**

| Type | Description |
| ---- | ----------- |
| `INTEGER` | Integer |
| `TEXT` | String |
| `REAL` | Floating-point number |
| `BOOLEAN` | Boolean (stored internally as 0 / 1 in SQLite) |
| `DATETIME` | Date and time (stored internally as text in SQLite) |

---

## 9.5 DML: CRUD Operations

DML (Data Manipulation Language) is used to create, read, update, and delete data.

### INSERT — Inserting Data

```sql
-- Insert a single record
INSERT INTO users (username, email, password)
VALUES ('alice', 'alice@example.com', 'password123');

-- Insert multiple records at once
INSERT INTO users (username, email, password)
VALUES
    ('bob', 'bob@example.com', 'password123'),
    ('jack', 'jack@example.com', 'password123');
```

If the string contains a single quote, escape it with two single quotes:

```sql
INSERT INTO blogs (user_id, title, content)
VALUES (2, 'Bob''s Note', 'Unpublished content.');
```

### SELECT — Querying Data

```sql
-- Query all fields
SELECT * FROM users;

-- Query specific fields
SELECT username, email FROM users;

-- Filter with conditions
SELECT * FROM blogs WHERE user_id = 1;
SELECT * FROM blogs WHERE published = 1;
```

### JOIN — Cross-Table Queries

A single table cannot simultaneously provide the blog title and author name — `JOIN` is needed to merge two tables:

```sql
-- Query all blogs with their author names
SELECT blogs.id, blogs.title, users.username, blogs.published
FROM blogs
JOIN users ON blogs.user_id = users.id;

-- Using table aliases for brevity
SELECT b.id, b.title, u.username, b.published
FROM blogs AS b
JOIN users AS u ON b.user_id = u.id;
```

`JOIN ... ON` specifies the join condition: rows where `blogs.user_id` equals `users.id` are merged into a single row.

### UPDATE — Modifying Data

```sql
UPDATE blogs SET title = 'My Updated Blog Title' WHERE id = 1;
UPDATE blogs SET published = 1 WHERE id = 2;
UPDATE users SET password = 'password456' WHERE id = 1;
```

> **Warning:** An `UPDATE` without a `WHERE` clause updates every row in the entire table. Always confirm your condition before running.

### DELETE — Deleting Data

```sql
-- Delete a single blog post
DELETE FROM blogs WHERE id = 2;

-- Delete a user (because blogs has ON DELETE CASCADE, related posts are deleted automatically)
DELETE FROM users WHERE id = 2;
```

> **Warning:** A `DELETE` without a `WHERE` clause clears the entire table. Always confirm your condition before running.

---

## 9.6 ALTER TABLE: Modifying Table Structure

Sometimes you need to add a column to an existing table or rename something. SQLite has limited `ALTER TABLE` support:

### Operations SQLite Supports

```sql
-- Add a column
ALTER TABLE users ADD COLUMN group_id INTEGER;

-- Rename a column
ALTER TABLE users RENAME COLUMN username TO user_name;

-- Rename a table
ALTER TABLE users RENAME TO members;
```

### Operations SQLite Does NOT Support

The following operations can be executed directly in PostgreSQL but are **not supported** in SQLite:

```sql
-- ❌ Drop a column
ALTER TABLE users DROP COLUMN age;

-- ❌ Change a column's data type
ALTER TABLE users ALTER COLUMN age TYPE TEXT;

-- ❌ Add a foreign key constraint to an existing column
ALTER TABLE users
ADD CONSTRAINT fk_group FOREIGN KEY (group_id) REFERENCES groups(id);
```

When SQLite encounters these requirements, the solution is to rebuild the table.

---

## 9.7 Rebuilding a Table: SQLite's Data Migration Pattern

When you need to add a foreign key constraint, drop a column, or change a column's type, the standard SQLite approach is: **create a new table with the target structure → migrate data → replace the old table**.

The following example adds a foreign key constraint to the `group_id` column on the `users` table:

```sql
-- Step 1: Create the new table with the foreign key constraint
CREATE TABLE new_users (
    id         INTEGER  PRIMARY KEY AUTOINCREMENT,
    username   TEXT     NOT NULL UNIQUE,
    email      TEXT     NOT NULL UNIQUE,
    password   TEXT     NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    group_id   INTEGER,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE SET NULL
);

-- Step 2: Migrate data from the old table to the new one
INSERT INTO new_users (id, username, email, password, created_at, group_id)
SELECT id, username, email, password, created_at, group_id FROM users;

-- Step 3: Rename the old table (kept as a backup)
ALTER TABLE users RENAME TO old_users;

-- Step 4: Rename the new table to the official name
ALTER TABLE new_users RENAME TO users;
```

This "create new table → copy data → rename" pattern is what DataGrip automatically generates when performing certain structural changes.

---

## Appendix: DDL vs DML

| Category | Full Name | Statements | Operates On |
| -------- | --------- | ---------- | ----------- |
| **DDL** | Data Definition Language | `CREATE`, `ALTER`, `DROP` | Table structure, database objects |
| **DML** | Data Manipulation Language | `INSERT`, `SELECT`, `UPDATE`, `DELETE` | Data inside tables |
