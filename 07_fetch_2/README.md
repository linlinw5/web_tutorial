[← 返回首页](../readme.md)

# 第 7 章（续）：多页面用户管理系统

本案例在 `07_fetch_1` 的基础上进行扩展，将单页面演示升级为三页面用户管理系统，实现完整的增删改查（CRUD）。新增内容：

- **PUT 请求**：修改已有资源
- **多页面共享脚本**：三个 HTML 页面使用同一个编译后的 `script.js`
- **URL 参数传递**：通过 `?id=3` 在页面间传递数据
- **页面加载时自动请求**：进入编辑页自动填充表单

## 前置条件

本章所有请求都发往本地 Mock API 服务器，**运行代码前必须先启动它**：

```bash
cd 07_mock_api
npm install
npm run dev
```

## 目录约定

```
07_fetch_2/
  README.md
  codes/
    tsconfig.json
    public/
      index.html       ← 用户列表页
      add-user.html    ← 新增用户页
      edit-user.html   ← 编辑用户页
      style.css
    src/
      script.ts        ← 三个页面共用一个脚本
    dist/
  practice/
    tsconfig.json
    public/            ← 同上
    src/
      script.ts        ← 在这里完成实现
    dist/
```

**工作流：**

```bash
cd codes       # 或 practice
tsc --watch
# 打开 public/index.html
```

---

## 7.1 多页面共享脚本的设计

三个 HTML 页面末尾都加载同一个脚本：

```html
<script src="../dist/script.js"></script>
```

`tsconfig.json` 将 `src/script.ts` 编译到 `dist/script.js`，三个 HTML 通过 `../dist/` 相对路径引用（`public/` → 上一级 → `dist/`）。

三个页面的 DOM 元素各不相同：

| 页面 | 特有元素 |
|---|---|
| `index.html` | `#loadBtn`、`#addUserBtn`、`#userGrid` |
| `add-user.html` | `#username`、`#email`、`#submitAdd` |
| `edit-user.html` | `#userId`、`#username`、`#email`、`#submitUpdate` |
| 全部页面 | `#message` |

脚本在某个页面执行时，其他页面特有的元素不存在，`document.getElementById()` 返回 `null`。因此所有 DOM 操作都必须先做 null 检查，否则会抛出运行时错误。

---

## 7.2 条件守卫模式

`&&` 短路运算符可以简洁地实现"元素存在时才执行"：

```typescript
// 等价于：if (loadBtn) { getUsers(); }
loadBtn && getUsers();

// 等价于：if (loadBtn) { loadBtn.addEventListener("click", getUsers); }
loadBtn && loadBtn.addEventListener("click", getUsers);

// 等价于：if (submitUpdate) { getUserById(Number(currentUserId)); }
submitUpdate && getUserById(Number(currentUserId));
```

这是多页面共享脚本的核心技巧：同一段代码在不同页面按需激活，不需要判断当前在哪个页面。

---

## 7.3 PUT 请求：修改用户

PUT 请求与 POST 请求格式几乎相同，区别在于 URL 包含目标资源的 ID，语义是"替换整个资源"：

```typescript
async function updateUser(name: string, email: string, id: number) {
    try {
        const response = await fetch(`${baseUrl}/api/users/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email })
        });
        if (response.ok) {
            renderMessage("用户修改成功", "success");
            setTimeout(() => {
                window.location.href = "./index.html";
            }, 2000);
        } else {
            throw new Error(`更新失败，状态码：${response.status}`);
        }
    } catch (err) {
        renderMessage(`更新用户失败：${err}`, "error");
    }
}
```

常见 HTTP 方法与语义：

| 方法 | 语义 | URL 示例 |
|---|---|---|
| GET | 读取资源 | `/api/users` 或 `/api/users/3` |
| POST | 新增资源 | `/api/users` |
| PUT | 替换整个资源 | `/api/users/3` |
| DELETE | 删除资源 | `/api/users/3` |

---

## 7.4 URL 参数在页面间传递数据

从列表页跳转到编辑页时，需要把用户 ID 附加到 URL 中：

```typescript
function editUser(userId: number) {
    window.location.href = `./edit-user.html?id=${userId}`;
    // 跳转后 URL 变为：edit-user.html?id=3
}
```

在编辑页面，通过 `URLSearchParams` 读取 URL 的查询字符串：

```typescript
// window.location.search 返回 URL 的查询字符串，如 "?id=3"
const urlParams = new URLSearchParams(window.location.search);
const currentUserId = urlParams.get("id"); // 返回字符串 "3"，不存在时返回 null
```

`URLSearchParams.get()` 返回 `string | null`，使用前需要转换类型：

```typescript
getUserById(Number(currentUserId)); // "3" → 3
```

---

## 7.5 页面加载时自动请求

编辑页进入后需要自动获取用户当前数据并填充表单，无需用户手动点击触发：

```typescript
// 页面加载时立即执行（submitUpdate 仅在 edit-user.html 存在）
submitUpdate && getUserById(Number(currentUserId));
```

获取失败时应禁用表单，防止用户用空数据覆盖，并在短暂提示后跳回首页：

```typescript
async function getUserById(id: number) {
    try {
        const response = await fetch(`${baseUrl}/api/users/${id}`);
        if (response.ok) {
            const user: User = await response.json();
            userIdInput.value = user.id.toString();
            usernameInput.value = user.name;
            emailInput.value = user.email;
        } else {
            throw new Error(`获取失败，状态码：${response.status}`);
        }
    } catch (err) {
        usernameInput.disabled = true;
        emailInput.disabled = true;
        submitUpdate.disabled = true;
        renderMessage(`获取用户信息失败：${err}`, "error");
        setTimeout(() => {
            window.location.href = "./index.html";
        }, 2000);
    }
}
```

---

## 7.6 反馈消息组件

`renderMessage()` 封装了用户操作反馈的完整逻辑：

```typescript
function renderMessage(text: string, type: string) {
    message.textContent = text;
    message.classList.add("show", type); // 触发显示
    setTimeout(() => {
        message.classList.remove("show", type); // 3 秒后自动隐藏
    }, 3000);
}
```

对应的 CSS：

```css
.message { display: none; }       /* 默认隐藏 */
.message.show { display: block; } /* 有 show 类时显示 */
.message.success { background-color: #2fca6a; } /* 绿色 */
.message.error   { background-color: #ee5a24; } /* 红色 */
```

调用方式：

```typescript
renderMessage("用户添加成功", "success");
renderMessage(`删除失败：${err}`, "error");
```

---

## 最终效果

![用户管理系统效果图](./assets/fetch_2.png)
