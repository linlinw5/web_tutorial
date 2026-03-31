const loginForm = document.getElementById("loginForm") as HTMLElement;

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // TODO 1: 用 FormData 收集表单数据，构建包含 username / password 的对象

    // TODO 2: 用 fetch 向 /api/auth/login 发送 POST 请求
    //         headers: { "Content-Type": "application/json" }
    //         body: JSON.stringify(data)

    // TODO 3: 根据 response.ok 判断结果
    //         成功：window.location.href = "/auth/profile"
    //         失败：alert(responseData.error)
});
