const PI = 3.14;
let radius = 5;

function area() {
  return PI * radius * radius;
}

// Named export: importers must use the same names
export { PI, radius, area };

// Default export: importers can use any name
export default {
  PI,
  radius,
  area,
};
