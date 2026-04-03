// Other commonly used array methods: some, every, find, findIndex, includes, push/pop/splice, sort, reverse

// ===== Query methods =====

let arr022: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// some() - Returns true if at least one element matches the condition
let hasEvenNumber = arr022.some((item) => item % 2 === 0);
console.log(hasEvenNumber); // true

// every() - Returns true if all elements match the condition
let allEvenNumbers = arr022.every((item) => item % 2 === 0);
console.log(allEvenNumbers); // false

// find() - Returns the first matching element, or undefined if none found
let firstEvenNumber = arr022.find((item) => item % 2 === 0);
console.log(firstEvenNumber); // 2

// findIndex() - Returns the index of the first matching element, or -1 if none found
let firstEvenIndex = arr022.findIndex((item) => item % 2 === 0);
console.log(firstEvenIndex); // 1

// includes() - Checks whether a specific element exists
let includesFive = arr022.includes(5);
console.log(includesFive); // true

// ===== Add, remove, and update methods (mutate the original array) =====

let arr033: Array<number> = [1, 2, 3, 4, 5];

arr033.push(1); // Add to the end
console.log(arr033); // [1, 2, 3, 4, 5, 1]

arr033.unshift(6); // Add to the beginning
console.log(arr033); // [6, 1, 2, 3, 4, 5, 1]

arr033.splice(2, 0, 7); // Insert 7 at index 2 (without deleting)
console.log(arr033); // [6, 1, 7, 2, 3, 4, 5, 1]
// splice(start, deleteCount, ...items)

let lastElement = arr033.pop(); // Remove and return the last element
console.log(lastElement); // 1
console.log(arr033); // [6, 1, 7, 2, 3, 4, 5]

// join() - Joins array elements into a string (does not mutate the original array)
let arr034: Array<string> = ["Hello", "World"];
let joinedString = arr034.join(" ");
console.log(joinedString); // "Hello World"

// ===== Sorting and copying =====

let arr456: Array<number> = [5, 3, 8, 1, 2];

arr456.sort((a, b) => a - b); // Ascending order
console.log(arr456); // [1, 2, 3, 5, 8]

arr456.sort((a, b) => b - a); // Descending order
console.log(arr456); // [8, 5, 3, 2, 1]

arr456.reverse(); // Reverse order (ignores element values)
console.log(arr456); // [1, 2, 3, 5, 8]

// Arrays are reference types: direct assignment copies the reference, not the array itself
let arr456Copy = arr456; // Copy reference
arr456Copy.push(9);
console.log(arr456); // [1, 2, 3, 5, 8, 9] (the original array is also modified)

// Use the spread operator for a shallow copy
let arr456Copy2 = [...arr456];
arr456Copy2.push(10);
console.log(arr456); // [1, 2, 3, 5, 8, 9] (unaffected)
console.log(arr456Copy2); // [1, 2, 3, 5, 8, 9, 10]
