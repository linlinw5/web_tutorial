[← 返回首页](../readme.md)

# 第 14 章：PostgreSQL 入门

本章以已掌握 SQLite 的基础为起点，介绍 PostgreSQL 的安装与基本使用，重点讲解两者在语法和使用习惯上的差异。完整 SQL 脚本见 [`scripts/console.sql`](./scripts/console.sql)，可在 DataGrip 中逐段执行。

---

## 14.1 为什么从 SQLite 迁移到 PostgreSQL

学完 SQLite 后你已经掌握了关系型数据库的核心：表、主键、外键、JOIN、事务。切换到 PostgreSQL 不需要重新学习这些概念，只需要适应它们**工作方式的差异**。

| 维度       | SQLite                             | PostgreSQL                             |
| ---------- | ---------------------------------- | -------------------------------------- |
| 部署方式   | 嵌入式，数据库即单个文件           | 独立服务器进程，客户端通过网络连接     |
| 并发支持   | 写操作串行，适合低并发             | 多版本并发控制（MVCC），支持高并发读写 |
| 数据量     | 适合小型、本地数据                 | 可管理 TB 级数据                       |
| 功能完整性 | 有意裁减，如 ALTER TABLE 受限      | 标准 SQL 支持最完整                    |
| 远程访问   | 不支持（文件在哪里，进程就在哪里） | 支持远程连接，适合多人协作和服务器部署 |
| 适用场景   | 本地工具、移动端、测试、教学       | 生产环境 Web 应用、SaaS 系统           |

**结论：**

- 开发阶段快速验证、课程练习 → SQLite 更方便
- 生产部署、多人访问、数据量增长 → PostgreSQL

---

## 14.2 安装 PostgreSQL

### Ubuntu / Debian

```bash
sudo apt update
sudo apt -y install postgresql

# 查看服务状态
sudo systemctl status postgresql
```

### 首次配置

PostgreSQL 安装后会创建系统用户 `postgres`，默认没有密码。

```bash
# 切换到 postgres 系统用户
sudo -i -u postgres

# 进入 PostgreSQL 命令行
psql

# 修改 postgres 角色密码
ALTER USER postgres WITH PASSWORD 'your_password';

# 创建新数据库
CREATE DATABASE mydb;

# 退出命令行 / 切换回普通用户
\q
exit
```

### 允许远程连接（可选）

```bash
# 修改监听地址
sudo vim /etc/postgresql/16/main/postgresql.conf
# 将 listen_addresses = 'localhost' 改为：
listen_addresses = '*'

# 修改认证规则
sudo vim /etc/postgresql/16/main/pg_hba.conf
# 添加一行：
host    all    all    0.0.0.0/0    scram-sha-256

# 重启服务
sudo systemctl restart postgresql
```

---

## 14.3 用 DataGrip 连接 PostgreSQL

1. DataGrip → **+** → **Data Source** → **PostgreSQL**
2. 填写 Host / Port（默认 5432）/ User / Password / Database
3. **Test Connection** → 首次会提示下载驱动 → **OK**

连接成功后右键数据库 → **New** → **Query Console**，即可执行 SQL。

---

## 14.4 与 SQLite 的语法差异

这是本章最重要的内容。两个数据库的 SQL 大体相同，但有几个关键差异需要记住。

### 差异一：自增主键

```sql
-- SQLite
id INTEGER PRIMARY KEY AUTOINCREMENT

-- PostgreSQL
id SERIAL PRIMARY KEY
-- SERIAL 是 INTEGER + 自动创建的序列（sequence）的语法糖
-- 等价于：id INTEGER DEFAULT nextval('users_id_seq')
```

### 差异二：日期时间类型

```sql
-- SQLite（内部实际存储为文本）
created_at DATETIME DEFAULT CURRENT_TIMESTAMP

-- PostgreSQL（真正的时间戳类型）
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### 差异三：布尔值

```sql
-- SQLite（用整数 0 / 1 模拟布尔）
published BOOLEAN DEFAULT 0
INSERT INTO blogs (published) VALUES (1);
SELECT * FROM blogs WHERE published = 1;

