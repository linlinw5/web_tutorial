[← Back to Home](../readme.md)

# Chapter 20: Jest — Introduction to Unit Testing

---

## Starting with a Question

Suppose you wrote a utility function like this:

```typescript
// utils.ts
export function toBigCase(str: string): string {
    return str.toUpperCase();
}
```

How do you confirm it's correct?

The old approach probably looks like this:

```typescript
// index.ts
import { toBigCase } from "./utils";

console.log(toBigCase("hello world")); // check if the output looks right
```

Run it, stare at the terminal, see `HELLO WORLD`, nod — "looks fine."

This works, but has two obvious problems:

1. **Unprofessional**: relying on visual inspection has no clear pass/fail standard; different people looking at the same output may reach different conclusions
2. **Not durable**: the moment the function is modified, you have to re-run index.ts and stare at the output again. What if there are ten functions, or twenty?

Is there a way to **write a test once and have it work forever**?

Yes — that is **unit testing**, and the tool you will learn in this chapter: **Jest**.

---

## Installation and Configuration

```bash
npm install -D jest ts-jest @types/jest
```

What each package does:
- `jest`: the test framework itself
- `ts-jest`: lets Jest understand TypeScript directly, no manual compilation required
- `@types/jest`: provides type hints for `describe`, `test`, `expect`, and other functions

Create `jest.config.js` in the project root:

```javascript
// jest.config.js
const config = {
    preset: "ts-jest",       // use ts-jest to process TypeScript files
    testEnvironment: "node", // tests run in a Node.js environment
    verbose: true,           // display the name and result of each test
    collectCoverage: true,   // collect code coverage reports
};
export default config;
```

Add a test script to `package.json`:

```json
"scripts": {
    "test": "jest"
}
```

---

## Writing Test Cases

### File Organization

Jest convention is to place test files in a `__tests__` directory or name them with a `.test.ts` suffix. This project's structure is:

```
src/
  utils.ts           ← the utility functions under test
  __tests__/
    utils.test.ts    ← tests for utils.ts
```

### Basic Structure: describe + test + expect

```typescript
import { toBigCase } from "../utils";

describe("toBigCase test group", () => {
    test("should return an uppercase string", () => {
        let input = "hello world";
        let expected = "HELLO WORLD";
        let actual = toBigCase(input);
        expect(actual).toBe(expected);
    });
});
```

- `describe`: groups related tests; first argument is the group name
- `test` (or `it` — the two are equivalent): defines a single test; first argument is the test description, second is the test function
- `expect(...).toBe(...)`: assertion — "expect the result to equal the expected value"

#### The AAA Pattern

Good test cases typically follow three steps: **Arrange → Act → Assert**:

```typescript
test("example", () => {
    // Arrange: prepare input data
    let input = "hello world";
    let expected = "HELLO WORLD";

    // Act: call the function under test
    let actual = toBigCase(input);

    // Assert: verify the result
    expect(actual).toBe(expected);
});
```

This pattern makes the intent of each test immediately clear.

### beforeEach / afterEach: Test Hooks

When testing a class, you typically want each test case to use a **fresh instance** to prevent tests from interfering with each other:

```typescript
describe("LittelCalc test group", () => {
    let calc: LittelCalc;

    beforeEach(() => {
        calc = new LittelCalc(); // create a new instance before each test
    });

    afterEach(() => {
        // cleanup after each test (not needed in this example)
    });

    test("addition", () => {
        expect(calc.add(2, 3)).toBe(5);
    });
});
```

### test.each: Parameterized Tests

When the same logic needs to be verified with multiple different inputs, use `test.each` to avoid writing repetitive test cases:

```typescript
test.each([
    { a: 6, b: 3, expected: 18 },
    { a: 7, b: 3, expected: 21 },
    { a: 5, b: 5, expected: 25 },
])("multiply: $a * $b = $expected", ({ a, b, expected }) => {
    expect(calc.multiply(a, b)).toBe(expected);
});
```

The `$a`, `$b`, and `$expected` in the test name are replaced with the actual values from each row of data, making the report easy to read.

### test.skip: Temporarily Skip

When a test is not ready yet, or the feature has not been implemented, use `test.skip` to skip it. The test still appears in the report, but is marked as "skipped" rather than "failed":

```typescript
test.skip("should throw an exception when dividing by zero", () => {
    expect(() => calc.divide(5, 0)).toThrow("Cannot divide by zero");
});
```

---

## Running Tests

```bash
npm test
```

### Viewing the Test Report

The terminal outputs the pass/fail status of each test along with a **code coverage** summary table:

```
----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files |   83.33 |      100 |      80 |   83.33 |
 utils.ts |   83.33 |      100 |      80 |   83.33 | 15
----------|---------|----------|---------|---------|-------------------
```

- **Stmts**: statement coverage — how many lines of code were executed
- **Branch**: branch coverage — whether every branch of `if / else` was covered
- **Funcs**: function coverage — how many functions were called
- **Lines**: line coverage

A visual HTML report is also generated in `coverage/lcov-report/`. Open `index.html` in a browser to see coverage for each line — green means covered, red means not yet covered by any test.

---

## Practice

The `practice/` directory already provides:

- `src/utils.ts`: three items to test (a `capitalize` function, a `clamp` function, and a `Stack` class)
- `src/__tests__/utils.test.ts`: a skeleton file — fill in all the `// TODO` comments to complete it

Run `npm test` to see the results. The goal is to get coverage as close to 100% as possible.
