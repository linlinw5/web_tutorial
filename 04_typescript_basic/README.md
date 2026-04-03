[← Back to Home](../readme.md)

# Chapter 4: TypeScript Basics

## Why Introduce TypeScript?

From this chapter onward, all code in the course is written in **TypeScript**.

The core reason for introducing TypeScript is not the syntax itself, but to help beginners develop an awareness of **data structures**. In real projects, a large proportion of bugs come from "not knowing what a variable actually contains." TypeScript's type system forces you to think clearly about the shape of your data before writing code — this habit matters more than any specific syntax.

> **Core convention:** In all subsequent chapters, any custom data (users, blogs, tags, etc.) must be defined with an `interface` or `type` before use.

---

## Directory Convention

```
04_typescript_basic/
  README.md
  codes/
    src/          ← TypeScript source files (organized by section number)
    tsconfig.json ← Compilation configuration
  practice/
    src/          ← Your practice directory
    tsconfig.json ← Pre-configured
```

---

## Installation and Configuration

```bash
# Install the TypeScript compiler globally (only needed once)
sudo npm install -g typescript

# Verify installation
tsc --version
```

### Initializing the Project

```bash
cd practice

# Generate tsconfig.json (or copy the existing configuration)
tsc --init
```

Modify two settings in `tsconfig.json` to specify the source and output directories:

```json
{
  "compilerOptions": {
    "target": "es2016",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

### Development Workflow

```bash
# Watch all .ts files in src/ for changes and auto-compile to dist/
tsc --watch

# Do not emit output if there are type errors (recommended)
tsc --noEmitOnError --watch
```

After compilation, run the compiled output with node:

```bash
node dist/41_primitives.js
```

> Reference: [TypeScript Official Handbook](https://www.typescriptlang.org/)

---

## Running TypeScript Directly with tsx

The `tsc` compilation workflow (write code → compile → run JS) is a bit cumbersome during the learning phase. **tsx** is a tool that can execute `.ts` files directly, skipping the compilation step — ideal for practice and quick code verification.

```bash
# Install globally
npm install -g tsx

# Verify installation
tsx --version
```

After installation, you can run `.ts` files just like `node`:

```bash
tsx src/41_primitives.ts
```

It also supports watch mode, auto-re-executing on save:

```bash
tsx watch src/41_primitives.ts
```

> **Choosing between tsx and tsc:**
> - **Learning/practice**: use `tsx` for fast feedback
> - **Production projects**: compile with `tsc`, run with `node` — the compiled output can be deployed, and type errors are exposed at build time

---

## 4.1 Primitive Types (`src/41_primitives.ts`)

TypeScript adds **type annotations** to every variable on top of JavaScript. The core value is catching type errors at compile time rather than at runtime.

### The Three Primitive Types

```ts
const message: string = "Hello, TypeScript!";
let count: number = 42;
const isActive: boolean = true;
```

### Type Inference

When a variable is **declared and assigned at the same time**, TypeScript automatically infers the type — no manual annotation needed:

```ts
let inferredCount = 42;  // Inferred as number
// inferredCount = "100"; // ❌ Compile error
```

### `undefined` and `null`

```ts
let a;          // Not assigned → undefined
let b = null;   // Explicitly "empty" → null
```

| | Meaning | Typical Use Case |
|---|---|---|
| `undefined` | Variable declared but not assigned | Function has no return, object missing a property |
| `null` | Programmer explicitly set to "empty" | "There should be a value here, but currently it's empty" |

### `any`: Disabling Type Checking

```ts
let e: any;
e = 123;    // ✅
e = "abc";  // ✅
e = null;   // ✅
```

`any` essentially disables type checking and should be avoided as much as possible.

---

## 4.2 Composite Types (`src/42_complex_types.ts`)

### Union Types

Allow a variable to hold one of multiple types:

```ts
let value: string | number;
value = "hello";  // ✅
value = 42;       // ✅
// value = true;  // ❌
```

### Array Types

```ts
let nums: number[] = [1, 2, 3];          // Bracket syntax
let strs: Array<string> = ["a", "b"];   // Generic syntax (equivalent)
let mixed: (number | string)[] = [1, "a", 2];
```

### Tuple

Fixed length, with each position having a fixed type:

```ts
let point: [number, number] = [10, 20];
let record: [string, number, boolean] = ["Alice", 18, true];
```

| | Array | Tuple |
|---|---|---|
| Length | Variable | Fixed |
| Element types | Uniform (or union) | Defined per position |

### `object` vs `Object`

```ts
// Object (uppercase): accepts almost any value, including primitives
let o1: Object = "hello";  // ✅ (not recommended)

