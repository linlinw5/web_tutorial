// ===== BOM 基础：window / location / history / 对话框 =====

// --- window 对象 ---
// window 是浏览器的全局对象，所有全局变量和函数都挂载在它上面
console.log(window.document === document); // true
console.log("窗口宽度：", window.innerWidth);
console.log("窗口高度：", window.innerHeight);
console.log("浏览器信息：", navigator.userAgent);


// --- location 对象 ---
console.log("完整 URL：", location.href);
console.log("域名：", location.hostname);
console.log("路径：", location.pathname);
console.log("查询字符串：", location.search);

const btn = document.querySelector("button") as HTMLButtonElement;
btn.addEventListener("click", () => {
    // href / assign：跳转，保留历史记录（可后退）
    // location.href = "https://www.baidu.com";

    // replace：跳转，替换历史记录（不可后退）
    // location.replace("https://www.baidu.com");

    // reload：刷新
    // location.reload();

    // --- history 对象 ---
    // history.back();    // 返回上一页
    // history.forward(); // 前进

    // pushState：无刷新修改 URL（SPA 路由底层原理）
    history.pushState({ page: "about" }, "", "/about");
    console.log("URL 已更新：", location.href);
});

console.log("历史记录条数：", history.length);


// --- 对话框 ---
// alert("这是一个警告框");

const isConfirmed: boolean = confirm("你确定要继续吗？");
console.log("confirm 结果：", isConfirmed);

const userInput: string | null = prompt("请输入你的名字：");
console.log("prompt 结果：", userInput);


// --- 定时器 ---

// setTimeout：延迟执行一次
const timerId = setTimeout(() => {
    console.log("3 秒后执行一次");
}, 3000);
// clearTimeout(timerId); // 取消

// setInterval：重复执行
let count = 0;
const intervalId = setInterval(() => {
    console.log("计时中...", ++count);
    if (count >= 5) {
        clearInterval(intervalId);
        console.log("定时器已停止");
    }
}, 1000);
