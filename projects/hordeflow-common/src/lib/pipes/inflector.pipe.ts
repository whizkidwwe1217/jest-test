import { Pipe, PipeTransform } from "@angular/core";
import { Inflector } from "../utils/inflector";

@Pipe({
	name: "inflector"
})
export class InflectorPipe implements PipeTransform {
	transform(value: string, format: string): string {
		if (!value) return "";
		let inflector: Inflector = new Inflector(value);
		switch (format) {
			case "camelize":
				return inflector.camelize().value;
			case "humanize":
				return inflector.humanize().value;
			case "pascalize":
				return inflector.pascalize().value;
			case "capitalize":
				return inflector.capitalize().value;
			case "unCapitalize":
				return inflector.unCapitalize().value;
			case "titleize":
				return inflector.titleize().value;
			case "ordinalize":
				return inflector.ordinalize().value;
			case "underscore":
				return inflector.underscore().value;
			case "dasherize":
				return inflector.dasherize().value;
			case "singularize":
				return inflector.singularize().value;
			case "pluralize":
				return inflector.pluralize().value;
			default:
				return value;
		}
	}
}
