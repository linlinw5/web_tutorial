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
    google_id TEXT,
    avatar TEXT,
    provider TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE SET NULL
);

-- 以下为blog相关的表
CREATE TABLE IF NOT EXISTS blogs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    published BOOLEAN DEFAULT FALSE,
    img TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 标签表，用于存储blog标签，blog和tag之间是多对多关系
CREATE TABLE IF NOT EXISTS tags (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- 新增中间表，处理多对多关系
CREATE TABLE IF NOT EXISTS blog_tags (
    id SERIAL PRIMARY KEY,
    blog_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    UNIQUE(blog_id, tag_id)  -- 防止重复关联
);



-- 第二，增 - 示例
-- 插入group/tags数据
INSERT INTO groups (name) VALUES ('Admin'), ('Editor'), ('Guest');
INSERT INTO tags (name) VALUES ('Technical'), ('Life'), ('Education'), ('Travel'), ('Food');

-- 插入users数据，默认密码123123
INSERT INTO users (username, email, password, group_id)
VALUES
    ('alice', 'alice@abc.com', '$2b$08$FRkr0/mUucoezu16xnXcw.DgfeR577f0UF2mbqSRVNGNUA7WX1QH2', 1),
    ('bob', 'bob@abc.com', '$2b$08$FRkr0/mUucoezu16xnXcw.DgfeR577f0UF2mbqSRVNGNUA7WX1QH2', 2),
    ('charlie', 'charlie@abc.com', '$2b$08$FRkr0/mUucoezu16xnXcw.DgfeR577f0UF2mbqSRVNGNUA7WX1QH2', 3),
    ('diana', 'diana@abc.com', '$2b$08$FRkr0/mUucoezu16xnXcw.DgfeR577f0UF2mbqSRVNGNUA7WX1QH2', 1),
    ('nina', 'nina@abc.com', '$2b$08$FRkr0/mUucoezu16xnXcw.DgfeR577f0UF2mbqSRVNGNUA7WX1QH2', 2),
    ('oscar', 'oscar@abc.com', '$2b$08$FRkr0/mUucoezu16xnXcw.DgfeR577f0UF2mbqSRVNGNUA7WX1QH2', 2),
    ('carol', 'carol@abc.com', '$2b$08$FRkr0/mUucoezu16xnXcw.DgfeR577f0UF2mbqSRVNGNUA7WX1QH2', 3),
    ('dave', 'dave@abc.com', '$2b$08$FRkr0/mUucoezu16xnXcw.DgfeR577f0UF2mbqSRVNGNUA7WX1QH2', 1),
    ('eve', 'eve@abc.com', '$2b$08$FRkr0/mUucoezu16xnXcw.DgfeR577f0UF2mbqSRVNGNUA7WX1QH2', 3);

INSERT INTO blogs (user_id, title, content, published, img)
VALUES
  (1, 'Getting Started with Python', 'Python is a great language for beginners.', TRUE, '/images/a1.avif'),
  (1, 'My Journey Learning to Code', 'It all started when I wrote my first Hello World program.', FALSE, '/images/a2.avif'),
  (1, 'Best Practices for Clean Code', 'Writing readable code is more important than clever code.', TRUE, '/images/a3.avif'),
  (2, 'Digital Marketing Trends 2024', 'Social media and AI are changing how we market products.', TRUE, '/images/a4.avif'),
  (2, 'Content Creation Strategies', 'Consistency and authenticity are key to successful content.', FALSE, '/images/a5.avif'),
  (3, 'The Art of Italian Cooking', 'Authentic Italian recipes passed down through generations.', TRUE, '/images/a6.avif'),
  (3, 'Street Food Adventures in Bangkok', 'Exploring the vibrant street food scene in Thailand.', TRUE, '/images/a2.avif'),
  (4, 'Dealing with Burnout', 'Recognizing the signs and taking action to recover.', FALSE, '/images/a3.avif'),
  (4, 'Time Management for Developers', 'Balancing coding, meetings, and personal time effectively.', TRUE, '/images/a6.avif'),
  (5, 'Hiking Trails in the Pacific Northwest', 'Discover breathtaking views and hidden gems in the mountains.', TRUE, '/images/a1.avif'),
  (3, 'Strategy travel focus beautiful walk.', 'One day I walked across a silent mountain. It taught me patience, silence, and appreciation.', TRUE, '/images/a2.avif'),
  (5, 'Unique data solve better moment.', 'Everything starts with asking the right questions. Then the answers become a natural flow.', FALSE, '/images/a1.avif'),
  (1, 'Developers seek wisdom before lunch.', 'Tech culture is not only about work. It''s about the community and balance between code and life.', TRUE, '/images/a6.avif'),
  (1, 'People knowledge enjoy truth reason.', 'We value ideas that spread easily. That''s how the internet became such a transformative place.', FALSE, '/images/a3.avif'),
  (4, 'Food styles reach across oceans.', 'Every dish has a story. Food is culture, history, and family passed from hand to hand.', TRUE, '/images/a2.avif'),
  (2, 'New designs reflect modern users.', 'User experience is not just design. It''s empathy and insight woven into every interface.', FALSE, '/images/a5.avif'),
  (4, 'Systems create value through order.', 'Efficiency doesn''t mean speed. It means clarity, consistency, and removing friction.', TRUE, '/images/a4.avif'),
  (3, 'Balance comes through daily habits.', 'Success isn''t a one-time goal—it''s a set of habits repeated every day.', TRUE, '/images/a2.avif'),
  (2, 'Insights emerge when we reflect.', 'Creativity requires rest. Without it, we can''t synthesize ideas into innovation.', TRUE, '/images/a3.avif'),
  (3, 'Curiosity leads to unexpected places.', 'Never stop asking why. It''s the first step to every discovery worth sharing.', FALSE, '/images/a2.avif'),
  (4, 'Trust builds stronger communities.', 'When we trust one another, we create safety. And from safety, innovation thrives.', TRUE, '/images/a4.avif'),
  (5, 'Learning never ends in this era.', 'Today''s skills become tomorrow''s foundation. Stay humble and keep building.', TRUE, '/images/a5.avif'),
  (1, 'True design simplifies complexity.', 'Simplicity isn''t the absence of complexity—it''s the result of understanding.', FALSE, '/images/a1.avif'),
  (2, 'Digital growth needs human insight.', 'Marketing today is about knowing your audience better than they know themselves.', TRUE, '/images/a4.avif'),
  (2, 'Effort matters more than perfection.', 'It''s better to publish and learn than to polish endlessly in the shadows.', FALSE, '/images/a5.avif'),
  (3, 'Ideas evolve with conversation.', 'The best ideas are forged in dialogue—not isolation.', TRUE, '/images/a6.avif'),
  (1, 'Healthy minds need healthy spaces.', 'Your environment affects your output. Clear your space, and your mind will follow.', TRUE, '/images/a2.avif'),
  (5, 'Nature heals and inspires action.', 'Time outdoors rewires our focus and fuels new perspectives.', FALSE, '/images/a5.avif'),
  (4, 'Books are slow wisdom in pages.', 'A book is the only place where you can examine a thought slowly and in detail.', TRUE, '/images/a6.avif'),
  (2, 'Learning from failure is strength.', 'Every mistake is feedback. Use it as a ladder, not a weight.', TRUE, '/images/a3.avif');



INSERT INTO blog_tags (blog_id, tag_id) VALUES
(3, 2),
(17, 4),
(8, 1),
(22, 5),
(10, 3),
(4, 2),
(13, 1),
(7, 4),
(16, 3),
(2, 5),
(25, 1),
(6, 2),
(19, 5),
(30, 4),
(12, 3),
(1, 2),
(14, 5),
(21, 1),
(5, 3),
(24, 4),
(11, 2),
(9, 5),
(18, 1),
(26, 3),
(15, 4),
(20, 2),
(28, 5),
(23, 1),
(27, 4),
(3, 1),
(17, 2),
(8, 3),
(22, 4),
(10, 5),
(4, 1),
(13, 2),
(7, 3),
(16, 4),
(2, 1),
(25, 2),
(6, 3),
(19, 4),
(30, 5),
(12, 1),
(14, 2),
(21, 4),
(5, 1),
(24, 3),
(11, 5),
(9, 2),
(18, 3),
(26, 1),
(15, 5),
(20, 4),
(28, 3),
(23, 2),
(27, 5);




-- 第三 - 删、改、查 - 示例
-- 查询
SELECT * FROM groups;
SELECT * FROM users;
SELECT * FROM blogs;
SELECT * FROM blogs ORDER BY created_at DESC LIMIT 5 OFFSET 0;

SELECT b.id, b.title, b.content, b.published, b.user_id, b.created_at, u.username
FROM blogs as b
JOIN users u on u.id = b.user_id
WHERE b.id = 1;

SELECT u.id, u.username, u.email,u.password, g.name as group_name
FROM users as u
JOIN groups as g ON u.group_id = g.id
WHERE u.id = 1;

SELECT b.id, b.title, u.username, b.published
FROM blogs as b
JOIN users as u ON b.user_id = u.id;

SELECT * FROM blogs WHERE user_id = 1;
SELECT * FROM blogs WHERE published = TRUE;

-- 查询某个 blog 的所有 tag
SELECT b.title, t.name as tag_name
FROM blogs b
JOIN blog_tags bt ON b.id = bt.blog_id
JOIN tags t ON bt.tag_id = t.id
WHERE b.id = 1;

SELECT t.id, t.name
FROM tags t
JOIN blog_tags bt ON t.id = bt.tag_id
WHERE bt.blog_id = 1;


-- 查询某个 tag 下的所有 blog
SELECT b.title, b.user_id, b.published, b.created_at, u.username
FROM blogs b
JOIN users u ON b.user_id = u.id
JOIN blog_tags bt ON b.id = bt.blog_id
WHERE bt.tag_id = 1;  -- technical 标签


-- 更新
UPDATE blogs SET title = 'My Updated Blog Title' WHERE id = 10;
UPDATE blogs SET published = TRUE WHERE id = 4;
UPDATE users SET password = 'password456' WHERE id = 8;

-- 删除
DELETE FROM blogs WHERE id = 10;
DELETE FROM users WHERE id = 9;






