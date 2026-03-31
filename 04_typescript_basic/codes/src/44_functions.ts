// ===== 三种函数定义方式 =====

// 函数声明 - JavaScript 最早的函数定义方式
function add(x: number, y: number): number {
    return x + y;
}
// 函数表达式 - 将函数视为一等公民（函数式编程）
const subtract = function(x: number, y: number): number {
    return x - y;
}
// 箭头函数 - ES6 引入的简洁语法
const multiply = (x: number, y: number): number => {
    return x * y;
}

console.log("加法结果: " + add(5, 3));        // 8
console.log("减法结果: " + subtract(5, 3));   // 2
console.log("乘法结果: " + multiply(5, 3));   // 15


// ===== 函数声明 vs 函数表达式 =====
// 函数声明存在"提升"（hoisting），可以在定义之前调用
diff1();

function diff1() {
    console.log('函数声明可以在定义之前调用');
}

const diff2 = function() {
    console.log('函数表达式不能在定义之前调用');
}

diff2();


// ===== 箭头函数简写 =====
// 当函数体只有一个表达式时，可以省略大括号和 return
const add1 = (x: number, y: number): number => {
    return x + y;
}
const add2 = (x: number, y: number): number => x + y; // 省略了大括号和 return


// ===== 特殊参数 =====

// 默认参数
function greet(name: string = "World"): string {
    return `Hello, ${name}!`;
}
console.log(greet());         // Hello, World!
console.log(greet("Alice"));  // Hello, Alice!

// 可选参数（用 ? 标记，必须放在必需参数之后）
function logMessage(message: string, prefix?: string): void {
    if (prefix) {
        console.log(`${prefix}: ${message}`);
    } else {
        console.log(message);
    }
}
logMessage("This is a message");          // This is a message
logMessage("This is a message", "Info");  // Info: This is a message

// 剩余参数（rest parameters）
function sum(...numbers: Array<number>): number {
    return numbers.reduce((acc, curr) => acc + curr, 0);
}
console.log(sum(1, 2, 3));      // 6
console.log(sum(1, 2, 3, 4, 5)); // 15

// 返回多个值（通过元组）
function getCoordinates(): [number, number] {
    return [10, 20];
}
const [x, y] = getCoordinates();
console.log(`Coordinates: x=${x}, y=${y}`); // x=10, y=20


// ===== 函数类型描述 =====

// 用类型注解描述函数类型（箭头表示函数签名，不是箭头函数）
let myFunction: (x: number, y: number) => number;
myFunction = (x: number, y: number): number => x + y;

// 用 interface 描述函数类型（更清晰）
interface MyFunction {
    (x: number, y: number): number;
}
const myFunction2: MyFunction = (x: number, y: number): number => x + y;


// ===== 函数作为参数和返回值（高阶函数）=====

// 函数作为参数（回调函数）
function processNumbers(numbers: number[], callback: (num: number) => void): void {
    for (const num of numbers) {
        callback(num);
    }
}
processNumbers([1, 2, 3], (num) => {
    console.log(`Processing number: ${num}`);
});

// 函数作为返回值（工厂函数）
function createMultiplier(factor: number): (num: number) => number {
    return (num: number) => num * factor;
}
const double = createMultiplier(2);
console.log(double(5)); // 10
