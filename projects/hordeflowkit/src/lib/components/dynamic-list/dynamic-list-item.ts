import { HfDynamicListGroup } from "./dynamic-list-group";

export class HfDynamicListItem {
    name: string;
    icon?: string;
    group?: HfDynamicListGroup;
    readonly?: boolean;
    payload?: any;
    index?: number;
}
