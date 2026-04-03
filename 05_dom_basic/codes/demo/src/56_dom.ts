// ===== 5.6 Event binding =====

// Method 1: addEventListener (recommended, supports multiple handlers)
const btn1 = document.getElementById("btn1") as HTMLButtonElement;
btn1.addEventListener("click", () => {
  console.log("btn1 clicked - listener A");
});
btn1.addEventListener("click", () => {
  console.log("btn1 clicked - listener B"); // Both listeners will be triggered
});

// Named function, convenient for removing the listener later
function handleBtn1Click() {
  console.log("btn1 clicked - named handler");
}
btn1.addEventListener("click", handleBtn1Click);
// btn1.removeEventListener('click', handleBtn1Click);

// Method 2: onXXX property (only one handler, new assignment overrides the old one)
const btn2 = document.getElementById("btn2") as HTMLButtonElement;
btn2.onclick = () => {
  console.log("btn2 clicked (after override)");
};

// Method 3: HTML inline handler (see btn3 in index.html with onclick="handleClick(...)")
function handleClick(message: string) {
  console.log(message);
}

// ===== Bind events to any element =====
const banner1 = document.getElementById("banner") as HTMLDivElement;
banner1.addEventListener("click", () => {
  console.log("Banner area clicked");
});

// ===== Keyboard and input events =====
const input1 = document.getElementById("input1") as HTMLInputElement;

input1.addEventListener("keydown", (event) => {
  console.log("Key pressed:", event.key);
});

// change: triggered when focus is lost and content has changed
input1.onchange = () => {
  console.log("change event, current value:", input1.value);
};

// input: triggered immediately on every content change
input1.addEventListener("input", () => {
  console.log("input event, live value:", input1.value);
});
