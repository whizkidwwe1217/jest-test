import { Pipe, PipeTransform } from "@angular/core";
import * as _ from "lodash";

@Pipe({
	name: "person",
})
export class PersonPipe implements PipeTransform {
	transform(
		value: any,
		lastNameKey: string = "lastName",
		firstNameKey: string = "firstName",
		middleNameKey: string = "middleName"
	): string {
		return this.getFullName(
			value,
			lastNameKey,
			firstNameKey,
			middleNameKey
		);
	}

	private getFullName(
		employee: any,
		lastNameKey: string,
		firstNameKey: string,
		middleNameKey: string
	) {
		if (!employee) return "";
		if (_.isString(employee)) return _.toString(employee);
		return `${this.blanks(employee, firstNameKey)} ${this.getInitials(
			this.blanks(employee, middleNameKey),
			true
		)} ${this.blanks(employee, lastNameKey)}`;
	}

	private blanks(object, key, defaultValue: string = "") {
		return object && _.has(object, key) ? _.get(object, key) : defaultValue;
	}

	private getInitials(middleName: string, appendDot: boolean = true): string {
		let initials = _.first(middleName);
		if (!_.isUndefined(initials) && !_.isNull(initials) && initials !== "")
			return initials.toLocaleUpperCase() + (appendDot ? "." : "");
		return "";
	}
}
