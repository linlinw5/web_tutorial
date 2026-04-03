[← Back to Home](../readme.md)

# Chapter 14: Introduction to PostgreSQL

This chapter starts from an existing SQLite foundation and introduces PostgreSQL installation and basic usage, focusing on the syntax and behavioral differences between the two. The complete SQL script is in [`scripts/console.sql`](./scripts/console.sql) and can be executed section by section in DataGrip.

---

## 14.1 Why Move from SQLite to PostgreSQL

After learning SQLite you already understand the core of relational databases: tables, primary keys, foreign keys, JOINs, and transactions. Switching to PostgreSQL doesn't require relearning these concepts — you only need to adapt to **differences in how they work**.

| Dimension        | SQLite                                   | PostgreSQL                                    |
| ---------------- | ---------------------------------------- | --------------------------------------------- |
| Deployment       | Embedded, database is a single file      | Standalone server process, clients connect over network |
| Concurrency      | Writes are serialized, suited for low concurrency | Multi-version concurrency control (MVCC), supports high-concurrency reads and writes |
| Data volume      | Suited for small, local data             | Can manage terabytes of data                  |
| SQL completeness | Intentionally trimmed (e.g., ALTER TABLE is limited) | Most complete standard SQL support           |
| Remote access    | Not supported (process must be where the file is) | Supports remote connections, suitable for team collaboration and server deployment |
| Use cases        | Local tools, mobile apps, testing, learning | Production web apps, SaaS systems           |

**Conclusion:**

- Rapid validation during development, course exercises → SQLite is more convenient
- Production deployment, multiple users, growing data → PostgreSQL

---

## 14.2 Installing PostgreSQL

### Ubuntu / Debian

```bash
sudo apt update
sudo apt -y install postgresql

# Check service status
sudo systemctl status postgresql
```

### Initial Configuration

After installation, PostgreSQL creates a system user `postgres` with no password by default.

```bash
# Switch to the postgres system user
sudo -i -u postgres

# Enter the PostgreSQL command line
psql

# Set a password for the postgres role
ALTER USER postgres WITH PASSWORD 'your_password';

# Create a new database
CREATE DATABASE mydb;

# Exit the command line / switch back to normal user
\q
exit
```

### Allowing Remote Connections (Optional)

```bash
# Modify the listen address
sudo vim /etc/postgresql/16/main/postgresql.conf
# Change listen_addresses = 'localhost' to:
listen_addresses = '*'

# Modify authentication rules
sudo vim /etc/postgresql/16/main/pg_hba.conf
# Add a line:
host    all    all    0.0.0.0/0    scram-sha-256

# Restart the service
sudo systemctl restart postgresql
```

---

## 14.3 Connecting to PostgreSQL with DataGrip

1. DataGrip → **+** → **Data Source** → **PostgreSQL**
2. Fill in Host / Port (default 5432) / User / Password / Database
3. **Test Connection** → first time will prompt to download the driver → **OK**

After a successful connection, right-click the database → **New** → **Query Console** to run SQL.

---

## 14.4 Syntax Differences from SQLite

This is the most important content in this chapter. The SQL between the two databases is largely the same, but there are several key differences to remember.

### Difference 1: Auto-increment Primary Keys

```sql
-- SQLite
id INTEGER PRIMARY KEY AUTOINCREMENT

-- PostgreSQL
id SERIAL PRIMARY KEY
-- SERIAL is syntactic sugar for INTEGER + an auto-created sequence
-- Equivalent to: id INTEGER DEFAULT nextval('users_id_seq')
```

### Difference 2: Date/Time Types

```sql
-- SQLite (internally stored as text)
created_at DATETIME DEFAULT CURRENT_TIMESTAMP

-- PostgreSQL (a true timestamp type)
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### Difference 3: Boolean Values

```sql
-- SQLite (simulates booleans with integers 0 / 1)
published BOOLEAN DEFAULT 0
INSERT INTO blogs (published) VALUES (1);
SELECT * FROM blogs WHERE published = 1;

