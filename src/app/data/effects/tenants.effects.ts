import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { TenantsActionTypes } from "../actions/tenants.action";
import { switchMap, map, catchError, pluck } from "rxjs/operators";
import { of } from "rxjs";
import { HttpService, Tenant } from "hordeflow-common";

@Injectable()
export class TenantsEffects {
	constructor(private actions$: Actions, private service: HttpService) {}

	@Effect()
	getTenants$ = this.actions$.pipe(ofType(TenantsActionTypes.LIST_TENANTS)).pipe(
		switchMap(action =>
			this.service.list<Tenant>("api/v1/admin/catalog").pipe(
				map(tenants => ({
					type: TenantsActionTypes.LIST_TENANTS_SUCCESS,
					payload: tenants
				})),
				catchError(error =>
					of({
						type: TenantsActionTypes.TENANTS_ERROR,
						payload: error
					})
				)
			)
		)
	);

	@Effect()
	addTenant$ = this.actions$.pipe(ofType(TenantsActionTypes.ADD_TENANT)).pipe(
		pluck("payload"),
		switchMap((tenant: Tenant) =>
			this.service.create<Tenant>("api/v1/admin/catalog", tenant).pipe(
				map(tenant => ({
					type: TenantsActionTypes.ADD_TENANT_SUCCESS,
					payload: tenant
				})),
				catchError(error =>
					of({
						type: TenantsActionTypes.TENANTS_ERROR,
						payload: error
					})
				)
			)
		)
	);

	@Effect()
	getTenant$ = this.actions$.pipe(ofType(TenantsActionTypes.GET_TENANT)).pipe(
		pluck("payload"),
		switchMap((id: string) =>
			this.service.get<Tenant, string>(`api/v1/admin/catalog`, id).pipe(
				map(tenant => ({
					type: TenantsActionTypes.GET_TENANT_SUCCESS,
					payload: tenant
				})),
				catchError(error =>
					of({
						type: TenantsActionTypes.TENANTS_ERROR,
						payload: error
					})
				)
			)
		)
	);

	@Effect()
	deleteTenant$ = this.actions$.pipe(ofType(TenantsActionTypes.DELETE_TENANT)).pipe(
		pluck("payload"),
		switchMap((id: string) =>
			this.service.delete<string, Tenant>("api/v1/admin/catalog", id).pipe(
				map(res => ({
					type: TenantsActionTypes.DELETE_TENANT_SUCCESS,
					payload: res
				})),
				catchError(error =>
					of({
						type: TenantsActionTypes.TENANTS_ERROR,
						payload: error
					})
				)
			)
		)
	);
}
