import { toBigCase, LittelCalc } from "../utils";

describe("toBigCase test section", () => {
    test("should return upper case string", () => {
        // Arrange
        let input = "hello world";
        let expectedOutput = "HELLO WORLD";
        // Act
        let actual = toBigCase(input);
        // Assert
        expect(actual).toBe(expectedOutput);
    });

    test("should return upper case string with number", () => {
        let input = "hello 111 world";
        let expectedOutput = "HELLO 111 WORLD";
        let actual = toBigCase(input);
        expect(actual).toBe(expectedOutput);
    });
});

describe("LittelCalc test section", () => {
    let calc: LittelCalc;
    
    beforeEach(() => {
        calc = new LittelCalc();
    });
    afterEach(() => {
        // clean up if needed
    });

    test("should return sum of two numbers", () => {
        expect(calc.add(2, 3)).toBe(5);
    });

    test.each([
        {a: 6, b: 3, expected: 18},
        {a: 7, b: 3, expected: 21},
        {a: 5, b: 5, expected: 25},
    ])("multiplies two numbers: $a * $b = $expected", ({a, b, expected}) => {
        expect(calc.multiply(a, b)).toBe(expected);
    });

    test.each([
        {a: 5, b: 3, expected: 2},
        {a: 7, b: 3, expected: 4},
        {a: 5, b: 5, expected: 0},
    ])("subtracts two numbers: $a - $b = $expected", ({a, b, expected}) => {
        expect(calc.substract(a, b)).toBe(expected);
    });

    it.each([
        {a: 6, b: 3, expected: 2},
        {a: 9, b: 3, expected: 3},
        {a: 5, b: 5, expected: 1},
    ])("divides two numbers: $a / $b = $expected", ({a, b, expected}) => {
        expect(calc.divide(a, b)).toBe(expected);
    });

    test.skip("should throw error when dividing by zero", () => {
        expect(() => calc.divide(5, 0)).toThrow("Cannot divide by zero");
    });
   
});