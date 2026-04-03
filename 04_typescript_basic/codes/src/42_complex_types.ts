// ===== Union Types =====
// Allows a variable to be one of multiple types
let aa: string | number;
aa = "Hello"; // ✅ OK
aa = 42; // ✅ OK
// aa = true;   // ❌ Not allowed

// ===== Array Types =====
let arr1: number[] = [1, 2, 3]; // Number array
let arr2: string[] = ["a", "b", "c"]; // String array
let arr3: (number | string)[] = [1, "a", 2, "b"]; // Mixed array

// Generic syntax (equivalent form)
let arr4: Array<number> = [1, 2, 3];
let arr5: Array<string> = ["a", "b", "c"];
let arr6: Array<number | string> = [1, "a", 2, "b"];

// ===== Tuple Types =====
// Difference from arrays:
//   Array - Variable length, element types are usually the same
//   Tuple - Fixed length, each position can have a different type
let tuple1: [string, number] = ["Hello", 42];
let tuple2: [number, string, boolean] = [1, "a", true];
let tuple3: [string, ...number[]] = ["Numbers", 1, 2, 3]; // First element is fixed as string, the rest are numbers

// ===== Object Types =====
// Object (uppercase): a legacy JS concept that accepts any value except null/undefined
let obj1: Object;
obj1 = "hello"; // ✅ OK (primitive values are also allowed)
obj1 = 42; // ✅ OK
obj1 = { name: "A" }; // ✅ OK
// obj1 = null;        // ❌ Not allowed

// object (lowercase): only accepts non-primitive types (objects, arrays, functions, etc.)
let obj2: object;
// obj2 = "hello";     // ❌ Not allowed
obj2 = { name: "A" }; // ✅ OK
obj2 = [1, 2, 3]; // ✅ OK

// In real projects, use interface or type to describe object structures (see 46_interface_class.ts)

// ===== Type Assertion =====
// When you know a value's type better than TypeScript, use "as" to tell the compiler
let something: any = "Hello, world";
let strLength: number = (something as string).length;
console.log(strLength); // Output: 12

// Type assertion does not perform runtime conversion; it only tells the compiler: "Trust me, I know this value's type"
