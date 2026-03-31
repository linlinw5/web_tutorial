[← 返回章节首页](../../readme.md)

# Step 07：单篇博客页面样式

完善单篇博客页面的 EJS 模板和 CSS 样式，使内容正常排版显示。

## 本步骤新增内容

- `views/blog.ejs`：替换 `JSON.stringify` 占位，用正式的 HTML 结构渲染博客内容
- `public/css/input.css`：补充博客页相关的 Tailwind 自定义样式

## 单篇博客页面数据来源

博客页面的数据全部由服务端查询后传入 EJS（SSR），无需客户端脚本：

```ejs
<%- include('partial/header', { title, tags }) %>

<article>
    <h1><%= blog.title %></h1>
    <p><%= blog.created_at %> · <%= blog.username %></p>
    <img src="<%= blog.img %>" alt="cover">
    <div><%= blog.content %></div>

    <!-- 博客标签（由 getTagsByBlogId 查询后传入） -->
    <% blogTags.forEach(tag => { %>
        <span><%= tag.name %></span>
    <% }) %>
</article>

<%- include('partial/footer') %>
```

## 本步骤成果

- 单篇博客页

  ![step07 博客页](../../assets/step07-01.png)
