"use strict";
const registerForm = document.getElementById("registerForm");
registerForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // 阻止默认的提交行为
    const formData = new FormData(event.target);
    // 检查密码是否匹配
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }
    const data = {
        username: formData.get("username"),
        password: formData.get("password"),
        email: formData.get("email"),
        group_id: Number(formData.get("group_id")),
    };
    try {
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const responseData = await response.json();
        if (response.ok) {
            alert("Registered successfully!");
            window.location.href = "/";
        }
        else {
            alert(responseData.error);
        }
    }
    catch (error) {
        console.error("Error registering:", error);
        alert("Failed to register. Please try again later.");
    }
});
