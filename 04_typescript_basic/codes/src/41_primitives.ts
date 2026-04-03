// Three primitive types in TypeScript (Primitives)
// Use let / const for variable declarations, and avoid var whenever possible
// TypeScript allows type annotations on variables, which helps catch errors at compile time

const message: string = "Hello, TypeScript!";
// message = "Hello, World!"; // const cannot be reassigned

let count: number = 42;
count = 100; // let can be reassigned

const isActive: boolean = true;

console.log(message);
console.log("count: ", count);
console.log(`isActive: ${isActive}, test message.`);

// Difference between let and const:
// let is used for mutable variables, while const is used for immutable bindings.
// Variables declared with const must be initialized at declaration and cannot be reassigned.

// Type Annotation
// count = "100"; // ❌ Error: count is declared as type number

// TypeScript type inference: when declaration and initialization happen together, the type is inferred automatically
let inferredCount = 42; // inferred as number
// inferredCount = "100"; // ❌ Error

// undefined: a variable is declared but not assigned, or a function has no return value
// null: explicitly assigned empty value, meaning "there should be a value here, but currently it is empty"
let a; // not assigned
console.log(a); // undefined

let b = null; // explicitly assigned as empty
console.log(b); // null

let c: undefined; // explicitly declared as undefined
// c = 11; // ❌ Error
let d: null; // explicitly declared as null
// d = 22; // ❌ Error

// any type: accepts values of any type, effectively turning off type checking
let e: any;
e = 123; // ✅ OK
e = "123"; // ✅ OK
e = null; // ✅ OK
e = undefined; // ✅ OK
e = {}; // ✅ OK
e = []; // ✅ OK
