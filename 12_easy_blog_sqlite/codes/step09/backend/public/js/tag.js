console.log("Frontend tag.ts file loaded successfully.");
import { container } from "./elements.js";
import { renderPagination } from "./tools.js";
const pagination = document.createElement("div");
pagination.classList.add("pagination");
container.appendChild(pagination);
const blogByTagList = document.createElement("div");
blogByTagList.classList.add("blogByTagList");
container.appendChild(blogByTagList);
function blogTagToHtml(blog) {
    const blogHtml = `
        <div class="blogCard blogByTag">
            <div class="image"><img src="${blog.img}" alt="default"></div>
            <div class="content">
                <p>${blog.created_at.split(" ")[0]}</p>
                <h2><a href="/web/blogs/${blog.id}">${blog.title}</a></h2>
                <hr>
                <p>Created By: ${blog.username}</p>
            </div>
        </div>
    `;
    return blogHtml;
}
async function fetchAndRenderBlogsByTag(limit, offset, tag) {
    try {
        const response = await fetch(`/api/blogs/tag/${tag}?limit=${limit}&offset=${offset}`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const blogs = await response.json();
        if (blogs.total === 0) {
            blogByTagList.innerHTML = "<h2>No blog content at current.</h2>";
            return;
        }
        blogByTagList.innerHTML = blogs.data.map(blogTagToHtml).join("");
        renderPagination({
            total: blogs.total,
            limit,
            offset,
            pagination,
            tag,
            fetchAndRenderBlogs: fetchAndRenderBlogsByTag
        });
    }
    catch (error) {
        console.error("Error fetching blogs by tag:", error);
        blogByTagList.innerHTML = "<h2>Error loading blogs by tag.</h2>";
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const tag = new URLSearchParams(window.location.search).get("tag");
    if (tag) {
        fetchAndRenderBlogsByTag(5, 0, tag);
    }
    else {
        blogByTagList.innerHTML = "<h2>No tag specified.</h2>";
    }
});
