const registerForm = document.getElementById("registerForm") as HTMLElement;

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // TODO 1: 用 FormData 收集表单数据

    // TODO 2: 检查 password 和 confirmPassword 是否一致
    //         不一致则 alert 提示并 return

    // TODO 3: 构建包含 username / password / email / group_id 的对象
    //         注意 group_id 需要用 Number() 转换

    // TODO 4: 用 fetch 向 /api/auth/register 发送 POST 请求
    //         headers: { "Content-Type": "application/json" }
    //         body: JSON.stringify(data)

    // TODO 5: 根据 response.ok 判断结果
    //         成功：alert 提示 + window.location.href = "/"
    //         失败：alert(responseData.error)
});
