"use strict";
console.log("frontend edit_blog.ts loaded");
const editBlogForm = document.getElementById("editBlogForm");
editBlogForm.addEventListener("submit", async (event) => {
    console.log("Edit blog form submitted");
    event.preventDefault(); // 阻止默认的提交行为
    const formData = new FormData(event.target);
    const tags = formData.getAll("tags[]").map(tag => Number(tag));
    // 构建提交数据
    const data = {
        title: formData.get("title"),
        content: formData.get("content"),
        img: formData.get("img") || "/images/default.png",
        user_id: 1,
        published: formData.get("published") === "published",
        tags: tags,
    };
    console.log("Submitting blog data:", data);
    try {
        const response = await fetch(`/api/blogs/${formData.get("blogId")}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });
        const responseData = await response.json();
        if (response.ok) {
            alert("Blog edited successfully!");
            window.location.href = "/web/admin";
        }
        else {
            alert(responseData.error);
        }
    }
    catch (error) {
        console.error("Error editing blog:", error);
        alert("Failed to edit blog");
    }
});
