const loginForm = document.getElementById("loginForm") as HTMLElement;

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // 阻止默认的提交行为

    const formData = new FormData(event.target as HTMLFormElement);
    const data = {
        username: formData.get("username") as string,
        password: formData.get("password") as string,
    };

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const responseData = await response.json();

        if (response.ok) {
            alert("Login successfully!");
            window.location.href = "/auth/profile";
        } else {
            // 401 时后端返回的是 responseData.message（不是 .error），注意区分
            alert(responseData.message || responseData.error || "Login failed");
        }
    } catch (error) {
        console.error("Error login:", error);
        alert("Failed to login. Please try again later.");
    }
});
