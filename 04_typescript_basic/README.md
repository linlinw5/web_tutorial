[← 返回首页](../readme.md)

# 第 4 章：TypeScript 基础

## 为什么引入 TypeScript？

从本章起，课程的所有代码统一使用 **TypeScript** 编写。

引入 TypeScript 的核心原因不是语法本身，而是帮助初学者建立**数据结构的意识**。在实际项目中，大量的 bug 源于"不清楚某个变量里装的是什么"——TypeScript 的类型系统强迫你在写代码前先想清楚数据的形状，这个习惯比任何具体语法都重要。

> **核心约定：** 之后所有章节中，任何自定义数据（用户、博客、标签等）都必须用 `interface` 或 `type` 先定义结构，再使用。

---

## 目录约定

```
04_typescript_basic/
  README.md
  codes/
    src/          ← TypeScript 源文件（按章节编号组织）
    tsconfig.json ← 编译配置
  practice/
    src/          ← 你的练习目录
    tsconfig.json ← 已预配置
```

---

## 安装与配置

```bash
# 全局安装 TypeScript 编译器（只需一次）
sudo npm install -g typescript

# 验证安装
tsc --version
```

### 初始化项目

```bash
cd practice

# 生成 tsconfig.json（或直接复制已有配置）
tsc --init
```

修改 `tsconfig.json` 中的两处，指定源文件和输出目录：

```json
{
  "compilerOptions": {
    "target": "es2016",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

### 开发工作流

```bash
# 监听 src/ 中的所有 .ts 文件变化，自动编译到 dist/
tsc --watch

# 有类型错误时不输出编译结果（推荐）
tsc --noEmitOnError --watch
```

编译后用 node 运行编译产物：

```bash
node dist/41_primitives.js
```

> 参考文档：[TypeScript 官方手册](https://www.typescriptlang.org/)

---

## 使用 tsx 直接运行 TypeScript

`tsc` 的编译流程（写代码 → 编译 → 运行 js）在学习阶段稍显繁琐。**tsx** 是一个可以直接执行 `.ts` 文件的工具，省去编译步骤，非常适合练习和快速验证代码。

```bash
# 全局安装
npm install -g tsx

# 验证安装
tsx --version
```

安装后可以像 `node` 一样直接运行 `.ts` 文件：

```bash
tsx src/41_primitives.ts
```

也支持 watch 模式，保存时自动重新执行：

```bash
tsx watch src/41_primitives.ts
```

> **tsx vs tsc 的选择：**
> - **学习/练习**：用 `tsx`，快速看到运行结果
> - **正式项目**：用 `tsc` 编译，`node` 运行——编译产物可以部署，类型错误也会在构建时暴露

---

## 4.1 基本类型（`src/41_primitives.ts`）

TypeScript 在 JavaScript 的基础上为每个变量加上了**类型标注**，核心价值是在编译阶段发现类型错误，而不是等到运行时。

### 三大原始类型

```ts
const message: string = "Hello, TypeScript!";
let count: number = 42;
const isActive: boolean = true;
```

### 类型推断

变量**声明同时赋值**时，TypeScript 会自动推断类型，无需手动标注：

```ts
let inferredCount = 42;  // 推断为 number
// inferredCount = "100"; // ❌ 编译错误
```

### `undefined` 与 `null`

```ts
let a;          // 未赋值 → undefined
let b = null;   // 主动表示"空"→ null
```

| | 含义 | 典型场景 |
|---|---|---|
| `undefined` | 变量声明了但没赋值 | 函数没有 return、对象缺少属性 |
| `null` | 程序员主动赋值为"空" | 表示"这里应该有值，但当前是空的" |

### `any`：关闭类型检查

```ts
let e: any;
e = 123;    // ✅
e = "abc";  // ✅
e = null;   // ✅
```

`any` 本质上是关闭了类型检查，应尽量避免使用。

---

## 4.2 复合类型（`src/42_complex_types.ts`）

### Union 类型

允许一个变量持有多种类型之一：

```ts
let value: string | number;
value = "hello";  // ✅
value = 42;       // ✅
// value = true;  // ❌
```

### Array 类型

```ts
let nums: number[] = [1, 2, 3];          // 方括号语法
let strs: Array<string> = ["a", "b"];   // 泛型语法（等价）
let mixed: (number | string)[] = [1, "a", 2];
```

### Tuple 元组

长度固定、每个位置类型固定：

```ts
let point: [number, number] = [10, 20];
let record: [string, number, boolean] = ["Alice", 18, true];
```

| | Array | Tuple |
|---|---|---|
| 长度 | 可变 | 固定 |
| 元素类型 | 统一（或 union） | 每位独立定义 |

### `object` vs `Object`

```ts
// Object（大写）：几乎接受任何值，包括基本类型
let o1: Object = "hello";  // ✅（不推荐用）

