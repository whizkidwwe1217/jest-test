import { createFeatureSelector, createSelector, MemoizedSelector } from "@ngrx/store";

import { tenantAdapter, TenantState } from "./state";
import { Tenant } from "hordeflow-common";

export const getError = (state: TenantState): any => state.error;

export const getIsLoading = (state: TenantState): boolean => state.isLoading;

export const selectTenantState: MemoizedSelector<object, TenantState> = createFeatureSelector<
	TenantState
>("tenant");

export const selectAllTenants: (state: object) => Tenant[] = tenantAdapter.getSelectors(
	selectTenantState
).selectAll;

export const selectTenantById = (id: string) =>
	createSelector(this.selectAllTenants, (allTenants: Tenant[]) => {
		if (allTenants) {
			return allTenants.find(p => p.id === id);
		} else {
			return null;
		}
	});

export const selectTenantError: MemoizedSelector<object, any> = createSelector(
	selectTenantState,
	getError
);

export const selectTenantIsLoading: MemoizedSelector<object, boolean> = createSelector(
	selectTenantState,
	getIsLoading
);
