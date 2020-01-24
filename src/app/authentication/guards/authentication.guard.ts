import { Injectable } from "@angular/core";
import {
	CanActivate,
	CanLoad,
	CanActivateChild,
	RouterStateSnapshot,
	ActivatedRouteSnapshot,
	Route,
	Router
} from "@angular/router";
import { Observable, of } from "rxjs";
import { SmartAuthService } from "../services/smart-auth.service";
import { Store, select } from "@ngrx/store";
import { SET_INFO, SetInfo } from "../../data/actions/app-info.action";
import { switchMap } from "rxjs/operators";
import {
	AppInfo,
	HttpService,
	UserAccount,
	URL_APP_INFO,
	LS_TENANT_AUTH_ACCOUNT
} from "hordeflow-common";
import { AppState } from "src/app/data/app-state";

@Injectable()
export class AuthenticationGuard implements CanActivate, CanActivateChild, CanLoad {
	appInfo: AppInfo;

	constructor(
		private router: Router,
		private authService: SmartAuthService,
		private store: Store<AppState>,
		private http: HttpService
	) {
		this.store.pipe(select("appInfo")).subscribe(appInfo => (this.appInfo = appInfo));
	}

	canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
		let url = `/${route.path}`;
		return this.checkLoggedAccount(url);
	}
	canActivateChild(
		childRoute: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): boolean | Observable<boolean> | Promise<boolean> {
		return this.canActivate(childRoute, state);
	}
	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): boolean | Observable<boolean> | Promise<boolean> {
		let url: string = state.url;
		return this.checkLoggedAccount(url);
	}

	checkLoggedAccount(url: string): Observable<boolean> {
		// @TODO: User sessions and state management
		// Maybe use cookies for browser-based but JWT for mobile
		return this.http.getValue<AppInfo>(URL_APP_INFO).pipe(
			switchMap((info: AppInfo) => {
				this.store.dispatch(SetInfo(info));

				let account: UserAccount = this.authService.getLoggedAccount();
				if (!account) {
					account = JSON.parse(localStorage.getItem(LS_TENANT_AUTH_ACCOUNT));
				}
				if (account) {
					if (
						!info.isAdmin &&
						account.username &&
						account.companyId &&
						account.password &&
						!account.loggedOut
					) {
						return of(true);
					}
				}

				this.router.navigate(["/login", { queryParams: { returnUrl: url } }]);
				return of(false);
			})
		);

		// this.router.navigate(['/login', { queryParams: { returnUrl: url } }]);
		// return of(false);
	}
}
