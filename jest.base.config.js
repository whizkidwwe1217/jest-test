const esModules = ["@clr/core", "lit-html", "lit-element", "ramda"].join("|");

module.exports = {
	preset: "jest-preset-angular",
	globals: {
		"ts-jest": {
			tsConfig: "<rootDir>/src/tsconfig.spec.json",
			stringifyContentPathRegex: "\\.html$",
			astTransformers: [
				"jest-preset-angular/build/InlineFilesTransformer",
				"jest-preset-angular/build/StripStylesTransformer"
			]
		}
	},
	transform: {
		"^.+\\.(ts|html)$": "ts-jest",
		"^.+\\.js$": "babel-jest"
	},
	testEnvironment: "jest-environment-jsdom-thirteen",
	moduleFileExtensions: ["ts", "html", "js", "json"],
	moduleNameMapper: {
		"^src/(.*)$": "<rootDir>/src/$1",
		"^app/(.*)$": "<rootDir>/src/app/$1",
		"^assets/(.*)$": "<rootDir>/src/assets/$1",
		"^environments/(.*)$": "<rootDir>/src/environments/$1"
	},
	transformIgnorePatterns: [`node_modules/(?!(${esModules})).+\\.js$`],

	snapshotSerializers: [
		"jest-preset-angular/build/AngularSnapshotSerializer.js",
		"jest-preset-angular/build/HTMLCommentSerializer.js"
	],
	roots: ["<rootDir>/src"],
	setupFilesAfterEnv: ["<rootDir>/src/setup-jest.ts"],
	modulePaths: ["<rootDir>/dist"],
	testMatch: ["**/+(*.)+(spec).+(ts)"],
	collectCoverage: true,
	coverageReporters: ["html"],
	coverageDirectory: "coverage/hris",
	coveragePathIgnorePatterns: [
		"/node_modules",
		"/assets",
		"/dist",
		"package.json",
		"package-lock.json",
		"setup-jest.ts",
		"jestGlobalMocks.ts"
	]
};
