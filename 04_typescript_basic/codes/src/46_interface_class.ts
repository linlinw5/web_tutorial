// ===== Object types: from object to interface =====

// When declaring an object with the object type, specific properties cannot be accessed
let obj01: object = { name: "Alice", age: 30, isStudent: false };
// console.log(obj01.name); // ❌ TS error: object type has no name property

// Inline type (properties are accessible, but reusability is poor)
let obj02: { name: string; age: number; isStudent: boolean } = {
  name: "Bob",
  age: 25,
  isStudent: true,
};
console.log(obj02.name); // "Bob"
console.log(obj02.age); // 25
console.log(obj02.isStudent); // true

// Recommended approach: define object structures with interface (reusable)
interface Person {
  name: string;
  age: number;
  isStudent: boolean;
}
let obj03: Person = { name: "Charlie", age: 22, isStudent: true };
console.log(obj03.name); // "Charlie"

// The type keyword can also define object types (similar effect to interface)
type PersonType = {
  name: string;
  age: number;
  isStudent: boolean;
};
let obj04: PersonType = { name: "David", age: 28, isStudent: false };
console.log(obj04.name); // "David"

// Optional properties (marked with ?)
interface PersonWithOptional {
  name: string;
  age: number;
  isStudent?: boolean; // Optional and may be omitted
}
let obj05: PersonWithOptional = { name: "Eve", age: 26 };

// Complex properties in an interface (arrays, functions)
interface ComplexObject {
  name: string;
  age: number;
  hobbies: string[]; // Array property
  greet: () => void; // Function property (arrow function style)
  hello(): void; // Function property (method shorthand, ES6)
}
let obj06: ComplexObject = {
  name: "Frank",
  age: 32,
  hobbies: ["reading", "gaming"],
  greet: () => {
    console.log("Hello, my name is Frank!");
  },
  hello() {
    console.log("Hello from Frank!");
  },
};

// ===== class =====
// A class is a template for creating objects with the same structure in batches

class Animal {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  eat() {
    console.log(`${this.name} is eating.`);
  }
}

let dog1 = new Animal("Dog", 5);
let cat1 = new Animal("Cat", 3);

dog1.eat(); // "Dog is eating."
cat1.eat(); // "Cat is eating."
console.log(dog1);

// ===== Combined exercise: class + array methods =====

class Student {
  name: string;
  age: number;
  score: number;

  constructor(name: string, age: number, score: number) {
    this.name = name;
    this.age = age;
    this.score = score;
  }
}

let students: Student[] = [new Student("Alice", 18, 85), new Student("Bob", 19, 92), new Student("Charlie", 17, 78)];

console.log("Student info:", students);

// Use forEach to add 5 points to each student (mutates the original array)
students.forEach((student) => {
  student.score += 5;
});
console.log("After adding points:", students);

// Use map to generate a new array containing only names and ages
let nameAndAgeArr = students.map((student) => {
  return { name: student.name, age: student.age };
});
console.log("Name and age:", nameAndAgeArr);

// ===== Homework =====
// 1. Define a Course class containing courseName: string and score: number
// 2. Create an array with 3 courses, for example:
//    [{ courseName: "Math", score: 38 }, { courseName: "English", score: 81 }, ...]
// 3. Use forEach to add 10 points to each course
// 4. Use filter to select passing courses (score >= 60)
// 5. Print the course array after adding points and the passing course array
