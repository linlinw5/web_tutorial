-- 第一，创建table
CREATE TABLE IF NOT EXISTS groups (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    group_id INTEGER,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE SET NULL
);

-- 第二，增 - 示例
-- 插入 group 数据
INSERT INTO groups (name) VALUES 
  ('Admin'),
  ('Editor'),
  ('Guest')
RETURNING *;

-- 插入 users 数据
INSERT INTO users (username, email, password, group_id)
VALUES
  ('nina', 'nina@abc.com', 'password123', 2),
  ('oscar', 'oscar@abc.com', 'password456', 2),
  ('carol', 'carol@abc.com', 'password123', 3),
  ('dave', 'dave@abc.com', 'davepass', 1),
  ('eve', 'eve@abc.com', 'eve12345', 3);

-- 第三，删、改、查 - 示例
-- 查询所有 groups
SELECT * FROM groups;

-- 查询所有 users
SELECT * FROM users;

-- 查询用户及其所在的组
SELECT u.id, u.username, u.email, u.password, g.name AS group_name
FROM users AS u
JOIN groups AS g ON u.group_id = g.id
WHERE u.id = 1;

-- 查询某个用户的详细信息
SELECT * FROM users WHERE id = 1;

-- 更新某个用户的密码
UPDATE users SET password = 'password456' WHERE id = 8;

-- 删除某个用户
DELETE FROM users WHERE id = 9;
