// ===== Union Types（联合类型）=====
// 允许一个变量可以是多种类型之一
let aa: string | number;
aa = "Hello";   // ✅ OK
aa = 42;        // ✅ OK
// aa = true;   // ❌ 不可以


// ===== Array Types（数组类型）=====
let arr1: number[] = [1, 2, 3];                     // 数字数组
let arr2: string[] = ["a", "b", "c"];               // 字符串数组
let arr3: (number | string)[] = [1, "a", 2, "b"];   // 混合数组

// 泛型语法（等价写法）
let arr4: Array<number> = [1, 2, 3];
let arr5: Array<string> = ["a", "b", "c"];
let arr6: Array<number | string> = [1, "a", 2, "b"];


// ===== Tuple Types（元组类型）=====
// 与数组的区别：
//   数组 - 长度可变，元素类型通常相同
//   元组 - 长度固定，每个位置可以有不同的类型
let tuple1: [string, number] = ["Hello", 42];
let tuple2: [number, string, boolean] = [1, "a", true];
let tuple3: [string, ...number[]] = ["Numbers", 1, 2, 3]; // 第一个固定为 string，其余为 number


// ===== Object Types（对象类型）=====
// Object（大写）：JS 遗留概念，可以接受除 null/undefined 外的任何值
let obj1: Object;
obj1 = "hello";        // ✅ OK（基本类型也可以）
obj1 = 42;             // ✅ OK
obj1 = { name: "A" }; // ✅ OK
// obj1 = null;        // ❌ 不可以

// object（小写）：只接受非基本类型（对象、数组、函数等）
let obj2: object;
// obj2 = "hello";     // ❌ 不可以
obj2 = { name: "A" }; // ✅ OK
obj2 = [1, 2, 3];     // ✅ OK

// 实际开发中建议使用 interface 或 type 来描述对象结构（见 46_interface_class.ts）


// ===== Type Assertion（类型断言）=====
// 当你比 TypeScript 更清楚某个值的类型时，可以使用 as 告诉编译器
let something: any = "Hello, world";
let strLength: number = (something as string).length;
console.log(strLength); // 输出：12

// 类型断言不做任何运行时转换，只是告诉编译器"相信我，我知道这个值的类型"
