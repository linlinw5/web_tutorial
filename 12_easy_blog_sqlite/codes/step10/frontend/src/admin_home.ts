console.log("Frontend admin_blogs.ts file loaded successfully.");
import { container } from "./elements.ts";
import { Blog } from "./types.ts";
import { renderPagination } from "./tools.ts";

// After clicking the delete button, show an overlay prompt with confirm and cancel buttons
const overlay = document.createElement("div");
overlay.classList.add("overlay");
const confirmDiv = document.createElement("div");
confirmDiv.classList.add("confirmDiv");
const confirmText = document.createElement("p");
confirmText.innerHTML = "Are you sure you want to delete this blog?";
const buttonDiv = document.createElement("div");
buttonDiv.classList.add("buttonDiv");
const cancelButton = document.createElement("button");
cancelButton.textContent = "Cancel";
cancelButton.classList.add("editButton");
const deleteButton = document.createElement("button");
deleteButton.textContent = "delete";
deleteButton.classList.add("deleteButton");
buttonDiv.appendChild(cancelButton);
buttonDiv.appendChild(deleteButton);
confirmDiv.appendChild(confirmText);
confirmDiv.appendChild(buttonDiv);
overlay.appendChild(confirmDiv);
document.body.appendChild(overlay);
// The overlay must cover the whole page, so append it directly to body; if it is appended to the container, it will only cover the container area



// Create the blog list and pagination elements
const pagination = document.createElement("div");
pagination.classList.add("pagination");
container.appendChild(pagination);

const addButton = document.createElement("button");
addButton.textContent = "Add New Blog";
addButton.classList.add("addButton");
addButton.addEventListener("click", () => addBlog());
container.appendChild(addButton);

const blogList = document.createElement("div");
blogList.classList.add("blogList");
container.appendChild(blogList);


function deleteBlog(blogId: number, limit: number, offset: number) {
    // The simplest way is to use the browser built-in confirm dialog
    // if (confirm("Are you sure you want to delete this blog?")) {
    //     // Blog deletion logic
    //     console.log(`Deleting blog with ID: ${blogId}`);
    // }
    // But the browser built-in confirm dialog looks ugly and cannot be customized, so the experience is poor; this approach is fine for now and can be improved later

    // I am using a slightly more complex approach now: implementing an overlay and confirmation dialog myself
    overlay.style.display = "block"; // Show the overlay
    cancelButton.onclick = () => {
        overlay.style.display = "none"; // Hide the overlay on cancel
    }
    deleteButton.onclick = async () => {
        overlay.style.display = "none"; // Hide the overlay after confirmation
        // Proceed with the deletion
        console.log(`Deleting blog with ID: ${blogId}`);
        try {
            const response = await fetch(`/api/blogs/${blogId}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            console.log(`Blog with ID ${blogId} deleted successfully.`);
            // Re-fetch and render the blog list after deletion
            fetchAndRenderBlogs(limit, offset);
        } catch (error) {
            console.error("Error deleting blog:", error);
        }
    }
}

async function editBlog(blogId: number) {
    console.log(`Editing blog with ID: ${blogId}`);
    window.location.href = `/web/admin/edit/${blogId}`; // Redirect to the edit blog page
}

async function addBlog() {
    console.log("Adding new blog");
    window.location.href = "/web/admin/add"; // Redirect to the add blog page
}


async function fetchAndRenderBlogs(limit: number = 10, offset: number = 0) {
    try {
        const response = await fetch(`/api/blogs?limit=${limit}&offset=${offset}`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const blogs = await response.json();
        // console.log("Fetched blogs:", blogs);
        if (blogs.total === 0) {
            blogList.innerHTML = "<h2>No blog content at current.</h2>";
            return;
        }
        blogList.innerHTML = ""; // Clear previous blog list

        blogs.data.forEach((blog: Blog) => {
            const blogDiv = document.createElement("div");
            blogDiv.classList.add("blogLine");

            const infoDiv = document.createElement("div");
            infoDiv.classList.add("infoDiv");

            const bloCreatedAt = document.createElement("p");
            bloCreatedAt.textContent = blog.created_at.split(" ")[0];

            const blogTitle = document.createElement("h3");
            blogTitle.innerHTML = `<a href="/web/blogs/${blog.id}">${blog.title}</a>`;

            infoDiv.appendChild(bloCreatedAt);
            infoDiv.appendChild(blogTitle);

            const buttonDiv = document.createElement("div");
            buttonDiv.classList.add("buttonDiv");

            const blogDeleteButton = document.createElement("button");
            blogDeleteButton.textContent = "Delete";
            blogDeleteButton.classList.add("deleteButton");
            blogDeleteButton.addEventListener("click", () => {
                deleteBlog(blog.id, limit, offset);
            });

            const blogEditButton = document.createElement("button");
            blogEditButton.textContent = "Edit";
            blogEditButton.classList.add("editButton");
            blogEditButton.addEventListener("click", () => {
                editBlog(blog.id);
            });

            buttonDiv.appendChild(blogDeleteButton);
            buttonDiv.appendChild(blogEditButton);

            blogDiv.appendChild(infoDiv);
            blogDiv.appendChild(buttonDiv);

            blogList.appendChild(blogDiv);
        });

        // Render pagination
        renderPagination({total: blogs.total, limit, offset, pagination, fetchAndRenderBlogs });
    } catch (error) {
        console.error("Error fetching blogs:", error);
        blogList.innerHTML = "<h2>Error loading blogs.</h2>";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    fetchAndRenderBlogs();
});