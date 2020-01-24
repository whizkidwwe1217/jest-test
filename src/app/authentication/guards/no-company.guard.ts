import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { Observable, of, pipe } from "rxjs";
import { switchMap } from "rxjs/operators";
import { AppInfo } from "hordeflow-common";
import { AppState } from "src/app/data/app-state";

@Injectable()
export class NoCompanyGuard implements CanActivate {
	constructor(private router: Router, private store: Store<AppState>) {}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): boolean | Observable<boolean> | Promise<boolean> {
		let url: string = state.url;
		return this.store.pipe(
			select("appInfo"),
			switchMap(appInfo => {
				const hasCompany = appInfo.hasCompany;
				if (hasCompany) return of(true);
				this.router.navigate(["/", { queryParams: { returnUrl: url } }]);
				return of(false);
			})
		);
	}
}
