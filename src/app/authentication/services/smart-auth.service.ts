import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import {
	AppInfo,
	TenantAuthService,
	CatalogAuthService,
	AuthToken,
	UserAccount,
	JwtProvider
} from "hordeflow-common";
import { flatMap } from "rxjs/operators";
import { AppState } from "src/app/data/app-state";

@Injectable({
	providedIn: "root"
})
export class SmartAuthService {
	appInfo: AppInfo;
	constructor(
		private store: Store<AppState>,
		private catalogAuth: CatalogAuthService,
		private tenantAuth: TenantAuthService
	) {
		this.store.subscribe(state => (this.appInfo = state.appInfo));
	}

	private createAuthTokenObservable(token: AuthToken): Observable<AuthToken> {
		return new Observable(observer => {
			if (token == null || token.accessToken == null) observer.error("Invalid token.");
			observer.next(token);
			observer.complete();
		});
	}

	getLoggedAccount(): UserAccount {
		let account: UserAccount;

		if (this.appInfo.isTenant) {
			account = this.tenantAuth.getAccount();
		} else {
			account = this.catalogAuth.getAccount();
		}

		return account;
	}

	getAuthToken(): AuthToken {
		if (this.appInfo.isTenant) return this.tenantAuth.getAuthorizationToken();
		return this.catalogAuth.getAuthorizationToken();
	}

	isTokenExpired(): boolean {
		const token = this.getAuthToken();
		const jwt = new JwtProvider();
		return jwt.isTokenExpired(token.accessToken, 0.09);
	}

	logout() {
		if (this.appInfo.isTenant) {
			this.tenantAuth.clearAccount();
		} else {
			this.catalogAuth.clearAccount();
		}
	}

	refreshToken(token: AuthToken) {
		if (this.appInfo.isTenant) {
			return this.tenantAuth.refreshToken(token).pipe(
				flatMap((newToken: AuthToken) => {
					this.tenantAuth.setAuthorizationToken(newToken);
					return this.createAuthTokenObservable(newToken);
				})
			);
		} else {
			return this.catalogAuth.refreshToken(token).pipe(
				flatMap((newToken: AuthToken) => {
					this.catalogAuth.setAuthorizationToken(newToken);
					return this.createAuthTokenObservable(newToken);
				})
			);
		}
	}

	login(
		username: string,
		password: string,
		companyId: string,
		rememberCredentials?: boolean
	): Observable<AuthToken> {
		if (this.appInfo.isTenant) {
			return this.tenantAuth
				.login({
					username: username,
					password: password,
					companyId: companyId,
					rememberCredentials: rememberCredentials
				})
				.pipe(
					flatMap((token: AuthToken) => {
						this.tenantAuth.setAuthorizationToken(token);
						this.tenantAuth.setAccount({
							username: username,
							password: password,
							companyId: companyId,
							rememberCredentials: rememberCredentials
						});
						return this.createAuthTokenObservable(token);
					})
				);
		} else {
			return this.catalogAuth
				.login({
					email: username,
					password: password,
					rememberCredentials: rememberCredentials
				})
				.pipe(
					flatMap((token: AuthToken) => {
						this.catalogAuth.setAuthorizationToken(token);
						this.catalogAuth.setAccount({
							username: username,
							password: password,
							rememberCredentials: rememberCredentials
						});
						return this.createAuthTokenObservable(token);
					})
				);
		}
	}
}
