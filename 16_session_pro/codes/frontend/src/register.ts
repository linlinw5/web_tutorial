console.log("frontend register.ts loaded");

const registerForm = document.getElementById("registerForm") as HTMLElement;

registerForm.addEventListener("submit", async (event) => {

    console.log("register form submitted");
    event.preventDefault(); // 阻止默认的提交行为

    // 使用 FormData 自动收集所有表单数据
    const formData = new FormData(event.target as HTMLFormElement);
    console.log("Form data collected:", formData);

    // 检查密码是否匹配
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // 构建提交数据
    const data = {
        username: formData.get("username") as string,
        password: formData.get("password") as string,
        email: formData.get("email") as string,
        group_id: Number(formData.get("group_id")),
    };

    console.log("Submitting blog data:", data);

    // 发送 POST 请求到后端 API
    
    try {
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });
        const responseData = await response.json();

        if (response.ok) {
            alert("Registered successfully!");
            window.location.href = "/"; // Redirect to the admin blogs page
        } else {
            alert(responseData.error);
        }
    } catch (error) {
        console.error("Error registering:", error);
        alert("Failed to register. Please try again later.");
    }
});


