
import { ConnectionManager } from '../../db/ConnectionManager.ts';
import { Database } from 'sqlite';

describe('ConnectionManager test section', () => {
    let testManager: ConnectionManager;
 
    beforeEach(async () => {
        // Get test environment instance before each test
        testManager = ConnectionManager.getInstance('test');
    });

    afterEach(async () => {
        // Clean up connection after each test
        await testManager.closeConnection();
    });

    describe('getInstance', () => {
        test('should create and return a database connection manager', () => {
            const manager = ConnectionManager.getInstance('test');
            expect(manager).toBeDefined();
            expect(manager).toBeInstanceOf(ConnectionManager);
        });

        test('should return the same instance for the same environment', () => {
            const manager1 = ConnectionManager.getInstance('test');
            const manager2 = ConnectionManager.getInstance('test');

            expect(manager1).toBe(manager2); // Should be the same instance
        });

        test('should return different instances for different environments', () => {
            const devManager = ConnectionManager.getInstance('dev');
            const testManager = ConnectionManager.getInstance('test');
            const prodManager = ConnectionManager.getInstance('prod');
            
            expect(devManager).not.toBe(testManager);
            expect(testManager).not.toBe(prodManager);
            expect(devManager).not.toBe(prodManager);
        });

        test('should use dev as default environment', () => {
            const defaultManager = ConnectionManager.getInstance();
            const devManager = ConnectionManager.getInstance('dev');
            
            expect(defaultManager).toBe(devManager); // Should be the same instance
        });
    });

    describe('getConnection', () => {
        test('should create and return a database connection', async () => {
            const db = await testManager.getConnection();

            expect(db).toBeDefined();
            expect(db).toBeInstanceOf(Database);
        });

        test('should return the same connection instance on multiple calls', async () => {
            const db1 = await testManager.getConnection();
            const db2 = await testManager.getConnection();
            
            expect(db1).toBe(db2); // Should be the same connection instance
        });

        test('should use in-memory database for test environment', async () => {
            const db = await testManager.getConnection();
            
            // Create a temporary table in in-memory DB for verification
            await db.exec("CREATE TABLE temp_test (id INTEGER PRIMARY KEY)");
            await db.run("INSERT INTO temp_test (id) VALUES (1)");
            
            // Verify data exists
            const result = await db.get("SELECT * FROM temp_test WHERE id = 1");
            expect(result).toBeDefined();
            expect(result.id).toBe(1);
        });

    });

    describe('closeConnection', () => {
        test('should close the connection without throwing', async () => {
            // Establish connection first
            const db = await testManager.getConnection();
            expect(db).toBeDefined();
            
            // Closing connection should not throw
            await expect(testManager.closeConnection()).resolves.not.toThrow();
        });

        test('should handle multiple close calls gracefully', async () => {
            await testManager.getConnection();
            
            // Multiple close calls should not throw
            await expect(testManager.closeConnection()).resolves.not.toThrow();
            await expect(testManager.closeConnection()).resolves.not.toThrow();
        });

        test('should allow reconnection after close', async () => {
            // Establish initial connection
            const db1 = await testManager.getConnection();
            expect(db1).toBeDefined();
            
            // Close connection
            await testManager.closeConnection();
            
            // Reconnect
            await testManager.initializeDatabase();
            const db2 = await testManager.getConnection();
            expect(db2).toBeDefined();
            
            // New connection should be a different instance (re-created)
            expect(db2).not.toBe(db1);
        });
    });

    describe('initializeDatabase', () => {
        test('should create required tables', async () => {
            await testManager.initializeDatabase();
            const db = await testManager.getConnection();
            
            // Check whether table exists
            const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
            const tableNames = tables.map((table: any) => table.name);
            
            expect(tableNames).toContain('groups');
            expect(tableNames).toContain('users');
            expect(tableNames).toContain('blogs');
            expect(tableNames).toContain('tags');
            expect(tableNames).toContain('blog_tags');
        });

        test('should be safe to call multiple times', async () => {
            // Multiple initializations should not throw
            await expect(testManager.initializeDatabase()).resolves.not.toThrow();
            await expect(testManager.initializeDatabase()).resolves.not.toThrow();
            await expect(testManager.initializeDatabase()).resolves.not.toThrow();
            
            const db = await testManager.getConnection();
            const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
            expect(tables.length).toBeGreaterThan(0);
        });

        test('should create tables with correct structure', async () => {
            await testManager.initializeDatabase();
            const db = await testManager.getConnection();
            
            // Check blogs table schema
            const blogsSchema = await db.all("PRAGMA table_info(blogs)");
            expect(blogsSchema.length).toBeGreaterThan(0);
            
            // Verify key fields exist
            const columnNames = blogsSchema.map((col: any) => col.name);
            expect(columnNames).toContain('id');
            expect(columnNames).toContain('title');
            expect(columnNames).toContain('content');
            expect(columnNames).toContain('user_id');
        });
    });

});