import * as _ from "lodash";
import { TextUtils } from "../utils/text.utils";
import { FilterRule, FilterGroup } from "../utils/datafilter";
import { DataField } from "./data-field";

export class FilterManager<T> {
	searchString = "";
	enableGlobalSearch = true;
	filterGroup: FilterGroup;

	constructor(private dataFields: DataField<T>[]) {}

	buildFilter(): FilterGroup {
		if (!this.dataFields) return;

		const criteria: FilterGroup = {
			groupOp: "Or",
			groups: [],
			rules: this.buildGlobalSearchFilter()
		};

		const criteriaGroup: FilterGroup = {
			groupOp: "And",
			groups: [],
			rules: []
		};
		criteriaGroup.groups.push(criteria);
		this.filterGroup = criteriaGroup;
		return criteriaGroup;
	}

	buildGlobalSearchFilter(): FilterRule[] {
		if (!_.isEmpty(this.searchString)) {
			if (
				!(
					typeof this.dataFields === "string" ||
					(this.dataFields.length > 0 && typeof this.dataFields[0] === "string")
				)
			) {
				const searchableFields = _.filter(this.dataFields, {
					enableSearch: true
				});
				return _.map(searchableFields, (f: DataField<T>) => {
					const rule: FilterRule = {
						field: TextUtils.camelize(f.name),
						op: "cn",
						data: this.searchString,
						dataType: f.type
					};
					return rule;
				});
			}
		}

		return [];
	}
}
