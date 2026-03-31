// ===== 5.6 事件绑定 =====

// 方式一：addEventListener（推荐，可绑定多个处理函数）
const btn1 = document.getElementById("btn1") as HTMLButtonElement;
btn1.addEventListener("click", () => {
  console.log("btn1 被点击了 - 监听器 A");
});
btn1.addEventListener("click", () => {
  console.log("btn1 被点击了 - 监听器 B"); // 两个都会触发
});

// 具名函数，方便后续移除监听器
function handleBtn1Click() {
  console.log("btn1 被点击了 - 具名处理函数");
}
btn1.addEventListener("click", handleBtn1Click);
// btn1.removeEventListener('click', handleBtn1Click);

// 方式二：onXXX 属性（只能绑定一个，新赋值覆盖旧的）
const btn2 = document.getElementById("btn2") as HTMLButtonElement;
btn2.onclick = () => {
  console.log("btn2 被点击了（覆盖后）");
};

// 方式三：HTML 内联（见 index.html 中 btn3 的 onclick="handleClick(...)"）
function handleClick(message: string) {
  console.log(message);
}

// ===== 给任意元素绑定事件 =====
const banner1 = document.getElementById("banner") as HTMLDivElement;
banner1.addEventListener("click", () => {
  console.log("banner 区域被点击了");
});

// ===== 键盘与输入事件 =====
const input1 = document.getElementById("input1") as HTMLInputElement;

input1.addEventListener("keydown", (event) => {
  console.log("按下了键：", event.key);
});

// change：失去焦点且内容有变化时触发
input1.onchange = () => {
  console.log("change 事件，当前值：", input1.value);
};

// input：每次输入内容变化时立即触发
input1.addEventListener("input", () => {
  console.log("input 事件，实时值：", input1.value);
});
