// ===== BOM Basics: window / location / history / dialogs =====

// --- window object ---
// window is the browser's global object; all global variables and functions are attached to it
console.log(window.document === document); // true
console.log("Window width:", window.innerWidth);
console.log("Window height:", window.innerHeight);
console.log("Browser info:", navigator.userAgent);

// --- location object ---
console.log("Full URL:", location.href);
console.log("Hostname:", location.hostname);
console.log("Path:", location.pathname);
console.log("Query string:", location.search);

const btn = document.querySelector("button") as HTMLButtonElement;
btn.addEventListener("click", () => {
  // href / assign: navigate and keep history (can go back)
  // location.href = "https://www.baidu.com";

  // replace: navigate and replace history (cannot go back)
  // location.replace("https://www.baidu.com");

  // reload: refresh
  // location.reload();

  // --- history object ---
  // history.back();    // Go to previous page
  // history.forward(); // Go forward

  // pushState: update URL without refresh (core idea behind SPA routing)
  history.pushState({ page: "about" }, "", "/about");
  console.log("URL updated:", location.href);
});

console.log("History length:", history.length);

// --- dialogs ---
// alert("This is an alert dialog");

const isConfirmed: boolean = confirm("Are you sure you want to continue?");
console.log("confirm result:", isConfirmed);

const userInput: string | null = prompt("Please enter your name:");
console.log("prompt result:", userInput);

// --- timers ---

// setTimeout: run once after a delay
const timerId = setTimeout(() => {
  console.log("Runs once after 3 seconds");
}, 3000);
// clearTimeout(timerId); // cancel

// setInterval: run repeatedly
let count = 0;
const intervalId = setInterval(() => {
  console.log("Timing...", ++count);
  if (count >= 5) {
    clearInterval(intervalId);
    console.log("Timer stopped");
  }
}, 1000);
