const baseUrl = "http://localhost:3000";

// ===== 公共元素（三个页面都有）=====

const message = document.querySelector("#message") as HTMLDivElement;

// 在这里实现以下功能：
//
// 公共函数：
//   renderMessage(text, type) - 显示操作反馈，3 秒后自动隐藏
//   goHome()                  - 跳转回 index.html
//
// 数据结构：
//   interface User { id, name, email, image }
//
// index.html 相关：
//   getUsers()                - GET 请求获取用户列表
//   renderUserGrid(users)     - 将用户列表渲染为卡片网格，包含编辑/删除按钮
//   deleteUser(userId)        - DELETE 请求删除用户，删除后刷新列表
//   editUser(userId)          - 跳转到 edit-user.html?id=userId
//
// add-user.html 相关：
//   addUser(name, email)      - POST 请求新增用户，成功后 2 秒跳回首页
//
// edit-user.html 相关：
//   getUserById(id)           - GET 请求获取单个用户，填充表单
//   updateUser(name, email, id) - PUT 请求更新用户，成功后 2 秒跳回首页
