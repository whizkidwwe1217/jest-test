import { Inflector } from "./inflector";

describe("Inflector", () => {
	it("should have a value of 33", () => {
		expect(new Inflector("33").value).toBe("33");
	});

	it("should camelize", () => {
		expect(new Inflector("variable_of_something").camelize().value).toBe("variableOfSomething");
	});

	it("should pascalize", () => {
		expect(new Inflector("variable_of_something").pascalize().value).toBe(
			"VariableOfSomething"
		);
	});

	it("should humanize", () => {
		expect(new Inflector("variable_of_something").humanize().value).toBe(
			"Variable of something"
		);
	});

	it("should titleize", () => {
		expect(new Inflector("variableOfSomething").titleize().value).toBe("Variable Of Something");
		expect(new Inflector("variable_of_something").titleize().value).toBe(
			"Variable Of Something"
		);
	});

	it("should dasherize", () => {
		expect(new Inflector("make-It-Happen").dasherize().value).toBe("make-It-Happen");
		expect(new Inflector("make_It_Happen").dasherize().value).toBe("make-It-Happen");
	});

	it("should ordanize", () => {
		expect(new Inflector("23").ordinalize().value).toBe("23rd");
		expect(new Inflector("21").ordinalize().value).toBe("21st");
		expect(new Inflector("42").ordinalize().value).toBe("42nd");
		expect(new Inflector("7").ordinalize().value).toBe("7th");
	});
});
