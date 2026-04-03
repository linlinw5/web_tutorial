import { ConnectionManager } from "../../db/ConnectionManager.ts";
import type { Database } from "sqlite";

// mock config.ts and replace env with test so tests use test database
jest.mock("../../config.ts", () => {
  // Get original module content
  const config = jest.requireActual("../../config");
  // Return modified module content
  return {
    ...config,
    options: {
      ...config.options,
      env: "test", // Keep everything else unchanged; only set env to test
    },
  };
});

// Import tested functions after mock so tags.ts uses mocked config and test database
import { getAllTagsCached, getTagsByBlogId, clearTagsCache } from "../../db/tags.ts";

describe("Tags Functions", () => {
  let testManager: ConnectionManager;
  let testDb: Database;

  beforeAll(async () => {
    // Get test environment database instance
    testManager = ConnectionManager.getInstance("test");
    await testManager.initializeDatabase();
    testDb = await testManager.getConnection();
  });

  afterAll(async () => {
    await testManager.closeConnection();
  });

  beforeEach(async () => {
    // Clean related tables before each test
    await testDb.run("DELETE FROM blog_tags");
    await testDb.run("DELETE FROM blogs");
    await testDb.run("DELETE FROM tags");
    await testDb.run("DELETE FROM users");
    await testDb.run("DELETE FROM groups");
    // Reset auto-increment IDs
    await testDb.run('DELETE FROM sqlite_sequence WHERE name IN ("blogs", "blog_tags", "tags", "users", "groups")');

    // Clear cache to ensure each test is isolated
    clearTagsCache();

    // Re-insert base test data
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

      // Verify tag content
      const tagNames = tags.map((tag) => tag.name);
      expect(tagNames).toContain("JavaScript");
      expect(tagNames).toContain("TypeScript");
      expect(tagNames).toContain("React");
      expect(tagNames).toContain("Node.js");
      expect(tagNames).toContain("Testing");
    });

    test("should return cached data on second call", async () => {
      // First call
      const tags1 = await getAllTagsCached();
      expect(tags1).toHaveLength(5);

      // Add a new tag to DB (without clearing cache)
      await testDb.run("INSERT INTO tags (name) VALUES (?)", ["Vue.js"]);

      // Second call should return cached data (without the newly added tag)
      const tags2 = await getAllTagsCached();
      expect(tags2).toHaveLength(5); // Still 5 because cache is used
    });

    test("should refresh cache after clearTagsCache", async () => {
      // First call
      const tags1 = await getAllTagsCached();
      expect(tags1).toHaveLength(5);

      // Add a new tag
      await testDb.run("INSERT INTO tags (name) VALUES (?)", ["Vue.js"]);

      // Clear cache
      clearTagsCache();

      // Next call should fetch latest data
      const tags2 = await getAllTagsCached();
      expect(tags2).toHaveLength(6); // Includes newly added tag

      const tagNames = tags2.map((tag) => tag.name);
      expect(tagNames).toContain("Vue.js");
    });

    test("should handle empty tags table", async () => {
      // Clear tag table
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
      // Create test blog
      const result = await testDb.run(`
                INSERT INTO blogs (title, content, img, user_id, published) 
                VALUES ('Test Blog', 'Test content', 'test.jpg', 1, 1)
            `);
      blogId = result.lastID as number;
    });

    test("should return tags associated with a blog", async () => {
      // Associate tags with the blog
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

      // Verify returned tags
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
      // First call builds cache
      const tags1 = await getAllTagsCached();
      expect(tags1).toHaveLength(5);

      // Update database
      await testDb.run("INSERT INTO tags (name) VALUES (?)", ["Angular"]);

      // Clear cache
      clearTagsCache();

      // Next call should fetch latest data
      const tags2 = await getAllTagsCached();
      expect(tags2).toHaveLength(6);

      const tagNames = tags2.map((tag) => tag.name);
      expect(tagNames).toContain("Angular");
    });

    test("should be safe to call multiple times", () => {
      // Calling clearTagsCache multiple times should not throw
      expect(() => {
        clearTagsCache();
        clearTagsCache();
        clearTagsCache();
      }).not.toThrow();
    });
  });

  // Error handling tests - place at end because closing connection affects later tests
  describe("Error Handling", () => {
    test("should handle database connection errors", async () => {
      // Close DB connection to simulate connectivity issues
      await testManager.closeConnection();
      clearTagsCache(); // Clear cache to ensure re-query

      // Test error handling for both core functions
      await expect(getAllTagsCached()).rejects.toThrow();
      await expect(getTagsByBlogId(1)).rejects.toThrow();
    });
  });
});