// object（小写）：只接受非基本类型
let o2: object = { name: "Alice" };  // ✅
// let o3: object = "hello";          // ❌
```

实际开发中用 `interface` 或 `type` 代替 `object`，见 4.6 节。

### 类型断言（Type Assertion）

当你比 TypeScript 更清楚某个值的具体类型时，用 `as` 告知编译器：

```ts
let something: any = "Hello, world";
let len: number = (something as string).length;  // 断言为 string 再访问 .length
```

---

## 4.3 控制流（`src/43_control_flow.ts`）

TypeScript 的 `if`、`for`、`while` 语法与 JavaScript 完全相同，只是变量和参数需要加上类型标注：

```ts
const randomNumber: number = Number(Math.random().toFixed(1));

if (randomNumber > 0.5) {
    console.log("大于 0.5");
} else if (randomNumber === 0.5) {
    console.log("等于 0.5");
} else {
    console.log("小于 0.5");
}

for (let i: number = 0; i < 5; i++) {
    console.log("循环次数：" + i);
}

let j: number = 0;
while (j < 5) {
    console.log("while：" + j);
    j++;
}
```

---

## 4.4 函数（`src/44_functions.ts`）

### 三种定义方式

```ts
// 1. 函数声明 —— 有"提升"效果，可在定义前调用
function add(x: number, y: number): number {
    return x + y;
}

// 2. 函数表达式 —— 不会提升，必须先定义再调用
const subtract = function(x: number, y: number): number {
    return x - y;
};

// 3. 箭头函数 —— ES6 简洁语法
const multiply = (x: number, y: number): number => x * y;
```

### 可选参数、默认参数、剩余参数

```ts
// 可选参数（? 标记，调用时可省略）
function log(msg: string, prefix?: string): void {
    console.log(prefix ? `${prefix}: ${msg}` : msg);
}

// 默认参数
function greet(name: string = "World"): string {
    return `Hello, ${name}!`;
}

// 剩余参数（任意数量同类型参数）
function sum(...nums: number[]): number {
    return nums.reduce((acc, n) => acc + n, 0);
}
```

### 用 `interface` 描述函数类型

```ts
interface BinaryOp {
    (x: number, y: number): number;
}

const divide: BinaryOp = (x, y) => x / y;
```

### 高阶函数（函数作为参数 / 返回值）

```ts
// 函数作为参数（回调函数）
function process(nums: number[], callback: (n: number) => void): void {
    for (const n of nums) callback(n);
}

// 函数作为返回值
function createMultiplier(factor: number): (n: number) => number {
    return (n) => n * factor;
}
const double = createMultiplier(2);
console.log(double(5));  // 10
```

---

## 4.5 数组方法

TypeScript 数组的类型写法为 `T[]` 或 `Array<T>`，方法与 JavaScript 完全相同。

### 遍历：`for` / `for...of` / `forEach`（`src/45_1_array_basics.ts`）

```ts
const arr: number[] = [1, 2, 3, 4];

for (let i = 0; i < arr.length; i++) { console.log(arr[i]); }

for (const item of arr) { console.log(item); }

arr.forEach(item => console.log(item));
```

### `map`：转换每个元素，返回新数组（`src/45_2_array_map.ts`）

```ts
const doubled = [1, 2, 3].map(n => n * 2);          // [2, 4, 6]
const upper = ["hello", "world"].map(s => s.toUpperCase()); // ["HELLO", "WORLD"]
```

`map` 不修改原数组，返回等长的新数组。

### `filter` / `reduce`（`src/45_3_array_filter_reduce.ts`）

```ts
// filter：筛选满足条件的元素
const evens = [1,2,3,4,5,6].filter(n => n % 2 === 0);  // [2,4,6]

// reduce：将数组"折叠"为单一值
const total = [10, 20, 30].reduce((acc, n) => acc + n, 0);  // 60
```

`reduce(callback, 初始值)` — `acc` 是累加器，每次回调的返回值作为下次的 `acc`。

### 其他常用方法（`src/45_4_array_methods.ts`）

**查询类（不修改原数组）：**

```ts
const arr = [1, 2, 3, 4, 5];
arr.some(n => n > 4);        // true  —— 至少一个满足
arr.every(n => n > 0);       // true  —— 全部满足
arr.find(n => n > 3);        // 4     —— 第一个满足的元素
arr.findIndex(n => n > 3);   // 3     —— 第一个满足的索引
arr.includes(3);             // true  —— 是否包含某值
```

**修改类（直接操作原数组）：**

```ts
arr.push(6);           // 末尾添加，返回新长度
arr.unshift(0);        // 开头添加，返回新长度
arr.pop();             // 删除末尾，返回被删元素
arr.splice(2, 0, 99);  // splice(起始索引, 删除数量, 插入值)
arr.sort((a, b) => a - b);   // 升序排序（原地）
arr.reverse();               // 反转（原地）
```

**数组复制（注意引用 vs 值）：**

```ts
const a = [1, 2, 3];
const b = a;          // ❌ 复制引用，b 和 a 指向同一数组
const c = [...a];     // ✅ 展开运算符，浅拷贝
```

---

## 4.6 对象、接口与类（`src/46_interface_class.ts`）

### `interface` 与 `type`：定义数据结构

这是本课程最重要的习惯：**用数据前，先定义它的形状**。

```ts
// interface（推荐用于描述对象结构）
interface User {
    id: number;
    name: string;
    email: string;
    age?: number;          // ? 表示可选属性
}

