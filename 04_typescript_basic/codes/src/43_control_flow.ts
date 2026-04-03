// This example introduces how to use if, for, and while statements

let randomNumber: number = Number(Math.random().toFixed(1));
console.log("Random Number is: " + randomNumber);

if (randomNumber > 0.5) {
  console.log("Bigger than 0.5");
} else if (randomNumber === 0.5) {
  console.log("Equal to 0.5");
} else {
  console.log("Little than 0.5");
}

for (let i: number = 0; i < 5; i++) {
  console.log("for loop: " + i);
}

let j: number = 0;
while (j < 5) {
  console.log("while loop: " + j);
  j++;
}
