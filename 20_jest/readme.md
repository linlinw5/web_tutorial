[← 返回首页](../readme.md)

# 第 20 章：Jest — 单元测试入门

---

## 从一个问题开始

假设你写了一个工具函数，像这样：

```typescript
// utils.ts
export function toBigCase(str: string): string {
    return str.toUpperCase();
}
```

你怎么确认它是对的？

以前的做法，大概是这样：

```typescript
// index.ts
import { toBigCase } from "./utils";

console.log(toBigCase("hello world")); // 看看输出对不对
```

运行，眼睛盯着终端，输出了 `HELLO WORLD`，点点头，"没问题"。

这种方式能用，但有两个明显的问题：

1. **不专业**：靠眼睛判断，没有明确的"通过 / 失败"标准，不同的人看同一个输出，结论可能不同
2. **不持久**：函数稍作修改，你就得重新跑一遍 index.ts，重新盯着输出看。如果有十个函数、二十个函数呢？

有没有一种方式，能让你**写一次测试，永远有效**？

有，这就是**单元测试**，以及本章要学的工具：**Jest**。

---

## 安装与配置

```bash
npm install -D jest ts-jest @types/jest
```

三个包的分工：
- `jest`：测试框架本体
- `ts-jest`：让 Jest 能直接读懂 TypeScript，无需手动编译
- `@types/jest`：为 `describe`、`test`、`expect` 等函数提供类型提示

在项目根目录创建 `jest.config.js`：

```javascript
// jest.config.js
const config = {
    preset: "ts-jest",       // 使用 ts-jest 处理 TypeScript 文件
    testEnvironment: "node", // 测试运行在 Node.js 环境
    verbose: true,           // 显示每条测试的名称和结果
    collectCoverage: true,   // 收集代码覆盖率报告
};
export default config;
```

在 `package.json` 中添加测试脚本：

```json
"scripts": {
    "test": "jest"
}
```

---

## 写测试用例

### 文件组织

Jest 约定测试文件放在 `__tests__` 目录下，或者文件名以 `.test.ts` 结尾。本项目的结构是：

```
src/
  utils.ts           ← 被测试的工具函数
  __tests__/
    utils.test.ts    ← 针对 utils.ts 的测试
```

### 基本结构：describe + test + expect

```typescript
import { toBigCase } from "../utils";

describe("toBigCase 测试组", () => {
    test("应当返回大写字符串", () => {
        let input = "hello world";
        let expected = "HELLO WORLD";
        let actual = toBigCase(input);
        expect(actual).toBe(expected);
    });
});
```

- `describe`：将相关测试分组，第一个参数是组名
- `test`（或 `it`，两者等价）：定义单条测试，第一个参数是测试描述，第二个是测试函数
- `expect(...).toBe(...)`：断言，"期望结果等于预期值"

#### AAA 模式

好的测试用例通常遵循 **Arrange → Act → Assert** 三步：

```typescript
test("示例", () => {
    // Arrange：准备输入数据
    let input = "hello world";
    let expected = "HELLO WORLD";

    // Act：执行被测函数
    let actual = toBigCase(input);

    // Assert：验证结果
    expect(actual).toBe(expected);
});
```

这个模式让每条测试的意图一目了然。

### beforeEach / afterEach：测试钩子

测试一个类时，通常希望每条用例都使用一个**全新的实例**，避免测试之间互相影响：

```typescript
describe("LittelCalc 测试组", () => {
    let calc: LittelCalc;

    beforeEach(() => {
        calc = new LittelCalc(); // 每条 test 执行前，重新创建实例
    });

    afterEach(() => {
        // 每条 test 执行后清理（本例不需要）
    });

    test("加法", () => {
        expect(calc.add(2, 3)).toBe(5);
    });
});
```

### test.each：参数化测试

同一个逻辑，用不同的输入验证多次，可以用 `test.each` 避免重复写用例：

```typescript
test.each([
    { a: 6, b: 3, expected: 18 },
    { a: 7, b: 3, expected: 21 },
    { a: 5, b: 5, expected: 25 },
])("乘法：$a * $b = $expected", ({ a, b, expected }) => {
    expect(calc.multiply(a, b)).toBe(expected);
});
```

测试名称中的 `$a`、`$b`、`$expected` 会被每行数据的实际值替换，报告中清晰可读。

### test.skip：暂时跳过

某个测试还没准备好，或者功能尚未实现，可以用 `test.skip` 跳过，测试仍会出现在报告中，但标记为"skipped"而非"failed"：

```typescript
test.skip("除以零时应抛出异常", () => {
    expect(() => calc.divide(5, 0)).toThrow("Cannot divide by zero");
});
```

---

## 运行测试

```bash
npm test
```

### 查看测试报告

终端会输出每条测试的通过 / 失败状态，以及一份**代码覆盖率**汇总表：

```
----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files |   83.33 |      100 |      80 |   83.33 |
 utils.ts |   83.33 |      100 |      80 |   83.33 | 15
----------|---------|----------|---------|---------|-------------------
```

- **Stmts**：语句覆盖率，有多少行代码被执行到了
- **Branch**：分支覆盖率，`if / else` 的每条分支是否都被覆盖
- **Funcs**：函数覆盖率，有多少函数被调用到了
- **Lines**：行覆盖率

还会在 `coverage/lcov-report/` 目录生成一份 HTML 格式的可视化报告，用浏览器打开 `index.html` 即可看到每行代码的覆盖情况——绿色代表已覆盖，红色代表还没有测试覆盖到。

---

## Practice

`practice/` 目录已提供：

- `src/utils.ts`：三个待测工具（`capitalize` 函数、`clamp` 函数、`Stack` 类）
- `src/__tests__/utils.test.ts`：骨架文件，补全所有 `// TODO` 即可

运行 `npm test` 查看结果，目标是让覆盖率尽量接近 100%。