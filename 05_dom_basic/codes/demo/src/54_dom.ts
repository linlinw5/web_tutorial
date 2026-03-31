// ===== 5.4 读写元素内容与样式 =====

const p2 = document.querySelector(".p2") as HTMLParagraphElement;

// innerHTML：读写包含子标签的 HTML 内容
console.log(p2.innerHTML); // "这是另一个段落，<span>这是特殊的文字</span>"
// p2.innerHTML = "Hello, <br>TypeScript!"; // 会解析 HTML 标签

// innerText：读写纯文本内容（受 CSS 影响，display:none 的内容不含）
console.log(p2.innerText); // "这是另一个段落，这是特殊的文字"
// p2.innerText = "Hello, <br>TypeScript!"; // <br> 原样显示为文本

// textContent：读写所有文本节点内容（不受 CSS 影响，性能更好）


// ===== classList 操作 CSS 类 =====
const lis = document.querySelectorAll("li") as NodeListOf<HTMLLIElement>;

lis[0].classList.add("active");       // 添加 class
// lis[0].classList.remove("active"); // 移除 class
// lis[0].classList.toggle("active"); // 有则移除，无则添加

// 直接修改 style 属性（内联样式）
lis[1].style.color = "yellow";
(lis[1].children[0] as HTMLElement).style.color = "yellow";


// ===== 读写元素属性 =====
const input = document.querySelector("#input1") as HTMLInputElement;
console.log(input.type);   // "text"
console.log(input.value);  // "abcde"
// input.type = "password";
