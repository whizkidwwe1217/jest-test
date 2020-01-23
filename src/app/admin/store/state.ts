import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { Tenant } from "hordeflow-common";

export const tenantAdapter: EntityAdapter<Tenant> = createEntityAdapter<Tenant>({
	selectId: model => model.id,
	sortComparer: (a: Tenant, b: Tenant): number => b.name.localeCompare(a.name)
});

export interface TenantState extends EntityState<Tenant> {
	isLoading?: boolean;
	error?: any;
}

export const initialState: TenantState = tenantAdapter.getInitialState({
	isLoading: false,
	error: null
});
