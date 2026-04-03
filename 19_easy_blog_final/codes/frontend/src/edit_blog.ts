// 本案例主要讲述 HTML5 原生的 FormData API
// 相比手写 JavaScript 逐个获取表单字段，FormData 更简洁，也天然支持文件上传

const editBlogForm = document.getElementById("editBlogForm") as HTMLElement;

editBlogForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // 阻止默认的提交行为

    const formData = new FormData(event.target as HTMLFormElement);

    // 标签是复选框（多选），需要用 getAll 获取数组，再转成数字
    const tags = formData.getAll("tags[]").map(tag => Number(tag));

    const data = {
        title: formData.get("title") as string,
        content: formData.get("content") as string,
        img: formData.get("img") || "/images/default.png", // 未填则使用默认图片
        published: formData.get("published") === "published", // 复选框选中时值为 "published"
        tags: tags,
    };

    try {
        const response = await fetch(`/api/blogs/${formData.get("blogId")}`, {
            method: "PATCH",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const responseData = await response.json();

        if (response.ok) {
            alert("Blog edited successfully!");
            window.location.href = "/editor/blogs";
        } else {
            alert(responseData.error);
        }
    } catch (error) {
        console.error("Error editing blog:", error);
        alert("Failed to edit blog");
    }
});
