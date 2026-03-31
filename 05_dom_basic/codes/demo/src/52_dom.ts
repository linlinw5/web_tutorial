// ===== 5.2 顶层节点与子节点 =====

const ht = document.documentElement as HTMLHtmlElement;
ht.lang = 'cn';

const hd = document.head as HTMLHeadElement;
console.log(hd);

const bd = document.body as HTMLBodyElement;
console.log(bd);

// children：只包含子元素节点（<div>、<p> 等标签），不含文本节点、注释节点
const bdChildren = bd.children as HTMLCollectionOf<Element>;
console.log("children（只含元素节点）：", bdChildren);

// childNodes：包含所有类型的子节点，包括换行、空白等文本节点
const bdChildNodes = bd.childNodes as NodeListOf<Node>;
console.log("childNodes（含所有节点）：", bdChildNodes);
