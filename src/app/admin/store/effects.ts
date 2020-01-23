import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action, Store } from "@ngrx/store";
import { Observable, of as observableOf } from "rxjs";
import {
	catchError,
	map,
	startWith,
	switchMap,
	pluck,
	withLatestFrom,
	retry
} from "rxjs/operators";
import * as tenantActions from "./actions";
import { Tenant, HttpService } from "hordeflow-common";
import { HttpResponse } from "@angular/common/http";
import { TenantStoreState, TenantStoreSelectors } from '../tenant';

@Injectable()
export class TenantStoreEffects {
	constructor(
		private dataService: HttpService,
		private actions$: Actions,
		private store$: Store<TenantStoreState.TenantState>
	) {}

	@Effect()
	loadRequestEffect$: Observable<Action> = this.actions$.pipe(
		ofType<tenantActions.LoadRequestAction>(tenantActions.ActionTypes.LOAD_REQUEST),
		// startWith(
		//     new featureActions.LoadRequestAction({ url: "admin/catalog", refresh: true })
		// ),
		withLatestFrom(
			this.store$.select(TenantStoreSelectors.selectAllTenants),
			(action: any, tenants: Tenant[]) => {
				return {
					url: action.payload.url,
					refresh: action.payload.refresh,
					tenants: tenants
				};
			}
		),
		switchMap(action => {
			if (action.tenants && action.tenants.length > 0 && !action.refresh) {
				return [
					new tenantActions.LoadSuccessAction({
						tenants: action.tenants
					})
				];
			}
			return this.dataService.list<Tenant>(action.url).pipe(
				retry(3),
				map(
					tenants =>
						new tenantActions.LoadSuccessAction({
							tenants
						})
				),
				catchError(error => observableOf(new tenantActions.FailureAction({ error })))
			);
		})
	);

	@Effect()
	addRequestEffect$: Observable<Action> = this.actions$.pipe(
		ofType<tenantActions.AddRequestAction>(tenantActions.ActionTypes.ADD_REQUEST),
		switchMap(action =>
			this.dataService.create<Tenant>("api/v1/admin/catalog", action.payload.tenant).pipe(
				retry(3),
				map(tenant => new tenantActions.AddSuccesstAction({ tenant })),
				catchError(error => observableOf(new tenantActions.FailureAction({ error })))
			)
		)
	);

	@Effect()
	deleteRequestEffect$: Observable<Action> = this.actions$.pipe(
		ofType<tenantActions.DeleteRequestAction>(tenantActions.ActionTypes.DELETE_REQUEST),
		switchMap(action =>
			this.dataService
				.delete<string, Tenant>("api/v1/admin/catalog", action.payload.tenant.id)
				.pipe(
					retry(3),
					switchMap(a => observableOf(action.payload.tenant))
				)
				.pipe(
					map(tenant => {
						return new tenantActions.DeleteSuccessAction({
							tenant: tenant
						});
					}),
					catchError(error => observableOf(new tenantActions.FailureAction({ error })))
				)
		)
	);

	@Effect()
	editRequestEffect$: Observable<Action> = this.actions$.pipe(
		ofType<tenantActions.EditRequestAction>(tenantActions.ActionTypes.EDIT_REQUEST),
		switchMap(action =>
			this.dataService
				.update<string, Tenant>(
					"api/v1/admin/catalog",
					action.payload.tenant.id,
					action.payload.tenant
				)
				.pipe(
					switchMap((response: HttpResponse<Tenant>) => {
						let tenant = action.payload.tenant;
						tenant.concurrencyStamp = response.headers.get("concurrencyStamp");
						tenant.concurrencyTimeStamp = response.headers.get("concurrencyTimeStamp");
						return observableOf(tenant);
					})
				)
				.pipe(
					map(tenant => {
						return new tenantActions.EditSuccesstAction({
							tenant: tenant
						});
					}),
					catchError(error => observableOf(new tenantActions.FailureAction({ error })))
				)
		)
	);
}
