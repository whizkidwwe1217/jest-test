export enum PageTagType {
	Internal,
	Demo,
	New
}

export class Page {
	subPages?: Array<Page>;
	name: string;
	route?: string;
	icon?: string;
	disableRouting?: boolean;
	collapsed?: boolean;
	permission?: string;
	active?: boolean = true;
	tag?: { name: string; type: PageTagType };

	constructor(
		name: string,
		route?: string,
		icon: string = "application",
		disableRouting: boolean = false,
		collapsed: boolean = false,
		subPages: Array<Page> = []
	) {
		this.active = true;
		this.subPages = subPages;
		this.name = name;
		this.route = route;
		this.icon = icon;
		this.collapsed = collapsed;
		this.disableRouting = disableRouting;
	}
}
