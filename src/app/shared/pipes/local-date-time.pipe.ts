import { Pipe, PipeTransform } from "@angular/core";
import { formatDate } from "@angular/common";
import { LocaleService } from "../services/locale.service";

@Pipe({
	name: "localDateTime"
})
export class LocalDateTimePipe implements PipeTransform {
	constructor(private session: LocaleService) {}

	transform(value: any, format: string) {
		if (!value) {
			return "";
		}

		if (!format) {
			format = "shortDate";
		}

		return formatDate(value, format, this.session.locale);
	}
}
