const esModules = ["@clr/core", "lit-html", "lit-element", "ramda"].join("|");

module.exports = {
  preset: "jest-preset-angular",
  transform: {
    "^.+\\.(ts|html)$": "ts-jest",
    "^.+\\.js$": "babel-jest"
  },
  transformIgnorePatterns: [`node_modules/(?!(${esModules})).+\\.js$`],
  roots: ["<rootDir>/src"],
  setupFilesAfterEnv: ["<rootDir>/src/setup-jest.ts"],
  modulePaths: ["<rootDir>/dist"],
  testMatch: ["**/+(*.)+(spec).+(ts)"],
  collectCoverage: true,
  coverageReporters: ["html"],
  coverageDirectory: "coverage/my-app"
};
