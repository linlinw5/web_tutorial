import { ConnectionManager } from "../../db/ConnectionManager.ts";
import type { Database } from "sqlite";
import type { BlogsResponse } from "../../types/index.ts";

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

// 在 mock 之后导入被测试的函数，这样blogs.ts中引用的config就是被mock过的了，会用测试环境的数据库
import { getAllBlogs, getBlogById, getBlogsByTagId, createBlog, updateBlogById, deleteBlogById } from "../../db/blogs.ts";

describe("Blogs Functions", () => {
  let testManager: ConnectionManager;
  let testDb: Database;

  beforeAll(async () => {
    // 获取测试环境的数据库实例
    testManager = ConnectionManager.getInstance("test");
    await testManager.initializeDatabase();
    testDb = await testManager.getConnection();

    // 插入测试基础数据
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
    // 每个测试前清理 blogs 和 blog_tags 表
    await testDb.run("DELETE FROM blog_tags");
    await testDb.run("DELETE FROM blogs");
    // 重置自增ID
    await testDb.run('DELETE FROM sqlite_sequence WHERE name IN ("blogs", "blog_tags")');
  });

  describe("getAllBlogs", () => {
    beforeEach(async () => {
      // 插入测试数据
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

      // 验证包含用户信息
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
      // 插入数据
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

      // 验证博客是否被创建
      const blog = await testDb.get("SELECT * FROM blogs WHERE title = ?", ["Test Blog Title"]);
      expect(blog).toBeDefined();
      expect(blog.content).toBe("This is test content");

      // 验证标签关联
      const blogTags = await testDb.all("SELECT * FROM blog_tags WHERE blog_id = ?", [blog.id]);
      expect(blogTags).toHaveLength(2);
    });

    test("should create a blog without tags", async () => {
      const result = await createBlog("Blog Without Tags", "Content without tags", "no-tags.jpg", 1, false, []);

      expect(result.success).toBe(true);

      // 验证博客被创建但没有标签
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
          [999], // 不存在的标签ID
        ),
      ).rejects.toThrow("Failed to create blog");

      // 验证没有部分数据被插入
      const blogs = await testDb.all("SELECT * FROM blogs");
      expect(blogs).toHaveLength(0);
    });
  });

  describe("updateBlogById", () => {
    let blogId: number;

    beforeEach(async () => {
      // 创建测试博客
      const result = await testDb.run(`
                INSERT INTO blogs (title, content, img, user_id, published) 
                VALUES ('Original Title', 'Original content', 'original.jpg', 1, 0)
            `);
      blogId = result.lastID as number;

      // 添加初始标签
      await testDb.run("INSERT INTO blog_tags (blog_id, tag_id) VALUES (?, 1)", [blogId]);
    });

    test("should update blog and tags successfully", async () => {
      const result = await updateBlogById(blogId, "Updated Title", "Updated content", "updated.jpg", 2, true, [2, 3]);

      expect(result.success).toBe(true);

      // 验证博客更新
      const blog = await testDb.get("SELECT * FROM blogs WHERE id = ?", [blogId]);
      expect(blog.title).toBe("Updated Title");
      expect(blog.content).toBe("Updated content");
      expect(blog.img).toBe("updated.jpg");
      expect(blog.user_id).toBe(2);
      expect(blog.published).toBe(1);

      // 验证标签更新
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

      // 验证标签被清空
      const blogTags = await testDb.all("SELECT * FROM blog_tags WHERE blog_id = ?", [blogId]);
      expect(blogTags).toHaveLength(0);
    });

    test("should handle transaction rollback on invalid tag in update", async () => {
      // 测试 updateBlogById 的事务回滚和错误处理
      await expect(
        updateBlogById(
          blogId,
          "Updated with Invalid Tag",
          "Content",
          "img.jpg",
          1,
          true,
          [999], // 不存在的标签ID，会触发外键约束错误
        ),
      ).rejects.toThrow("Failed to update blog");

      // 验证博客没有被更新（事务回滚）
      const blog = await testDb.get("SELECT title FROM blogs WHERE id = ?", [blogId]);
      expect(blog.title).toBe("Original Title"); // 应该还是原来的标题
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

      // 添加标签关联
      await testDb.run("INSERT INTO blog_tags (blog_id, tag_id) VALUES (?, 1), (?, 2)", [blogId, blogId]);
    });

    test("should delete blog and cascade delete tags", async () => {
      const result = await deleteBlogById(blogId);

      expect(result.success).toBe(true);
      expect(result.message).toBe("Blog deleted successfully");

      // 验证博客被删除
      const blog = await testDb.get("SELECT * FROM blogs WHERE id = ?", [blogId]);
      expect(blog).toBeUndefined();

      // 验证关联标签也被删除
      const blogTags = await testDb.all("SELECT * FROM blog_tags WHERE blog_id = ?", [blogId]);
      expect(blogTags).toHaveLength(0);
    });

    test("should return error for non-existent blog", async () => {
      const result = await deleteBlogById(999);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Blog not found");
    });
  });

  // 错误处理测试 - 放在最后，关闭连接会影响后续测试
  describe("Error Handling", () => {
    test("should handle database connection errors", async () => {
      // 关闭数据库连接，模拟连接问题
      await testManager.closeConnection();

      // 测试所有主要函数的错误处理
      await expect(getAllBlogs(0, 10)).rejects.toThrow();
      await expect(getBlogById(1)).rejects.toThrow();
      await expect(getBlogsByTagId(1, 0, 10)).rejects.toThrow();
      await expect(createBlog("Test", "Content", "test.jpg", 1, true, [])).rejects.toThrow();
      await expect(updateBlogById(1, "Test", "Content", "test.jpg", 1, true, [])).rejects.toThrow();
      await expect(deleteBlogById(1)).rejects.toThrow();
    });
  });
});
