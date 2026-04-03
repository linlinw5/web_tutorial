import { toBigCase, LittelCalc } from "./utils";

console.log(toBigCase("hello world"));

const calc = new LittelCalc();
console.log(calc.add(3, 5));
console.log(calc.substract(10, 7));
console.log(calc.multiply(4, 6));
console.log(calc.divide(20, 4));
