// ===== 5.3 元素选取 =====

// getElementById - 按 id 获取，返回单个元素
const banner = document.getElementById("banner") as HTMLDivElement;
console.log(banner);

// querySelector - 按 CSS 选择器获取第一个匹配元素
const p1 = document.querySelector(".p1") as HTMLParagraphElement;
const content = document.querySelector("#content") as HTMLDivElement;
console.log(p1, content);

// querySelectorAll - 获取所有匹配元素，返回 NodeList
const allLi = document.querySelectorAll("li") as NodeListOf<HTMLLIElement>;
console.log(allLi);

// NodeList 类似数组，支持 forEach，但不能直接用 map/filter 等
// 需要时先转换：Array.from(allLi)
