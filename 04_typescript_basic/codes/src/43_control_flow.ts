// 本案例介绍 if、for 和 while 语句的使用

let randomNumber: number = Number(Math.random().toFixed(1));
console.log("随机数是: " + randomNumber);

if (randomNumber > 0.5) {
    console.log("大于0.5");
} else if (randomNumber === 0.5) {
    console.log("等于0.5");
} else {
    console.log("小于0.5");
}


for (let i: number = 0; i < 5; i++) {
    console.log("for 当前循环次数: " + i);
}

let j: number = 0;
while (j < 5) {
    console.log("while 当前循环次数: " + j);
    j++;
}
