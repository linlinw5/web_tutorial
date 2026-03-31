import { Blog, container } from "./models.ts"

const blogNewest = document.createElement("div");
blogNewest.classList.add("blogNewest");
container.appendChild(blogNewest);

const pagination = document.createElement("div");
pagination.classList.add("pagination");
container.appendChild(pagination);

const blogGrid = document.createElement("div");
blogGrid.classList.add("blogGrid");
container.appendChild(blogGrid);

function blogToHtml(blog: Blog): string {
    const blogHtml = `
        <div class="blogCard">
            <div class="image"><img src="${blog.img}" alt="default"></div>
            <div class="content">
                <p>${blog.created_at.split("T")[0]}</p>
                <h2><a href="/pages/${blog.id}">${blog.title}</a></h2>
                <hr>
                <p>${blog.content}</p>
            </div>
        </div>
    `;
    return blogHtml;  
}

async function fetchAndRenderNewest() {
    try {
        const response = await fetch("/api/blogs?limit=1");
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const blogs = await response.json();

        if (blogs.total === 0) {
            container.innerHTML = "<h2>No blog content at current.</h2>";
            return;
        }
        blogNewest.innerHTML = blogToHtml(blogs.data[0]);
        
    } catch (error) {
        console.error("Error fetching blogs:", error);
    }
}

async function fetchAndRenderOthers(limit: number = 6, offset: number = 1) {
    try {
        const response = await fetch(`/api/blogs?limit=${limit}&offset=${offset}`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const blogs = await response.json();

        blogGrid.innerHTML = blogs.data.map((blog: Blog) => blogToHtml(blog)).join("");

        renderPagination(blogs.total - 1, limit, offset);

    } catch (error) {
        console.error("Error fetching blogs:", error);
    }
}

async function renderPagination(total: number, limit: number, offset: number) {
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
            fetchAndRenderOthers(limit, offset - limit);
        });
        pagination.appendChild(prevButton);
    } else {
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
        } else {
            pageButton.addEventListener("click", () => {
                let newOffset = (i - 1) * limit + 1; // Calculate new offset based on page number
                fetchAndRenderOthers(limit, newOffset);
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
            fetchAndRenderOthers(limit, offset + limit);
        });
        pagination.appendChild(nextButton);
    } else {
        nextButton.disabled = true; // Disable if on the last page
        nextButton.classList.add("disabled");
        pagination.appendChild(nextButton);
    }
}


document.addEventListener("DOMContentLoaded", () => {

    fetchAndRenderNewest();
    fetchAndRenderOthers();
});
