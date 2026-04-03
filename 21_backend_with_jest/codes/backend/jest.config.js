const baseDir = "<rootDir>/src/db";
const baseTestDir = "<rootDir>/src/__tests__";

const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  collectCoverage: true,
  // Collect coverage only for files under src/db/, excluding routes and utility functions
  collectCoverageFrom: [`${baseDir}/**/*.ts`],
  // Run only test files under src/__tests__/
  testMatch: [`${baseTestDir}/**/*.test.ts`],
};

export default config;
