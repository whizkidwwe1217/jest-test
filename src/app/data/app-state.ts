import { AppInfo } from "hordeflow-common";
import { TenantStoreState } from "../admin/tenant";

export interface AppState {
	readonly appInfo: AppInfo;
	adminState: TenantStoreState.TenantState;
}
