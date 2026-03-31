-- ============================================================
-- 第 9 章：SQLite 数据库入门 — 完整演示脚本
-- 在 DataGrip 中打开后，可逐段选中执行
-- ============================================================


-- ===== 第一步：创建表结构 =====

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


-- ===== 第二步：插入数据 =====

-- 插入用户
INSERT INTO users (username, email, password)
VALUES ('alice', 'alice@example.com', 'password123');

INSERT INTO users (username, email, password)
VALUES
    ('bob',  'bob@example.com',  'password123'),
    ('jack', 'jack@example.com', 'password123');

-- 插入博客（注意：字符串中的单引号用两个单引号转义）
INSERT INTO blogs (user_id, title, content, published)
VALUES (1, 'My First Blog', 'This is the content of my first blog.', 1);

INSERT INTO blogs (user_id, title, content)
VALUES
    (2, 'Bob''s Note',   'Unpublished content.'),
    (1, 'Alice''s Note', 'Unpublished content.');


-- ===== 第三步：查询数据 =====

-- 查询所有用户
SELECT * FROM users;

-- 查询所有博客
SELECT * FROM blogs;

-- JOIN：查询所有博客及作者名
SELECT blogs.id, blogs.title, users.username, blogs.published
FROM blogs
JOIN users ON blogs.user_id = users.id;

-- 使用表别名，更简洁
SELECT b.id, b.title, u.username, b.published
FROM blogs AS b
JOIN users AS u ON b.user_id = u.id;

-- 条件查询
SELECT * FROM blogs WHERE user_id = 1;
SELECT * FROM blogs WHERE published = 1;


-- ===== 第四步：更新数据 =====

UPDATE blogs SET title = 'My Updated Blog Title' WHERE id = 1;
UPDATE blogs SET published = 1 WHERE id = 2;
UPDATE users SET password = 'password456' WHERE id = 1;


-- ===== 第五步：删除数据 =====

-- 删除一篇博客
DELETE FROM blogs WHERE id = 2;

-- 删除一个用户（blogs 有 ON DELETE CASCADE，关联博客会自动删除）
DELETE FROM users WHERE id = 2;


-- ===== 第六步：创建 groups 表 =====
-- 新增 groups 表，用于记录用户所属权限组

CREATE TABLE IF NOT EXISTS groups (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT    NOT NULL UNIQUE
);

INSERT INTO groups (name) VALUES ('Admin');
INSERT INTO groups (name) VALUES ('Editor');
INSERT INTO groups (name) VALUES ('Guest');


-- ===== 第七步：ALTER TABLE 修改表结构 =====

-- 给 users 表新增 group_id 列（暂无外键约束）
ALTER TABLE users ADD COLUMN group_id INTEGER;

-- 给所有用户赋默认组（假设全部加入 Editor）
UPDATE users SET group_id = 2;

-- SQLite 支持的 ALTER TABLE 操作：
--   ALTER TABLE users ADD COLUMN age INTEGER;                  -- 添加列
--   ALTER TABLE users RENAME COLUMN username TO user_name;    -- 重命名列
--   ALTER TABLE users RENAME TO members;                      -- 重命名表

-- SQLite 不支持的操作（需重建表）：
--   ALTER TABLE users DROP COLUMN age;
--   ALTER TABLE users ALTER COLUMN age TYPE TEXT;
--   ALTER TABLE users ADD CONSTRAINT fk_group FOREIGN KEY (group_id) REFERENCES groups(id);


-- ===== 第八步：重建表，添加外键约束 =====
-- SQLite 不支持直接添加外键，需新建表 → 迁移数据 → 替换旧表

-- 8.1 创建新 users 表，含外键约束
CREATE TABLE new_users (
    id         INTEGER  PRIMARY KEY AUTOINCREMENT,
    username   TEXT     NOT NULL UNIQUE,
    email      TEXT     NOT NULL UNIQUE,
    password   TEXT     NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    group_id   INTEGER,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE SET NULL
);

-- 8.2 迁移数据
INSERT INTO new_users (id, username, email, password, created_at, group_id)
SELECT id, username, email, password, created_at, group_id FROM users;

-- 8.3 旧表重命名（保留备份）
ALTER TABLE users RENAME TO old_users;

-- 8.4 新表改名为正式表名
ALTER TABLE new_users RENAME TO users;