-- PostgreSQL（原生布尔类型）
published BOOLEAN DEFAULT FALSE
INSERT INTO blogs (published) VALUES (TRUE);
SELECT * FROM blogs WHERE published = TRUE;
```

### 差异四：ALTER TABLE 更强大

SQLite 不能直接删除列、修改列类型、或为已有列添加外键约束，需要"重建表"迂回实现。PostgreSQL 直接支持：

```sql
-- 添加列
ALTER TABLE users ADD COLUMN group_id INTEGER;

-- 为已有列添加外键约束（SQLite 不支持，需重建表）
ALTER TABLE users
ADD CONSTRAINT fk_user_group
FOREIGN KEY (group_id) REFERENCES groups(id)
ON DELETE SET NULL;

-- 删除列（SQLite 不支持）
ALTER TABLE users DROP COLUMN age;

-- 修改列类型（SQLite 不支持）
ALTER TABLE users ALTER COLUMN bio TYPE VARCHAR(500);
```

### 差异五：RETURNING 子句（PostgreSQL 独有）

INSERT / UPDATE / DELETE 后可以直接返回受影响的行，无需额外的 SELECT：

```sql
-- 插入并返回生成的 id
INSERT INTO users (username, email, password)
VALUES ('john', 'john@abc.com', 'password123')
RETURNING *;

-- 更新并返回更新后的行
UPDATE users SET password = 'newpass' WHERE id = 1 RETURNING *;

-- 删除并返回被删除的行
DELETE FROM users WHERE id = 2 RETURNING *;
```

这在 API 开发中非常实用——`createUser()` 函数执行插入后能直接拿到含 `id` 的完整记录，不需要再查一次数据库。

---

## 14.5 建表与数据操作

### 建表

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

### 插入 / 查询 / 更新 / 删除

基本语法与 SQLite 相同，注意布尔值写法：

```sql
-- 插入
INSERT INTO blogs (user_id, title, content, published)
VALUES (1, 'My First Blog', 'Content here.', TRUE);

-- 查询（JOIN 写法相同）
SELECT b.id, b.title, u.username, b.published
FROM blogs b
JOIN users u ON b.user_id = u.id;

-- 更新（可跟 RETURNING）
UPDATE blogs SET published = TRUE WHERE id = 2 RETURNING *;

-- 删除（可跟 RETURNING）
DELETE FROM blogs WHERE id = 3 RETURNING *;
```

---

## 14.6 常用 psql 命令行速查

在 `psql` 中输入以下元命令（以 `\` 开头）：

| 命令           | 说明                   |
| -------------- | ---------------------- |
| `\l`           | 列出所有数据库         |
| `\c dbname`    | 切换到指定数据库       |
| `\dt`          | 列出当前数据库的所有表 |
| `\d tablename` | 查看表结构             |
| `\du`          | 列出所有角色（用户）   |
| `\q`           | 退出 psql              |

---

## 附录：SQLite vs PostgreSQL 语法对照

| 场景             | SQLite                              | PostgreSQL                       |
| ---------------- | ----------------------------------- | -------------------------------- |
| 自增主键         | `INTEGER PRIMARY KEY AUTOINCREMENT` | `SERIAL PRIMARY KEY`             |
| 日期时间         | `DATETIME`                          | `TIMESTAMP`                      |
| 布尔默认值       | `DEFAULT 0` / `DEFAULT 1`           | `DEFAULT FALSE` / `DEFAULT TRUE` |
| 布尔查询         | `WHERE published = 1`               | `WHERE published = TRUE`         |
| 添加外键到已有列 | 需重建表                            | `ALTER TABLE ... ADD CONSTRAINT` |
| 删除列           | 需重建表                            | `ALTER TABLE ... DROP COLUMN`    |
| 插入后返回数据   | 不支持                              | `INSERT ... RETURNING *`         |
| 字符串转义       | `''`                                | `''`（相同）                     |
