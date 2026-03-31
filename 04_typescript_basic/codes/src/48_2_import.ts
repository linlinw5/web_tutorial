// 命名导入：名称必须与导出时一致，用花括号包裹
import { PI, radius, area } from './48_1_export';

// 默认导入：可以使用任意名称（tools 只是一个别名）
import tools from './48_1_export';

console.log(PI);       // 3.14
console.log(radius);   // 5
console.log(area());   // 78.5

console.log(tools.PI);       // 3.14
console.log(tools.radius);   // 5
console.log(tools.area());   // 78.5