// object (lowercase): only accepts non-primitive types
let o2: object = { name: "Alice" };  // ✅
// let o3: object = "hello";          // ❌
```

In practice, use `interface` or `type` instead of `object` — see Section 4.6.

### Type Assertion

When you know the specific type of a value better than TypeScript does, use `as` to inform the compiler:

```ts
let something: any = "Hello, world";
let len: number = (something as string).length;  // Assert as string before accessing .length
```

---

## 4.3 Control Flow (`src/43_control_flow.ts`)

TypeScript's `if`, `for`, and `while` syntax is identical to JavaScript — variables and parameters just need type annotations:

```ts
const randomNumber: number = Number(Math.random().toFixed(1));

if (randomNumber > 0.5) {
    console.log("Greater than 0.5");
} else if (randomNumber === 0.5) {
    console.log("Equal to 0.5");
} else {
    console.log("Less than 0.5");
}

for (let i: number = 0; i < 5; i++) {
    console.log("Loop iteration: " + i);
}

let j: number = 0;
while (j < 5) {
    console.log("while: " + j);
    j++;
}
```

---

## 4.4 Functions (`src/44_functions.ts`)

### Three Ways to Define Functions

```ts
// 1. Function declaration — "hoisted"; can be called before definition
function add(x: number, y: number): number {
    return x + y;
}

// 2. Function expression — not hoisted; must be defined before calling
const subtract = function(x: number, y: number): number {
    return x - y;
};

// 3. Arrow function — concise ES6 syntax
const multiply = (x: number, y: number): number => x * y;
```

### Optional Parameters, Default Parameters, Rest Parameters

```ts
// Optional parameter (marked with ?; can be omitted when calling)
function log(msg: string, prefix?: string): void {
    console.log(prefix ? `${prefix}: ${msg}` : msg);
}

// Default parameter
function greet(name: string = "World"): string {
    return `Hello, ${name}!`;
}

// Rest parameters (any number of same-type parameters)
function sum(...nums: number[]): number {
    return nums.reduce((acc, n) => acc + n, 0);
}
```

### Describing Function Types with `interface`

```ts
interface BinaryOp {
    (x: number, y: number): number;
}

const divide: BinaryOp = (x, y) => x / y;
```

### Higher-Order Functions (Functions as Parameters / Return Values)

```ts
// Function as a parameter (callback)
function process(nums: number[], callback: (n: number) => void): void {
    for (const n of nums) callback(n);
}

// Function as a return value
function createMultiplier(factor: number): (n: number) => number {
    return (n) => n * factor;
}
const double = createMultiplier(2);
console.log(double(5));  // 10
```

---

## 4.5 Array Methods

TypeScript array type syntax is `T[]` or `Array<T>`; methods are identical to JavaScript.

### Iteration: `for` / `for...of` / `forEach` (`src/45_1_array_basics.ts`)

```ts
const arr: number[] = [1, 2, 3, 4];

for (let i = 0; i < arr.length; i++) { console.log(arr[i]); }

for (const item of arr) { console.log(item); }

arr.forEach(item => console.log(item));
```

### `map`: Transform Each Element, Return a New Array (`src/45_2_array_map.ts`)

```ts
const doubled = [1, 2, 3].map(n => n * 2);          // [2, 4, 6]
const upper = ["hello", "world"].map(s => s.toUpperCase()); // ["HELLO", "WORLD"]
```

`map` does not modify the original array; it returns a new array of equal length.

### `filter` / `reduce` (`src/45_3_array_filter_reduce.ts`)

```ts
// filter: select elements that meet a condition
const evens = [1,2,3,4,5,6].filter(n => n % 2 === 0);  // [2,4,6]

// reduce: "fold" the array into a single value
const total = [10, 20, 30].reduce((acc, n) => acc + n, 0);  // 60
```

`reduce(callback, initialValue)` — `acc` is the accumulator; the return value of each callback becomes the next `acc`.

### Other Commonly Used Methods (`src/45_4_array_methods.ts`)

**Query methods (do not modify the original array):**

```ts
const arr = [1, 2, 3, 4, 5];
arr.some(n => n > 4);        // true  — at least one satisfies
arr.every(n => n > 0);       // true  — all satisfy
arr.find(n => n > 3);        // 4     — first element that satisfies
arr.findIndex(n => n > 3);   // 3     — index of the first element that satisfies
arr.includes(3);             // true  — whether a value is present
```

**Mutation methods (operate on the original array directly):**

```ts
arr.push(6);           // Add to end; returns new length
arr.unshift(0);        // Add to beginning; returns new length
arr.pop();             // Remove from end; returns the removed element
arr.splice(2, 0, 99);  // splice(startIndex, deleteCount, insertValue)
arr.sort((a, b) => a - b);   // Sort ascending (in-place)
arr.reverse();               // Reverse (in-place)
```

**Copying arrays (note reference vs value):**

```ts
const a = [1, 2, 3];
const b = a;          // ❌ Copies the reference; b and a point to the same array
const c = [...a];     // ✅ Spread operator; shallow copy
```

---

## 4.6 Objects, Interfaces, and Classes (`src/46_interface_class.ts`)

### `interface` and `type`: Defining Data Structures

This is the most important habit in this course: **define the shape of your data before using it**.

```ts
// interface (recommended for describing object structures)
interface User {
    id: number;
    name: string;
    email: string;
    age?: number;          // ? means optional property
}

