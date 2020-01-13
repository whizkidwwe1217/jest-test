const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions } = require("./tsconfig");

module.exports = {
  globals: {
    "ts-jest": {
      tsConfig: "<rootDir>/tsconfig.spec.json"
    }
  },
  preset: "jest-preset-angular",
  roots: ["<rootDir>/src"],
  setupFilesAfterEnv: ["<rootDir>/src/setup-jest.ts"],
  modulePaths: ["<rootDir>/dist"],
  testMatch: ["**/+(*.)+(spec).+(ts)"],
  collectCoverage: true,
  coverageReporters: ["html"],
  coverageDirectory: "coverage/my-app",
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
    prefix: "<rootDir>/"
  })
};
