import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

export default createJestConfig({
  coverageProvider: "v8",
  maxWorkers: 1,
  setupFiles: ["<rootDir>/tests/jest.setup.ts"],
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
});