const baseDir = '<rootDir>/src/db';
const baseTestDir = '<rootDir>/src/__tests__';

const config = {
    preset: "ts-jest",
    testEnvironment: "node",
    verbose: true,
    collectCoverage: true,
    // 只统计 src/db/ 下的文件的覆盖率，忽略路由、工具函数等
    collectCoverageFrom: [
        `${baseDir}/**/*.ts`,
    ],
    // 只运行 src/__tests__/ 下的测试文件
    testMatch: [
        `${baseTestDir}/**/*.test.ts`
    ]
};

export default config;