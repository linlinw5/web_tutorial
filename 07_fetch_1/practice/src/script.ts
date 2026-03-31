// Mock API 基础地址
const baseUrl = "http://localhost:3000";

// 从 HTML 中获取需要操作的元素
const loadBtn = document.getElementById("loadBtn") as HTMLButtonElement;
const userList = document.getElementById("userList") as HTMLUListElement;
const message = document.getElementById("message") as HTMLDivElement;

// 定义用户数据结构
interface User {
    id: number;
    name: string;
    email: string;
    image: string;
}

// 在这里实现以下功能：
// 1. getUserList()   - GET 请求获取并渲染用户列表
// 2. renderUserList() - 渲染函数，包含删除按钮
// 3. deleteUser()    - DELETE 请求删除用户
// 4. addUserJSON()   - POST 请求，JSON 格式新增用户
// 5. addUserWWW()    - POST 请求，www-form 格式新增用户
