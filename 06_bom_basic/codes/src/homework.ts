// Countdown timer

const countdown = document.getElementById("countdown") as HTMLDivElement;
const btn1 = document.querySelector("button") as HTMLButtonElement;

let isRunning = false;

btn1.addEventListener("click", () => {
  if (isRunning) return;
  isRunning = true;

  let seconds = 10;
  countdown.innerText = seconds.toString();

  const timer = setInterval(() => {
    seconds--;
    if (seconds < 0) {
      clearInterval(timer);
      countdown.innerText = "Time's up!";
      isRunning = false;
    } else {
      countdown.innerText = seconds.toString();
    }
  }, 1000);
});
