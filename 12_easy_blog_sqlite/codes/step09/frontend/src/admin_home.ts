console.log("Frontend admin_blogs.ts file loaded successfully.");
import { container } from "./elements.ts";
import { Blog } from "./types.ts";
import { renderPagination } from "./tools.ts";

// 点击delete按钮后，出现一个遮罩层，出现提示，然后里面有确认和取消按钮
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
// 这个overlay要遮住整个页面，所以要直接append给body，如果个container的话，只能遮住container部分



// 创建博客列表和分页元素
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
    // 这里最简单的实现方式是采用浏览器自带的confirm对话框
    // if (confirm("Are you sure you want to delete this blog?")) {
    //     // 删除blog的代码逻辑
    //     console.log(`Deleting blog with ID: ${blogId}`);
    // }
    // 但是浏览器自带的confirm对话框样式比较丑，而且不能自定义，所以用户体验不好，可以先用这个方法实现一下，后面再改进

    // 我现在采用一种相对复杂一点的方式，自己实现一个遮罩层和确认对话框
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