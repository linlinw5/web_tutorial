// ===== Date object =====

let date1: Date = new Date(); // Current time
console.log("Current time:", date1);

console.log("Year:", date1.getFullYear());
console.log("Month:", date1.getMonth() + 1); // Months are zero-based, so add 1
console.log("Day:", date1.getDate());
console.log("Hour:", date1.getHours());
console.log("Minute:", date1.getMinutes());
console.log("Second:", date1.getSeconds());
console.log("Timestamp (ms):", date1.getTime());

// Create a specific time
let date2 = new Date("2025-10-01T00:00:00");
console.log("Specified time:", date2);

// Compare two times
if (date1 > date2) {
  console.log("Current time is later than the specified time");
} else if (date1 < date2) {
  console.log("Current time is earlier than the specified time");
} else {
  console.log("Current time is equal to the specified time");
}

// Modify time
date1.setFullYear(2023);
date1.setMonth(11); // December
date1.setDate(25);
date1.setHours(10);
date1.setMinutes(30);
date1.setSeconds(0);
console.log("Modified time:", date1);

// ===== Math object =====

let pi: number = Math.PI;
console.log("Pi:", pi);

let myNum: number = 16;
console.log(Math.sqrt(myNum), "Square root"); // 4
console.log(Math.pow(myNum, 2), "Square"); // 256
console.log(Math.abs(-myNum), "Absolute value"); // 16
console.log(Math.ceil(3.14), "Ceiling"); // 4
console.log(Math.floor(3.14), "Floor"); // 3
console.log(Math.round(3.14), "Round"); // 3

let randomNum: number = Math.random(); // Random number between 0 and 1
console.log("Random number:", randomNum);

let randomInt: number = Math.floor(Math.random() * 100); // Random integer between 0 and 99
console.log("Random integer:", randomInt);

// ===== Promise and async/await =====
// Promise is used to handle asynchronous operations, representing a future operation that may succeed or fail
// Three states: pending -> fulfilled or rejected

function fetchTest() {
  let promise1: Promise<Response> = fetch("https://jsonplaceholder.typicode.com/posts/1");
  console.log(promise1); // Promise object (pending state)
}
fetchTest();

// async/await is syntactic sugar for Promise, making async code look like synchronous code
async function fetchData() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts/1");
    console.log(response);
    if (!response.ok) {
      throw new Error("Network response is not OK");
    }
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Failed to fetch data:", error);
  } finally {
    console.log("Data fetch operation completed"); // Executes whether successful or failed
  }
}

fetchData();
