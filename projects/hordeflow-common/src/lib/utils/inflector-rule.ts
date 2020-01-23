export class InflectorRule {
	regex: RegExp;
	replacement: string;

	constructor(pattern: string, replacement: string) {
		this.replacement = replacement;
		this.regex = new RegExp(pattern, "i");
	}

	apply(word: string): string {
		if (!this.regex.test(word)) return null;
		return word.replace(this.regex, this.replacement);
	}
}
