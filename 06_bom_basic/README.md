[← 返回首页](../readme.md)

# 第 6 章：BOM 浏览器对象模型

## 目录约定

```
06_bom_basic/
  README.md
  codes/
    tsconfig.json
    61_bom.html           ← 演示：window / location / history / 对话框 / 定时器
    homework.html         ← 练习参考答案：倒计时器
    src/
      61_bom.ts
      homework.ts
    dist/
  practice/
    tsconfig.json
    61_bom.html           ← 跟练页面
    homework.html         ← 倒计时器练习页面
    src/
      61_bom.ts           ← 在这里跟随演示编写代码
      homework.ts         ← 在这里完成练习
    dist/
```

**工作流：**

```bash
# 演示阶段：在 codes/ 内运行
cd codes
tsc --watch
# 打开 61_bom.html 演示所有 BOM 基础概念
# 打开 homework.html 查看倒计时器参考答案

# 练习阶段：在 practice/ 内运行
cd practice
tsc --watch
# 打开 61_bom.html 跟随演示编写代码
# 打开 homework.html 完成倒计时练习
```

---

## 6.1 BOM 与 window 对象

**BOM（Browser Object Model，浏览器对象模型）** 是浏览器提供的一组接口，用于操作浏览器窗口本身，而不是页面内容（那是 DOM 的工作）。

BOM 的核心是 **`window` 对象**，它是浏览器环境的全局对象：
- 所有全局变量和函数都挂载在 `window` 上
- `document`（DOM）也是 `window` 的一个属性
- 在浏览器中直接写 `console.log()` 等价于 `window.console.log()`

```typescript
console.log(window.document === document); // true

// 窗口尺寸
console.log(window.innerWidth);   // 视口宽度（px）
console.log(window.innerHeight);  // 视口高度（px）

// 浏览器与设备信息
console.log(navigator.userAgent); // 浏览器 UA 字符串
```

---

## 6.2 location 对象

`location` 对象表示当前页面的 URL，可以读取 URL 的各个部分，也可以控制页面跳转。

```typescript
// 读取 URL 信息
console.log(location.href);      // 完整 URL
console.log(location.hostname);  // 域名，如 "www.example.com"
console.log(location.pathname);  // 路径，如 "/blog/post"
console.log(location.search);    // 查询字符串，如 "?id=1"
console.log(location.hash);      // 哈希，如 "#section1"

// 跳转与刷新
location.href = "https://www.example.com";    // 跳转（可后退）
location.assign("https://www.example.com");   // 同上
location.replace("https://www.example.com");  // 跳转（不可后退，替换历史记录）
location.reload();                             // 刷新当前页面
```

> `href`/`assign` 与 `replace` 的区别：前者保留当前页在浏览器历史中，用户可以点后退回来；`replace` 则将当前页从历史中替换掉，无法后退。

---

## 6.3 history 对象

`history` 对象管理浏览器的会话历史（标签页内的访问记录）。

```typescript
console.log(history.length); // 当前会话的历史记录条数

// 前进和后退
history.back();      // 返回上一页，等同于 history.go(-1)
history.forward();   // 前进到下一页，等同于 history.go(1)
history.go(-2);      // 后退两页
```

### pushState 与 replaceState

这两个方法可以**在不刷新页面的情况下修改 URL**，是单页应用（SPA）路由的底层原理：

```typescript
// pushState(状态对象, 标题, 新URL)
history.pushState({ page: "about" }, "", "/about");
// 地址栏变为 /about，但页面不刷新、不发送请求

// replaceState：同上，但替换当前历史记录而非新增
history.replaceState({ page: "home" }, "", "/");
```

---

## 6.4 对话框：alert / confirm / prompt

浏览器原生提供三种模态对话框，会阻塞 JavaScript 执行直到用户响应：

```typescript
// alert：显示信息，用户只能点"确定"
alert("操作成功！");

// confirm：需要用户确认，返回 boolean
const ok: boolean = confirm("确定要删除吗？");
if (ok) { /* 执行删除 */ }

// prompt：需要用户输入，返回 string | null（点取消返回 null）
const name: string | null = prompt("请输入你的名字：");
if (name !== null) {
    console.log("你好，" + name);
}
```

> 这三个对话框在实际产品中已较少使用（用户体验差、样式无法定制），通常用自定义 Modal 组件替代。但在学习阶段用于快速调试和演示非常方便。

---

## 6.5 定时器

### setTimeout — 延迟执行一次

```typescript
// 2000ms 后执行一次
const timerId = setTimeout(() => {
    console.log("2 秒后执行");
}, 2000);

// 在触发前取消
clearTimeout(timerId);
```

### setInterval — 重复执行

```typescript
let count = 0;
const intervalId = setInterval(() => {
    console.log("计时中...", ++count);
    if (count >= 5) {
        clearInterval(intervalId); // 停止定时器
    }
}, 1000);
```

> **注意：** `setInterval` 的回调中若有耗时操作，实际间隔会比设定值长。若需要精确间隔，可以用 `setTimeout` 递归调用自身来实现。

---

## 练习：倒计时器

对应 `practice/src/script.ts`，页面已提供一个按钮和一个 `#countdown` 显示区。

**要求：**
1. 点击按钮开始从 10 秒倒计时
2. 每秒更新 `#countdown` 中显示的数字
3. 倒计时结束后显示"时间到！"
4. 倒计时进行中再次点击按钮不重复启动

参考答案见 `codes/src/homework.ts`。
