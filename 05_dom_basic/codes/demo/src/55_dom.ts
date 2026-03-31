// ===== 5.5 节点的创建、插入与删除 =====

const ul = document.querySelector("ul") as HTMLUListElement;

// 创建新节点
const newLi = document.createElement("li");
newLi.innerHTML = "<a href='#'>新建的 li</a>";
newLi.classList.add("item");

// appendChild - 追加到末尾
ul.appendChild(newLi);

// insertBefore - 插入到指定节点之前
const newLi2 = document.createElement("li");
newLi2.innerHTML = "<a href='#'>新建的 li2</a>";
newLi2.classList.add("item");
ul.insertBefore(newLi2, ul.firstChild);

// append - 可同时插入多个节点或文本
const newLi3 = document.createElement("li");
const text = document.createTextNode("纯文本节点");
const link = document.createElement("a");
link.href = "#";
link.textContent = "链接";
newLi3.append(text, link);
ul.appendChild(newLi3);

// 删除节点
ul.removeChild(newLi);   // 父节点删除指定子节点
newLi2.remove();         // 节点自删（更简洁）
