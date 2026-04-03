-- Connect DataGrip with PostgreSQL, select your target database


-- Create tables, note the differences with SQLite
-- Note: PostgreSQL's SERIAL type automatically creates an auto-incrementing integer
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blogs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- Insert users
INSERT INTO users (username, email, password)
VALUES
    ('alice', 'alice@example.com', 'password123'),
    ('bob', 'bob@example.com', 'password123'),
    ('jack', 'jack@example.com', 'password123');

-- Insert blogs (unlike SQLite's BOOLEAN type, PostgreSQL uses TRUE/FALSE)
INSERT INTO blogs (user_id, title, content, published)
VALUES
    (1, 'My First Blog', 'This is the content of my first blog.', TRUE),
    (2, 'Bob''s Note', 'Unpublished content.', FALSE),
    (1, 'Alice''s Note', 'Unpublished content.', FALSE);

-- PostgreSQL's INSERT statement supports RETURNING clause to directly return inserted rows
INSERT INTO users (username, email, password)
VALUES
    ('john', 'john@abc.com', 'password123'),
    ('jane', 'jane@abc.com', 'password123')
RETURNING *;  -- Return the inserted rows


-- Query
SELECT * FROM users;
SELECT * FROM blogs;

SELECT b.id, b.title, u.username, b.published
FROM blogs b
JOIN users u ON b.user_id = u.id;

SELECT * FROM blogs WHERE user_id = 1;
SELECT * FROM blogs WHERE published = TRUE;


-- Update data
UPDATE blogs SET title = 'My Updated Blog Title' WHERE id = 1;
UPDATE blogs SET published = TRUE WHERE id = 2;
UPDATE users SET password = 'password456' WHERE id = 1 RETURNING *;  -- Return the updated rows
-- After UPDATE you can also add RETURNING clause to get the updated rows

-- Delete data
DELETE FROM blogs WHERE id = 2;
DELETE FROM users WHERE id = 2 RETURNING *;  -- Return the deleted rows
-- After DELETE you can also add RETURNING clause to get the deleted rows


-- Create a groups table to store user group information
CREATE TABLE IF NOT EXISTS groups (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);
-- Insert some initial user group data
INSERT INTO groups (name) VALUES ('Admin'), ('Editor'), ('Guest');



-- Modify users table, add group_id field
ALTER TABLE users ADD COLUMN group_id INTEGER;

-- Add foreign key constraint to group_id; PostgreSQL's ALTER TABLE can add it directly without rebuilding the table like SQLite
ALTER TABLE users
ADD CONSTRAINT fk_user_group
FOREIGN KEY (group_id) REFERENCES groups(id)
ON DELETE SET NULL;


-- Set default group for existing users
UPDATE users SET group_id = 2;






-- Insert large amount of test data
INSERT INTO users (username, email, password, group_id) VALUES
  ('nina', 'nina@abc.com', 'password123', 2),
  ('oscar', 'oscar@abc.com', 'password123', 1),
  ('carol', 'carol@abc.com', 'password123', 3),
  ('dave', 'dave@abc.com', 'davepass', 1),
  ('eve', 'eve@abc.com', 'eve12345', 2),
  ('frank', 'frank@abc.com', 'frankie!', 1),
  ('grace', 'grace@abc.com', 'password123', 3),
  ('heidi', 'heidi@abc.com', 'h3idipass', 2),
  ('ivan', 'ivan@abc.com', 'ivanivan', 1),
  ('judy', 'judy@abc.com', 'judyjudy', 3);

INSERT INTO blogs (user_id, title, content, published)
VALUES
  -- User 1's articles (4)
  (1, 'Getting Started with Python', 'Python is a great language for beginners. Here are the basics you need to know.', TRUE),
  (1, 'Data Structures in Programming', 'Understanding arrays, lists, and dictionaries is crucial for any developer.', TRUE),
  (1, 'My Journey Learning to Code', 'It all started when I wrote my first Hello World program...', FALSE),
  (1, 'Best Practices for Clean Code', 'Writing readable code is more important than clever code.', TRUE),
  -- User 3's articles (2)
  (3, 'The Art of Italian Cooking', 'Authentic Italian recipes passed down through generations.', TRUE),
  (3, 'Street Food Adventures in Bangkok', 'Exploring the vibrant street food scene in Thailand.', TRUE),
  -- User 4's articles (4)
  (4, 'Remote Work Productivity Tips', 'Working from home can be challenging. Here are my strategies.', TRUE),
  (4, 'Morning Routines That Work', 'How I start my day to maximize productivity and energy.', TRUE),
  (4, 'Dealing with Burnout', 'Recognizing the signs and taking action to recover.', FALSE),
  (4, 'Time Management for Developers', 'Balancing coding, meetings, and personal time effectively.', TRUE),
  -- User 5's articles (3)
  (5, 'Hiking Trails in the Pacific Northwest', 'Discover breathtaking views and hidden gems in the mountains.', TRUE),
  (5, 'Photography Tips for Travelers', 'Capture amazing memories with these simple techniques.', TRUE),
  (5, 'Budget Travel Hacks', 'See the world without breaking the bank.', FALSE),
  -- User 6's articles (2)
  (6, 'Book Review: The Midnight Library', 'A thought-provoking novel about life choices and possibilities.', TRUE),
  (6, 'Creating a Reading Habit', 'How I went from reading 2 books to 50 books per year.', FALSE),
  -- User 7's articles (5)
  (7, 'React Hooks Explained', 'useState, useEffect, and custom hooks made simple.', TRUE),
  (7, 'CSS Grid vs Flexbox', 'When to use each layout method for responsive design.', TRUE),
  (7, 'API Design Best Practices', 'Creating RESTful APIs that are easy to use and maintain.', TRUE),
  (7, 'Docker for Beginners', 'Containerization made simple for new developers.', FALSE),
  (7, 'Testing Your JavaScript Code', 'Unit tests, integration tests, and why they matter.', TRUE),
  -- User 8's articles (2)
  (8, 'Meditation for Busy Professionals', 'Finding peace and focus in just 10 minutes a day.', TRUE),
  (8, 'Healthy Meal Prep Ideas', 'Save time and eat well with these simple recipes.', TRUE),
  -- User 9's articles (3)
  (9, 'Introduction to Machine Learning', 'Understanding algorithms and their real-world applications.', TRUE),
  (9, 'Data Visualization with Python', 'Creating compelling charts and graphs using matplotlib.', FALSE),
  (9, 'The Future of Artificial Intelligence', 'How AI will shape our world in the next decade.', TRUE),
  -- User 10's articles (2)
  (10, 'Startup Lessons Learned', 'Mistakes I made and how you can avoid them.', TRUE),
  (10, 'Building a Sustainable Business', 'Balancing profit with environmental responsibility.', FALSE);



-- Appendix, random testing and practice
-- Query
SELECT * FROM groups;
SELECT * FROM users;
SELECT * FROM blogs;

SELECT b.id, b.title, u.username, b.published
FROM blogs b
JOIN users u ON b.user_id = u.id;

-- Update
UPDATE blogs SET title = 'My Updated Blog Title' WHERE id = 10;
UPDATE blogs SET published = TRUE WHERE id = 4;
UPDATE users SET password = 'password456' WHERE id = 8;

-- Delete
DELETE FROM blogs WHERE id = 10;
DELETE FROM users WHERE id = 9;