// type (more flexible; also usable for union types, etc.)
type Point = {
    x: number;
    y: number;
};
```

Both have the same effect for describing object structures. This course uses `interface` uniformly.

### Object Literals

```ts
const user: User = {
    id: 1,
    name: "Alice",
    email: "alice@example.com",
    // age is optional; can be omitted
};

console.log(user.name);      // Dot notation
console.log(user["email"]);  // Bracket notation
```

### Function Properties in Interfaces

```ts
interface Animal {
    name: string;
    eat(): void;           // Method signature
    sleep: () => void;     // Equivalent syntax
}
```

### `class`: A Template for Creating Objects in Bulk

```ts
class Student {
    name: string;
    age: number;
    score: number;

    constructor(name: string, age: number, score: number) {
        this.name = name;
        this.age = age;
        this.score = score;
    }

    greet(): string {
        return `Hi, I'm ${this.name}`;
    }
}

const s1 = new Student("Alice", 18, 85);
const s2 = new Student("Bob", 19, 92);
```

The relationship between `class` and `interface`: `interface` describes the "shape" of data; `class` is the "factory" that produces objects.

---

## 4.7 Common Built-in Objects (`src/47_builtin_objects.ts`)

### `Date`

```ts
const now = new Date();
console.log(now.getFullYear());  // Year
console.log(now.getMonth() + 1); // Month (starts from 0; add 1)
console.log(now.getDate());      // Day
console.log(now.getTime());      // Unix timestamp (milliseconds)

const d = new Date("2025-10-01T00:00:00");
if (now > d) console.log("Current time is later");
```

### `Math`

```ts
Math.PI;               // 3.14159...
Math.sqrt(16);         // 4
Math.pow(2, 8);        // 256
Math.abs(-5);          // 5
Math.ceil(3.1);        // 4 (round up)
Math.floor(3.9);       // 3 (round down)
Math.round(3.5);       // 4 (round to nearest)
Math.random();         // [0, 1) random decimal
Math.floor(Math.random() * 100); // [0, 99] random integer
```

### `Promise` and `async/await`

Asynchronous operations like HTTP requests return a `Promise`, representing a value that "will be available at some future point":

```ts
// fetch returns Promise<Response> directly
async function fetchData(url: string): Promise<void> {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Request failed:", error);
    } finally {
        console.log("Request finished");  // Runs regardless of success or failure
    }
}

fetchData("https://jsonplaceholder.typicode.com/posts/1");
```

Inside an `async` function, `await` waits for a Promise to resolve, making the code read like synchronous code.

---

## 4.8 Modules (`src/48_1_export.ts` / `src/48_2_import.ts`)

Split code into multiple files and share between them with `export` / `import`:

**`48_1_export.ts` (exporting):**

```ts
export const PI = 3.14;

export function area(radius: number): number {
    return PI * radius * radius;
}

// Default export (only one allowed per file)
export default { PI, area };
```

**`48_2_import.ts` (importing):**

```ts
// Named import (import specific items by name)
import { PI, area } from './48_1_export';

// Default import (can use a custom alias)
import mathUtils from './48_1_export';

console.log(PI);               // 3.14
console.log(area(5));          // 78.5
console.log(mathUtils.area(5)); // 78.5
```

---

## Exercises

Combining all the knowledge from this chapter, complete the following comprehensive exercise:

1. Define a `interface Product` with fields: `id: number`, `name: string`, `price: number`, `category: string`, `inStock?: boolean`
2. Create a `Product[]` array containing at least 5 products
3. Use `filter` to select all products priced below 100
4. Use `map` to generate a new array containing only `name` and `price`
5. Use `reduce` to calculate the total price of all products
6. Define a `class Cart` with a `items: Product[]` property and the following methods:
   - `add(product: Product): void` — add a product
   - `total(): number` — calculate the total price
   - `list(): void` — print all product names and prices
7. Place the `Product` interface and the `Cart` class in separate files, and organize the code using `export` / `import`
