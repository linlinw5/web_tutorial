[← 返回章节首页](../../readme.md)

# Step 09：管理后台页面

实现管理员的博客管理界面：列表展示、新增和编辑功能。

## 本步骤新增内容

- `src/routes/web/admin.ts`：后台页面路由（3 个路由）
- `frontend/src/admin_home.ts`：后台首页 CSR 脚本（博客列表 + 删除）
- `frontend/src/admin_add_blog.ts`：新增博客页面的表单交互脚本
- `frontend/src/admin_edit_blog.ts`：编辑博客页面的表单交互脚本
- `views/addBlog.ejs`：新增博客表单页
- `views/editBlog.ejs`：编辑博客表单页

## Web 路由

```typescript
// 后台首页：CSR，加载 admin_home.js 展示博客列表
router.get('/', async (req, res) => {
    const tags = await getAllTags();
    res.render('home.ejs', { title: 'Admin Dashboard', tags, script_name: 'admin_home.js' });
});

// 新增博客页：SSR 渲染表单（tags 用于渲染 checkbox 列表）
router.get('/add', async (req, res) => {
    const tags = await getAllTags();
    res.render('addBlog.ejs', { title: 'Add Blog', tags, script_name: 'admin_add_blog.js' });
});

// 编辑博客页：SSR，服务端查询当前博客内容，预填表单
router.get('/edit/:id', async (req, res) => {
    const tags    = await getAllTags();
    const blog    = await getBlogById(blogId);
    const blogTags = await getTagsByBlogId(blogId);
    // 将 tags 转为 id 数组，便于 EJS 判断哪些 checkbox 应勾选
    const blogWithTags: BlogWithTags = { ...blog, tags: blogTags.map(tag => tag.id) };
    res.render('editBlog.ejs', { title: 'Edit Blog', tags, script_name: 'admin_edit_blog.js', blog: blogWithTags });
});
```

## CSR vs SSR 设计选择

| 页面 | 方式 | 原因 |
|---|---|---|
| 后台首页（博客列表） | CSR | 需要分页，且删除操作通过 JS 调用 API |
| 新增博客表单 | SSR | 表单结构固定，只有提交动作需要 JS |
| 编辑博客表单 | SSR | 需要在服务端查出当前博客数据预填字段 |

## 本步骤成果

- 后台首页（博客列表 + 操作按钮）

  ![step09 后台首页](../../assets/step09-01.png)

- 新增博客页

  ![step09 新增页](../../assets/step09-02.png)

- 编辑博客页

  ![step09 编辑页](../../assets/step09-03.png)

- 附加：自定义删除确认弹窗（遮罩层）

  ![step09 删除弹窗](../../assets/step09-04.png)
