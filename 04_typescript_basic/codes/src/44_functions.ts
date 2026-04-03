// ===== Three ways to define functions =====

// Function declaration - the earliest function definition style in JavaScript
function add(x: number, y: number): number {
  return x + y;
}
// Function expression - treats functions as first-class citizens (functional programming)
const subtract = function (x: number, y: number): number {
  return x - y;
};
// Arrow function - concise syntax introduced in ES6
const multiply = (x: number, y: number): number => {
  return x * y;
};

console.log("Addition result: " + add(5, 3)); // 8
console.log("Subtraction result: " + subtract(5, 3)); // 2
console.log("Multiplication result: " + multiply(5, 3)); // 15

// ===== Function declaration vs function expression =====
// Function declarations are hoisted and can be called before their definitions
diff1();

function diff1() {
  console.log("Function declarations can be called before definition");
}

const diff2 = function () {
  console.log("Function expressions cannot be called before definition");
};

diff2();

// ===== Arrow function shorthand =====
// When the function body has only one expression, braces and return can be omitted
const add1 = (x: number, y: number): number => {
  return x + y;
};
const add2 = (x: number, y: number): number => x + y; // Braces and return are omitted

// ===== Special parameters =====

// Default parameter
function greet(name: string = "World"): string {
  return `Hello, ${name}!`;
}
console.log(greet()); // Hello, World!
console.log(greet("Alice")); // Hello, Alice!

// Optional parameter (marked with ?, must be after required parameters)
function logMessage(message: string, prefix?: string): void {
  if (prefix) {
    console.log(`${prefix}: ${message}`);
  } else {
    console.log(message);
  }
}
logMessage("This is a message"); // This is a message
logMessage("This is a message", "Info"); // Info: This is a message

// Rest parameters
function sum(...numbers: Array<number>): number {
  return numbers.reduce((acc, curr) => acc + curr, 0);
}
console.log(sum(1, 2, 3)); // 6
console.log(sum(1, 2, 3, 4, 5)); // 15

// Return multiple values (via tuple)
function getCoordinates(): [number, number] {
  return [10, 20];
}
const [x, y] = getCoordinates();
console.log(`Coordinates: x=${x}, y=${y}`); // x=10, y=20

// ===== Function type descriptions =====

// Use type annotations to describe function types (the arrow represents the function signature, not an arrow function)
let myFunction: (x: number, y: number) => number;
myFunction = (x: number, y: number): number => x + y;

// Use an interface to describe function types (clearer)
interface MyFunction {
  (x: number, y: number): number;
}
const myFunction2: MyFunction = (x: number, y: number): number => x + y;

// ===== Functions as parameters and return values (higher-order functions) =====

// Function as a parameter (callback)
function processNumbers(numbers: number[], callback: (num: number) => void): void {
  for (const num of numbers) {
    callback(num);
  }
}
processNumbers([1, 2, 3], (num) => {
  console.log(`Processing number: ${num}`);
});

// Function as a return value (factory function)
function createMultiplier(factor: number): (num: number) => number {
  return (num: number) => num * factor;
}
const double = createMultiplier(2);
console.log(double(5)); // 10
