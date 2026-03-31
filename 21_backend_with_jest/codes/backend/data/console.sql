-- 第一，创建table
CREATE TABLE IF NOT EXISTS groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE SET NULL
);

-- 以下为blog相关的表
CREATE TABLE IF NOT EXISTS blogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    published BOOLEAN DEFAULT 0,
    img TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 标签表，用于存储blog标签，blog和tag之间是多对多关系
CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

-- 新增中间表，处理多对多关系
CREATE TABLE IF NOT EXISTS blog_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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

-- 插入users数据
INSERT INTO users (username, email, password, group_id)
VALUES
    ('alice', 'alice@abc.com', 'password123', 1),
    ('bob', 'bob@abc.com', 'password456', 2),
    ('charlie', 'charlie@abc.com', 'password789', 3),
    ('diana', 'diana@abc.com', 'dianapass', 1),
    ('nina', 'nina@abc.com', 'password123', 2),
    ('oscar', 'oscar@abc.com', 'password456', 2),
    ('carol', 'carol@abc.com', 'password123', 3),
    ('dave', 'dave@abc.com', 'davepass', 1),
    ('eve', 'eve@abc.com', 'eve12345', 3);

INSERT INTO blogs (user_id, title, content, published, img)
VALUES
  (1, 'Getting Started with Python', 'Python is a great language for beginners.', 1, '/images/a1.avif'),
  (1, 'My Journey Learning to Code', 'It all started when I wrote my first Hello World program.', 0, '/images/a2.avif'),
  (1, 'Best Practices for Clean Code', 'Writing readable code is more important than clever code.', 1, '/images/a3.avif'),
  (2, 'Digital Marketing Trends 2024', 'Social media and AI are changing how we market products.', 1, '/images/a4.avif'),
  (2, 'Content Creation Strategies', 'Consistency and authenticity are key to successful content.', 0, '/images/a5.avif'),
  (3, 'The Art of Italian Cooking', 'Authentic Italian recipes passed down through generations.', 1, '/images/p1.avif'),
  (3, 'Street Food Adventures in Bangkok', 'Exploring the vibrant street food scene in Thailand.', 1, '/images/p2.avif'),
  (4, 'Dealing with Burnout', 'Recognizing the signs and taking action to recover.', 0, '/images/p3.avif'),
  (4, 'Time Management for Developers', 'Balancing coding, meetings, and personal time effectively.', 1, '/images/p4.avif'),
  (5, 'Hiking Trails in the Pacific Northwest', 'Discover breathtaking views and hidden gems in the mountains.', 1, '/images/p5.avif');


INSERT INTO blog_tags (blog_id, tag_id) VALUES 
(1, 1),  -- technical
(1, 3);  -- education







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

SELECT * FROM blogs WHERE published = 1;

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

UPDATE blogs SET published = 1 WHERE id = 4;

UPDATE users SET password = 'password456' WHERE id = 8;

-- 删除
DELETE FROM blogs WHERE id = 10;

DELETE FROM users WHERE id = 9;








-- 第四 - 海量blog数据 - 供测试

