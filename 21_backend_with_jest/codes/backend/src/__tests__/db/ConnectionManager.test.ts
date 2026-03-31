
import { ConnectionManager } from '../../db/ConnectionManager.ts';
import { Database } from 'sqlite';

describe('ConnectionManager test section', () => {
    let testManager: ConnectionManager;
 
    beforeEach(async () => {
        // 每个测试前获取测试环境的实例
        testManager = ConnectionManager.getInstance('test');
    });

    afterEach(async () => {
        // 每个测试后清理连接
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

            expect(manager1).toBe(manager2); // 应该是同一个实例
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
            
            expect(defaultManager).toBe(devManager); // 应该是同一个实例
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
            
            expect(db1).toBe(db2); // 应该是同一个连接实例
        });

        test('should use in-memory database for test environment', async () => {
            const db = await testManager.getConnection();
            
            // 在内存数据库中创建一个临时表来验证
            await db.exec("CREATE TABLE temp_test (id INTEGER PRIMARY KEY)");
            await db.run("INSERT INTO temp_test (id) VALUES (1)");
            
            // 验证数据存在
            const result = await db.get("SELECT * FROM temp_test WHERE id = 1");
            expect(result).toBeDefined();
            expect(result.id).toBe(1);
        });

    });

    describe('closeConnection', () => {
        test('should close the connection without throwing', async () => {
            // 先建立连接
            const db = await testManager.getConnection();
            expect(db).toBeDefined();
            
            // 关闭连接应该不抛出错误
            await expect(testManager.closeConnection()).resolves.not.toThrow();
        });

        test('should handle multiple close calls gracefully', async () => {
            await testManager.getConnection();
            
            // 多次关闭应该都不报错
            await expect(testManager.closeConnection()).resolves.not.toThrow();
            await expect(testManager.closeConnection()).resolves.not.toThrow();
        });

        test('should allow reconnection after close', async () => {
            // 建立初始连接
            const db1 = await testManager.getConnection();
            expect(db1).toBeDefined();
            
            // 关闭连接
            await testManager.closeConnection();
            
            // 重新连接
            await testManager.initializeDatabase();
            const db2 = await testManager.getConnection();
            expect(db2).toBeDefined();
            
            // 新连接应该是不同的实例（因为重新创建了）
            expect(db2).not.toBe(db1);
        });
    });

    describe('initializeDatabase', () => {
        test('should create required tables', async () => {
            await testManager.initializeDatabase();
            const db = await testManager.getConnection();
            
            // 检查表是否存在
            const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
            const tableNames = tables.map((table: any) => table.name);
            
            expect(tableNames).toContain('groups');
            expect(tableNames).toContain('users');
            expect(tableNames).toContain('blogs');
            expect(tableNames).toContain('tags');
            expect(tableNames).toContain('blog_tags');
        });

        test('should be safe to call multiple times', async () => {
            // 多次初始化应该不报错
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
            
            // 检查blogs表结构
            const blogsSchema = await db.all("PRAGMA table_info(blogs)");
            expect(blogsSchema.length).toBeGreaterThan(0);
            
            // 验证关键字段存在
            const columnNames = blogsSchema.map((col: any) => col.name);
            expect(columnNames).toContain('id');
            expect(columnNames).toContain('title');
            expect(columnNames).toContain('content');
            expect(columnNames).toContain('user_id');
        });
    });

});