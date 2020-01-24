import { NumberSequenceGenerator } from "./number-sequence-generator";

describe("Number Sequence Generator", () => {
	let generator: NumberSequenceGenerator;

	beforeEach(() => {
		generator = new NumberSequenceGenerator()
			.setStartingValue(1)
			.setPrefix("EMP-")
			.setSuffix("-2018")
			.setLeftPadding(3)
			.setRightPadding(3)
			.setResetValue(1);
	});

	test("should create", () => {
		expect(generator).toBeTruthy();
	});

	test("should have an initial starting value of 0", () => {
		expect(generator.startingValue).toBe(1);
	});

	test("should have a prefix of EMP-", () => {
		expect(generator.prefix).toBe("EMP-");
	});

	test("should have a suffix of -2018", () => {
		expect(generator.suffix).toBe("-2018");
	});

	test("should have a number sequence of EMP-00100-2018", () => {
		expect(generator.generateNumberSequence()).toBe("EMP-00100-2018");
	});

	test("should have a next number sequence of EMP-00200-2018", () => {
		generator.generateNumberSequence();
		expect(generator.nextNumberSequence()).toBe("EMP-00200-2018");
	});
});
