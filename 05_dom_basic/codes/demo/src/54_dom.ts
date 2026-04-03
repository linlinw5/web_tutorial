// ===== 5.4 Read and write element content and styles =====

const p2 = document.querySelector(".p2") as HTMLParagraphElement;

// innerHTML: reads/writes HTML content including child tags
console.log(p2.innerHTML); // "This is another paragraph, <span>this is special text</span>"
// p2.innerHTML = "Hello, <br>TypeScript!"; // HTML tags will be parsed

// innerText: reads/writes plain text content (affected by CSS, excludes display:none content)
console.log(p2.innerText); // "This is another paragraph, this is special text"
// p2.innerText = "Hello, <br>TypeScript!"; // <br> is shown as plain text

// textContent: reads/writes all text node content (not affected by CSS, better performance)

// ===== classList operations for CSS classes =====
const lis = document.querySelectorAll("li") as NodeListOf<HTMLLIElement>;

lis[0].classList.add("active"); // Add class
// lis[0].classList.remove("active"); // Remove class
// lis[0].classList.toggle("active"); // Remove if present, add if absent

// Directly modify style properties (inline styles)
lis[1].style.color = "yellow";
(lis[1].children[0] as HTMLElement).style.color = "yellow";

// ===== Read and write element attributes =====
const input = document.querySelector("#input1") as HTMLInputElement;
console.log(input.type); // "text"
console.log(input.value); // "abcde"
// input.type = "password";
