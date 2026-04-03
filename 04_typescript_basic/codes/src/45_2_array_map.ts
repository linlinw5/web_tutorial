// map() - Applies a transformation to each element and returns a new array

const arr001: Array<number> = [1, 2, 3, 4];

// Full form
const arr002 = arr001.map((item) => {
  return item * 2;
});
console.log(arr002); // [2, 4, 6, 8]

// Arrow function shorthand
const arr003 = arr001.map((item) => item * 2);
console.log(arr003); // [2, 4, 6, 8]

// Core idea of map(): you provide a "transformation rule" (callback), and map() does the following:
//   1. Applies the rule to each element
//   2. Collects the transformed results
//   3. Returns a new array containing all results
// Note: map() does not modify the original array

// Example: convert a string array to uppercase
const strArray: Array<string> = ["hello", "world", "typescript"];
const upperCaseArray = strArray.map((str) => str.toUpperCase());
console.log(upperCaseArray); // ["HELLO", "WORLD", "TYPESCRIPT"]

// ===== Exercises =====
// 1. Square each number in the numeric array
const numbers: Array<number> = [1, 2, 3, 4, 5];
// Expected result: [1, 4, 9, 16, 25]

// 2. Convert the string array to an array of string lengths
const strings: Array<string> = ["apple", "banana", "cherry"];
// Expected result: [5, 6, 6]

// 3. Convert month names to uppercase 3-letter abbreviations
const months: Array<string> = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
// Expected result: ["JAN", "FEB", "MAR", ...]
// Hint: use str.slice(0, 3).toUpperCase()
