import { ConnectionManager } from "../../db/ConnectionManager.ts";
import type { Database } from "sqlite";
import type { BlogsResponse } from "../../types/index.ts";

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

// Import tested functions after mock so blogs.ts uses mocked config and test database
import {
  getAllBlogs,
  getBlogById,
  getBlogsByTagId,
  createBlog,
  updateBlogById,
  deleteBlogById,
} from "../../db/blogs.ts";

describe("Blogs Functions", () => {
  let testManager: ConnectionManager;
  let testDb: Database;

  beforeAll(async () => {
    // Get test environment database instance
    testManager = ConnectionManager.getInstance("test");
    await testManager.initializeDatabase();
    testDb = await testManager.getConnection();

    // Insert base test data
    await testDb.run(`
            INSERT INTO groups (id, name)
            VALUES
            (1, 'test-group')
        `);
    await testDb.run(`
            INSERT INTO tags (id, name) VALUES 
            (1, 'JavaScript'),
            (2, 'TypeScript'),
            (3, 'React')
        `);
    await testDb.run(`
            INSERT INTO users (id, group_id, username, email, password) 
            VALUES
            (1, 1, 'testuser1', 'test1@example.com', 'hashedpassword1'),
            (2, 1, 'testuser2', 'test2@example.com', 'hashedpassword2')
        `);
  });

  afterAll(async () => {
    await testManager.closeConnection();
  });

  beforeEach(async () => {
    // Clean blogs and blog_tags tables before each test
    await testDb.run("DELETE FROM blog_tags");
    await testDb.run("DELETE FROM blogs");
    // Reset auto-increment IDs
    await testDb.run('DELETE FROM sqlite_sequence WHERE name IN ("blogs", "blog_tags")');
  });

  describe("getAllBlogs", () => {
    beforeEach(async () => {
      // Insert test data
      await testDb.run(`
                INSERT INTO blogs (title, content, img, user_id, published, created_at) 
                VALUES 
                ('First Blog', 'First content', 'first.jpg', 1, 1, '2023-01-01 10:00:00'),
                ('Second Blog', 'Second content', 'second.jpg', 2, 1, '2023-01-02 10:00:00'),
                ('Third Blog', 'Third content', 'third.jpg', 1, 0, '2023-01-03 10:00:00')
            `);
    });

    test("should return blogs with correct pagination and sorting", async () => {
      const result: BlogsResponse = await getAllBlogs(0, 2);

      expect(result.total).toBe(3);
      expect(result.data).toHaveLength(2);

      // Verify it includes user information
      expect(result.data[0].username).toBe("testuser1");
      expect(result.data[1].username).toBe("testuser2");
    });

    test("should return empty data when offset exceeds total", async () => {
      const result = await getAllBlogs(10, 5);

      expect(result.total).toBe(3);
      expect(result.data).toHaveLength(0);
    });
  });

  describe("getBlogById", () => {
    let blogId: number;

    beforeEach(async () => {
      const result = await testDb.run(`
                INSERT INTO blogs (title, content, img, user_id, published) 
                VALUES ('Test Blog', 'Test content', 'test.jpg', 1, 1)
            `);
      blogId = result.lastID as number;
    });

    test("should return blog with user information for valid ID", async () => {
      const blog = await getBlogById(blogId);

      expect(blog).toBeDefined();
      expect(blog!.id).toBe(blogId);
      expect(blog!.title).toBe("Test Blog");
    });

    test("should return undefined for non-existent ID", async () => {
      const blog = await getBlogById(999);
      expect(blog).toBeUndefined();
    });
  });

  describe("getBlogsByTagId", () => {
    beforeEach(async () => {
      // Insert data
      await testDb.run(`
                INSERT INTO blogs (id, title, content, img, user_id, published) 
                VALUES 
                (1, 'JS Blog', 'JavaScript content', 'js.jpg', 1, 1),
                (2, 'TS Blog', 'TypeScript content', 'ts.jpg', 2, 1),
                (3, 'React Blog', 'React content', 'react.jpg', 1, 1)
            `);
      await testDb.run(`
                INSERT INTO blog_tags (blog_id, tag_id) 
                VALUES (1, 1), (2, 1), (2, 2), (3, 3)
            `);
    });

    test("should return blogs filtered by tag with pagination", async () => {
      const result = await getBlogsByTagId(1, 0, 10);

      expect(result.total).toBe(2);
      expect(result.data).toHaveLength(2);

      const titles = result.data.map((blog) => blog.title);
      expect(titles).toEqual(["JS Blog", "TS Blog"]);
    });

    test("should return empty result for non-existent tag", async () => {
      const result = await getBlogsByTagId(999, 0, 10);

      expect(result.total).toBe(0);
      expect(result.data).toHaveLength(0);
    });
  });

  describe("createBlog", () => {
    test("should create a blog successfully with tags", async () => {
      const result = await createBlog("Test Blog Title", "This is test content", "test-image.jpg", 1, true, [1, 2]);

      expect(result.success).toBe(true);

      // Verify blog was created
      const blog = await testDb.get("SELECT * FROM blogs WHERE title = ?", ["Test Blog Title"]);
      expect(blog).toBeDefined();
      expect(blog.content).toBe("This is test content");

      // Verify tag associations
      const blogTags = await testDb.all("SELECT * FROM blog_tags WHERE blog_id = ?", [blog.id]);
      expect(blogTags).toHaveLength(2);
    });

    test("should create a blog without tags", async () => {
      const result = await createBlog("Blog Without Tags", "Content without tags", "no-tags.jpg", 1, false, []);

      expect(result.success).toBe(true);

      // Verify blog is created without tags
      const blog = await testDb.get("SELECT * FROM blogs WHERE title = ?", ["Blog Without Tags"]);
      expect(blog).toBeDefined();

      const blogTags = await testDb.all("SELECT * FROM blog_tags WHERE blog_id = ?", [blog.id]);
      expect(blogTags).toHaveLength(0);
    });

    test("should handle transaction rollback on invalid tag", async () => {
      await expect(
        createBlog(
          "Blog with Invalid Tag",
          "Content",
          "img.jpg",
          1,
          true,
          [999], // Non-existent tag ID
        ),
      ).rejects.toThrow("Failed to create blog");

      // Verify no partial data was inserted
      const blogs = await testDb.all("SELECT * FROM blogs");
      expect(blogs).toHaveLength(0);
    });
  });

  describe("updateBlogById", () => {
    let blogId: number;

    beforeEach(async () => {
      // Create test blog
      const result = await testDb.run(`
                INSERT INTO blogs (title, content, img, user_id, published) 
                VALUES ('Original Title', 'Original content', 'original.jpg', 1, 0)
            `);
      blogId = result.lastID as number;

      // Add initial tags
      await testDb.run("INSERT INTO blog_tags (blog_id, tag_id) VALUES (?, 1)", [blogId]);
    });

    test("should update blog and tags successfully", async () => {
      const result = await updateBlogById(blogId, "Updated Title", "Updated content", "updated.jpg", 2, true, [2, 3]);

      expect(result.success).toBe(true);

      // Verify blog update
      const blog = await testDb.get("SELECT * FROM blogs WHERE id = ?", [blogId]);
      expect(blog.title).toBe("Updated Title");
      expect(blog.content).toBe("Updated content");
      expect(blog.img).toBe("updated.jpg");
      expect(blog.user_id).toBe(2);
      expect(blog.published).toBe(1);

      // Verify tag update
      const blogTags = await testDb.all("SELECT tag_id FROM blog_tags WHERE blog_id = ? ORDER BY tag_id", [blogId]);
      expect(blogTags.map((bt: any) => bt.tag_id)).toEqual([2, 3]);
    });

    test("should return error for non-existent blog", async () => {
      const result = await updateBlogById(999, "Updated Title", "Updated content", "updated.jpg", 1, true, []);

      expect(result.success).toBe(false);
    });

    test("should handle empty tags update", async () => {
      const result = await updateBlogById(blogId, "No Tags Blog", "Content without tags", "notags.jpg", 1, false, []);

      expect(result.success).toBe(true);

      // Verify tags are cleared
      const blogTags = await testDb.all("SELECT * FROM blog_tags WHERE blog_id = ?", [blogId]);
      expect(blogTags).toHaveLength(0);
    });

    test("should handle transaction rollback on invalid tag in update", async () => {
      // Test transaction rollback and error handling of updateBlogById
      await expect(
        updateBlogById(
          blogId,
          "Updated with Invalid Tag",
          "Content",
          "img.jpg",
          1,
          true,
          [999], // Non-existent tag ID, will trigger foreign key constraint error
        ),
      ).rejects.toThrow("Failed to update blog");

      // Verify blog was not updated (transaction rollback)
      const blog = await testDb.get("SELECT title FROM blogs WHERE id = ?", [blogId]);
      expect(blog.title).toBe("Original Title"); // Should still be the original title
    });
  });

  describe("deleteBlogById", () => {
    let blogId: number;

    beforeEach(async () => {
      const result = await testDb.run(`
                INSERT INTO blogs (title, content, img, user_id, published) 
                VALUES ('To Delete', 'Delete content', 'delete.jpg', 1, 1)
            `);
      blogId = result.lastID as number;

      // Add tag associations
      await testDb.run("INSERT INTO blog_tags (blog_id, tag_id) VALUES (?, 1), (?, 2)", [blogId, blogId]);
    });

    test("should delete blog and cascade delete tags", async () => {
      const result = await deleteBlogById(blogId);

      expect(result.success).toBe(true);
      expect(result.message).toBe("Blog deleted successfully");

      // Verify blog was deleted
      const blog = await testDb.get("SELECT * FROM blogs WHERE id = ?", [blogId]);
      expect(blog).toBeUndefined();

      // Verify associated tags were also deleted
      const blogTags = await testDb.all("SELECT * FROM blog_tags WHERE blog_id = ?", [blogId]);
      expect(blogTags).toHaveLength(0);
    });

    test("should return error for non-existent blog", async () => {
      const result = await deleteBlogById(999);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Blog not found");
    });
  });

  // Error handling tests - place at end because closing connection affects later tests
  describe("Error Handling", () => {
    test("should handle database connection errors", async () => {
      // Close DB connection to simulate connectivity issues
      await testManager.closeConnection();

      // Test error handling of all major functions
      await expect(getAllBlogs(0, 10)).rejects.toThrow();
      await expect(getBlogById(1)).rejects.toThrow();
      await expect(getBlogsByTagId(1, 0, 10)).rejects.toThrow();
      await expect(createBlog("Test", "Content", "test.jpg", 1, true, [])).rejects.toThrow();
      await expect(updateBlogById(1, "Test", "Content", "test.jpg", 1, true, [])).rejects.toThrow();
      await expect(deleteBlogById(1)).rejects.toThrow();
    });
  });
});
