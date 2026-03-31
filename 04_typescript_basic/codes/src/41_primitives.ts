// TypeScript 三大原始类型（Primitives）
// 变量声明使用 let / const，尽量避免使用 var
// TypeScript 允许为变量添加类型注解，有助于在编译时捕获错误

const message: string = "Hello, TypeScript!";
// message = "Hello, World!"; // const 不可以重新赋值

let count: number = 42;
count = 100; // let 可以重新赋值

const isActive: boolean = true;

console.log(message);
console.log("count: ", count);
console.log(`isActive: ${isActive}, test message.`);

// let 和 const 的区别：
// let 用于声明可以改变的变量，const 用于声明不可改变的变量。
// const 声明的变量必须在声明时初始化，并且不能被重新赋值。

// 类型注解（Type Annotation）
// count = "100"; // ❌ 报错：count 被声明为 number 类型

// TypeScript 类型推断：声明+初始化一起时会自动推断类型
let inferredCount = 42; // 推断为 number
// inferredCount = "100"; // ❌ 报错

// undefined：变量声明了但没有赋值，或函数没有 return
// null：程序员主动赋值为空，表示"这里应该有值，但目前是空的"
let a;              // 未赋值
console.log(a);     // undefined

let b = null;       // 明确赋值为空
console.log(b);     // null

let c: undefined;   // 显式声明为 undefined
// c = 11; // ❌ 报错
let d: null;        // 显式声明为 null
// d = 22; // ❌ 报错

// any 类型：接受任何类型的值，实则关闭了类型检查
let e: any;
e = 123;       // ✅ OK
e = "123";     // ✅ OK
e = null;      // ✅ OK
e = undefined; // ✅ OK
e = {};        // ✅ OK
e = [];        // ✅ OK
