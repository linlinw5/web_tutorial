"use strict";
console.log("frontend add_blog.ts loaded");
// 本案例主要讲述HTML5 原生的formAPI，可以用来处理表单提交，
// 相比手写JavaScript获取表单数据，HTML5的form API更简单易用，
const addBlogForm = document.getElementById("addBlogForm");
addBlogForm.addEventListener("submit", async (event) => {
    console.log("Add blog form submitted");
    event.preventDefault(); // 阻止默认的提交行为
    // 使用 FormData 自动收集所有表单数据
    const formData = new FormData(event.target);
    // console.log("Form data collected:", formData);
    // 获取所有标签，并转成数字数组
    // 注意：这里的标签是复选框，所以需要使用 getAll 方法来获取
    const tags = formData.getAll("tags[]").map(tag => Number(tag));
    // console.log("Selected tags:", tags);
    // 构建提交数据
    const data = {
        title: formData.get("title"),
        content: formData.get("content"),
        img: formData.get("img") || "/images/default.png", // 如果未设置就采用默认图片，简化案例，实际应用中需要处理图片上传
        user_id: 1, // 这里简化案例，用户ID默认为1，实际应用中应该从登录状态获取
        published: formData.get("published") === "published", // 如果复选框被选中，则为 true
        tags: tags, // 传递标签数组
    };
    console.log("Submitting blog data:", data);
    // 发送 POST 请求到后端 API
    try {
        const response = await fetch("/api/blogs", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });
        const responseData = await response.json();
        if (response.ok) {
            alert(responseData.message);
            window.location.href = "/web/admin"; // Redirect to the admin blogs page
        }
        else {
            alert(responseData.error);
        }
    }
    catch (error) {
        console.error("Error adding blog:", error);
        alert("Failed to add blog");
    }
});
