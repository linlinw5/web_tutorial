import { capitalize, clamp, Stack } from "../utils.ts";

// ─── capitalize ───────────────────────────────────────────────────────────────

describe("capitalize", () => {
    test("每个单词首字母大写，其余小写", () => {
        // Arrange
        const input = "hello world";
        const expected = "Hello World";
        // Act
        const actual = capitalize(input);
        // Assert
        expect(actual).toBe(expected);
    });

    test("已经是大写的输入，应当正确处理", () => {
        // TODO
    });

    test("单个单词", () => {
        // TODO
    });
});

// ─── clamp ────────────────────────────────────────────────────────────────────

describe("clamp", () => {
    test("值在范围内时原样返回", () => {
        // TODO
    });

    test.each([
        // TODO：补充多组边界测试数据，格式参考：
        // { value: ?, min: ?, max: ?, expected: ? }
    ])("clamp($value, $min, $max) = $expected", ({ value, min, max, expected }: any) => {
        expect(clamp(value, min, max)).toBe(expected);
    });
});

// ─── Stack ────────────────────────────────────────────────────────────────────

describe("Stack", () => {
    let stack: Stack<number>;

    beforeEach(() => {
        // TODO：在这里初始化 stack
    });

    test("新建的栈应当为空", () => {
        // TODO
    });

    test("push 后 size 增加，isEmpty 返回 false", () => {
        // TODO
    });

    test("peek 返回栈顶元素，但不弹出", () => {
        // TODO
    });

    test("pop 弹出并返回栈顶元素", () => {
        // TODO
    });

    test("对空栈调用 pop 应当抛出异常", () => {
        // TODO：提示：expect(() => ...).toThrow(...)
    });

    test("对空栈调用 peek 应当抛出异常", () => {
        // TODO
    });
});
