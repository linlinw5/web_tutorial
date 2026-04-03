import pg from "pg";
import { dbConfig } from "../config.ts";

export const pool = new pg.Pool(dbConfig);

// 自动建表 + 初始化种子数据
// 使用 IF NOT EXISTS 保证幂等：重启服务不会重复建表
// 每张表独立检查 COUNT，支持部分初始化后重启继续完成剩余步骤
export async function initializeDatabase() {
  // ── 建表（按外键依赖顺序）──────────────────────────────────────────
  await pool.query(`
        CREATE TABLE IF NOT EXISTS groups (
            id   SERIAL PRIMARY KEY,
            name TEXT NOT NULL UNIQUE
        );
    `);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id         SERIAL PRIMARY KEY,
            group_id   INTEGER REFERENCES groups(id) ON DELETE SET NULL,
            username   TEXT NOT NULL UNIQUE,
            email      TEXT NOT NULL UNIQUE,
            password   TEXT NOT NULL,
            google_id  TEXT,
            avatar     TEXT,
            provider   TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS blogs (
            id         SERIAL PRIMARY KEY,
            user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            title      TEXT NOT NULL,
            content    TEXT NOT NULL,
            published  BOOLEAN DEFAULT FALSE,
            img        TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS tags (
            id   SERIAL PRIMARY KEY,
            name TEXT NOT NULL UNIQUE
        );
    `);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS blog_tags (
            id      SERIAL PRIMARY KEY,
            blog_id INTEGER NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
            tag_id  INTEGER NOT NULL REFERENCES tags(id)  ON DELETE CASCADE,
            UNIQUE(blog_id, tag_id)
        );
    `);

  // ── 种子数据（每张表独立检查，空表才插入）────────────────────────
  const { rows: groupRows } = await pool.query("SELECT COUNT(*) AS count FROM groups");
  if (Number(groupRows[0].count) === 0) {
    await pool.query(`INSERT INTO groups (name) VALUES ('Admin'), ('Editor'), ('Guest')`);
    console.log("Groups seeded.");
  }

  const { rows: tagRows } = await pool.query("SELECT COUNT(*) AS count FROM tags");
  if (Number(tagRows[0].count) === 0) {
    await pool.query(`INSERT INTO tags (name) VALUES ('Technical'), ('Life'), ('Education'), ('Travel'), ('Food')`);
    console.log("Tags seeded.");
  }

  // 密码哈希对应明文：123123（bcrypt, saltRounds=8）
  const { rows: userRows } = await pool.query("SELECT COUNT(*) AS count FROM users");
  if (Number(userRows[0].count) === 0) {
    const passwordHash = "$2b$08$FRkr0/mUucoezu16xnXcw.DgfeR577f0UF2mbqSRVNGNUA7WX1QH2";
    await pool.query(
      `
            INSERT INTO users (username, email, password, group_id, provider) VALUES
                ('alice',   'alice@abc.com',   $1, 1, 'local'),
                ('bob',     'bob@abc.com',     $1, 2, 'local'),
                ('charlie', 'charlie@abc.com', $1, 3, 'local'),
                ('diana',   'diana@abc.com',   $1, 1, 'local'),
                ('nina',    'nina@abc.com',    $1, 2, 'local'),
                ('oscar',   'oscar@abc.com',   $1, 2, 'local'),
                ('carol',   'carol@abc.com',   $1, 3, 'local'),
                ('dave',    'dave@abc.com',    $1, 1, 'local'),
                ('eve',     'eve@abc.com',     $1, 3, 'local')
        `,
      [passwordHash],
    );
    console.log("Users seeded. Default password: 123123");
  }

  const { rows: blogRows } = await pool.query("SELECT COUNT(*) AS count FROM blogs");
  if (Number(blogRows[0].count) === 0) {
    await pool.query(`
            INSERT INTO blogs (user_id, title, content, published, img) VALUES
                (1, 'Getting Started with Python',            'Python is a great language for beginners.',                                                              TRUE,  '/images/a1.avif'),
                (1, 'My Journey Learning to Code',            'It all started when I wrote my first Hello World program.',                                              FALSE, '/images/a2.avif'),
                (1, 'Best Practices for Clean Code',          'Writing readable code is more important than clever code.',                                              TRUE,  '/images/a3.avif'),
                (2, 'Digital Marketing Trends 2024',          'Social media and AI are changing how we market products.',                                               TRUE,  '/images/a4.avif'),
                (2, 'Content Creation Strategies',            'Consistency and authenticity are key to successful content.',                                            FALSE, '/images/a5.avif'),
                (3, 'The Art of Italian Cooking',             'Authentic Italian recipes passed down through generations.',                                             TRUE,  '/images/a6.avif'),
                (3, 'Street Food Adventures in Bangkok',      'Exploring the vibrant street food scene in Thailand.',                                                   TRUE,  '/images/a2.avif'),
                (4, 'Dealing with Burnout',                   'Recognizing the signs and taking action to recover.',                                                    FALSE, '/images/a3.avif'),
                (4, 'Time Management for Developers',         'Balancing coding, meetings, and personal time effectively.',                                             TRUE,  '/images/a6.avif'),
                (5, 'Hiking Trails in the Pacific Northwest', 'Discover breathtaking views and hidden gems in the mountains.',                                          TRUE,  '/images/a1.avif'),
                (3, 'Strategy travel focus beautiful walk.',  'One day I walked across a silent mountain. It taught me patience, silence, and appreciation.',           TRUE,  '/images/a2.avif'),
                (5, 'Unique data solve better moment.',       'Everything starts with asking the right questions. Then the answers become a natural flow.',             FALSE, '/images/a1.avif'),
                (1, 'Developers seek wisdom before lunch.',   'Tech culture is not only about work. It''s about the community and balance between code and life.',      TRUE,  '/images/a6.avif'),
                (1, 'People knowledge enjoy truth reason.',   'We value ideas that spread easily. That''s how the internet became such a transformative place.',        FALSE, '/images/a3.avif'),
                (4, 'Food styles reach across oceans.',       'Every dish has a story. Food is culture, history, and family passed from hand to hand.',                 TRUE,  '/images/a2.avif'),
                (2, 'New designs reflect modern users.',      'User experience is not just design. It''s empathy and insight woven into every interface.',              FALSE, '/images/a5.avif'),
                (4, 'Systems create value through order.',    'Efficiency doesn''t mean speed. It means clarity, consistency, and removing friction.',                  TRUE,  '/images/a4.avif'),
                (3, 'Balance comes through daily habits.',    'Success isn''t a one-time goal—it''s a set of habits repeated every day.',                               TRUE,  '/images/a2.avif'),
                (2, 'Insights emerge when we reflect.',       'Creativity requires rest. Without it, we can''t synthesize ideas into innovation.',                      TRUE,  '/images/a3.avif'),
                (3, 'Curiosity leads to unexpected places.',  'Never stop asking why. It''s the first step to every discovery worth sharing.',                          FALSE, '/images/a2.avif'),
                (4, 'Trust builds stronger communities.',     'When we trust one another, we create safety. And from safety, innovation thrives.',                      TRUE,  '/images/a4.avif'),
                (5, 'Learning never ends in this era.',       'Today''s skills become tomorrow''s foundation. Stay humble and keep building.',                          TRUE,  '/images/a5.avif'),
                (1, 'True design simplifies complexity.',     'Simplicity isn''t the absence of complexity—it''s the result of understanding.',                         FALSE, '/images/a1.avif'),
                (2, 'Digital growth needs human insight.',    'Marketing today is about knowing your audience better than they know themselves.',                        TRUE,  '/images/a4.avif'),
                (2, 'Effort matters more than perfection.',   'It''s better to publish and learn than to polish endlessly in the shadows.',                             FALSE, '/images/a5.avif'),
                (3, 'Ideas evolve with conversation.',        'The best ideas are forged in dialogue—not isolation.',                                                   TRUE,  '/images/a6.avif'),
                (1, 'Healthy minds need healthy spaces.',     'Your environment affects your output. Clear your space, and your mind will follow.',                     TRUE,  '/images/a2.avif'),
                (5, 'Nature heals and inspires action.',      'Time outdoors rewires our focus and fuels new perspectives.',                                            FALSE, '/images/a5.avif'),
                (4, 'Books are slow wisdom in pages.',        'A book is the only place where you can examine a thought slowly and in detail.',                         TRUE,  '/images/a6.avif'),
                (2, 'Learning from failure is strength.',     'Every mistake is feedback. Use it as a ladder, not a weight.',                                           TRUE,  '/images/a3.avif')
        `);
    console.log("Blogs seeded.");

    await pool.query(`
            INSERT INTO blog_tags (blog_id, tag_id) VALUES
                (3,2),(17,4),(8,1),(22,5),(10,3),(4,2),(13,1),(7,4),(16,3),(2,5),
                (25,1),(6,2),(19,5),(30,4),(12,3),(1,2),(14,5),(21,1),(5,3),(24,4),
                (11,2),(9,5),(18,1),(26,3),(15,4),(20,2),(28,5),(23,1),(27,4),(3,1),
                (17,2),(8,3),(22,4),(10,5),(4,1),(13,2),(7,3),(16,4),(2,1),(25,2),
                (6,3),(19,4),(30,5),(12,1),(14,2),(21,4),(5,1),(24,3),(11,5),(9,2),
                (18,3),(26,1),(15,5),(20,4),(28,3),(23,2),(27,5)
        `);
    console.log("Blog tags seeded.");
  }

  console.log("Database initialized.");
}
