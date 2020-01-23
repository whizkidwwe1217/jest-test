import { DecimalPipe } from "@angular/common";

export interface DataField<T> {
	name: string;
	text: string;
	type?: string | "string" | "boolean" | "currency" | "number" | "date" | "time" | "datetime";
	hidden?: boolean;
	enableSearch?: boolean;
	template?: any;
	excludeFromGrid?: boolean;
	disableColumnSelection?: boolean;
	render?(field: DataField<T>, record: T, value: any, index: number): any;
}

export class NumericDataField<T> implements DataField<T> {
	name: string;
	text: string;
	type?: string = "number";
	hidden?: boolean;

	constructor(options: {
		name: string;
		text: string;
		type?: string | "string" | "boolean" | "currency" | "number" | "date" | "time";
	}) {
		this.name = options.name;
		this.text = options.text;
	}

	render?(field: DataField<T>, record: T, value: any, index: number) {
		return `<div style="width: 100%; text-align: right">${new DecimalPipe("en-us").transform(
			value,
			"1.2"
		)}</div>`;
	}
}

export class LinkDataField<T> implements DataField<T> {
	name: string;
	text: string;
	type?: string = "string";
	hidden?: boolean;

	constructor(options: {
		name: string;
		text: string;
		type?: string | "string" | "boolean" | "currency" | "number" | "date";
	}) {
		this.name = options.name;
		this.text = options.text;
	}

	render?(field: DataField<T>, record: T, value: any, index: number) {
		return `<a href="${value}">${value}</a>`;
	}
}