// type（更灵活，也可用于联合类型等）
type Point = {
    x: number;
    y: number;
};
```

两者对于描述对象结构效果相同，本课程统一使用 `interface`。

### 对象字面量

```ts
const user: User = {
    id: 1,
    name: "Alice",
    email: "alice@example.com",
    // age 是可选的，可以不提供
};

console.log(user.name);      // 点语法
console.log(user["email"]);  // 括号语法
```

### 接口中的函数属性

```ts
interface Animal {
    name: string;
    eat(): void;           // 方法签名
    sleep: () => void;     // 等价写法
}
```

### `class`：批量创建对象的模板

```ts
class Student {
    name: string;
    age: number;
    score: number;

    constructor(name: string, age: number, score: number) {
        this.name = name;
        this.age = age;
        this.score = score;
    }

    greet(): string {
        return `Hi, I'm ${this.name}`;
    }
}

const s1 = new Student("Alice", 18, 85);
const s2 = new Student("Bob", 19, 92);
```

`class` 与 `interface` 的关系：`interface` 描述数据的"形状"，`class` 是生产对象的"工厂"。

---

## 4.7 常用内置对象（`src/47_builtin_objects.ts`）

### `Date`

```ts
const now = new Date();
console.log(now.getFullYear());  // 年
console.log(now.getMonth() + 1); // 月（从 0 开始，需 +1）
console.log(now.getDate());      // 日
console.log(now.getTime());      // Unix 时间戳（毫秒）

const d = new Date("2025-10-01T00:00:00");
if (now > d) console.log("当前时间更晚");
```

### `Math`

```ts
Math.PI;               // 3.14159...
Math.sqrt(16);         // 4
Math.pow(2, 8);        // 256
Math.abs(-5);          // 5
Math.ceil(3.1);        // 4（向上取整）
Math.floor(3.9);       // 3（向下取整）
Math.round(3.5);       // 4（四舍五入）
Math.random();         // [0, 1) 随机小数
Math.floor(Math.random() * 100); // [0, 99] 随机整数
```

### `Promise` 与 `async/await`

HTTP 请求等异步操作会返回 `Promise`，表示"未来某个时刻会完成"的值：

```ts
// fetch 直接返回 Promise<Response>
async function fetchData(url: string): Promise<void> {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("请求失败：", error);
    } finally {
        console.log("请求结束");  // 无论成功失败都执行
    }
}

fetchData("https://jsonplaceholder.typicode.com/posts/1");
```

`async` 函数内部可以用 `await` 等待 Promise 完成，写起来像同步代码。

---

## 4.8 模块化（`src/48_1_export.ts` / `src/48_2_import.ts`）

将代码拆分到多个文件，通过 `export` / `import` 共享：

**`48_1_export.ts`（导出）：**

```ts
export const PI = 3.14;

export function area(radius: number): number {
    return PI * radius * radius;
}

// 默认导出（一个文件只能有一个）
export default { PI, area };
```

**`48_2_import.ts`（导入）：**

```ts
// 具名导入（按名字引入特定内容）
import { PI, area } from './48_1_export';

// 默认导入（可自定义别名）
import mathUtils from './48_1_export';

console.log(PI);               // 3.14
console.log(area(5));          // 78.5
console.log(mathUtils.area(5)); // 78.5
```

---

## 课后练习

结合本章所有知识点，完成以下综合练习：

1. 定义一个 `interface Product`，包含 `id: number`、`name: string`、`price: number`、`category: string`、`inStock?: boolean`
2. 创建一个 `Product[]` 数组，包含至少 5 个商品
3. 用 `filter` 筛选出所有价格低于 100 的商品
4. 用 `map` 生成一个只包含 `name` 和 `price` 的新数组
5. 用 `reduce` 计算所有商品的总价
6. 定义一个 `class Cart`，包含 `items: Product[]` 属性和以下方法：
   - `add(product: Product): void` — 添加商品
   - `total(): number` — 计算总价
   - `list(): void` — 打印所有商品名称和价格
7. 将 `Product` 接口和 `Cart` 类分别放在独立文件中，用 `export` / `import` 组织代码
