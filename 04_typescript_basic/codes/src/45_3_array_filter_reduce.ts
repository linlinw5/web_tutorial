// filter() 和 reduce()

// ===== filter() - 过滤数组，返回满足条件的元素组成的新数组 =====

let arr011: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// 过滤出所有偶数
let evenNumbers = arr011.filter((item) => item % 2 === 0);
console.log(evenNumbers); // [2, 4, 6, 8, 10]

// filter() 遍历每个元素，回调返回 true 则保留，false 则排除

// 示例：筛选及格成绩（>= 60）
const scores: Array<number> = [55, 75, 60, 45, 90, 80];
const passingScores = scores.filter(score => score >= 60);
console.log(passingScores); // [75, 60, 90, 80]


// ===== reduce() - 将数组归并为单一值 =====

let arr012: Array<number> = [1, 2, 3, 4, 5];

// 计算总和
let sum012 = arr012.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
console.log(sum012); // 15

// reduce() 的工作方式：
//   accumulator：上一次调用函数的结果（初始值由第二个参数指定）
//   currentValue：当前正在处理的元素
//   每次调用的结果会作为下次的 accumulator

// 示例：计算商品总价
const prices: Array<number> = [19.99, 29.99, 9.99, 49.99];
const totalPrice = prices.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
console.log(totalPrice); // 109.96

// 示例：计算乘积
const numbersForProduct: Array<number> = [1, 2, 3, 4, 5];
const product = numbersForProduct.reduce((acc, curr) => acc * curr, 1);
console.log(product); // 120

// 示例：连接字符串
const words: Array<string> = ["Hello", "World", "TypeScript"];
const sentence = words.reduce((acc, curr) => acc + " " + curr, "");
console.log(sentence.trim()); // "Hello World TypeScript"
