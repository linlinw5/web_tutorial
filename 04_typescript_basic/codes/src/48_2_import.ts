// Named import: names must match the exported names and be wrapped in braces
import { PI, radius, area } from "./48_1_export";

// Default import: any name can be used (tools is just an alias)
import tools from "./48_1_export";

console.log(PI); // 3.14
console.log(radius); // 5
console.log(area()); // 78.5

console.log(tools.PI); // 3.14
console.log(tools.radius); // 5
console.log(tools.area()); // 78.5
