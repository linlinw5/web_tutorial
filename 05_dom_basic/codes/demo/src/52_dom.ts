// ===== 5.2 Top-level nodes and child nodes =====

const ht = document.documentElement as HTMLHtmlElement;
ht.lang = "cn";

const hd = document.head as HTMLHeadElement;
console.log(hd);

const bd = document.body as HTMLBodyElement;
console.log(bd);

// children: contains only child element nodes (<div>, <p>, etc.), excluding text and comment nodes
const bdChildren = bd.children as HTMLCollectionOf<Element>;
console.log("children (element nodes only):", bdChildren);

// childNodes: contains all types of child nodes, including text nodes such as line breaks and whitespace
const bdChildNodes = bd.childNodes as NodeListOf<Node>;
console.log("childNodes (all node types):", bdChildNodes);
