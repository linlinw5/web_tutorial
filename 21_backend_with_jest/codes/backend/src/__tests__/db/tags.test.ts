import { ConnectionManager } from "../../db/ConnectionManager.ts";
import type { Database } from "sqlite";

// mock config.ts，替换其中的env为test，从而使用测试环境的数据库
jest.mock("../../config.ts", () => {
  // 获取原始模块内容
  const config = jest.requireActual("../../config");
  // 返回修改后的模块内容
  return {
    ...config,
    options: {
      ...config.options,
      env: "test", // 其余内容保持不变，我们只修改env为test
    },
  };
});

// 在 mock 之后导入被测试的函数，这样tags.ts中引用的config就是被mock过的了，会用测试环境的数据库
import { getAllTagsCached, getTagsByBlogId, clearTagsCache } from "../../db/tags.ts";

describe("Tags Functions", () => {
  let testManager: ConnectionManager;
  let testDb: Database;

  beforeAll(async () => {
    // 获取测试环境的数据库实例
    testManager = ConnectionManager.getInstance("test");
    await testManager.initializeDatabase();
    testDb = await testManager.getConnection();
  });

  afterAll(async () => {
    await testManager.closeConnection();
  });

  beforeEach(async () => {
    // 每个测试前清理相关表
    await testDb.run("DELETE FROM blog_tags");
    await testDb.run("DELETE FROM blogs");
    await testDb.run("DELETE FROM tags");
    await testDb.run("DELETE FROM users");
    await testDb.run("DELETE FROM groups");
    // 重置自增ID
    await testDb.run('DELETE FROM sqlite_sequence WHERE name IN ("blogs", "blog_tags", "tags", "users", "groups")');

    // 清除缓存，确保每个测试都是独立的
    clearTagsCache();

    // 重新插入测试基础数据
    await testDb.run(`INSERT INTO groups (id, name) VALUES (1, 'test-group')`);
    await testDb.run(`
            INSERT INTO users (id, group_id, username, email, password) 
            VALUES (1, 1, 'testuser1', 'test1@example.com', 'hashedpassword1')
        `);
    await testDb.run(`
            INSERT INTO tags (id, name) VALUES 
            (1, 'JavaScript'),
            (2, 'TypeScript'),
            (3, 'React'),
            (4, 'Node.js'),
            (5, 'Testing')
        `);
  });

  describe("getAllTagsCached", () => {
    test("should return all tags", async () => {
      const tags = await getAllTagsCached();

      expect(tags).toHaveLength(5);
      expect(tags[0]).toHaveProperty("id");
      expect(tags[0]).toHaveProperty("name");

      // 验证标签内容
      const tagNames = tags.map((tag) => tag.name);
      expect(tagNames).toContain("JavaScript");
      expect(tagNames).toContain("TypeScript");
      expect(tagNames).toContain("React");
      expect(tagNames).toContain("Node.js");
      expect(tagNames).toContain("Testing");
    });

    test("should return cached data on second call", async () => {
      // 第一次调用
      const tags1 = await getAllTagsCached();
      expect(tags1).toHaveLength(5);

      // 添加新标签到数据库（但不清除缓存）
      await testDb.run("INSERT INTO tags (name) VALUES (?)", ["Vue.js"]);

      // 第二次调用应该返回缓存的数据（不包含新添加的标签）
      const tags2 = await getAllTagsCached();
      expect(tags2).toHaveLength(5); // 仍然是5个，因为使用了缓存
    });

    test("should refresh cache after clearTagsCache", async () => {
      // 第一次调用
      const tags1 = await getAllTagsCached();
      expect(tags1).toHaveLength(5);

      // 添加新标签
      await testDb.run("INSERT INTO tags (name) VALUES (?)", ["Vue.js"]);

      // 清除缓存
      clearTagsCache();

      // 再次调用应该获取最新数据
      const tags2 = await getAllTagsCached();
      expect(tags2).toHaveLength(6); // 包含新添加的标签

      const tagNames = tags2.map((tag) => tag.name);
      expect(tagNames).toContain("Vue.js");
    });

    test("should handle empty tags table", async () => {
      // 清空标签表
      await testDb.run("DELETE FROM tags");
      clearTagsCache();

      const tags = await getAllTagsCached();
      expect(tags).toHaveLength(0);
      expect(Array.isArray(tags)).toBe(true);
    });
  });

  describe("getTagsByBlogId", () => {
    let blogId: number;

    beforeEach(async () => {
      // 创建测试博客
      const result = await testDb.run(`
                INSERT INTO blogs (title, content, img, user_id, published) 
                VALUES ('Test Blog', 'Test content', 'test.jpg', 1, 1)
            `);
      blogId = result.lastID as number;
    });

    test("should return tags associated with a blog", async () => {
      // 为博客关联标签
      await testDb.run(
        `
                INSERT INTO blog_tags (blog_id, tag_id) 
                VALUES (?, 1), (?, 3), (?, 5)
            `,
        [blogId, blogId, blogId],
      );

      const tags = await getTagsByBlogId(blogId);

      expect(tags).toHaveLength(3);
      expect(tags[0]).toHaveProperty("id");
      expect(tags[0]).toHaveProperty("name");

      // 验证返回的标签
      const tagNames = tags.map((tag) => tag.name);
      expect(tagNames).toContain("JavaScript");
      expect(tagNames).toContain("React");
      expect(tagNames).toContain("Testing");
    });

    test("should return empty array for blog with no tags", async () => {
      const tags = await getTagsByBlogId(blogId);

      expect(tags).toHaveLength(0);
      expect(Array.isArray(tags)).toBe(true);
    });

    test("should return empty array for non-existent blog", async () => {
      const tags = await getTagsByBlogId(999);

      expect(tags).toHaveLength(0);
      expect(Array.isArray(tags)).toBe(true);
    });
  });

  describe("clearTagsCache", () => {
    test("should clear the cache", async () => {
      // 第一次调用建立缓存
      const tags1 = await getAllTagsCached();
      expect(tags1).toHaveLength(5);

      // 修改数据库
      await testDb.run("INSERT INTO tags (name) VALUES (?)", ["Angular"]);

      // 清除缓存
      clearTagsCache();

      // 再次调用应该获取最新数据
      const tags2 = await getAllTagsCached();
      expect(tags2).toHaveLength(6);

      const tagNames = tags2.map((tag) => tag.name);
      expect(tagNames).toContain("Angular");
    });

    test("should be safe to call multiple times", () => {
      // 多次调用 clearTagsCache 应该不会出错
      expect(() => {
        clearTagsCache();
        clearTagsCache();
        clearTagsCache();
      }).not.toThrow();
    });
  });

  // 错误处理测试 - 放在最后，关闭连接会影响后续测试
  describe("Error Handling", () => {
    test("should handle database connection errors", async () => {
      // 关闭数据库连接，模拟连接问题
      await testManager.closeConnection();
      clearTagsCache(); // 清除缓存确保重新查询

      // 测试两个主要函数的错误处理
      await expect(getAllTagsCached()).rejects.toThrow();
      await expect(getTagsByBlogId(1)).rejects.toThrow();
    });
  });
});
