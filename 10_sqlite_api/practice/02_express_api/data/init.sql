-- Initialize database schema and test data
-- Open data/db.sqlite in DataGrip and execute this script

CREATE TABLE IF NOT EXISTS groups (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT    NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
    id         INTEGER  PRIMARY KEY AUTOINCREMENT,
    group_id   INTEGER,
    username   TEXT     NOT NULL UNIQUE,
    email      TEXT     NOT NULL UNIQUE,
    password   TEXT     NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE SET NULL
);

INSERT INTO groups (name) VALUES ('Admin'), ('Editor'), ('Guest');

INSERT INTO users (username, email, password, group_id)
VALUES
    ('nina',  'nina@abc.com',  'password123', 2),
    ('oscar', 'oscar@abc.com', 'password456', 2),
    ('carol', 'carol@abc.com', 'password123', 3),
    ('dave',  'dave@abc.com',  'davepass',    1),
    ('eve',   'eve@abc.com',   'eve12345',    3);
