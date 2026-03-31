const PI = 3.14;
let radius = 5;

function area() {
    return PI * radius * radius;
}

// 命名导出：导入方必须使用相同的名称
export { PI, radius, area };

// 默认导出：导入方可以使用任意名称
export default {
    PI,
    radius,
    area
};
