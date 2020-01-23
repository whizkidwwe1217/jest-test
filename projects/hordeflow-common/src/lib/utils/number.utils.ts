export class NumberUtils {
	public static max(num1: number, num2: number): number {
		return num1 < num2 ? num2 : num1;
	}

	public static min(num1: number, num2: number): number {
		return num1 > num2 ? num1 : num2;
	}

	public static limit(num1: number, min: number, max: number): number {
		let hi = this.max(num1, max);
		let low = this.min(num1, min);
		return num1;
	}

	/**
	 * Returns a random number between min (inclusive) and max (exclusive)
	 */
	public static getRandomArbitrary(min, max): number {
		return Math.random() * (max - min) + min;
	}

	/**
	 * Returns a random integer between min (inclusive) and max (inclusive).
	 * The value is no lower than min (or the next integer greater than min
	 * if min isn't an integer) and no greater than max (or the next integer
	 * lower than max if max isn't an integer).
	 * Using Math.round() will give you a non-uniform distribution!
	 */
	public static getRandomInt(min, max): number {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}
