import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

// Complete the following exercises here:
//
// 1. Connect to the database (open), file path: ./data/db.sqlite
//
// 2. Create tables with exec:
//    groups table (id, name)
//    users table (id, group_id FK, username, email, password, created_at)
//
// 3. Insert data with run (? placeholders):
//    Insert Admin / Editor / Guest into groups
//    Insert at least 2 records into users
//
// 4. Query all users with all
//
// 5. Query a single user with get (by username)
//
// 6. Update one record's password with run
//
// 7. Delete one record with run
//
// 8. Close the database connection (in finally block)
