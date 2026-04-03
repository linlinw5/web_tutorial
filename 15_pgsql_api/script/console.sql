-- First, create tables
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

-- Second, insert - examples
-- Insert group data
INSERT INTO groups (name) VALUES 
  ('Admin'),
  ('Editor'),
  ('Guest')
RETURNING *;

-- Insert users data
INSERT INTO users (username, email, password, group_id)
VALUES
  ('nina', 'nina@abc.com', 'password123', 2),
  ('oscar', 'oscar@abc.com', 'password456', 2),
  ('carol', 'carol@abc.com', 'password123', 3),
  ('dave', 'dave@abc.com', 'davepass', 1),
  ('eve', 'eve@abc.com', 'eve12345', 3);

-- Third, delete, update, query - examples
-- Query all groups
SELECT * FROM groups;

-- Query all users
SELECT * FROM users;

-- Query users and their belonging groups
SELECT u.id, u.username, u.email, u.password, g.name AS group_name
FROM users AS u
JOIN groups AS g ON u.group_id = g.id
WHERE u.id = 1;

-- Query details of a specific user
SELECT * FROM users WHERE id = 1;

-- Update password of a specific user
UPDATE users SET password = 'password456' WHERE id = 8;

-- Delete a specific user
DELETE FROM users WHERE id = 9;
