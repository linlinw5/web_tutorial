// map() - 对每个元素执行转换，返回新数组

const arr001: Array<number> = [1, 2, 3, 4];

// 完整写法
const arr002 = arr001.map((item) => {
    return item * 2;
});
console.log(arr002); // [2, 4, 6, 8]

// 箭头函数简写
const arr003 = arr001.map(item => item * 2);
console.log(arr003); // [2, 4, 6, 8]

// map() 的核心理念：你提供"转换规则"（回调函数），map() 负责：
//   1. 对每个元素应用这个规则
//   2. 收集转换后的结果
//   3. 返回一个包含所有结果的新数组
// 注意：map() 不修改原数组

// 示例：字符串数组转大写
const strArray: Array<string> = ["hello", "world", "typescript"];
const upperCaseArray = strArray.map(str => str.toUpperCase());
console.log(upperCaseArray); // ["HELLO", "WORLD", "TYPESCRIPT"]


// ===== 练习 =====
// 1. 将数字数组中每个数字求平方
const numbers: Array<number> = [1, 2, 3, 4, 5];
// 期望结果：[1, 4, 9, 16, 25]

// 2. 将字符串数组转换为每个字符串的长度
const strings: Array<string> = ["apple", "banana", "cherry"];
// 期望结果：[5, 6, 6]

// 3. 将月份名称数组转换为前三个字母大写的简写
const months: Array<string> = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];
// 期望结果：["JAN", "FEB", "MAR", ...]
// 提示：使用 str.slice(0, 3).toUpperCase()
