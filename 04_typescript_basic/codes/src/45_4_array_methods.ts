// 其他常用数组方法：some、every、find、findIndex、includes、push/pop/splice、sort、reverse

// ===== 查询类方法 =====

let arr022: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// some() - 至少有一个元素满足条件，返回 true
let hasEvenNumber = arr022.some((item) => item % 2 === 0);
console.log(hasEvenNumber); // true

// every() - 所有元素都满足条件，返回 true
let allEvenNumbers = arr022.every((item) => item % 2 === 0);
console.log(allEvenNumbers); // false

// find() - 返回第一个满足条件的元素，否则返回 undefined
let firstEvenNumber = arr022.find((item) => item % 2 === 0);
console.log(firstEvenNumber); // 2

// findIndex() - 返回第一个满足条件的元素的索引，否则返回 -1
let firstEvenIndex = arr022.findIndex((item) => item % 2 === 0);
console.log(firstEvenIndex); // 1

// includes() - 检查是否包含某个元素
let includesFive = arr022.includes(5);
console.log(includesFive); // true


// ===== 增删改方法（会修改原数组）=====

let arr033: Array<number> = [1, 2, 3, 4, 5];

arr033.push(1);           // 末尾添加
console.log(arr033);      // [1, 2, 3, 4, 5, 1]

arr033.unshift(6);        // 开头添加
console.log(arr033);      // [6, 1, 2, 3, 4, 5, 1]

arr033.splice(2, 0, 7);   // 在索引2处插入7（不删除）
console.log(arr033);      // [6, 1, 7, 2, 3, 4, 5, 1]
// splice(start, deleteCount, ...items)

let lastElement = arr033.pop(); // 删除末尾元素并返回
console.log(lastElement);       // 1
console.log(arr033);            // [6, 1, 7, 2, 3, 4, 5]

// join() - 将数组元素连接为字符串（不修改原数组）
let arr034: Array<string> = ['Hello', 'World'];
let joinedString = arr034.join(' ');
console.log(joinedString); // "Hello World"


// ===== 排序与复制 =====

let arr456: Array<number> = [5, 3, 8, 1, 2];

arr456.sort((a, b) => a - b); // 升序
console.log(arr456); // [1, 2, 3, 5, 8]

arr456.sort((a, b) => b - a); // 降序
console.log(arr456); // [8, 5, 3, 2, 1]

arr456.reverse(); // 反转顺序（不关心元素值）
console.log(arr456); // [1, 2, 3, 5, 8]

// 数组是引用类型：直接赋值复制的是引用，而非数组本身
let arr456Copy = arr456;   // 复制引用
arr456Copy.push(9);
console.log(arr456);       // [1, 2, 3, 5, 8, 9]（原数组也被修改）

// 使用扩展运算符进行浅拷贝
let arr456Copy2 = [...arr456];
arr456Copy2.push(10);
console.log(arr456);       // [1, 2, 3, 5, 8, 9]（不受影响）
console.log(arr456Copy2);  // [1, 2, 3, 5, 8, 9, 10]
