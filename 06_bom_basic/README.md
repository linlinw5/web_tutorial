[← Back to Home](../readme.md)

# Chapter 6: BOM — Browser Object Model

## Directory Structure

```
06_bom_basic/
  README.md
  codes/
    tsconfig.json
    61_bom.html           ← Demo: window / location / history / dialogs / timers
    homework.html         ← Exercise reference solution: countdown timer
    src/
      61_bom.ts
      homework.ts
    dist/
  practice/
    tsconfig.json
    61_bom.html           ← Follow-along page
    homework.html         ← Countdown timer exercise page
    src/
      61_bom.ts           ← Write code here following the demo
      homework.ts         ← Complete the exercise here
    dist/
```

**Workflow:**

```bash
# Demo phase: run inside codes/
cd codes
tsc --watch
# Open 61_bom.html to demo all BOM fundamentals
# Open homework.html to view the countdown timer reference solution

# Practice phase: run inside practice/
cd practice
tsc --watch
# Open 61_bom.html to follow along with the demo
# Open homework.html to complete the countdown exercise
```

---

## 6.1 BOM and the window Object

**BOM (Browser Object Model)** is a set of interfaces provided by the browser for manipulating the browser window itself, as opposed to page content (that is the DOM's job).

The core of BOM is the **`window` object**, which is the global object in the browser environment:
- All global variables and functions are attached to `window`
- `document` (DOM) is also a property of `window`
- Writing `console.log()` directly in the browser is equivalent to `window.console.log()`

```typescript
console.log(window.document === document); // true

// Window dimensions
console.log(window.innerWidth);   // viewport width (px)
console.log(window.innerHeight);  // viewport height (px)

// Browser and device information
console.log(navigator.userAgent); // browser UA string
```

---

## 6.2 The location Object

The `location` object represents the URL of the current page. It can read individual parts of the URL and also control page navigation.

```typescript
// Reading URL information
console.log(location.href);      // full URL
console.log(location.hostname);  // domain, e.g. "www.example.com"
console.log(location.pathname);  // path, e.g. "/blog/post"
console.log(location.search);    // query string, e.g. "?id=1"
console.log(location.hash);      // hash, e.g. "#section1"

// Navigation and reload
location.href = "https://www.example.com";    // navigate (history preserved)
location.assign("https://www.example.com");   // same as above
location.replace("https://www.example.com");  // navigate (replaces history entry, no back)
location.reload();                             // reload the current page
```

> The difference between `href`/`assign` and `replace`: the former keeps the current page in the browser history so the user can navigate back; `replace` removes the current page from history, making it impossible to go back.

---

## 6.3 The history Object

The `history` object manages the browser's session history (the browsing record within a tab).

```typescript
console.log(history.length); // number of entries in the current session history

// Forward and back
history.back();      // go back one page, equivalent to history.go(-1)
history.forward();   // go forward one page, equivalent to history.go(1)
history.go(-2);      // go back two pages
```

### pushState and replaceState

These two methods can **modify the URL without reloading the page** — they are the underlying mechanism behind Single Page Application (SPA) routing:

```typescript
// pushState(state object, title, new URL)
history.pushState({ page: "about" }, "", "/about");
// The address bar changes to /about, but the page does not reload or send a request

// replaceState: same as above, but replaces the current history entry instead of adding a new one
history.replaceState({ page: "home" }, "", "/");
```

---

## 6.4 Dialogs: alert / confirm / prompt

The browser natively provides three modal dialogs that block JavaScript execution until the user responds:

```typescript
// alert: display a message; user can only click "OK"
alert("Operation successful!");

// confirm: request user confirmation; returns boolean
const ok: boolean = confirm("Are you sure you want to delete?");
if (ok) { /* perform deletion */ }

// prompt: request user input; returns string | null (returns null if cancelled)
const name: string | null = prompt("Please enter your name:");
if (name !== null) {
    console.log("Hello, " + name);
}
```

> These three dialogs are rarely used in real products (poor user experience, styles cannot be customized) and are typically replaced with custom Modal components. However, they are very convenient for quick debugging and demos during learning.

---

## 6.5 Timers

### setTimeout — Execute Once After a Delay

```typescript
// Execute once after 2000ms
const timerId = setTimeout(() => {
    console.log("Executed after 2 seconds");
}, 2000);

// Cancel before it fires
clearTimeout(timerId);
```

### setInterval — Execute Repeatedly

```typescript
let count = 0;
const intervalId = setInterval(() => {
    console.log("Counting...", ++count);
    if (count >= 5) {
        clearInterval(intervalId); // stop the timer
    }
}, 1000);
```

> **Note:** If the `setInterval` callback contains time-consuming operations, the actual interval will be longer than the configured value. For precise intervals, use `setTimeout` calling itself recursively.

---

## Exercise: Countdown Timer

Corresponds to `practice/src/script.ts`. The page already provides a button and a `#countdown` display area.

**Requirements:**
1. Click the button to start a 10-second countdown
2. Update the number displayed in `#countdown` every second
3. Show "Time's up!" when the countdown ends
4. Clicking the button again while the countdown is running should not restart it

Reference solution in `codes/src/homework.ts`.
