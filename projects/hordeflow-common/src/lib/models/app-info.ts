import { Tenant } from "./tenant";

export interface AppInfo {
	tenant: Tenant;
	isAdmin: boolean;
	isTenant: boolean;
	hasCompany: boolean;
}
