// ===== 5.5 Node creation, insertion, and removal =====

const ul = document.querySelector("ul") as HTMLUListElement;

// Create a new node
const newLi = document.createElement("li");
newLi.innerHTML = "<a href='#'>New li</a>";
newLi.classList.add("item");

// appendChild - Append to the end
ul.appendChild(newLi);

// insertBefore - Insert before a specified node
const newLi2 = document.createElement("li");
newLi2.innerHTML = "<a href='#'>New li2</a>";
newLi2.classList.add("item");
ul.insertBefore(newLi2, ul.firstChild);

// append - Can insert multiple nodes or text at once
const newLi3 = document.createElement("li");
const text = document.createTextNode("Plain text node");
const link = document.createElement("a");
link.href = "#";
link.textContent = "Link";
newLi3.append(text, link);
ul.appendChild(newLi3);

// Remove nodes
ul.removeChild(newLi); // Parent node removes a specific child node
newLi2.remove(); // Node removes itself (more concise)