-- 8.5 对 blogs 表做同样处理（重建以确保外键一致性）
CREATE TABLE new_blogs (
    id         INTEGER  PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER  NOT NULL,
    title      TEXT     NOT NULL,
    content    TEXT     NOT NULL,
    published  BOOLEAN  DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO new_blogs (id, user_id, title, content, published, created_at)
SELECT id, user_id, title, content, published, created_at FROM blogs;

ALTER TABLE blogs    RENAME TO old_blogs;
ALTER TABLE new_blogs RENAME TO blogs;


-- ===== 附录：插入大量测试数据 =====

INSERT INTO users (username, email, password, group_id)
VALUES
    ('nina',  'nina@abc.com',  'password123', 2),
    ('oscar', 'oscar@abc.com', 'password123', 1),
    ('carol', 'carol@abc.com', 'password123', 3),
    ('dave',  'dave@abc.com',  'davepass',    1),
    ('eve',   'eve@abc.com',   'eve12345',    2),
    ('frank', 'frank@abc.com', 'frankie!',    1),
    ('grace', 'grace@abc.com', 'password123', 3),
    ('heidi', 'heidi@abc.com', 'h3idipass',   2),
    ('ivan',  'ivan@abc.com',  'ivanivan',    1),
    ('judy',  'judy@abc.com',  'judyjudy',    3);

INSERT INTO blogs (user_id, title, content, published)
VALUES
    (1, 'Getting Started with Python',       'Python is a great language for beginners.',            1),
    (1, 'Data Structures in Programming',    'Understanding arrays, lists, and dictionaries.',       1),
    (1, 'My Journey Learning to Code',       'It all started when I wrote my first Hello World.',    0),
    (1, 'Best Practices for Clean Code',     'Writing readable code is more important.',             1),
    (2, 'Digital Marketing Trends 2024',     'Social media and AI are changing how we market.',      1),
    (2, 'Building Your Personal Brand',      'Your online presence matters more than ever.',         1),
    (2, 'Content Creation Strategies',       'Consistency and authenticity are key.',                0),
    (3, 'The Art of Italian Cooking',        'Authentic Italian recipes passed down through generations.', 1),
    (3, 'Street Food Adventures in Bangkok', 'Exploring the vibrant street food scene in Thailand.', 1),
    (4, 'Remote Work Productivity Tips',     'Working from home can be challenging.',                1),
    (4, 'Morning Routines That Work',        'How I start my day to maximize productivity.',         1),
    (4, 'Dealing with Burnout',              'Recognizing the signs and taking action to recover.',  0),
    (4, 'Time Management for Developers',    'Balancing coding, meetings, and personal time.',       1),
    (5, 'Hiking Trails in the Pacific Northwest', 'Breathtaking views and hidden gems.',             1),
    (5, 'Photography Tips for Travelers',    'Capture amazing memories with simple techniques.',     1),
    (5, 'Budget Travel Hacks',               'See the world without breaking the bank.',             0),
    (6, 'Book Review: The Midnight Library', 'A thought-provoking novel about life choices.',        1),
    (6, 'Creating a Reading Habit',          'How I went from reading 2 books to 50 per year.',      0),
    (7, 'React Hooks Explained',             'useState, useEffect, and custom hooks made simple.',   1),
    (7, 'CSS Grid vs Flexbox',               'When to use each layout method.',                      1),
    (7, 'API Design Best Practices',         'Creating RESTful APIs that are easy to use.',          1),
    (7, 'Docker for Beginners',              'Containerization made simple for new developers.',     0),
    (7, 'Testing Your JavaScript Code',      'Unit tests, integration tests, and why they matter.',  1),
    (8, 'Meditation for Busy Professionals', 'Finding peace in just 10 minutes a day.',              1),
    (8, 'Healthy Meal Prep Ideas',           'Save time and eat well with these simple recipes.',    1),
    (9, 'Introduction to Machine Learning',  'Understanding algorithms and real-world applications.',1),
    (9, 'Data Visualization with Python',    'Creating compelling charts using matplotlib.',         0),
    (9, 'The Future of Artificial Intelligence', 'How AI will shape our world in the next decade.',  1),
    (10,'Startup Lessons Learned',           'Mistakes I made and how you can avoid them.',          1),
    (10,'Building a Sustainable Business',   'Balancing profit with environmental responsibility.',  0);


-- ===== 附录：常用查询练习 =====

SELECT * FROM groups;
SELECT * FROM users;
SELECT * FROM blogs;

-- JOIN 查询
SELECT b.id, b.title, u.username, b.published
FROM blogs AS b
JOIN users AS u ON b.user_id = u.id;

-- 条件查询
SELECT * FROM blogs WHERE user_id = 1;
SELECT * FROM blogs WHERE published = 1;

-- 更新
UPDATE blogs SET title = 'My Updated Blog Title' WHERE id = 10;
UPDATE blogs SET published = 1 WHERE id = 4;
UPDATE users SET password = 'newpassword' WHERE id = 8;

-- 删除
DELETE FROM blogs WHERE id = 10;
DELETE FROM users WHERE id = 9;
