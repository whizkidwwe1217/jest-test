import { InflectorRule } from "./inflector-rule";

export class Inflector {
	private _value: string;
	private _plurals: Array<InflectorRule>;
	private _singulars: Array<InflectorRule>;
	private _uncountables: Array<string>;

	constructor(value: string) {
		this._value = value;
		this._plurals = new Array<InflectorRule>();
		this._singulars = new Array<InflectorRule>();
		this._uncountables = new Array<string>();

		this.addPlural("$", "s");
		this.addPlural("s$", "s");
		this.addPlural("(ax|test)is$", "$1es");
		this.addPlural("(octop|vir|alumn|fung)us$", "$1i");
		this.addPlural("(alias|status)$", "$1es");
		this.addPlural("(bu)s$", "$1ses");
		this.addPlural("(buffal|tomat|volcan)o$", "$1oes");
		this.addPlural("([ti])um$", "$1a");
		this.addPlural("sis$", "ses");
		this.addPlural("(?:([^f])fe|([lr])f)$", "$1$2ves");
		this.addPlural("(hive)$", "$1s");
		this.addPlural("([^aeiouy]|qu)y$", "$1ies");
		this.addPlural("(x|ch|ss|sh)$", "$1es");
		this.addPlural("(matr|vert|ind)ix|ex$", "$1ices");
		this.addPlural("([m|l])ouse$", "$1ice");
		this.addPlural("^(ox)$", "$1en");
		this.addPlural("(quiz)$", "$1zes");

		this.addSingular("s$", "");
		this.addSingular("(n)ews$", "$1ews");
		this.addSingular("([ti])a$", "$1um");
		this.addSingular(
			"((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$",
			"$1$2sis"
		);
		this.addSingular("(^analy)ses$", "$1sis");
		this.addSingular("([^f])ves$", "$1fe");
		this.addSingular("(hive)s$", "$1");
		this.addSingular("(tive)s$", "$1");
		this.addSingular("([lr])ves$", "$1f");
		this.addSingular("([^aeiouy]|qu)ies$", "$1y");
		this.addSingular("(s)eries$", "$1eries");
		this.addSingular("(m)ovies$", "$1ovie");
		this.addSingular("(x|ch|ss|sh)es$", "$1");
		this.addSingular("([m|l])ice$", "$1ouse");
		this.addSingular("(bus)es$", "$1");
		this.addSingular("(o)es$", "$1");
		this.addSingular("(shoe)s$", "$1");
		this.addSingular("(cris|ax|test)es$", "$1is");
		this.addSingular("(octop|vir|alumn|fung)i$", "$1us");
		this.addSingular("(alias|status)es$", "$1");
		this.addSingular("^(ox)en", "$1");
		this.addSingular("(vert|ind)ices$", "$1ex");
		this.addSingular("(matr)ices$", "$1ix");
		this.addSingular("(quiz)zes$", "$1");

		this.addIrregular("person", "people");
		this.addIrregular("man", "men");
		this.addIrregular("child", "children");
		this.addIrregular("sex", "sexes");
		this.addIrregular("move", "moves");
		this.addIrregular("goose", "geese");
		this.addIrregular("alumna", "alumnae");

		this.addUncountable("equipment");
		this.addUncountable("information");
		this.addUncountable("rice");
		this.addUncountable("money");
		this.addUncountable("species");
		this.addUncountable("series");
		this.addUncountable("fish");
		this.addUncountable("sheep");
		this.addUncountable("deer");
		this.addUncountable("aircraft");
	}

	get value(): string {
		return this._value;
	}

	private addIrregular(singular: string, plural: string): void {
		this.addPlural(`(${singular[0]})${singular.substring(1)}$`, `$1${plural.substring(1)}`);
		this.addSingular(`(${plural[0]})${plural.substring(1)}$`, `$1${singular.substring(1)}`);
	}

	private addPlural(rule: string, replacement: string) {
		this._plurals.push(new InflectorRule(rule, replacement));
	}

	private addSingular(rule: string, replacement: string) {
		this._singulars.push(new InflectorRule(rule, replacement));
	}

	private addUncountable(word: string): void {
		this._uncountables.push(word.toLowerCase());
	}

	pluralize(): Inflector {
		this._value = this.applyRules(this._plurals, this._value);
		return this;
	}

	singularize(): Inflector {
		this._value = this.applyRules(this._singulars, this._value);
		return this;
	}

	private applyRules(rules: Array<InflectorRule>, word: string): string {
		let result = word;
		if (this._uncountables.indexOf(word.toLowerCase()) === -1) {
			for (let i = rules.length - 1; i >= 0; i--) {
				if ((result = rules[i].apply(word)) != null) {
					break;
				}
			}
		}
		return result;
	}

	dasherize(): Inflector {
		this._value = this._value.replace(/_/g, "-");
		return this;
	}

	ordanize(num: number, numberString: string): Inflector {
		let nMod100: number = num % 100;

		if (nMod100 >= 11 && nMod100 <= 13) {
			this._value = numberString + "th";
		}

		switch (num % 10) {
			case 1:
				this._value = numberString + "st";
				break;
			case 2:
				this._value = numberString + "nd";
				break;
			case 3:
				this._value = numberString + "rd";
				break;
			default:
				this._value = numberString + "th";
				break;
		}
		return this;
	}

	ordinalize(): Inflector {
		return this.ordanize(Number(this._value), this._value);
	}

	unCapitalize(): Inflector {
		this._value = `${this._value
			.toString()
			.substring(0, 1)
			.toLowerCase()}${this._value.substring(1)}`;
		return this;
	}

	capitalize(): Inflector {
		this._value = `${this._value
			.toString()
			.substring(0, 1)
			.toUpperCase()}${this._value
			.toString()
			.substring(1)
			.toLowerCase()}`;
		return this;
	}

	underscore(): Inflector {
		this._value = this._value
			.toString()
			.replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
			.replace(/([a-z\d])([A-Z])/g, "$1_$2")
			.replace(/[-\s]/, "_");
		return this;
	}

	humanize(): Inflector {
		this._value = this.capitalize()
			.value.toString()
			.replace(/_/g, " ");
		return this;
	}

	titleize(): Inflector {
		this._value = this.underscore()
			.humanize()
			.value.toString()
			.replace(/\b([a-z])/g, ($1, x) => x.toUpperCase());
		return this;
	}

	pascalize(): Inflector {
		this._value = this._value
			.toString()
			.replace(/(?:^|_)(.)/g, (_, x) => x.toUpperCase())
			.replace(/_/g, "");
		return this;
	}

	camelize(): Inflector {
		return this.pascalize().unCapitalize();
	}
}
