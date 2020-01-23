import { Observable } from "rxjs";
import { HttpHeaders } from "@angular/common/http";
import * as _ from "lodash";
import { BaseHttpService } from "./base-http.service";
import { UserAccount } from "../models/user-account";
import { AuthToken } from "../models/auth-token";

export abstract class BaseAuthService extends BaseHttpService {
	_tokenUrl = "api/v1/auth/account/login";
	_refreshTokenUrl = "api/v1/auth/account/refreshtoken";
	_authToken: AuthToken;
	_account: UserAccount;
	isTenant: boolean;

	get tokenUrl(): string {
		return this._tokenUrl;
	}

	set tokenUrl(url: string) {
		this._tokenUrl = url;
	}

	get refreshTokenUrl(): string {
		return this._refreshTokenUrl;
	}

	set refreshTokenUrl(url: string) {
		this._refreshTokenUrl = url;
	}

	get authToken(): AuthToken {
		return this._authToken;
	}

	set authToken(authToken: AuthToken) {
		this._authToken = authToken;
		this.setAuthorizationToken(authToken);
	}

	get account(): UserAccount {
		return this._account;
	}

	set account(account: UserAccount) {
		this._account = account;
		this.setAccount(account);
	}

	abstract getTokenLocalStorageKey(): string;
	abstract getAccountLocalStorageKey(): string;

	getAuthorizationToken(): AuthToken {
		if (localStorage.getItem(this.getTokenLocalStorageKey())) {
			const authToken: AuthToken = JSON.parse(
				localStorage.getItem(this.getTokenLocalStorageKey())
			);
			return authToken;
		}
		return null;
	}

	setAuthorizationToken(authToken: AuthToken) {
		if (authToken) {
			localStorage.setItem(this.getTokenLocalStorageKey(), JSON.stringify(authToken));
		}
	}

	getAccount(): UserAccount {
		if (localStorage.getItem(this.getAccountLocalStorageKey())) {
			const account: UserAccount = JSON.parse(
				localStorage.getItem(this.getAccountLocalStorageKey())
			);
			return account;
		}
		return null;
	}

	setAccount(account: UserAccount) {
		if (account) {
			localStorage.setItem(this.getAccountLocalStorageKey(), JSON.stringify(account));
			localStorage.setItem("isTenant", this.isTenant ? "true" : "false");
			localStorage.setItem("loggedOut", _.get(account.loggedOut, "false"));
		}
	}

	clearAccount() {
		const account = this.getAccount();
		if (account && !account.rememberCredentials) {
			account.companyId = null;
			account.password = null;
			account.username = null;
			account.loggedOut = true;
			localStorage.removeItem(this.getTokenLocalStorageKey());
		}
		this.setAccount(account);
	}

	refreshToken(token: AuthToken, headers: HttpHeaders = null): Observable<AuthToken> {
		const defaultHeaders = new HttpHeaders({
			"Content-Type": "application/json",
			Accept: "application/json",
			"Cache-Control": "no-cache",
			Pragma: "no-cache",
			Expires: "-1",
			"If-Modified-Since": "Mon, 26 Jul 1997 05:00:00 GMT"
		});
		return this.http.post<AuthToken>(this.getResourceUrl(this.refreshTokenUrl), token, {
			headers: headers ? headers : defaultHeaders
		});
	}

	login(body: any, headers: HttpHeaders = null): Observable<AuthToken> {
		const defaultHeaders = new HttpHeaders({
			"Content-Type": "application/json",
			Accept: "application/json",
			"Cache-Control": "no-cache",
			Pragma: "no-cache",
			Expires: "-1",
			"If-Modified-Since": "Mon, 26 Jul 1997 05:00:00 GMT"
		});
		return this.http.post<AuthToken>(this.getResourceUrl(this.tokenUrl), body, {
			headers: headers ? headers : defaultHeaders
		});
	}
}