INSERT INTO blogs (user_id, title, content, published, img)
VALUES
  (3, 'Strategy travel focus beautiful walk.', 'One day I walked across a silent mountain. It taught me patience, silence, and appreciation.', 1, '/images/p5.avif'),
  (5, 'Unique data solve better moment.', 'Everything starts with asking the right questions. Then the answers become a natural flow.', 0, '/images/a1.avif'),
  (1, 'Developers seek wisdom before lunch.', 'Tech culture is not only about work. It’s about the community and balance between code and life.', 1, '/images/p3.avif'),
  (1, 'People knowledge enjoy truth reason.', 'We value ideas that spread easily. That’s how the internet became such a transformative place.', 0, '/images/p4.avif'),
  (4, 'Food styles reach across oceans.', 'Every dish has a story. Food is culture, history, and family passed from hand to hand.', 1, '/images/p2.avif'),
  (2, 'New designs reflect modern users.', 'User experience is not just design. It’s empathy and insight woven into every interface.', 0, '/images/a5.avif'),
  (4, 'Systems create value through order.', 'Efficiency doesn’t mean speed. It means clarity, consistency, and removing friction.', 1, '/images/a4.avif'),
  (3, 'Balance comes through daily habits.', 'Success isn’t a one-time goal—it’s a set of habits repeated every day.', 1, '/images/p1.avif'),
  (2, 'Insights emerge when we reflect.', 'Creativity requires rest. Without it, we can’t synthesize ideas into innovation.', 1, '/images/a3.avif'),
  (3, 'Curiosity leads to unexpected places.', 'Never stop asking why. It’s the first step to every discovery worth sharing.', 0, '/images/a2.avif'),
  (4, 'Trust builds stronger communities.', 'When we trust one another, we create safety. And from safety, innovation thrives.', 1, '/images/p5.avif'),
  (5, 'Learning never ends in this era.', 'Today’s skills become tomorrow’s foundation. Stay humble and keep building.', 1, '/images/p4.avif'),
  (1, 'True design simplifies complexity.', 'Simplicity isn’t the absence of complexity—it’s the result of understanding.', 0, '/images/a1.avif'),
  (2, 'Digital growth needs human insight.', 'Marketing today is about knowing your audience better than they know themselves.', 1, '/images/a4.avif'),
  (2, 'Effort matters more than perfection.', 'It’s better to publish and learn than to polish endlessly in the shadows.', 0, '/images/a5.avif'),
  (3, 'Ideas evolve with conversation.', 'The best ideas are forged in dialogue—not isolation.', 1, '/images/p3.avif'),
  (1, 'Healthy minds need healthy spaces.', 'Your environment affects your output. Clear your space, and your mind will follow.', 1, '/images/a2.avif'),
  (5, 'Nature heals and inspires action.', 'Time outdoors rewires our focus and fuels new perspectives.', 0, '/images/p5.avif'),
  (4, 'Books are slow wisdom in pages.', 'A book is the only place where you can examine a thought slowly and in detail.', 1, '/images/p1.avif'),
  (2, 'Learning from failure is strength.', 'Every mistake is feedback. Use it as a ladder, not a weight.', 1, '/images/a3.avif'),
  (1, 'Every project begins with vision.', 'Without vision, execution loses direction. Lead with purpose.', 1, '/images/a1.avif'),
  (3, 'Stories shape how we connect.', 'Storytelling is our most ancient tool for meaning-making and belonging.', 0, '/images/p2.avif'),
  (5, 'Solve problems, not symptoms.', 'Understanding the root cause is 90% of the work. Then the fix becomes clear.', 1, '/images/a2.avif'),
  (2, 'Calmness powers better decisions.', 'Panic leads to reactivity. Calm allows true reasoning.', 1, '/images/p3.avif'),
  (4, 'Writing is thinking made visible.', 'When we write, we see ourselves more clearly.', 0, '/images/a5.avif'),
  (3, 'Ask better questions for clarity.', 'Better inputs create better outcomes. Ask with precision.', 1, '/images/a3.avif'),
  (1, 'Purpose makes work sustainable.', 'Burnout fades when you reconnect with your why.', 0, '/images/a4.avif'),
  (2, 'Empathy is tech’s secret ingredient.', 'The best technology solves human problems gently.', 1, '/images/p1.avif'),
  (4, 'Meditation resets creative minds.', 'Stillness creates the space for new connections.', 1, '/images/p4.avif'),
  (3, 'Challenge sparks personal growth.', 'Discomfort is data—telling us where to explore next.', 1, '/images/p2.avif'),
  (5, 'Great leaders listen before acting.', 'Silence is often more powerful than speech.', 0, '/images/p5.avif'),
  (1, 'Create systems, not chaos.', 'Organize once so you can focus daily.', 1, '/images/a1.avif'),
  (3, 'Legacy is built day by day.', 'Your small actions compound into something great.', 0, '/images/p4.avif'),
  (4, 'Change begins with awareness.', 'Nothing improves until it is seen clearly.', 1, '/images/a2.avif'),
  (5, 'Good writing is rewriting.', 'The first draft reveals; the second refines.', 1, '/images/a5.avif'),
  (2, 'Doubt signals growth is near.', 'Doubt invites reflection—don’t fear it.', 0, '/images/a3.avif'),
  (1, 'Art connects beyond language.', 'Visuals carry feeling where words fall short.', 1, '/images/p1.avif'),
  (3, 'Simplicity is user’s best friend.', 'Less means more impact when it’s focused.', 1, '/images/a4.avif'),
  (2, 'Curated chaos is creativity.', 'Sometimes mess leads to magic.', 0, '/images/p2.avif'),
  (4, 'Listen deeply to be understood.', 'Most conversations are people waiting to talk.', 1, '/images/a5.avif'),
  (5, 'Ideas are seeds—share them.', 'Even unpolished thoughts can inspire.', 1, '/images/a1.avif'),
  (3, 'Growth needs friction sometimes.', 'If it’s too easy, you’re not learning.', 0, '/images/a3.avif'),
  (1, 'Truth outlasts trends.', 'Focus on timeless value, not fleeting hype.', 1, '/images/a2.avif'),
  (4, 'Self-care is leadership too.', 'You can’t lead if you’re running on empty.', 1, '/images/p5.avif'),
  (2, 'Code is poetry in logic.', 'Every function has rhythm and reason.', 1, '/images/a4.avif'),
  (5, 'Patience is underrated.', 'Fast doesn’t mean right. Steady wins.', 0, '/images/a1.avif'),
  (2, 'Energy flows where focus goes.', 'Attention is our most valuable currency.', 1, '/images/p4.avif'),
  (1, 'Effort compounds quietly.', 'What you do today builds tomorrow’s momentum.', 1, '/images/a2.avif'),
  (4, 'Kindness scales faster than code.', 'People remember how you made them feel.', 0, '/images/a5.avif');


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
(32, 3),
(34, 2),
(29, 1),
(31, 5),
(33, 4),
(36, 3),
(35, 1),
(38, 2),
(39, 4),
(37, 5),
(40, 3),
(42, 1),
(41, 2),
(44, 5),
(43, 3),
(46, 4),
(45, 2),
(47, 1),
(48, 3),
(49, 4),
(50, 5),
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
(27, 5),
(32, 1),
(34, 4),
(29, 2),
(31, 3),
(33, 5),
(36, 2),
(35, 4),
(38, 1),
(39, 3),
(37, 2),
(40, 5),
(42, 3),
(41, 4),
(44, 1),
(43, 2),
(46, 5),
(45, 3),
(47, 4),
(48, 1),
(49, 2),
(50, 3);
