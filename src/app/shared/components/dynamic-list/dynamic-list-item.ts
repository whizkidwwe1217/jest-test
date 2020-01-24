import { DynamicListGroup } from "./dynamic-list-group";

export class DynamicListItem {
	name: string;
	icon?: string;
	group?: DynamicListGroup;
	readonly?: boolean;
	payload?: any;
	index?: number;
}
