// ===== 5.3 Element selection =====

// getElementById - Selects by id and returns a single element
const banner = document.getElementById("banner") as HTMLDivElement;
console.log(banner);

// querySelector - Selects the first matching element using a CSS selector
const p1 = document.querySelector(".p1") as HTMLParagraphElement;
const content = document.querySelector("#content") as HTMLDivElement;
console.log(p1, content);

// querySelectorAll - Selects all matching elements and returns a NodeList
const allLi = document.querySelectorAll("li") as NodeListOf<HTMLLIElement>;
console.log(allLi);

// NodeList is array-like: it supports forEach, but not map/filter directly
// Convert first when needed: Array.from(allLi)
