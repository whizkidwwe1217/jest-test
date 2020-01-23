export class FilterGroup {
	groupOp: string;
	groups?: FilterGroup[];
	rules: FilterRule[];
	index?: number;
}

export class FilterRule {
	op: string;
	field: string;
	data: any;
	index?: number;
	dataType?: string | "string" | "boolean" | "currency" | "number" | "date";
}

export const ops = [
	{ name: "eq", description: "==" },
	{ name: "ne", description: "!=" },
	{ name: "nb", description: "not blank" },
	{ name: "bk", description: "blank" },
	{ name: "bw", description: "begins with" },
	{ name: "bd", description: "does not begin with" },
	{ name: "lt", description: "<" },
	{ name: "le", description: "<=" },
	{ name: "gt", description: ">" },
	{ name: "ge", description: ">=" },
	{ name: "ew", description: "ends with" },
	{ name: "nw", description: "does not end with" },
	{ name: "cn", description: "contains" },
	{ name: "nc", description: "does not contain" },
	{ name: "nu", description: "is null" },
	{ name: "nn", description: "is not null" }
];
export const groupOps = ["and", "or"];
export function eq(d1, d2) {
	return d1 == d2;
}
export function ne(d1, d2) {
	return d1 != d2;
}
export function lt(d1, d2) {
	return d1 < d2;
}
export function le(d1, d2) {
	return d1 <= d2;
}
export function gt(d1, d2) {
	return d1 > d2;
}
export function ge(d1, d2) {
	return d1 >= d2;
}
export function bw(d1, d2) {
	return d1.match("^" + d2);
}
export function nb(d1, d2) {
	return !d1.match("^" + d2);
}
export function ew(d1, d2) {
	return d1.match(d2 + "$");
}
export function nw(d1, d2) {
	return !d1.match(d2 + "$");
}
export function cn(d1, d2) {
	return d2.indexOf(d1) != -1;
}
export function nc(d1, d2) {
	return d2.indexOf(d1) == -1;
}
export function nu(d1, d2) {
	return d1 == null;
}
export function nn(d1, d2) {
	return d1 != null;
}

export class Filter {
	filter: FilterGroup;

	static getOpName(name: string): string {
		let op: string = name;
		for (let index = 0; index < ops.length; index++) {
			let element = ops[index];
			if (element.name === name) {
				op = element.description;
				break;
			}
		}
		return op;
	}

	getStringForGroup(group) {
		let s = "(";

		if (group.groups != undefined) {
			for (let index = 0; index < group.groups.length; index++) {
				if (s.length > 1) {
					if (group.groupOp == "or") s += " || ";
					else s += " && ";
				}
				s += this.getStringForGroup(group.groups[index]);
			}
		}

		if (group.rules != undefined) {
			for (let index = 0; index < group.rules.length; index++) {
				if (s.length > 1) {
					if (group.groupOp == "or") s += " || ";
					else s += " && ";
				}
				s += this.getStringForRule(group.rules[index]);
			}
		}

		s += ")";

		if (s == "()") return "";
		// ignore groups that don't have rules
		else return s;
	}

	getStringForRule(rule) {
		return rule.op + "(item." + rule.field + ",'" + rule.data + "')";
	}

	getUserFriendlyStringForGroup(group) {
		let s = "(";
		if (group.groups != undefined) {
			for (let index = 0; index < group.groups.length; index++) {
				if (s.length > 1) s += " " + group.groupOp + " ";

				try {
					s += this.getUserFriendlyStringForGroup(group.groups[index]);
				} catch (e) {
					alert(e);
				}
			}
		}

		if (group.rules != undefined) {
			try {
				for (let index = 0; index < group.rules.length; index++) {
					if (s.length > 1) s += " " + group.groupOp + " ";
					s += this.getUserFriendlyStringForRule(group.rules[index]);
				}
			} catch (e) {
				alert(e);
			}
		}

		s += ")";

		if (s == "()") return "";
		// ignore groups that don't have rules
		else return s;
	}

	getUserFriendlyStringForRule(rule) {
		let opUF = "";
		for (let i = 0; i < ops.length; i++) {
			opUF = ops[i].description;
			break;
		}
		return `${rule.field} ${opUF} "${rule.data}"`;
	}

	apply(jsonObj) {
		if (jsonObj == null || jsonObj == undefined) return [];

		let filterString = this.getStringForGroup(this.filter);
		if (filterString.replace("(", "").replace(")", "") === "") return jsonObj;

		let newJsonObj = [];
		for (let index = 0; index < jsonObj.length; index++) {
			let item = jsonObj[index];

			if (eval(filterString) == true) newJsonObj.push(item);
		}

		return newJsonObj;
	}
}
