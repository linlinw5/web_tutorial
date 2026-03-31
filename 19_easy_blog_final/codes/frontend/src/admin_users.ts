document.addEventListener("DOMContentLoaded", () => {
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            // HTML 中的 data-user-id 在 JavaScript 的 dataset 中自动转换为 userId（camelCase），这是浏览器的标准行为。
            // 你可以使用 dataset.userId 或 getAttribute('data-user-id') 两种方式来访问，结果是相同的。
            const userId = Number((event.target as HTMLButtonElement).dataset.userId);
            if (confirm(`确定要删除此用户吗？`)) {
                try {
                    const response = await fetch(`/api/users/${userId}`, {
                        method: 'DELETE',
                    });
                    if (response.ok) {
                        alert(`用户 ID ${userId} 已成功删除。`);
                        // 刷新页面或重新加载用户列表
                        window.location.reload();
                    } else {
                        const errorData = await response.json();
                        alert(`删除用户失败: ${errorData.message}`);
                    }
                } catch (error) {
                    console.error('删除用户时发生错误:', error);
                    alert('删除用户时发生错误，请稍后再试。');
                }
            }
        });
    });
    const changePwdButtons = document.querySelectorAll('.edit-button');
    changePwdButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const userId = Number((event.target as HTMLButtonElement).dataset.userId);
            const newPassword = prompt(`请输入新密码：`);
            if (newPassword) {
                try {
                    const response = await fetch(`/api/users/${userId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ password: newPassword }),
                    });
                    if (response.ok) {
                        alert(`用户 ID ${userId} 的密码已成功更改。`);
                        // 刷新页面或重新加载用户列表
                        window.location.reload();
                    } else {
                        const errorData = await response.json();
                        alert(`更改密码失败: ${errorData.message}`);
                    }
                } catch (error) {
                    console.error('更改密码时发生错误:', error);
                    alert('更改密码时发生错误，请稍后再试。');
                }
            }
        }); 
    });
});