-- PostgreSQL (native boolean type)
published BOOLEAN DEFAULT FALSE
INSERT INTO blogs (published) VALUES (TRUE);
SELECT * FROM blogs WHERE published = TRUE;
```

### Difference 4: More Powerful ALTER TABLE

SQLite cannot directly drop columns, change column types, or add foreign key constraints to existing columns — you need to work around it by rebuilding the table. PostgreSQL supports these directly:

```sql
-- Add a column
ALTER TABLE users ADD COLUMN group_id INTEGER;

-- Add a foreign key constraint to an existing column (SQLite requires rebuilding the table)
ALTER TABLE users
ADD CONSTRAINT fk_user_group
FOREIGN KEY (group_id) REFERENCES groups(id)
ON DELETE SET NULL;

-- Drop a column (not supported in SQLite)
ALTER TABLE users DROP COLUMN age;

-- Change a column type (not supported in SQLite)
ALTER TABLE users ALTER COLUMN bio TYPE VARCHAR(500);
```

### Difference 5: RETURNING Clause (PostgreSQL Only)

After INSERT / UPDATE / DELETE, you can return the affected rows directly without a separate SELECT:

```sql
-- Insert and return the generated id
INSERT INTO users (username, email, password)
VALUES ('john', 'john@abc.com', 'password123')
RETURNING *;

-- Update and return the updated row
UPDATE users SET password = 'newpass' WHERE id = 1 RETURNING *;

-- Delete and return the deleted row
DELETE FROM users WHERE id = 2 RETURNING *;
```

This is very useful in API development — a `createUser()` function can get the complete record including `id` immediately after inserting, without a second database query.

---

## 14.5 Creating Tables and Working with Data

### Creating Tables

```sql
CREATE TABLE IF NOT EXISTS users (
    id         SERIAL    PRIMARY KEY,
    username   TEXT      NOT NULL UNIQUE,
    email      TEXT      NOT NULL UNIQUE,
    password   TEXT      NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blogs (
    id         SERIAL    PRIMARY KEY,
    user_id    INTEGER   NOT NULL,
    title      TEXT      NOT NULL,
    content    TEXT      NOT NULL,
    published  BOOLEAN   DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Insert / Query / Update / Delete

Basic syntax is the same as SQLite; note the boolean value syntax:

```sql
-- Insert
INSERT INTO blogs (user_id, title, content, published)
VALUES (1, 'My First Blog', 'Content here.', TRUE);

-- Query (JOIN syntax is the same)
SELECT b.id, b.title, u.username, b.published
FROM blogs b
JOIN users u ON b.user_id = u.id;

-- Update (can use RETURNING)
UPDATE blogs SET published = TRUE WHERE id = 2 RETURNING *;

-- Delete (can use RETURNING)
DELETE FROM blogs WHERE id = 3 RETURNING *;
```

---

## 14.6 Common psql Command-Line Reference

Enter the following meta-commands (starting with `\`) in `psql`:

| Command          | Description                          |
| ---------------- | ------------------------------------ |
| `\l`             | List all databases                   |
| `\c dbname`      | Switch to the specified database     |
| `\dt`            | List all tables in the current database |
| `\d tablename`   | View table structure                 |
| `\du`            | List all roles (users)               |
| `\q`             | Exit psql                            |

---

## Appendix: SQLite vs PostgreSQL Syntax Comparison

| Scenario                         | SQLite                              | PostgreSQL                       |
| -------------------------------- | ----------------------------------- | -------------------------------- |
| Auto-increment primary key       | `INTEGER PRIMARY KEY AUTOINCREMENT` | `SERIAL PRIMARY KEY`             |
| Date/time                        | `DATETIME`                          | `TIMESTAMP`                      |
| Boolean default value            | `DEFAULT 0` / `DEFAULT 1`           | `DEFAULT FALSE` / `DEFAULT TRUE` |
| Boolean query                    | `WHERE published = 1`               | `WHERE published = TRUE`         |
| Add foreign key to existing column | Requires rebuilding table         | `ALTER TABLE ... ADD CONSTRAINT` |
| Drop a column                    | Requires rebuilding table           | `ALTER TABLE ... DROP COLUMN`    |
| Return data after insert         | Not supported                       | `INSERT ... RETURNING *`         |
| String escaping                  | `''`                                | `''` (same)                      |
