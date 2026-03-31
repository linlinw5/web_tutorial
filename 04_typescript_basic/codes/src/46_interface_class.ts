// ===== 对象类型：从 object 到 interface =====

// 用 object 类型声明对象，无法访问具体属性
let obj01: object = { name: "Alice", age: 30, isStudent: false };
// console.log(obj01.name); // ❌ TS 报错：object 类型没有 name 属性

// 内联类型（可以访问属性，但可复用性差）
let obj02: { name: string; age: number; isStudent: boolean } = {
    name: "Bob",
    age: 25,
    isStudent: true
};
console.log(obj02.name);      // "Bob"
console.log(obj02.age);       // 25
console.log(obj02.isStudent); // true

// 推荐做法：用 interface 定义对象结构（可复用）
interface Person {
    name: string;
    age: number;
    isStudent: boolean;
}
let obj03: Person = { name: "Charlie", age: 22, isStudent: true };
console.log(obj03.name); // "Charlie"

// type 关键字也可以定义对象类型（与 interface 效果类似）
type PersonType = {
    name: string;
    age: number;
    isStudent: boolean;
};
let obj04: PersonType = { name: "David", age: 28, isStudent: false };
console.log(obj04.name); // "David"

// 可选属性（用 ? 标记）
interface PersonWithOptional {
    name: string;
    age: number;
    isStudent?: boolean; // 可选，可以不提供
}
let obj05: PersonWithOptional = { name: "Eve", age: 26 };

// interface 中的复杂属性（数组、函数）
interface ComplexObject {
    name: string;
    age: number;
    hobbies: string[];       // 数组属性
    greet: () => void;       // 函数属性（箭头函数写法）
    hello(): void;           // 函数属性（方法简写，ES6）
}
let obj06: ComplexObject = {
    name: "Frank",
    age: 32,
    hobbies: ["reading", "gaming"],
    greet: () => { console.log("Hello, my name is Frank!"); },
    hello() { console.log("Hello from Frank!"); }
};


// ===== class（类）=====
// 类是创建对象的模板，用于批量创建结构相同的对象

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


// ===== 综合练习：class + 数组方法 =====

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

let students: Student[] = [
    new Student("Alice", 18, 85),
    new Student("Bob", 19, 92),
    new Student("Charlie", 17, 78)
];

console.log("学生信息：", students);

// 用 forEach 给每个学生加5分（修改原数组）
students.forEach(student => {
    student.score += 5;
});
console.log("加分后：", students);

// 用 map 生成只含姓名和年龄的新数组
let nameAndAgeArr = students.map(student => {
    return { name: student.name, age: student.age };
});
console.log("姓名和年龄：", nameAndAgeArr);


// ===== 作业 =====
// 1. 定义一个 Course 类，包含 courseName: string 和 score: number
// 2. 创建包含3门课程的数组，例如：
//    [{ courseName: "Math", score: 38 }, { courseName: "English", score: 81 }, ...]
// 3. 用 forEach 给每门课加10分
// 4. 用 filter 筛选出及格课程（score >= 60）
// 5. 打印加分后的课程数组和及格课程数组
