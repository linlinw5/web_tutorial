// ===== Date 对象 =====

let date1: Date = new Date(); // 当前时间
console.log("当前时间：", date1);

console.log("年：", date1.getFullYear());
console.log("月：", date1.getMonth() + 1); // 月份从0开始，需要加1
console.log("日：", date1.getDate());
console.log("时：", date1.getHours());
console.log("分：", date1.getMinutes());
console.log("秒：", date1.getSeconds());
console.log("时间戳（毫秒）：", date1.getTime());

// 创建指定时间
let date2 = new Date("2025-10-01T00:00:00");
console.log("指定时间：", date2);

// 比较两个时间
if (date1 > date2) {
    console.log("当前时间晚于指定时间");
} else if (date1 < date2) {
    console.log("当前时间早于指定时间");
} else {
    console.log("当前时间等于指定时间");
}

// 修改时间
date1.setFullYear(2023);
date1.setMonth(11);  // 12月
date1.setDate(25);
date1.setHours(10);
date1.setMinutes(30);
date1.setSeconds(0);
console.log("修改后的时间：", date1);


// ===== Math 对象 =====

let pi: number = Math.PI;
console.log("圆周率：", pi);

let myNum: number = 16;
console.log(Math.sqrt(myNum), "平方根");   // 4
console.log(Math.pow(myNum, 2), "平方");   // 256
console.log(Math.abs(-myNum), "绝对值");   // 16
console.log(Math.ceil(3.14), "向上取整");  // 4
console.log(Math.floor(3.14), "向下取整"); // 3
console.log(Math.round(3.14), "四舍五入"); // 3

let randomNum: number = Math.random(); // 0 ~ 1 之间的随机数
console.log("随机数：", randomNum);

let randomInt: number = Math.floor(Math.random() * 100); // 0 ~ 99 的随机整数
console.log("随机整数：", randomInt);


// ===== Promise 与 async/await =====
// Promise 用于处理异步操作，表示一个未来可能完成或失败的操作
// 三种状态：pending（等待中）→ fulfilled（成功）或 rejected（失败）

function fetchTest() {
    let promise1: Promise<Response> = fetch("https://jsonplaceholder.typicode.com/posts/1");
    console.log(promise1); // Promise 对象（pending 状态）
}
fetchTest();

// async/await 是 Promise 的语法糖，让异步代码看起来像同步代码
async function fetchData() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts/1");
        console.log(response);
        if (!response.ok) {
            throw new Error("网络响应不是OK状态");
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("获取数据失败：", error);
    } finally {
        console.log("数据获取操作已完成"); // 无论成功或失败都会执行
    }
}

fetchData();
