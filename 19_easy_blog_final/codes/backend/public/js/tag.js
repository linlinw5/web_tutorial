import { container } from "./models.js";
// container.innerHTML = "<h2>Tag page is under construction.</h2>";
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
                <p>${blog.created_at.split("T")[0]}</p>
                <h2><a href="/pages/${blog.id}">${blog.title}</a></h2>
                <hr>
                <p>Created By: ${blog.username}</p>
            </div>
        </div>
    `;
    return blogHtml;
}
async function fetchAndRenderBlogsByTag(tag, limit = 10, offset = 0) {
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
        renderPagination(tag, blogs.total, limit, offset);
    }
    catch (error) {
        console.error("Error fetching blogs by tag:", error);
        blogByTagList.innerHTML = "<h2>Error loading blogs by tag.</h2>";
    }
}
function renderPagination(tag, total, limit, offset) {
    pagination.innerHTML = ""; // Clear previous pagination
    let totalPages = Math.ceil((total) / limit);
    let currentPage = Math.floor((offset) / limit) + 1; // Calculate current page based on offset
    let startPage = currentPage - 2; // Start from 2 pages before the current page
    if (startPage < 1) {
        startPage = 1; // Ensure we don't go below page 1
    }
    let endPage = startPage + 4; // Show 5 pages in total
    if (endPage > totalPages) {
        endPage = totalPages; // Ensure we don't go above the total pages
        startPage = endPage - 4 > 0 ? endPage - 4 : 1; // Adjust start page if end page is at the limit
    }
    // Add "Previous" button
    const prevButton = document.createElement("button");
    prevButton.textContent = "<<";
    prevButton.classList.add("prev");
    if (currentPage > 1) {
        prevButton.addEventListener("click", () => {
            fetchAndRenderBlogsByTag(tag, limit, offset - limit);
        });
        pagination.appendChild(prevButton);
    }
    else {
        prevButton.disabled = true; // Disable if on the first page
        prevButton.classList.add("disabled");
        pagination.appendChild(prevButton);
    }
    // Add numbered page buttons
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i.toString();
        pageButton.classList.add("page");
        if (i === currentPage) {
            pageButton.classList.add("active"); // Highlight the current page
        }
        else {
            pageButton.addEventListener("click", () => {
                let newOffset = (i - 1) * limit; // Calculate new offset based on page number
                fetchAndRenderBlogsByTag(tag, limit, newOffset);
            });
        }
        pagination.appendChild(pageButton);
    }
    // add "Next" button
    const nextButton = document.createElement("button");
    nextButton.textContent = ">>";
    nextButton.classList.add("next");
    if (currentPage < totalPages) {
        nextButton.addEventListener("click", () => {
            fetchAndRenderBlogsByTag(tag, limit, offset + limit);
        });
        pagination.appendChild(nextButton);
    }
    else {
        nextButton.disabled = true; // Disable if on the last page
        nextButton.classList.add("disabled");
        pagination.appendChild(nextButton);
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const tag = new URLSearchParams(window.location.search).get("tag");
    if (tag) {
        fetchAndRenderBlogsByTag(tag);
    }
    else {
        blogByTagList.innerHTML = "<h2>No tag specified.</h2>";
    }
});
