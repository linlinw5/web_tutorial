// filter() and reduce()

// ===== filter() - Filters an array and returns a new array of elements that match the condition =====

let arr011: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Filter all even numbers
let evenNumbers = arr011.filter((item) => item % 2 === 0);
console.log(evenNumbers); // [2, 4, 6, 8, 10]

// filter() iterates over each element: keep it if the callback returns true, otherwise exclude it

// Example: filter passing scores (>= 60)
const scores: Array<number> = [55, 75, 60, 45, 90, 80];
const passingScores = scores.filter((score) => score >= 60);
console.log(passingScores); // [75, 60, 90, 80]

// ===== reduce() - Reduces an array to a single value =====

let arr012: Array<number> = [1, 2, 3, 4, 5];

// Calculate the sum
let sum012 = arr012.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
console.log(sum012); // 15

// How reduce() works:
//   accumulator: the result of the previous callback call (initial value is provided by the second argument)
//   currentValue: the element currently being processed
//   the result of each call becomes the next accumulator

// Example: calculate total product price
const prices: Array<number> = [19.99, 29.99, 9.99, 49.99];
const totalPrice = prices.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
console.log(totalPrice); // 109.96

// Example: calculate the product
const numbersForProduct: Array<number> = [1, 2, 3, 4, 5];
const product = numbersForProduct.reduce((acc, curr) => acc * curr, 1);
console.log(product); // 120

// Example: concatenate strings
const words: Array<string> = ["Hello", "World", "TypeScript"];
const sentence = words.reduce((acc, curr) => acc + " " + curr, "");
console.log(sentence.trim()); // "Hello World TypeScript"
