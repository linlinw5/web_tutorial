// 数组基础与三种遍历方式

let arr01: Array<number> = [1, 2, 3, 4];
let arr02: Array<string> = ["a", "b", "c", "d"];
let arr03: Array<number | string> = [10, "aa", 20, "bb"];

// 遍历方式一：传统 for 循环
for (let i = 0; i < arr01.length; i++) {
    console.log(arr01[i]);
}

// 遍历方式二：for...of（ES6）
for (const item of arr02) {
    console.log(item);
}

// 遍历方式三：forEach（ES5 数组内置方法）
arr03.forEach((item) => {
    console.log(item);
});

// 需求：将 arr01 中的每个数字乘以2，生成新数组
// 使用 forEach + push 实现
let arr04: number[] = [];
arr01.forEach((item) => {
    arr04.push(item * 2);
});
console.log(arr04); // [2, 4, 6, 8]
