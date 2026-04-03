// Array basics and three iteration methods

let arr01: Array<number> = [1, 2, 3, 4];
let arr02: Array<string> = ["a", "b", "c", "d"];
let arr03: Array<number | string> = [10, "aa", 20, "bb"];

// Iteration method 1: traditional for loop
for (let i = 0; i < arr01.length; i++) {
  console.log(arr01[i]);
}

// Iteration method 2: for...of (ES6)
for (const item of arr02) {
  console.log(item);
}

// Iteration method 3: forEach (ES5 built-in array method)
arr03.forEach((item) => {
  console.log(item);
});

// Requirement: multiply each number in arr01 by 2 to create a new array
// Implemented with forEach + push
let arr04: number[] = [];
arr01.forEach((item) => {
  arr04.push(item * 2);
});
console.log(arr04); // [2, 4, 6, 8]
