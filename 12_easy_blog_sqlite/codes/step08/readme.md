[← Back to Chapter Home](../../readme.md)

# Step 08: Tag-Filtered Blog List Page

Add a page that filters blogs by tag, reusing the homepage EJS template and writing a dedicated frontend script.

## What's New in This Step

- `src/routes/web/blogs.ts`: Add the `/web/blogs/tags?tag=:id` route
- `frontend/src/tag.ts`: CSR script for tag-filtered blog listing
- `views/partial/header.ejs`: Update tag link `href` values in the navigation bar
- `public/css/input.css`: Adjust layout styles

## Web Route

```typescript
router.get('/tags', async (req, res) => {
    const tag  = Number(req.query.tag);
    const tags = await getAllTags();
    // Find the tag name from the already-fetched tags array for the page title
    const tagName = tags.find(t => t.id === tag)?.name || 'Unknown';
    res.render('home.ejs', {
        title: `Easy Blog - ${tagName}`,
        script_name: 'tag.js',     // load tag.js instead of home.js
        tags
    });
    // The blog list is fetched by tag.js via /api/blogs/tag/:tag
});
```

> **Note on route order:** `/tags` must be defined before `/:id`, otherwise Express will match `tags` as the `:id` parameter.

## `frontend/src/tag.ts`: Reusing the Pagination Utility

```typescript
async function fetchAndRenderBlogsByTag(limit, offset, tag?) {
    const response = await fetch(`/api/blogs/tag/${tag}?limit=${limit}&offset=${offset}`);
    const blogs = await response.json();
    blogByTagList.innerHTML = blogs.data.map(blogTagToHtml).join("");
    renderPagination({ total: blogs.total, limit, offset, pagination, tag,
                       fetchAndRenderBlogs: fetchAndRenderBlogsByTag });
}

document.addEventListener("DOMContentLoaded", () => {
    // Read the tag parameter from the URL: /web/blogs/tags?tag=1
    const tag = new URLSearchParams(window.location.search).get("tag");
    tag ? fetchAndRenderBlogsByTag(5, 0, tag) : (blogByTagList.innerHTML = "<h2>No tag specified.</h2>");
});
```

`renderPagination` accepts an optional `tag` parameter and passes it through to the callback, so both the homepage and the tag page can share the same pagination utility function.

## Results

- Tag-filtered blog list page

  ![step08 tag page](../../assets/step08-01.png)
