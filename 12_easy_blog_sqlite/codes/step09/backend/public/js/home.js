console.log("Frontend home.ts file loaded successfully.");
import { container } from "./elements.js";
import { renderPagination } from "./tools.js";
const pagination = document.createElement("div");
pagination.classList.add("pagination");
container.appendChild(pagination);
const blogGrid = document.createElement("div");
blogGrid.classList.add("blogGrid");
container.appendChild(blogGrid);
function blogToHtml(blog) {
    const blogHtml = `
        <div class="blogCard">
            <div class="image"><img src="${blog.img}" alt="default"></div>
            <div class="content">
                <p>${blog.created_at.split(" ")[0]}</p>
                <h2><a href="/web/blogs/${blog.id}">${blog.title}</a></h2>
                <hr>
                <p>${blog.content}</p>
            </div>
        </div>
    `;
    return blogHtml;
}
async function fetchAndRenderBlogs(limit = 6, offset = 0) {
    try {
        const response = await fetch(`/api/blogs?limit=${limit}&offset=${offset}`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const blogs = await response.json();
        blogGrid.innerHTML = blogs.data.map((blog) => blogToHtml(blog)).join("");
        const total = blogs.total;
        renderPagination({ total, limit, offset, pagination, fetchAndRenderBlogs });
    }
    catch (error) {
        console.error("Error fetching blogs:", error);
    }
}
document.addEventListener("DOMContentLoaded", () => {
    fetchAndRenderBlogs();
});
