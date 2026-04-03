const registerForm = document.getElementById("registerForm") as HTMLElement;

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // 阻止默认的提交行为

    const formData = new FormData(event.target as HTMLFormElement);

    // 检查密码是否匹配
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    const data = {
        username: formData.get("username") as string,
        password: formData.get("password") as string,
        email: formData.get("email") as string,
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
        } else {
            alert(responseData.error);
        }
    } catch (error) {
        console.error("Error registering:", error);
        alert("Failed to register. Please try again later.");
    }
});
